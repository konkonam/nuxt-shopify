import type { GraphQLClient } from '@shopify/graphql-client'

import { createGraphQLClient } from '@shopify/graphql-client'
import { createConsola } from 'consola'

import useErrors from './useErrors'

import { useRuntimeConfig, useNuxtApp } from '#imports'

export function useCustomerAccount(): GraphQLClient {
    const { _shopify } = useRuntimeConfig().public

    if (!_shopify?.clients.customerAccount) {
        throw new Error('Could not create customer account client')
    }

    const {
        ...options
    } = _shopify.clients.customerAccount

    if (_shopify.logger) {
        options.logger = createConsola(_shopify.logger).withTag('shopify').trace
    }

    const nuxtApp = useNuxtApp()

    nuxtApp.hooks.callHook('customer-account:client:configure', { options })

    // TODO: use the required headers and authentication measures
    const { request, ...rest } = createGraphQLClient(options)

    const wrappedRequest: GraphQLClient['request'] = async (...params) => {
        const response = await request(...params)

        if (response.errors) useErrors(nuxtApp, response.errors, _shopify.errors?.throw ?? false)

        return response
    }

    const client = { request: wrappedRequest, ...rest } satisfies GraphQLClient

    nuxtApp.hooks.callHook('customer-account:client:create', { client })

    return client
}

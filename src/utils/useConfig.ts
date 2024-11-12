import type { ModuleOptions, ApiTypeToOptions, ApiClientOptions } from '~/src/types'

import { ApiType, type ShopifyApiTypesOptions } from '@shopify/api-codegen-preset'
import defu from 'defu'
import { join } from 'node:path'

export function useConfig(options: ModuleOptions) {
    const resolveClient = <T extends ApiType>(apiType: T): ApiTypeToOptions[T] | undefined => {
        if (!options.clients) return

        switch (apiType) {
            case ApiType.Storefront:
                return options.clients.storefront as ApiTypeToOptions[T]
            case ApiType.Admin:
                return options.clients.admin as ApiTypeToOptions[T]
            default:
                return
        }
    }

    const getCodegen = (apiType: ApiType) => {
        const clientConfig = resolveClient(apiType)
        if (!clientConfig || clientConfig.codegen === false) return false

        const documents = {
            [ApiType.Storefront]: [
                '**/!(*.{admin,customer}).{gql,graphql}',
                '**/*.{ts,js}',
            ],
            [ApiType.Admin]: [
                '**/*.admin.{gql,graphql}',
            ],
            [ApiType.Customer]: [
                '**/*.customer.{gql,graphql}',
            ],
        }

        return {
            apiType,
            apiVersion: clientConfig.apiVersion,
            documents: [
                ...documents[apiType],
                '!node_modules',
                '!.nuxt',
                '!dist',
            ],
            outputDir: join('.nuxt/types/shopify', apiType.toLowerCase()),
        } satisfies ShopifyApiTypesOptions
    }

    const compile = <T extends ApiType>(apiType: T) => {
        const clientConfig = resolveClient(apiType)
        if (!clientConfig) return

        return defu({
            ...{ storeDomain: `${options.name}.myshopify.com` },
            ...{ _apiType: apiType.toLowerCase() },
            clientConfig,
        }) as unknown as ApiTypeToOptions[T]
    }

    return {
        resolveClient,
        getCodegen,
        compile,
    }
}

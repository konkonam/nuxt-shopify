import type { createAdminApiClient } from '@shopify/admin-api-client'
import type { createStorefrontApiClient } from '@shopify/storefront-api-client'
import type { createGraphQLClient } from '@shopify/graphql-client'
import type { ConsolaOptions } from 'consola'

export type StorefrontOptions = Parameters<typeof createStorefrontApiClient>[0]
export type AdminOptions = Parameters<typeof createAdminApiClient>[0]

export type CustomerAccountOptions = Parameters<typeof createGraphQLClient>[0] & {
    apiVersion: string
    shopId: string
    clientId: string
    clientSecret?: string
}

// The supported client types
declare enum ShopifyClientType {
    Storefront = 'storefront',
    Admin = 'admin',
    CustomerAccount = 'customerAccount',
}

// custom options for each client
// exposed via module options
export type ShopifyClientCustomConfig = {
    skipCodegen?: boolean
    sandbox?: boolean // defaults to true
    documents?: string[]
}

export type StorefrontCustomConfig = {
    mock?: boolean
}

export type ShopifyStorefrontConfig = StorefrontOptions & ShopifyClientCustomConfig & StorefrontCustomConfig
export type ShopifyAdminConfig = AdminOptions & ShopifyClientCustomConfig
export type ShopifyCustomerAccountConfig = CustomerAccountOptions & ShopifyClientCustomConfig
export type ShopifyClientConfig = ShopifyStorefrontConfig | ShopifyAdminConfig | ShopifyCustomerAccountConfig

// Fully resolved shopify config
export type ShopifyConfig<S = ShopifyStorefrontConfig, A = ShopifyAdminConfig, C = ShopifyCustomerAccountConfig> = {
    name: string
    logger?: Partial<ConsolaOptions>
    autoImports?: {
        graphql?: boolean
        storefront?: boolean
        admin?: boolean
        customerAccount?: boolean
    }
    errors?: {
        throw?: boolean
    }
    clients: {
        [ShopifyClientType.Storefront]?: S
        [ShopifyClientType.Admin]?: A
        [ShopifyClientType.CustomerAccount]?: C
    }
}

// Optional public config for client side usage
export type PublicShopifyConfig<S = ShopifyStorefrontConfig, C = ShopifyCustomerAccountConfig> = {
    logger?: Partial<ConsolaOptions>
    errors?: {
        throw?: boolean
    }
    clients: {
        [ShopifyClientType.Storefront]?: Omit<S, 'privateAccessToken' | 'skipCodegen' | 'sandbox' | 'documents' | 'mock'>
        [ShopifyClientType.CustomerAccount]?: Omit<C, 'clientSecret' | 'skipCodegen' | 'sandbox' | 'documents'>
    }
}

// Options for custom templates
export type ShopifyTemplateOptions = {
    filename: string
    clientType: ShopifyClientType
    clientConfig: ShopifyClientConfig
    introspection?: string
}

// Params for the interface extension function from the shopify codegen preset
export type InterfaceExtensionsParams = {
    queryType: string
    mutationType: string
}

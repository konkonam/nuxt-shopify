import type { ModuleOptions, ShopifyConfig, PublicShopifyConfig, ShopifyStorefrontConfig } from '../types'

import { joinURL } from 'ufo'

export enum ShopifyClientType {
    Storefront = 'storefront',
    Admin = 'admin',
    CustomerAccount = 'customerAccount',
}

const ignores = [
    '!node_modules',
    '!.output',
    '!.nuxt',
]

export const useShopifyConfig = (options: ModuleOptions) => {
    const getClientConfig = <T extends ShopifyClientType>(clientType: T, documents: string[] = []) => {
        const clientOptions = options.clients?.[clientType] as ShopifyConfig['clients'][T]

        if (!clientOptions) return

        if (clientType === ShopifyClientType.Storefront && (clientOptions as ShopifyStorefrontConfig).mock) {
            Object.assign(clientOptions, {
                publicAccessToken: 'mock-public-access-token',
                storeDomain: 'https://mock.shop',
            })
        }
        else if (clientType === ShopifyClientType.Storefront || clientType === ShopifyClientType.Admin) {
            Object.assign(clientOptions, {
                storeDomain: `https://${options.name}.myshopify.com`,
            })
        }
        else if (clientType === ShopifyClientType.CustomerAccount) {
            Object.assign(clientOptions, {
                url: joinURL(
                    'https://shopify.com',
                    options.clients.customerAccount?.shopId ?? '',
                    'account/customer/api',
                    options.clients.customerAccount?.apiVersion ?? '',
                    'graphql',
                ),
            })
        }

        clientOptions.sandbox = !!(clientOptions.sandbox === undefined || clientOptions.sandbox)

        clientOptions.documents = [
            ...clientOptions.documents ?? [],
            ...documents,
        ]

        return clientOptions
    }

    const buildConfig = () => {
        const storefront = getClientConfig(ShopifyClientType.Storefront, [
            '**/*.{gql,graphql,ts,js}',
            ...(options.clients.storefront?.publicAccessToken || options.clients.storefront?.mock ? ['**/*.vue'] : []),
            '!**/*.admin.{gql,graphql,ts,js}',
            '!**/admin/**/*.{gql,graphql,ts,js}',
            '!**/*.customer.{gql,graphql,ts,js,vue}',
            '!**/customer/**/*.{gql,graphql,ts,js,vue}',
            ...ignores,
        ])

        const admin = getClientConfig(ShopifyClientType.Admin, [
            '**/*.admin.{gql,graphql,ts,js}',
            '**/admin/**/*.{gql,graphql,ts,js}',
            ...ignores,
        ])

        const customerAccount = getClientConfig(ShopifyClientType.CustomerAccount, [
            '**/*.customer.{gql,graphql,ts,js,vue}',
            '**/customer/**/*.{gql,graphql,ts,js,vue}',
            ...ignores,
        ])

        return {
            name: options.name,
            logger: options.logger,
            autoImports: options.autoImports,
            errors: options.errors,
            clients: {
                ...(storefront && { storefront }),
                ...(admin && { admin }),
                ...(customerAccount && { customerAccount }),
            },
        } satisfies ShopifyConfig
    }

    const buildPublicConfig = (config: ShopifyConfig) => {
        if (
            !(config.clients.storefront?.publicAccessToken || config.clients.storefront?.mock)
            && !config.clients.customerAccount
        ) return

        let storefront, customerAccount

        if (config.clients.storefront?.publicAccessToken || config.clients.storefront?.mock) {
            const {
                privateAccessToken: _privateAccessToken,
                skipCodegen: _skipCodegen,
                sandbox: _sandbox,
                documents: _documents,
                mock: _mock,
                ...rest
            } = config.clients.storefront

            storefront = rest
        }

        if (config.clients?.customerAccount) {
            const {
                clientSecret: _clientSecret,
                skipCodegen: _skipCodegen,
                sandbox: _sandbox,
                documents: _documents,
                ...rest
            } = config.clients.customerAccount

            customerAccount = rest
        }

        return {
            logger: config.logger,
            errors: config.errors,
            clients: {
                storefront,
                customerAccount,
            },
        } satisfies PublicShopifyConfig
    }

    const config = buildConfig()
    const publicConfig = buildPublicConfig(config)

    return {
        config,
        publicConfig,
    }
}

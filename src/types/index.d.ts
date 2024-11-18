import type {
    ShopifyAdminConfig,
    ShopifyConfig,
    ShopifyStorefrontConfig,
} from './shopify'
import type { HookResult, Nuxt } from '@nuxt/schema'

import '@nuxt/schema'
import 'nitropack'
import type { AdminApiClient } from '@shopify/admin-api-client'
import type { StorefrontApiClient } from '@shopify/storefront-api-client'

export type ModuleOptions = ShopifyConfig<
    Omit<ShopifyStorefrontConfig, 'storeDomain'>,
    Omit<ShopifyAdminConfig, 'storeDomain'>
>

export type ShopifyConfigHookParams = {
    nuxt: Nuxt
    config: ShopifyConfig
}

export type ShopifyTemplateHookParams = {
    nuxt: Nuxt
    config: Record<string, unknown>
}

declare module '@shopify/storefront-api-client' {
    interface StorefrontApiClient extends StorefrontApiClient {}
    interface AdminApiClient extends AdminApiClient {}
}

declare module '@nuxt/schema' {
    interface RuntimeConfig {
        _shopify?: ShopifyConfig
    }

    interface NuxtHooks {
        /**
         * Called before the config is persisted into the runtime config
         */
        'shopify:config': ({ nuxt, config }: ShopifyConfigHookParams) => HookResult

        'storefront:generate:introspection': ({ nuxt, config }: ShopifyTemplateHookParams) => HookResult
        'admin:generate:introspection': ({ nuxt, config }: ShopifyTemplateHookParams) => HookResult

        'storefront:generate:types': ({ nuxt, config }: ShopifyTemplateHookParams) => HookResult
        'admin:generate:types': ({ nuxt, config }: ShopifyTemplateHookParams) => HookResul

        'storefront:generate:operations': ({ nuxt, config }: ShopifyTemplateHookParams) => HookResult
        'admin:generate:operations': ({ nuxt, config }: ShopifyTemplateHookParams) => HookResult
    }
}

export * from './shopify'

# Quickstart

This page will guide you through the basic setup of the module.

## Installation

Run the following command to install the module in your project:

```bash
npm install -D @konkonam/nuxt-shopify
```

## Configuration

Add the module to your `nuxt.config.ts`:

```ts
// ~/nuxt.config.ts

export default defineNuxtConfig({
    modules: [
        '@konkonam/nuxt-shopify',
    ],
})
```

Add your Shopify configuration to the `nuxt.config.ts`:

```ts
// ~/nuxt.config.ts

export default defineNuxtConfig({
    shopify: {
        name: 'quickstart-abcd1234',
            clients: {
                storefront: {
                apiVersion: '2025-04',
                publicAccessToken: 'YOUR_ACCESS_TOKEN',
            },
        },
    },
})
```

You can see the `name` of your Shopify store in the url when you are in the Shopify admin, for example: `https://admin.shopify.com/store/quickstart-abcd1234`.

To get the `publicAccessToken` for your store you need to [enable storefront API access](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started#step-1-enable-storefront-api-access), which involves installing the [Headless channel from the Shopify App Store](https://apps.shopify.com/headless).

> [!WARNING]
> The public access key will be exposed publicly in the Nuxt runtime config.
> If you want to stay fully server side, set a private access token instead: `clients > storefront > privateAccessToken`

## Usage

### Type generation
    
To enable IDE support, you can add a GraphQL configuration file to the root of your project:

```yaml
# ~/graphql.config.yml
schema:
  - ./.nuxt/schema/storefront.schema.json
  - ./.nuxt/schema/admin.schema.json
```

### Access Storefront API on the client side

There are multiple ways of communicating with the Shopify APIs.
The easiest way is with the `useStorefront` composable, directly inside of your vue component or page.

> [!NOTE]
> To access the `useStorefront` composable on the client side, make sure you have added a public access token.
> You can add it in the module config: `clients > storefront > publicAccessToken`

```html
<!-- ~/components/Products.vue -->

<script setup lang="ts">
const storefront = useStorefront()

const { data } = await storefront.request(`#graphql
    query FetchProducts($first: Int) {
        products(first: $first) {
            nodes {
                id
                title
                description
            }
        }
    }
`, {
    variables: {
        first: 3,
    },
})

// Also works with asyncData
const { data } = await useAsyncData('products', async () => await storefront.request(`#graphql
    query FetchFirstThreeProducts($first: Int) {
        products(first: $first) {
            nodes {
                id
                title
                description
            }
        }
    }
`, {
    variables: {
        first: 3,
    },
}), { transform: response => response?.data?.products.nodes })
</script>

<template>
    <div>
        <pre>{{ data?.products.nodes }}</pre>
    </div>
</template>
```

### Access APIs via Nitro endpoints

The module exposes utilities to access each API via Nitro endpoints.

#### Storefront API example

Obtain a list of products from the storefront API with the `useStorefront` utility:

```ts
// ~/server/api/products.ts

export default defineEventHandler(async () => {
    const storefront = useStorefront()

    const query = `#graphql
        query FetchProducts($first: Int) {
            products(first: $first) {
                nodes {
                    id
                    title
                    description
                }
            }
        }
    `

    return storefront.request(query, {
        variables: {
            first: 1,
        },
    })
})
```

### Use the GraphiQL Explorer for faster development

The module automatically installs the [GraphiQL Explorer](https://www.npmjs.com/package/@graphiql/plugin-explorer)
as a sandbox for each client type.

To access the sandbox for the Storefront API, use the following URL:

```
http://localhost:3000/_sandbox/storefront
```

> [!NOTE]
> The sandbox is only available while the Nuxt dev server is running.

import { createResolver } from '@nuxt/kit'
import { defineConfig } from 'vitepress'

const resolver = createResolver(import.meta.url)

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'Nuxt Shopify',

    description: 'Handbook to get you started with the nuxt-shopify module',

    base: '/nuxt-shopify/',

    themeConfig: {
        logo: './assets/img/logo-small.png',

        editLink: {
            pattern: 'https://github.com/konkonam/nuxt-shopify/edit/main/docs/:path',
        },

        nav: [
            { text: 'Home', link: '/' },
            { text: 'Examples', link: '/markdown-examples' },
        ],

        sidebar: [
            {
                text: 'Examples',
                items: [
                    { text: 'Markdown Examples', link: '/markdown-examples' },
                    { text: 'Runtime API Examples', link: '/api-examples' },
                ],
            },
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/konkonam/nuxt-shopify' },
        ],
    },
})

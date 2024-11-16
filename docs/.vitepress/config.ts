import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'Nuxt Shopify',

    description: 'Handbook to get you started with the nuxt-shopify module',

    base: '/nuxt-shopify/',

    themeConfig: {
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

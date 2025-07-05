type Target = '_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined

interface ILink {
    title?: string
    icon?: string
    to: string
    target?: Target
    showLinkIcon?: boolean // For nav and toc link section
}

interface INav {
    title: string
    links?: (ILink & { description: string, icon: string })[]
    to?: string
    target?: Target
}

export default defineAppConfig({
    shadcnDocs: {
        header: {
            name: 'nuxt-shopify',
            description: 'Shopify integration for Nuxt',
            logo: {
                light: '/logo.svg',
                dark: '/logo-dark.svg',
            },
            nav: [
                {
                    title: 'Essentials',
                    to: '/essentials',
                    showLinkIcon: false,
                },
                {
                    title: 'Features',
                    to: '/features',
                    showLinkIcon: false,
                },
                {
                    title: 'Recipes',
                    to: '/recipes',
                    showLinkIcon: false,
                },
            ],
            links: [
                {
                    title: 'GitHub',
                    icon: 'lucide:github',
                    to: 'https://github.com/konkonam/nuxt-shopify',
                },
            ],
        },
        theme: {
            customizable: false,
            color: 'green',
        },
        aside: {
        },
        main: {
            // ...
        },
        // ...
    },
})

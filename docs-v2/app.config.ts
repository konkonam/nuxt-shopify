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
        site: {
            name: 'nuxt-shopify',
            description: 'Shopify integration for Nuxt',
        },
        theme: {
            customizable: true,
        },
        header: {
            logo: {
                light: '/logo-light.svg',
                dark: '/logo-dark.svg',
            },
            nav: [
                {
                    title: 'Get Started',
                    to: '/getting-started',
                },
            ],
            links: [
                {
                    title: 'GitHub',
                    icon: 'lucide:github',
                    to: 'https://github.com/nuxt-shopify',
                },
            ],
        },
        aside: {
            levelStyle: 'header',
        },
        main: {
            // ...
        },
        // ...
    },
})

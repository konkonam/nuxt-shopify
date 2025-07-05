import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    extends: ['shadcn-docs-nuxt'],
    devtools: { enabled: true },
    compatibilityDate: '2024-07-06',
    vite: {
        server: {
            fs: {
                allow: [
                    resolve(__dirname, 'node_modules'),
                    // any directories that hold linked packages:
                    resolve(__dirname, '../'),
                ],
            },
        },
    },
    i18n: {
        defaultLocale: 'en',
        locales: [
            {
                code: 'en',
                name: 'English',
                language: 'en-US',
            },
        ],
    },
})

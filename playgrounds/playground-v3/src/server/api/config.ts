import defu from 'defu'

export default defineEventHandler((event) => {
    const { _shopify } = useRuntimeConfig(event)

    return defu({
        clients: {
            admin: {
                accessToken: '<admin_access_token>',
            },
        },
    }, _shopify)
})

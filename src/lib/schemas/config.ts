import { z } from 'zod'

export const autoImportsSchema = z.object({
    graphql: z.boolean().optional().default(true),
    storefront: z.boolean().optional().default(true),
    admin: z.boolean().optional().default(true),
}).optional().default({
    graphql: true,
    storefront: true,
    admin: true,
})

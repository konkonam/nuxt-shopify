import { z } from 'zod'

export const clientSchema = z.object({
    apiVersion: z.string().min(1),
    sandbox: z.boolean().optional(),
    documents: z.array(z.string().min(1)).optional(),
    headers: z.record(z.string(), z.string().min(1)).optional(),
    retries: z.number().optional(),
    skipCodegen: z.boolean().optional(),
})

export type ClientSchema = z.infer<typeof clientSchema>

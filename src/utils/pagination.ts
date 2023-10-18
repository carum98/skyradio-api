import { z } from 'zod'

export const PaginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    per_page: z.coerce.number().int().positive().default(10)
})

export function ResponsePaginationSchema<T> (schema: z.ZodType<T>): z.ZodType<{ data: T[], pagination: { page: number, per_page: number, total: number } }> {
    return z.object({
        data: z.array(schema),
        pagination: z.object({
            page: z.number().int().positive(),
            per_page: z.number().int().positive(),
            total: z.number().int().positive(),
            total_pages: z.number().int().positive()
        })
    })
}

export type PaginationSchemaType = z.infer<typeof PaginationSchema>

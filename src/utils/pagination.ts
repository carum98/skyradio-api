import { z } from 'zod'

export const PaginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    per_page: z.coerce.number().int().positive().default(10)
})

export interface ResponsePaginationSchemaType<T> {
    data: T[]
    pagination: { page: number, per_page: number, total: number, total_pages: number }
}

export function ResponsePaginationSchema<T> (schema: z.ZodType<T>): z.ZodType<ResponsePaginationSchemaType<T>> {
    return z.object({
        data: z.array(schema),
        pagination: z.object({
            page: z.number().int().positive(),
            per_page: z.number().int().positive(),
            total: z.number().int().nonnegative(),
            total_pages: z.number().int().nonnegative()
        })
    })
}

export type PaginationSchemaType = z.infer<typeof PaginationSchema>

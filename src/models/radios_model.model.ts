import { sql } from 'drizzle-orm'
import { datetime, index, int, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core'
import { groups } from './groups.model'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ResponsePaginationSchema } from '@/utils/pagination'
import { HexColorSchema } from '@/utils/schemas'

export const radios_model = mysqlTable('radios_model', {
    id: int('id').autoincrement().notNull(),
    code: varchar('code', { length: 6 }).notNull(),
    name: varchar('name', { length: 12 }).notNull(),
    color: varchar('color', { length: 7 }).notNull(),
    group_id: int('group_id').notNull().references(() => groups.id),
    created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
    deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
        radios_model_id: primaryKey(table.id),
        radios_model_code: index('radios_model_code').on(table.code),
        group_id: index('group_id').on(table.group_id)
    }
})

export const RadiosModelShemaSelect = createSelectSchema(radios_model)
    .pick({ code: true, name: true, color: true })

export const RadiosModelShemaCreate = createInsertSchema(radios_model, {
    name: (schema) => schema.name.min(3).max(12),
    color: HexColorSchema
}).pick({
    name: true,
    group_id: true,
    color: true
})
.required()

export const RadiosModelShemaUpdate = RadiosModelShemaCreate
    .pick({ name: true, color: true })
    .partial()

export const RadiosModelShemaUniqueIdentifier = createSelectSchema(radios_model, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export const RadiosModelShemaSelectPaginated = ResponsePaginationSchema(RadiosModelShemaSelect)

export type RadiosModelShemaCreateType = z.infer<typeof RadiosModelShemaCreate>
export type RadiosModelShemaSelectType = z.infer<typeof RadiosModelShemaSelect>
export type RadiosModelShemaUpdateType = z.infer<typeof RadiosModelShemaUpdate>
export type RadiosModelShemaSelectPaginatedType = z.infer<typeof RadiosModelShemaSelectPaginated>

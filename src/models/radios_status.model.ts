import { sql } from 'drizzle-orm'
import { datetime, index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'
import { groups } from './groups.model'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ResponsePaginationSchema } from '@/utils/pagination'
import { HexColorSchema } from '@/utils/schemas'

export const radios_status = mysqlTable('radios_status', {
    id: int('id').autoincrement().primaryKey(),
    code: varchar('code', { length: 6 }),
    name: varchar('name', { length: 12 }).notNull(),
    color: varchar('color', { length: 7 }).notNull(),
    group_id: int('group_id').notNull().references(() => groups.id),
    created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
    deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
        radios_status_code: index('radios_status_code').on(table.code),
        group_id: index('group_id').on(table.group_id)
    }
})

export const RadiosStatusShemaSelect = createSelectSchema(radios_status)
    .pick({ code: true, name: true, color: true })

export const RadiosStatusShemaCreate = createInsertSchema(radios_status, {
    name: (schema) => schema.name.min(3).max(12),
    color: HexColorSchema
}).pick({
    name: true,
    group_id: true,
    color: true
}).required()

export const RadiosStatusShemaUpdate = RadiosStatusShemaCreate
    .pick({ name: true, color: true })
    .partial()

export const RadiosStatusShemaUniqueIdentifier = createSelectSchema(radios_status, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export const RadiosStatusShemaSelectPaginated = ResponsePaginationSchema(RadiosStatusShemaSelect)

export type RadiosStatusShemaCreateType = z.infer<typeof RadiosStatusShemaCreate>
export type RadiosStatusShemaSelectType = z.infer<typeof RadiosStatusShemaSelect>
export type RadiosStatusShemaUpdateType = z.infer<typeof RadiosStatusShemaUpdate>
export type RadiosStatusShemaSelectPaginatedType = z.infer<typeof RadiosStatusShemaSelectPaginated>

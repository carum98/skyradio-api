import { z } from 'zod'
import { sql } from 'drizzle-orm'
import { datetime, int, mysqlTable, varchar, index } from 'drizzle-orm/mysql-core'
import { groups } from './groups.model'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { ResponsePaginationSchema } from '@utils/pagination'

export const licenses = mysqlTable('licenses', {
    id: int('id').autoincrement().primaryKey(),
    code: varchar('code', { length: 6 }).notNull(),
    key: varchar('key', { length: 50 }).unique().notNull(),
    group_id: int('group_id').notNull().references(() => groups.id),
    created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
    deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
        licenses_code: index('licenses_code').on(table.code),
        group_id: index('group_id').on(table.group_id)
    }
})

export const LicensesSchemaSelect = createSelectSchema(licenses)
    .pick({ code: true, key: true })
    .extend({
        is_active: z.coerce.boolean()
    })

export const LicensesSchemaCreate = createInsertSchema(licenses, {
    code: (schema) => schema.code.length(6),
    key: (schema) => schema.key.min(5).max(50)
}).pick({ key: true, group_id: true }).required()

export const LicensesSchemaUpdate = LicensesSchemaCreate
    .pick({ key: true })
    .partial()

export const LicensesSchemaUniqueIdentifier = createSelectSchema(licenses, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export const LicensesSchemaSelectPaginated = ResponsePaginationSchema(LicensesSchemaSelect)

export type LicensesSchemaCreateType = z.infer<typeof LicensesSchemaCreate>
export type LicensesSchemaSelectType = z.infer<typeof LicensesSchemaSelect>
export type LicensesSchemaUpdateType = z.infer<typeof LicensesSchemaUpdate>
export type LicensesSchemaSelectPaginatedType = z.infer<typeof LicensesSchemaSelectPaginated>

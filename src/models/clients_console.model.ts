import { sql } from 'drizzle-orm'
import { datetime, int, mysqlTable, varchar, index } from 'drizzle-orm/mysql-core'
import { LicensesSchemaSelect, licenses } from './licenses.model'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const console = mysqlTable('clients_console', {
    id: int('id').autoincrement().primaryKey(),
    code: varchar('code', { length: 6 }).notNull(),
    license_id: int('license_id').notNull().references(() => licenses.id),
    created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
    deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
        console_code: index('console_code').on(table.code),
        license_id: index('license_id').on(table.license_id)
    }
})

export const ConsoleSchemaSelect = createSelectSchema(console)
    .pick({ code: true })
    .extend({
        license: LicensesSchemaSelect,
        client: z.object({
            code: z.string(),
            name: z.string(),
            color: z.string()
        }).nullable()
    })

export const ConsoleSchemaCreate = createInsertSchema(console, {
    code: (schema) => schema.code.length(6),
    license_id: (schema) => schema.license_id
}).pick({ code: true, license_id: true }).required()

export const ConsoleSchemaUpdate = ConsoleSchemaCreate
    .pick({ license_id: true })
    .partial()

export const ConsoleSchemaUniqueIdentifier = z.object({
    code: z.string().length(6)
})

export type ConsoleSchemaCreateType = z.infer<typeof ConsoleSchemaCreate>
export type ConsoleSchemaSelectType = z.infer<typeof ConsoleSchemaSelect>
export type ConsoleSchemaUpdateType = z.infer<typeof ConsoleSchemaUpdate>
export type ConsoleSchemaUniqueIdentifierType = z.infer<typeof ConsoleSchemaUniqueIdentifier>

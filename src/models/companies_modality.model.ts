import { datetime, index, int, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { groups } from './groups.model'

export const companies_modality = mysqlTable('companies_modality', {
    id: int('id').autoincrement().notNull(),
    code: varchar('code', { length: 6 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    group_id: int('group_id').notNull().references(() => groups.id),
	created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
	deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
        companies_modality_id: primaryKey(table.id),
        group_id: index('group_id').on(table.group_id)
    }
})

export const CompanyModalitySchemaSelect = createSelectSchema(companies_modality)
    .pick({ code: true, name: true })

export const CompanyModalitySchemaCreate = createInsertSchema(companies_modality, {
    name: (schema) => schema.name.min(3).max(100)
}).pick({ name: true, group_id: true }).required()

export const CompanyModalitySchemaUpdate = CompanyModalitySchemaCreate
    .pick({ name: true })
    .partial()

export const CompanyModalitySchemaUniqueIdentifier = createSelectSchema(companies_modality, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export type CompanyModalitySchemaCreateType = z.infer<typeof CompanyModalitySchemaCreate>
export type CompanyModalitySchemaSelectType = z.infer<typeof CompanyModalitySchemaSelect>
export type CompanyModalitySchemaUpdateType = z.infer<typeof CompanyModalitySchemaUpdate>

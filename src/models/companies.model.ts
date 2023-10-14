import { datetime, index, int, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core'
import { groups } from './groups.model'
import { sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const companies = mysqlTable('companies', {
    id: int('id').autoincrement().notNull(),
    code: varchar('code', { length: 6 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
	group_id: int('group_id').notNull().references(() => groups.id),
	created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
	deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
		group_id: index('group_id').on(table.group_id),
        companies_id: primaryKey(table.id)
    }
})

export const CompanySchemaSelect = createSelectSchema(companies)
    .pick({ code: true, name: true })

export const CompanySchemaCreate = createInsertSchema(companies, {
    name: (schema) => schema.name.min(3).max(100)
}).pick({ name: true, group_id: true }).required()

export const CompanySchemaUpdate = CompanySchemaCreate
    .pick({ id: true, name: true })
    .required()

export const CompanySchemaUniqueIdentifier = createSelectSchema(companies, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export type CompanySchemaCreateType = z.infer<typeof CompanySchemaCreate>
export type CompanySchemaSelectType = z.infer<typeof CompanySchemaSelect>
export type CompanySchemaUpdateType = z.infer<typeof CompanySchemaUpdate>

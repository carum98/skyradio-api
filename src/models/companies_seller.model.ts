import { sql } from 'drizzle-orm'
import { datetime, index, int, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core'
import { groups } from './groups.model'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const companies_seller = mysqlTable('companies_seller', {
    id: int('id').autoincrement().notNull(),
    code: varchar('code', { length: 6 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
	group_id: int('group_id').notNull().references(() => groups.id),
    created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
    deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
        companies_seller_id: primaryKey(table.id),
        companies_seller_code: index('companies_seller_code').on(table.code),
		group_id: index('group_id').on(table.group_id)
    }
})

export const CompanySellerSchemaSelect = createSelectSchema(companies_seller)
    .pick({ code: true, name: true })

export const CompanySellerSchemaCreate = createSelectSchema(companies_seller, {
    name: (schema) => schema.name.min(3).max(100)
}).pick({ name: true, group_id: true }).required()

export const CompanySellerSchemaUpdate = CompanySellerSchemaCreate
    .pick({ name: true })
    .partial()

export const CompanySellerSchemaUniqueIdentifier = createSelectSchema(companies_seller, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export type CompanySellerSchemaCreateType = z.infer<typeof CompanySellerSchemaCreate>
export type CompanySellerSchemaSelectType = z.infer<typeof CompanySellerSchemaSelect>
export type CompanySellerSchemaUpdateType = z.infer<typeof CompanySellerSchemaUpdate>

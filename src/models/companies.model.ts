import { datetime, index, int, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core'
import { groups } from './groups.model'
import { sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { CompanyModalitySchemaSelect, companies_modality } from './companies_modality.model'
import { CompanySellerSchemaSelect, companies_seller } from './companies_seller.model'

export const companies = mysqlTable('companies', {
    id: int('id').autoincrement().notNull(),
    code: varchar('code', { length: 6 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
	group_id: int('group_id').notNull().references(() => groups.id),
    modality_id: int('modality_id').notNull().references(() => companies_modality.id),
    seller_id: int('seller_id').references(() => companies_seller.id),
	created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
	deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
		group_id: index('group_id').on(table.group_id),
        companies_id: primaryKey(table.id),
        modality_id: index('modality_id').on(table.modality_id),
        seller_id: index('seller_id').on(table.seller_id)
    }
})

export const CompanySchemaSelect = createSelectSchema(companies)
    .pick({ code: true, name: true })
    .extend({
        modality: CompanyModalitySchemaSelect.pick({ code: true, name: true }),
        seller: CompanySellerSchemaSelect.pick({ code: true, name: true }).nullable(),
        radios_count: z.number().int()
    })

export const CompanySchemaCreate = createInsertSchema(companies, {
    name: (schema) => schema.name.min(3).max(100)
}).pick({
    name: true,
    group_id: true
})
.extend({
    modality_code: z.string().length(6),
    seller_code: z.string().length(6)
})
.required()
.partial({
    seller_code: true
})

export const CompanySchemaUpdate = CompanySchemaCreate
.pick({
    id: true,
    name: true,
    modality_code: true,
    seller_code: true
})
.partial()

export const CompanySchemaUniqueIdentifier = createSelectSchema(companies, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export type CompanySchemaCreateType = z.infer<typeof CompanySchemaCreate>
export type CompanySchemaSelectType = z.infer<typeof CompanySchemaSelect>
export type CompanySchemaUpdateType = z.infer<typeof CompanySchemaUpdate>

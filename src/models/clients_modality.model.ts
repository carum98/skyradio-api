import { datetime, index, int, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { groups } from './groups.model'
import { ResponsePaginationSchema } from '@/utils/pagination'
import { HexColorSchema } from '@/utils/schemas'

export const companies_modality = mysqlTable('companies_modality', {
    id: int('id').autoincrement().notNull(),
    code: varchar('code', { length: 6 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    color: varchar('color', { length: 7 }).notNull().default('#000000'),
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

export const ClientsModalitySchemaSelect = createSelectSchema(companies_modality)
    .pick({ code: true, name: true, color: true })

export const ClientsModalitySchemaCreate = createInsertSchema(companies_modality, {
    name: (schema) => schema.name.min(3).max(100),
    color: (schema) => HexColorSchema
}).pick({ name: true, group_id: true }).required()

export const ClientsModalitySchemaUpdate = ClientsModalitySchemaCreate
    .pick({ name: true })
    .partial()

export const ClientsModalitySchemaUniqueIdentifier = createSelectSchema(companies_modality, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export const ClientsModalitySchemaSelectPaginated = ResponsePaginationSchema(ClientsModalitySchemaSelect)

export type ClientsModalitySchemaCreateType = z.infer<typeof ClientsModalitySchemaCreate>
export type ClientsModalitySchemaSelectType = z.infer<typeof ClientsModalitySchemaSelect>
export type ClientsModalitySchemaUpdateType = z.infer<typeof ClientsModalitySchemaUpdate>
export type ClientsModalitySchemaSelectPaginatedType = z.infer<typeof ClientsModalitySchemaSelectPaginated>

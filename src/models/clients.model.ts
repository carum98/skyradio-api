import { datetime, index, int, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core'
import { groups } from './groups.model'
import { sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ClientsModalitySchemaSelect, companies_modality } from './clients_modality.model'
import { SellersSchemaSelect, sellers } from './sellers.model'
import { ResponsePaginationSchema } from '@/utils/pagination'
import { HexColorSchema } from '@/utils/schemas'

export const clients = mysqlTable('clients', {
    id: int('id').autoincrement().notNull(),
    code: varchar('code', { length: 6 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    color: varchar('color', { length: 7 }).notNull().default('#000000'),
	group_id: int('group_id').notNull().references(() => groups.id),
    modality_id: int('modality_id').notNull().references(() => companies_modality.id),
    seller_id: int('seller_id').references(() => sellers.id),
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

export const ClientsSchemaSelect = createSelectSchema(clients)
    .pick({ code: true, name: true, color: true })
    .extend({
        modality: ClientsModalitySchemaSelect.pick({ code: true, name: true, color: true }),
        seller: SellersSchemaSelect.pick({ code: true, name: true }).nullable(),
        radios_count: z.number().int()
    })

export const ClientsSchemaCreateRaw = createInsertSchema(clients, {
    name: (schema) => schema.name.min(3).max(100),
    color: HexColorSchema
}).pick({
    name: true,
    group_id: true,
    modality_id: true,
    seller_id: true,
    color: true
})

export const ClientsSchemaCreate = ClientsSchemaCreateRaw.pick({
    name: true,
    group_id: true,
    color: true
})
.extend({
    modality_code: z.string().length(6),
    seller_code: z.string().length(6)
})
.required()
.partial({ seller_code: true })

export const ClientsSchemaUpdateRaw = ClientsSchemaCreateRaw.omit({
    group_id: true
})
.partial()

export const ClientsSchemaUpdate = ClientsSchemaCreate.pick({
    id: true,
    name: true,
    modality_code: true,
    seller_code: true
})
.partial()

export const ClientsRadiosSchema = z.object({
    radios_codes: z.array(z.string().length(6))
})

export const ClientRadiosSwapSchema = z.object({
    radio_code_from: z.string().length(6),
    radio_code_to: z.string().length(6)
})

export const ClientsSchemaUniqueIdentifier = createSelectSchema(clients, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export const ClientsSchemaSelectPaginated = ResponsePaginationSchema(ClientsSchemaSelect)

export type ClientsSchemaCreateRawType = z.infer<typeof ClientsSchemaCreateRaw>
export type ClientsSchemaCreateType = z.infer<typeof ClientsSchemaCreate>
export type ClientsSchemaSelectType = z.infer<typeof ClientsSchemaSelect>
export type ClientsSchemaUpdateRawType = z.infer<typeof ClientsSchemaUpdateRaw>
export type ClientsSchemaUpdateType = z.infer<typeof ClientsSchemaUpdate>
export type ClientsSchemaSelectPaginatedType = z.infer<typeof ClientsSchemaSelectPaginated>
export type ClientsRadiosSchemaType = z.infer<typeof ClientsRadiosSchema>
export type ClientRadiosSwapSchemaType = z.infer<typeof ClientRadiosSwapSchema>

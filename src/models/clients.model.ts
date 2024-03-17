import { datetime, index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'
import { groups } from './groups.model'
import { sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ClientsModalitySchemaCounter, ClientsModalitySchemaSelect, clients_modality } from './clients_modality.model'
import { SellerSchemaCounter, SellersSchemaSelect, sellers } from './sellers.model'
import { ResponsePaginationSchema } from '@/utils/pagination'
import { HexColorSchema } from '@/utils/schemas'
import { RadioModelSchemaCounter } from './radios_model.model'
import { SimsProviderSchemaCounter } from './sims_provider.model'
import { ConsoleSchemaSelect, console } from './clients_console.model'

export const clients = mysqlTable('clients', {
    id: int('id').autoincrement().primaryKey(),
    code: varchar('code', { length: 6 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    color: varchar('color', { length: 7 }).notNull(),
	group_id: int('group_id').notNull().references(() => groups.id),
    modality_id: int('modality_id').notNull().references(() => clients_modality.id),
    seller_id: int('seller_id').references(() => sellers.id),
    console_id: int('console_id').references(() => console.id),
	created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
	deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
		group_id: index('group_id').on(table.group_id),
        modality_id: index('modality_id').on(table.modality_id),
        seller_id: index('seller_id').on(table.seller_id),
        console_id: index('console_id').on(table.console_id)
    }
})

export const ClientsSchemaSelect = createSelectSchema(clients)
    .pick({ code: true, name: true, color: true })
    .extend({
        modality: ClientsModalitySchemaSelect.pick({ code: true, name: true, color: true }),
        seller: SellersSchemaSelect.pick({ code: true, name: true }).nullable(),
        console: ConsoleSchemaSelect.pick({ code: true }).nullable(),
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
    seller_code: true,
    color: true
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

export const ClientsSchemaCounter = ClientsSchemaSelect
    .omit({ modality: true, seller: true, console: true, radios_count: true })
    .extend({
        count: z.number().int(),
        models: RadioModelSchemaCounter.array(),
        providers: SimsProviderSchemaCounter.array()
    })

export const ClientsSchemaStatsByClient = z.object({
    models: RadioModelSchemaCounter.array(),
    sims_providers: SimsProviderSchemaCounter.array()
})

export const ClientSchemaStats = z.object({
    sellers: SellerSchemaCounter.array(),
    modality: ClientsModalitySchemaCounter.array(),
    clients: ClientsSchemaCounter.array()
})

export type ClientsSchemaCreateRawType = z.infer<typeof ClientsSchemaCreateRaw>
export type ClientsSchemaCreateType = z.infer<typeof ClientsSchemaCreate>
export type ClientsSchemaSelectType = z.infer<typeof ClientsSchemaSelect>
export type ClientsSchemaUpdateRawType = z.infer<typeof ClientsSchemaUpdateRaw>
export type ClientsSchemaUpdateType = z.infer<typeof ClientsSchemaUpdate>
export type ClientsSchemaSelectPaginatedType = z.infer<typeof ClientsSchemaSelectPaginated>
export type ClientsRadiosSchemaType = z.infer<typeof ClientsRadiosSchema>
export type ClientRadiosSwapSchemaType = z.infer<typeof ClientRadiosSwapSchema>
export type ClientsSchemaStatsByClientType = z.infer<typeof ClientsSchemaStatsByClient>
export type ClientsSchemaCounterType = z.infer<typeof ClientsSchemaCounter>
export type ClientSchemaStatsType = z.infer<typeof ClientSchemaStats>

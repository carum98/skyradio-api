import { sql } from 'drizzle-orm'
import { datetime, index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'
import { groups } from './groups.model'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ResponsePaginationSchema } from '@/utils/pagination'
import { HexColorSchema } from '@/utils/schemas'

export const sims_provider = mysqlTable('sims_provider', {
    id: int('id').autoincrement().primaryKey(),
    code: varchar('code', { length: 6 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    color: varchar('color', { length: 7 }).notNull(),
    group_id: int('group_id').notNull().references(() => groups.id),
    created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
    deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
        sims_provider_code: index('sims_provider_code').on(table.code),
		group_id: index('group_id').on(table.group_id)
    }
})

export const SimsProviderShemaSelect = createSelectSchema(sims_provider)
    .pick({ code: true, name: true, color: true })

export const SimsProviderShemaCreate = createSelectSchema(sims_provider, {
    name: (schema) => schema.name.min(3).max(100),
    color: (schema) => HexColorSchema
}).pick({ name: true, group_id: true, color: true }).required()

export const SimsProviderShemaUpdate = SimsProviderShemaCreate
    .pick({ name: true, color: true })
    .partial()

export const SimsProviderShemaUniqueIdentifier = createSelectSchema(sims_provider, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export const SimsProviderShemaSelectPaginated = ResponsePaginationSchema(SimsProviderShemaSelect)

export const SimsProviderSchemaCounter = SimsProviderShemaSelect.extend({
    count: z.number()
})

export type SimsProviderShemaCreateType = z.infer<typeof SimsProviderShemaCreate>
export type SimsProviderShemaSelectType = z.infer<typeof SimsProviderShemaSelect>
export type SimsProviderShemaUpdateType = z.infer<typeof SimsProviderShemaUpdate>
export type SimsProviderShemaSelectPaginatedType = z.infer<typeof SimsProviderShemaSelectPaginated>
export type SimsProviderSchemaCounterType = z.infer<typeof SimsProviderSchemaCounter>

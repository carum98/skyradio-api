import { sql } from 'drizzle-orm'
import { datetime, int, mysqlTable, varchar, primaryKey, index } from 'drizzle-orm/mysql-core'
import { groups } from './groups.model'
import { sims_provider } from './sims_provider.model'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const sims = mysqlTable('sims', {
    id: int('id').autoincrement().notNull(),
    code: varchar('code', { length: 6 }).notNull(),
    number: varchar('number', { length: 12 }).notNull(),
    serial: varchar('serial', { length: 24 }),
    provider_id: int('provider_id').notNull().references(() => sims_provider.id),
    group_id: int('group_id').notNull().references(() => groups.id),
    created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
    deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
        sims_id: primaryKey(table.id),
        sims_code: index('sims_code').on(table.code),
        provider_id: index('provider_id').on(table.provider_id),
        group_id: index('group_id').on(table.group_id)
    }
})

export const SimsShemaSelect = createSelectSchema(sims)
    .pick({ code: true, number: true })
    .extend({
        provider: createSelectSchema(sims_provider).pick({ code: true, name: true })
    })

export const SimsShemaCreate = createSelectSchema(sims, {
    number: (schema) => schema.number.min(3).max(12)
}).pick({
    number: true,
    group_id: true,
    provider_id: true,
    serial: true
})
.required()
.partial({ serial: true })

export const SimsShemaUpdate = SimsShemaCreate
    .pick({ number: true, serial: true, provider_id: true })
    .partial()

export const SimsShemaUniqueIdentifier = createSelectSchema(sims, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export type SimsShemaCreateType = z.infer<typeof SimsShemaCreate>
export type SimsShemaSelectType = z.infer<typeof SimsShemaSelect>
export type SimsShemaUpdateType = z.infer<typeof SimsShemaUpdate>

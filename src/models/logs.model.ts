import { sql } from 'drizzle-orm'
import { datetime, index, int, mysqlEnum, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core'
import { users } from './users.model'
import { groups } from './groups.model'
import { radios } from './radios.model'
import { clients } from './clients.model'
import { sims } from './sims.model'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ResponsePaginationSchema } from '@/utils/pagination'

const Actions = [
    'create-client',
    'create-radio',
    'create-sim',
    'add-radio-to-client',
    'add-sim-to-radio',
    'remove-radio-from-client',
    'remove-sim-from-radio',
    'swap-radio-from-client',
    'swap-sim-from-radio'
] as const

export const logs = mysqlTable('logs', {
    id: int('id').autoincrement().notNull(),
    user_id: int('user_id').notNull().references(() => users.id),
    group_id: int('group_id').notNull().references(() => groups.id),
    radio_id: int('radio_id').references(() => radios.id),
    client_id: int('client_id').references(() => clients.id),
    sim_id: int('sim_id').references(() => sims.id),
    action: mysqlEnum('action', Actions).notNull(),
	created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
}, (table) => {
    return {
        logs_id: primaryKey({ columns: [table.id] }),
        user_id: index('user_id').on(table.user_id),
        group_id: index('group_id').on(table.group_id),
        radio_id: index('radio_id').on(table.radio_id),
        client_id: index('client_id').on(table.client_id),
        sim_id: index('sim_id').on(table.sim_id)
    }
})

export const ActionsSchema = z.enum(Actions)

export const LogsSchemaSelect = createSelectSchema(logs)
    .omit({ created_at: true, updated_at: true })

export const LogsSchemaCreate = createInsertSchema(logs)

export const LogsSchemaUpdata = LogsSchemaCreate

export const LogsSchemaSelectPaginated = ResponsePaginationSchema(LogsSchemaSelect)

export type ActionsType = z.infer<typeof ActionsSchema>
export type LogsSchemaSelectType = z.infer<typeof LogsSchemaSelect>
export type LogsSchemaCreateType = z.infer<typeof LogsSchemaCreate>
export type LogsSchemaUpdateType = z.infer<typeof LogsSchemaUpdata>
export type LogsSchemaSelectPaginatedType = z.infer<typeof LogsSchemaSelectPaginated>

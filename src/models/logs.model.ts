import { sql } from 'drizzle-orm'
import { datetime, index, int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core'
import { UserSchemaSelect, users } from './users.model'
import { groups } from './groups.model'
import { RadiosSchemaSelect, radios } from './radios.model'
import { ClientsSchemaSelect, clients } from './clients.model'
import { SimsShemaSelect, sims } from './sims.model'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ResponsePaginationSchema } from '@/utils/pagination'
import { AppsSchemaSelect, apps } from './apps.model'
import { LOGS_MESSAGES } from '@utils/logs-messages'

const Actions = [
    'create-client',
    'create-radio',
    'create-sim',
    'create-app',
    'add-radio-to-client',
    'add-app-to-client',
    'add-sim-to-radio',
    'remove-radio-from-client',
    'remove-sim-from-radio',
    'swap-radio-from-client',
    'swap-sim-from-radio'
] as const

export const logs = mysqlTable('logs', {
    id: int('id').autoincrement().primaryKey(),
    user_id: int('user_id').notNull().references(() => users.id),
    group_id: int('group_id').notNull().references(() => groups.id),
    radio_id: int('radio_id').references(() => radios.id),
    client_id: int('client_id').references(() => clients.id),
    sim_id: int('sim_id').references(() => sims.id),
    app_id: int('app_id').references(() => apps.id),
    action: mysqlEnum('action', Actions).notNull(),
	created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
        user_id: index('user_id').on(table.user_id),
        group_id: index('group_id').on(table.group_id),
        radio_id: index('radio_id').on(table.radio_id),
        client_id: index('client_id').on(table.client_id),
        sim_id: index('sim_id').on(table.sim_id)
    }
})

export const ActionsSchema = z.enum(Actions)

export const actionsMessages = z.function()
    .args(ActionsSchema, z.string())
    .returns(z.string())
    .implement((action, rel) => LOGS_MESSAGES[rel][action] ?? 'no message found')

export const LogsSchemaSelect = createSelectSchema(logs)
    .pick({ action: true, created_at: true })
    .extend({
        message: z.string(),
        user: UserSchemaSelect.pick({ id: true, name: true }),
        values: z.object({
            radio: RadiosSchemaSelect.pick({ code: true, imei: true }).nullable(),
            client: ClientsSchemaSelect.pick({ code: true, name: true }).nullable(),
            sim: SimsShemaSelect.pick({ code: true, number: true }).nullable(),
            app: AppsSchemaSelect.pick({ code: true, name: true }).nullable()
        })
    })

export const LogsSchemaCreate = createInsertSchema(logs)

export const LogsSchemaUpdata = LogsSchemaCreate

export const LogsSchemaSelectPaginated = ResponsePaginationSchema(LogsSchemaSelect)

export type ActionsType = z.infer<typeof ActionsSchema>
export type LogsSchemaSelectType = z.infer<typeof LogsSchemaSelect>
export type LogsSchemaCreateType = z.infer<typeof LogsSchemaCreate>
export type LogsSchemaUpdateType = z.infer<typeof LogsSchemaUpdata>
export type LogsSchemaSelectPaginatedType = z.infer<typeof LogsSchemaSelectPaginated>

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
    id: int('id').autoincrement().primaryKey(),
    user_id: int('user_id').notNull().references(() => users.id),
    group_id: int('group_id').notNull().references(() => groups.id),
    radio_id: int('radio_id').references(() => radios.id),
    client_id: int('client_id').references(() => clients.id),
    sim_id: int('sim_id').references(() => sims.id),
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
    .args(ActionsSchema)
    .returns(z.string())
    .implement((action) => {
        switch (action) {
            case 'create-client':
                return 'Cliente creado {{ client }}'
            case 'create-radio':
                return 'Radio creado {{ radio }}'
            case 'create-sim':
                return 'Sim creado {{ sim }}'
            case 'add-radio-to-client':
                return 'Radio {{ radio }} agregado al cliente {{ client }}'
            case 'add-sim-to-radio':
                return 'Sim {{ sim }} agregado a radio {{ radio }}'
            case 'remove-radio-from-client':
                return 'Radio {{ radio }} removido de cliente {{ client }}'
            case 'remove-sim-from-radio':
                return 'Sim {{ sim }} removido de radio {{ radio }}'
            case 'swap-radio-from-client':
                return 'Radio cambiado de cliente'
            case 'swap-sim-from-radio':
                return 'Sim cambiado de radio'
        }
    })

export const LogsSchemaSelect = createSelectSchema(logs)
    .pick({ action: true, created_at: true })
    .extend({
        message: z.string(),
        user: UserSchemaSelect.pick({ id: true, name: true }),
        values: z.object({
            radio: RadiosSchemaSelect.pick({ code: true, imei: true }).nullable(),
            client: ClientsSchemaSelect.pick({ code: true, name: true }).nullable(),
            sim: SimsShemaSelect.pick({ code: true, number: true }).nullable()
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

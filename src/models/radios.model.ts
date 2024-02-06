import { sql } from 'drizzle-orm'
import { datetime, int, mysqlTable, varchar, index } from 'drizzle-orm/mysql-core'
import { groups } from './groups.model'
import { RadiosModelShemaSelect, radios_model } from './radios_model.model'
import { RadiosStatusShemaSelect, radios_status } from './radios_status.model'
import { ClientsSchemaSelect, clients } from './clients.model'
import { SimsShemaSelect, sims } from './sims.model'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ResponsePaginationSchema } from '@/utils/pagination'

export const radios = mysqlTable('radios', {
    id: int('id').autoincrement().primaryKey(),
    code: varchar('code', { length: 6 }).notNull(),
    name: varchar('name', { length: 100 }),
    imei: varchar('imei', { length: 50 }).notNull(),
    serial: varchar('serial', { length: 100 }),
    model_id: int('model_id').notNull().references(() => radios_model.id),
    status_id: int('status_id').references(() => radios_status.id),
    sim_id: int('sim_id').references(() => sims.id),
    client_id: int('client_id').references(() => clients.id),
    group_id: int('group_id').notNull().references(() => groups.id),
    created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
    deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
        radios_code: index('radios_code').on(table.code),
        radios_model_id: index('radios_model_id').on(table.model_id),
        radios_status_id: index('radios_status_id').on(table.status_id),
        radios_sim_id: index('radios_sim_id').on(table.sim_id),
        radios_client_id: index('radios_client_id').on(table.client_id),
        group_id: index('group_id').on(table.group_id)
    }
})

export const RadiosSchemaSelect = createSelectSchema(radios)
    .pick({ code: true, name: true, imei: true, serial: true })
    .extend({
        model: RadiosModelShemaSelect.pick({ code: true, name: true, color: true }),
        status: RadiosStatusShemaSelect.pick({ code: true, name: true, color: true }).nullable(),
        sim: SimsShemaSelect.pick({ code: true, number: true, provider: true }).nullable(),
        client: ClientsSchemaSelect.pick({ code: true, name: true, color: true }).nullable()
    })

export const RadiosSchemaCreateRaw = createInsertSchema(radios, {
    name: (schema) => schema.name.min(3).max(100).nullable(),
    imei: (schema) => schema.imei.length(15)
}).pick({
    name: true,
    imei: true,
    serial: true,
    model_id: true,
    group_id: true,
    status_id: true,
    sim_id: true,
    client_id: true
})

export const RadiosSchemaCreate = RadiosSchemaCreateRaw.pick({
    name: true,
    imei: true,
    serial: true,
    group_id: true
})
.extend({
    model_code: z.string().length(6),
    status_code: z.string().length(6),
    sim_code: z.string().length(6),
    client_code: z.string().length(6)
})
.required()
.partial({
    name: true,
    serial: true,
    status_code: true,
    sim_code: true,
    client_code: true
})

export const RadiosSchemaUpdateRaw = RadiosSchemaCreateRaw.omit({
    group_id: true
}).partial()

export const RadiosSchemaUpdate = RadiosSchemaCreate
    .pick({
        name: true,
        model_code: true,
        status_code: true,
        sim_code: true,
        client_code: true
    })
    .partial()

export const RadiosSchemaUniqueIdentifier = createSelectSchema(radios, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export const RadiosCompanySchema = z.object({
    client_code: z.string().length(6)
})

export const RadiosSimsSchema = z.object({
    sim_code: z.string().length(6)
})

export const RadiosSchemaSelectPaginated = ResponsePaginationSchema(RadiosSchemaSelect)

export type RadiosSchemaCreateRawType = z.infer<typeof RadiosSchemaCreateRaw>
export type RadiosSchemaCreateType = z.infer<typeof RadiosSchemaCreate>
export type RadiosSchemaSelectType = z.infer<typeof RadiosSchemaSelect>
export type RadiosSchemaUpdateRawType = z.infer<typeof RadiosSchemaUpdateRaw>
export type RadiosSchemaUpdateType = z.infer<typeof RadiosSchemaUpdate>
export type RadiosSchemaSelectPaginatedType = z.infer<typeof RadiosSchemaSelectPaginated>
export type RadiosCompanySchemaType = z.infer<typeof RadiosCompanySchema>
export type RadiosSimsSchemaType = z.infer<typeof RadiosSimsSchema>

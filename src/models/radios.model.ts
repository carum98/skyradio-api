import { sql } from 'drizzle-orm'
import { datetime, int, mysqlTable, varchar, primaryKey, index } from 'drizzle-orm/mysql-core'
import { groups } from './groups.model'
import { RadiosModelShemaSelect, radios_model } from './radios_model.model'
import { RadiosStatusShemaSelect, radios_status } from './radios_status.model'
import { CompanySchemaSelect, companies } from './companies.model'
import { SimsShemaSelect, sims } from './sims.model'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ResponsePaginationSchema } from '@/utils/pagination'

export const radios = mysqlTable('radios', {
    id: int('id').autoincrement().notNull(),
    code: varchar('code', { length: 6 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    imei: varchar('imei', { length: 255 }).notNull(),
    serial: varchar('serial', { length: 255 }).notNull(),
    model_id: int('model_id').notNull().references(() => radios_model.id),
    status_id: int('status_id').references(() => radios_status.id),
    sim_id: int('sim_id').references(() => sims.id),
    company_id: int('company_id').references(() => companies.id),
    group_id: int('group_id').notNull().references(() => groups.id),
    created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
    deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
        radios_id: primaryKey(table.id),
        radios_code: index('radios_code').on(table.code),
        radios_model_id: index('radios_model_id').on(table.model_id),
        radios_status_id: index('radios_status_id').on(table.status_id),
        radios_sim_id: index('radios_sim_id').on(table.sim_id),
        radios_company_id: index('radios_company_id').on(table.company_id),
        group_id: index('group_id').on(table.group_id)
    }
})

export const RadiosSchemaSelect = createSelectSchema(radios)
    .pick({ code: true, name: true, imei: true, serial: true })
    .extend({
        model: RadiosModelShemaSelect.pick({ code: true, name: true }),
        status: RadiosStatusShemaSelect.pick({ code: true, name: true }).nullable(),
        sim: SimsShemaSelect.pick({ code: true, number: true, provider: true }).nullable(),
        company: CompanySchemaSelect.pick({ code: true, name: true }).nullable()
    })

export const RadiosSchemaCreate = createInsertSchema(radios, {
    name: (schema) => schema.name.min(3).max(100)
}).pick({
    name: true,
    imei: true,
    serial: true,
    group_id: true
})
.extend({
    model_code: z.string().length(6),
    status_code: z.string().length(6),
    sim_code: z.string().length(6),
    company_code: z.string().length(6)
})
.required()
.partial({
    status_code: true,
    sim_code: true,
    company_code: true
})

export const RadiosSchemaUpdate = RadiosSchemaCreate
    .pick({
        name: true,
        model_code: true,
        status_code: true,
        sim_code: true,
        company_code: true
    })
    .partial()

export const RadiosSchemaUniqueIdentifier = createSelectSchema(radios, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export const RadiosSchemaSelectPaginated = ResponsePaginationSchema(RadiosSchemaSelect)

export type RadiosSchemaCreateType = z.infer<typeof RadiosSchemaCreate>
export type RadiosSchemaSelectType = z.infer<typeof RadiosSchemaSelect>
export type RadiosSchemaUpdateType = z.infer<typeof RadiosSchemaUpdate>
export type RadiosSchemaSelectPaginatedType = z.infer<typeof RadiosSchemaSelectPaginated>

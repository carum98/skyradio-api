import { sql } from 'drizzle-orm'
import { datetime, index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'
import { clients } from './clients.model'
import { LicensesSchemaSelect, licenses } from './licenses.model'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { ResponsePaginationSchema } from '@/utils/pagination'
import { z } from 'zod'
import { groups } from './groups.model'

export const apps = mysqlTable('apps', {
    id: int('id').autoincrement().primaryKey(),
    code: varchar('code', { length: 6 }).notNull(),
    name: varchar('name', { length: 100 }),
    license_id: int('license_id').notNull().references(() => licenses.id).unique(),
    client_id: int('client_id').references(() => clients.id),
    group_id: int('group_id').notNull().references(() => groups.id),
    created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
    deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
        console_code: index('console_code').on(table.code),
        license_id: index('license_id').on(table.license_id),
        group_id: index('group_id').on(table.group_id)
    }
})

export const AppsSchemaSelect = createSelectSchema(apps)
    .pick({ code: true, name: true })
    .extend({
        license: LicensesSchemaSelect,
        client: z.object({
            code: z.string(),
            name: z.string(),
            color: z.string()
        }).nullable()
    })

export const AppsSchemaCreateRaw = createInsertSchema(apps, {
    name: (schema) => schema.name.min(3).max(100)
})
.pick({
    name: true,
    license_id: true,
    client_id: true,
    group_id: true
})

export const AppsSchemaCreate = AppsSchemaCreateRaw
.pick({
    name: true,
    group_id: true
})
.extend({
    license_code: z.string().length(6),
    client_code: z.string().length(6)
})
.required()

export const AppsSchemaUpdateRaw = createInsertSchema(apps)
    .pick({ name: true, license_id: true })
    .partial()

export const AppsSchemaUpdate = AppsSchemaUpdateRaw
    .omit({ license_id: true })
    .extend({ license_code: z.string().length(6) })
    .partial()

export const AppsSchemaUniqueIdentifier = z.object({
    code: z.string().length(6)
})

export const AppsSchemaSelectPaginated = ResponsePaginationSchema(AppsSchemaSelect)

export type AppsSchemaCreateRawType = z.infer<typeof AppsSchemaCreateRaw>
export type AppsSchemaCreateType = z.infer<typeof AppsSchemaCreate>
export type AppsSchemaUpdateRawType = z.infer<typeof AppsSchemaUpdateRaw>
export type AppsSchemaUpdateType = z.infer<typeof AppsSchemaUpdate>
export type AppsSchemaSelectType = z.infer<typeof AppsSchemaSelect>
export type AppsSchemaUniqueIdentifierType = z.infer<typeof AppsSchemaUniqueIdentifier>
export type AppsSchemaSelectPaginatedType = z.infer<typeof AppsSchemaSelectPaginated>

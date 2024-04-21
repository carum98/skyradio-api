import { z } from 'zod'
import { sql } from 'drizzle-orm'
import { datetime, index, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core'
import { groups } from './groups.model'
import { UserSchemaSelect, users } from './users.model'
import { createSelectSchema } from 'drizzle-zod'
import { ResponsePaginationSchema } from '@/utils/pagination'

export const sellers = mysqlTable('sellers', {
    id: int('id').autoincrement().primaryKey(),
    code: varchar('code', { length: 6 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    user_id: int('user_id').references(() => users.id),
	group_id: int('group_id').notNull().references(() => groups.id),
    created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
    deleted_at: datetime('deleted_at', { mode: 'string' })
}, (table) => {
    return {
        sellers_code: index('sellers_code').on(table.code),
		group_id: index('group_id').on(table.group_id)
    }
})

export const SellersSchemaSelect = createSelectSchema(sellers)
    .pick({ code: true, name: true })
    .extend({
        user: UserSchemaSelect.pick({ code: true, name: true }).nullable()
    })

export const SellersSchemaCreate = createSelectSchema(sellers, {
        name: (schema) => schema.name.min(3).max(100)
    })
    .pick({ name: true, group_id: true, user_id: true })
    .extend({ user_code: z.string() })
    .required()
    .partial({ user_id: true, user_code: true })

export const SellersSchemaUpdate = SellersSchemaCreate
    .pick({ name: true, user_id: true })
    .extend({ user_code: z.string() })
    .partial()

export const SellersSchemaUniqueIdentifier = createSelectSchema(sellers, {
    code: (schema) => schema.code.length(6)
}).pick({ code: true }).required()

export const SellerSchemaCounter = SellersSchemaSelect.extend({
    count: z.number()
})
.omit({ user: true })

export const SellersSchemaSelectPaginated = ResponsePaginationSchema(SellersSchemaSelect)

export type SellersSchemaCreateType = z.infer<typeof SellersSchemaCreate>
export type SellersSchemaSelectType = z.infer<typeof SellersSchemaSelect>
export type SellersSchemaUpdateType = z.infer<typeof SellersSchemaUpdate>
export type SellersSchemaSelectPaginatedType = z.infer<typeof SellersSchemaSelectPaginated>
export type SellerSchemaCounterType = z.infer<typeof SellerSchemaCounter>

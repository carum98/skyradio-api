import { mysqlTable, int, varchar, datetime, unique, index } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'
import { users } from './users.model'

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const refresh_tokens = mysqlTable('refresh_tokens', {
	id: int('id').autoincrement().primaryKey(),
	user_id: int('user_id').notNull().references(() => users.id),
	token: varchar('token', { length: 255 }).notNull(),
	created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
	deleted_at: datetime('deleted_at', { mode: 'string' })
},
(table) => {
	return {
		user_id: index('user_id').on(table.user_id),
		token_2: index('token_2').on(table.token, table.user_id),
		token: unique('token').on(table.token, table.user_id)
	}
})

export const RefreshTokenSchemaCreate = createInsertSchema(refresh_tokens)
export const RefreshTokenSchemaSelect = createSelectSchema(refresh_tokens)

export type RefreshTokenSchemaCreateType = z.infer<typeof RefreshTokenSchemaCreate>
export type RefreshTokenSchemaSelectType = z.infer<typeof RefreshTokenSchemaSelect>

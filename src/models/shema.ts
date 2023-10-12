import { mysqlTable, primaryKey, int, varchar, datetime, unique, index, mysqlEnum } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

export const groups = mysqlTable('groups', {
	id: int('id').autoincrement().notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deleted_at: datetime('deleted_at', { mode: 'string' })
},
(table) => {
	return {
		groups_id: primaryKey(table.id)
	}
})

export const refresh_tokens = mysqlTable('refresh_tokens', {
	id: int('id').autoincrement().notNull(),
	user_id: int('user_id').notNull().references(() => users.id),
	token: varchar('token', { length: 255 }).notNull(),
	created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deleted_at: datetime('deleted_at', { mode: 'string' })
},
(table) => {
	return {
		user_id: index('user_id').on(table.user_id),
		token_2: index('token_2').on(table.token, table.user_id),
		refresh_tokens_id: primaryKey(table.id),
		token: unique('token').on(table.token, table.user_id)
	}
})

export const users = mysqlTable('users', {
	id: int('id').autoincrement().notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	role: mysqlEnum('role', ['admin', 'user']).default('user').notNull(),
	group_id: int('group_id').notNull().references(() => groups.id),
	created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deleted_at: datetime('deleted_at', { mode: 'string' })
},
(table) => {
	return {
		group_id: index('group_id').on(table.group_id),
		email_2: index('email_2').on(table.email),
		users_id: primaryKey(table.id),
		email: unique('email').on(table.email)
	}
})

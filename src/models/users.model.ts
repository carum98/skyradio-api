import { mysqlTable, primaryKey, int, varchar, datetime, unique, index, mysqlEnum } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'
import { groups } from './groups.model'

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const users = mysqlTable('users', {
	id: int('id').autoincrement().notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	role: mysqlEnum('role', ['admin', 'user']).default('user').notNull(),
	group_id: int('group_id').notNull().references(() => groups.id),
	created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
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

export const UserSchema = createSelectSchema(users, {
	email: z.string().email()
})

export const UserSchemaSelect = UserSchema.omit({
	password: true,
	deleted_at: true,
	created_at: true,
	updated_at: true
})

export const UserSchemaCreate = createInsertSchema(users, {
    email: (schema) => schema.email.email(),
	password: (schema) => schema.password.min(3).max(100),
	name: (schema) => schema.name.min(3).max(100)
}).pick({ name: true, email: true, password: true, role: true, group_id: true }).required()

export const UserSchemaUpdate = UserSchemaCreate
	.pick({ name: true, email: true, password: true })
	.partial()

export const UserSchemaUniqueIdentifier = createSelectSchema(users, {
	id: (schema) => schema.id.or(z.coerce.number())
}).pick({ id: true }).required()

export type UserSchemaType = z.infer<typeof UserSchema>
export type UserSchemaCreateType = z.infer<typeof UserSchemaCreate>
export type UserSchemaSelectType = z.infer<typeof UserSchemaSelect>
export type UserSchemaUpdateType = z.infer<typeof UserSchemaUpdate>

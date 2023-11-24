import { mysqlTable, primaryKey, int, varchar, datetime, unique, index, mysqlEnum } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'
import { GroupSchemaSelect, groups } from './groups.model'

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ResponsePaginationSchema } from '@/utils/pagination'

export const UserRoles = ['admin', 'user'] as const

export const users = mysqlTable('users', {
	id: int('id').autoincrement().notNull(),
	code: varchar('code', { length: 6 }).notNull().default('123456'),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	role: mysqlEnum('role', UserRoles).default('user').notNull(),
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

export const UserSchemaRoles = z.enum(UserRoles)

export const UserSchema = createSelectSchema(users, {
	email: z.string().email(),
	role: UserSchemaRoles
})

export const UserSchemaSelect = UserSchema.omit({
	id: true,
	group_id: true,
	password: true,
	deleted_at: true,
	created_at: true,
	updated_at: true
})
.extend({
	group: GroupSchemaSelect
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
	code: (schema) => schema.code
}).pick({ code: true }).required()

export const UserSchemaSelectPaginated = ResponsePaginationSchema(UserSchemaSelect)

export type UserSchemaType = z.infer<typeof UserSchema>
export type UserSchemaCreateType = z.infer<typeof UserSchemaCreate>
export type UserSchemaSelectType = z.infer<typeof UserSchemaSelect>
export type UserSchemaUpdateType = z.infer<typeof UserSchemaUpdate>
export type UserSchemaSelectPaginatedType = z.infer<typeof UserSchemaSelectPaginated>
export type UserRolesType = z.infer<typeof UserSchemaRoles>

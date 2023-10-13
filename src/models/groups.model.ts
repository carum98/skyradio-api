import { mysqlTable, primaryKey, int, varchar, datetime } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const groups = mysqlTable('groups', {
	id: int('id').autoincrement().notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	created_at: datetime('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updated_at: datetime('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
	deleted_at: datetime('deleted_at', { mode: 'string' })
},
(table) => {
	return {
		groups_id: primaryKey(table.id)
	}
})

export const GroupSchemaCreate = createInsertSchema(groups)
export const GroupSchemaSelect = createSelectSchema(groups)

export type GroupSchemaCreateType = z.infer<typeof GroupSchemaCreate>
export type GroupSchemaSelectType = z.infer<typeof GroupSchemaSelect>

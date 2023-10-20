import { PaginationSchemaType } from '@/utils/pagination'
import { SQL, sql } from 'drizzle-orm'
import { MySqlColumn, MySqlTable } from 'drizzle-orm/mysql-core'
import { MySql2Database } from 'drizzle-orm/mysql2'

export class RepositoryCore {
    constructor (
        public readonly db: MySql2Database,
        public readonly table: MySqlTable,
        public readonly columnId: MySqlColumn
    ) { }

    public async count (where: SQL<unknown> | undefined): Promise<number> {
        const total = await this.db.select({ count: sql<number>`count(${this.columnId})` })
            .from(this.table)
            .where(where)

        return total[0].count
    }

    public async paginate (where: SQL<unknown> | undefined, query: PaginationSchemaType): Promise<any> {
        const { page, per_page } = query

        const offset = (page - 1) * per_page

        const data = await this.db.select()
            .from(this.table)
            .where(where)
            .limit(per_page)
            .offset(offset)

        const total = await this.count(where)

        return {
            data,
            pagination: {
                total,
                page: query.page,
                per_page: query.per_page,
                total_pages: Math.ceil(total / query.per_page)
            }
        }
    }
}

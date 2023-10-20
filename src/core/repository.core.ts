import { PaginationSchemaType, ResponsePaginationSchemaType } from '@/utils/pagination'
import { SQL, and, isNull, sql } from 'drizzle-orm'
import { MySqlColumn, MySqlTable } from 'drizzle-orm/mysql-core'
import { MySql2Database } from 'drizzle-orm/mysql2'

interface RepositoryCoreParams {
    db: MySql2Database
    table: MySqlTable
    deletedColumn: MySqlColumn
}

export class RepositoryCore<T> {
    public readonly db: MySql2Database
    public readonly table: MySqlTable
    public readonly deletedColumn: MySqlColumn

    constructor ({ db, table, deletedColumn }: RepositoryCoreParams) {
        this.db = db
        this.table = table
        this.deletedColumn = deletedColumn
    }

    public async selector (where: SQL<unknown> | undefined, per_page?: number, offset?: number): Promise<T[]> {
        let query = this.db.select()
            .from(this.table)
            .where(and(where, isNull(this.deletedColumn)))

        if (per_page !== undefined) {
            query = query.limit(per_page)
        }

        if (offset !== undefined) {
            query = query.offset(offset)
        }

        return await query as T[]
    }

    public async paginate (where: SQL<unknown> | undefined, query: PaginationSchemaType): Promise<ResponsePaginationSchemaType<T>> {
        const { page, per_page } = query

        const offset = (page - 1) * per_page

        const data = await this.selector(where, per_page, offset)
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

    public async count (where: SQL<unknown> | undefined): Promise<number> {
        const total = await this.db.select({ count: sql<number>`count(id)` })
            .from(this.table)
            .where(and(where, isNull(this.deletedColumn)))

        return total[0].count
    }

    public async softDelete (where: SQL<unknown>): Promise<boolean> {
        const data = await this.db.update(this.table)
            .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
            .where(and(where, isNull(this.deletedColumn)))

        return data[0].affectedRows > 0
    }
}

import { generateCode } from '@/utils/code'
import { PaginationSchemaType, ResponsePaginationSchemaType } from '@/utils/pagination'
import { SQL, and, isNull, sql } from 'drizzle-orm'
import { MySqlTable } from 'drizzle-orm/mysql-core'
import { MySql2Database } from 'drizzle-orm/mysql2'

type Where = SQL<unknown> | undefined

interface RepositoryCoreParams {
    db: MySql2Database
    table: MySqlTable
    select: any
}

interface PaginateParams {
    query: PaginationSchemaType
    where: Where
}

interface SelectorParams {
    where: Where
    per_page?: number
    offset?: number
}

interface InsertParams<E> {
    params: E
}

interface UpdateParams<E> {
    where: Where
    params: Partial<E>
}

export class RepositoryCore<T> {
    protected readonly db: MySql2Database
    protected readonly table: MySqlTable
    protected readonly select: any

    constructor (data: RepositoryCoreParams) {
        this.db = data.db
        this.table = data.table
        this.select = data.select
    }

    protected async selector ({ where, offset, per_page }: SelectorParams): Promise<T[]> {
        let query = this.select.where(and(where, isNull(sql`deleted_at`)))

        if (per_page !== undefined) {
            query = query.limit(per_page)
        }

        if (offset !== undefined) {
            query = query.offset(offset)
        }

        return await query as T[]
    }

    protected async paginate ({ query, where }: PaginateParams): Promise<ResponsePaginationSchemaType<T>> {
        const { page, per_page } = query

        const offset = (page - 1) * per_page

        const data = await this.selector({ where, per_page, offset })
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

    protected async set<E> ({ where, params }: UpdateParams<E>): Promise<boolean> {
        const data = await this.db.update(this.table)
            .set(params)
            .where(and(where, isNull(sql`deleted_at`)))

        return data[0].affectedRows > 0
    }

    protected async insert<E> ({ params }: InsertParams<E>): Promise<string> {
        const code = generateCode()

        await this.db.insert(this.table).values({
            ...params,
            code
        })

        return code
    }

    protected async softDelete (where: Where): Promise<boolean> {
        const data = await this.db.update(this.table)
            .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
            .where(and(where, isNull(sql`deleted_at`)))

        return data[0].affectedRows > 0
    }

    protected async count (where: Where): Promise<number> {
        const total = await this.db.select({ count: sql<number>`count(id)` })
            .from(this.table)
            .where(and(where, isNull(sql`deleted_at`)))

        return total[0].count
    }
}

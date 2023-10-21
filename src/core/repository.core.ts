import { generateCode } from '@/utils/code'
import { PaginationSchemaType, ResponsePaginationSchemaType } from '@/utils/pagination'
import { SQL, and, isNull, sql } from 'drizzle-orm'
import { MySqlColumn, MySqlSelect, MySqlTable, getTableConfig } from 'drizzle-orm/mysql-core'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { SelectMode } from 'drizzle-orm/query-builders/select.types'

type Where = SQL<unknown> | undefined

interface RepositoryCoreParams {
    db: MySql2Database
    table: MySqlTable
    select: MySqlSelect<any, any, SelectMode, any>
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

interface InsertParams<TInsert> {
    params: TInsert
}

interface UpdateParams<TUpdate> {
    where: Where
    params: Partial<TUpdate>
}

export class RepositoryCore<TSelect, TInsert, TUpdate> {
    protected readonly db: MySql2Database
    protected readonly table: MySqlTable
    protected readonly select: MySqlSelect<any, any, SelectMode, any>
    protected readonly deleted_column: MySqlColumn

    constructor (data: RepositoryCoreParams) {
        this.db = data.db
        this.table = data.table
        this.select = data.select

        const { columns } = getTableConfig(this.table)

        const deleted_column = columns.find((column) => column.name === 'deleted_at')

        this.deleted_column = deleted_column as MySqlColumn
    }

    protected async selector ({ where, offset, per_page }: SelectorParams): Promise<TSelect[]> {
        let query = this.select.where(and(where, isNull(this.deleted_column)))

        if (per_page !== undefined) {
            query = query.limit(per_page)
        }

        if (offset !== undefined) {
            query = query.offset(offset)
        }

        const data = await query

        return this.parseResonse(data)
    }

    protected async set ({ where, params }: UpdateParams<TUpdate>): Promise<boolean> {
        const data = await this.db.update(this.table)
            .set(params)
            .where(and(where, isNull(this.deleted_column)))

        return data[0].affectedRows > 0
    }

    protected async insert ({ params }: InsertParams<TInsert>): Promise<string> {
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
            .where(and(where, isNull(this.deleted_column)))

        return data[0].affectedRows > 0
    }

    protected async count (where: Where): Promise<number> {
        const total = await this.db.select({ count: sql<number>`count(id)` })
            .from(this.table)
            .where(and(where, isNull(this.deleted_column)))

        return total[0].count
    }

    protected async paginate ({ query, where }: PaginateParams): Promise<ResponsePaginationSchemaType<TSelect>> {
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

    private parseResonse (data: { [key: string]: any }): TSelect[] {
        const keys = Object.keys(data.at(0)).filter((key) => key.includes('__'))

        if (keys.length > 0) {
            data.forEach((item: any) => {
                keys.forEach((key) => {
                    const [group, property] = key.split('__')

                    if (item[group] !== null) {
                        item[group] = {
                            ...item[group],
                            [property]: item[key]
                        }

                        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                        delete item[key]
                    }
                })
            })
        }

        return data as unknown as TSelect[]
    }
}

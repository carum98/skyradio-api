import { generateCode } from '@/utils/code'
import { NotFoundError } from '@/utils/errors'
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

export abstract class RepositoryCore<TSelect, TInsert, TUpdate> {
    protected readonly db: MySql2Database
    protected readonly table: MySqlTable
    protected readonly select: MySqlSelect<any, any, SelectMode, any>
    protected readonly table_name: string
    protected readonly deleted_column: MySqlColumn

    constructor (data: RepositoryCoreParams) {
        this.db = data.db
        this.table = data.table
        this.select = data.select

        const { columns, name } = getTableConfig(this.table)

        const deleted_column = columns.find((column) => column.name === 'deleted_at')

        this.deleted_column = deleted_column as MySqlColumn
        this.table_name = name
    }

    protected async getAllCore ({ query, where }: PaginateParams): Promise<ResponsePaginationSchemaType<TSelect>> {
        const { page, per_page } = query

        const offset = (page - 1) * per_page

        const data = await this.query({ where, per_page, offset })
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

    protected async getOneCore ({ where }: { where: Where }): Promise<TSelect> {
        const data = await this.query({ where, per_page: 1 })

        if (data.length === 0) {
            throw new NotFoundError(`${this.table_name} not found`)
        }

        return data.at(0) as TSelect
    }

    protected async updateCore ({ where, params }: UpdateParams<TUpdate>): Promise<boolean> {
        const data = await this.db.update(this.table)
            .set(params)
            .where(and(where, isNull(this.deleted_column)))

        return data[0].affectedRows > 0
    }

    protected async insertCore ({ params }: InsertParams<TInsert>): Promise<string> {
        const code = generateCode()

        await this.db.insert(this.table).values({
            ...params,
            code
        })

        return code
    }

    protected async deleteCore (where: Where): Promise<boolean> {
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

    private async query ({ where, offset, per_page }: SelectorParams): Promise<TSelect[]> {
        let query = this.select.where(and(where, isNull(this.deleted_column)))

        if (per_page !== undefined) {
            query = query.limit(per_page)
        }

        if (offset !== undefined) {
            query = query.offset(offset)
        }

        const data = await query

        if (data.length !== 0) {
            const keys = Object.keys(data.at(0) as object).filter((key) => key.includes('__'))

            if (keys.length > 0) {
                data.forEach((item: any) => keys.forEach((key) => this.parseObject(item, key)))
            }
        }

        return data as unknown as TSelect[]
    }

    private parseObject (item: any, key: string): void {
        const [group, property] = key.split('__')

        if (item[group] !== null) {
            item[group] = {
                ...item[group],
                [property]: item[key]
            }

            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete item[key]
        }
    }
}

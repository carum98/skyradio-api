import { MySql2Database } from 'drizzle-orm/mysql2'
import { count, eq, sql } from 'drizzle-orm'
import { SellerSchemaCounterType, SellersSchemaCreateType, SellersSchemaSelect, SellersSchemaSelectPaginated, SellersSchemaSelectPaginatedType, SellersSchemaSelectType, SellersSchemaUpdateType, sellers } from '@models/sellers.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { IRepository, RepositoryCore } from '@/core/repository.core'
import { clients } from '@/models/clients.model'

export class SellersRepository extends RepositoryCore<SellersSchemaSelectType, SellersSchemaCreateType, SellersSchemaUpdateType> implements IRepository {
    constructor (public readonly db: MySql2Database) {
        const table = sellers

        const select = db.select({
            code: sellers.code,
            name: sellers.name
        })
        .from(table)

        super({ db, table, select, search_columns: [sellers.name] })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<SellersSchemaSelectPaginatedType> {
        const data = await super.getAllCore({
            query,
            where: eq(sellers.group_id, group_id)
        })

        return SellersSchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<SellersSchemaSelectType> {
        const data = await super.getOneCore({
            where: eq(sellers.code, code)
        })

        return SellersSchemaSelect.parse(data)
    }

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(sellers.code, code)
        })
    }

    public async create (params: SellersSchemaCreateType): Promise<string> {
        const code = await super.insertCore({
            params
        })

        return code
    }

    public async update (code: string, params: SellersSchemaUpdateType): Promise<string> {
        const data = await super.updateCore({
            params,
            where: eq(sellers.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await super.deleteCore(eq(sellers.code, code))
    }

    public async countAll (group_id: number): Promise<SellerSchemaCounterType[]> {
        return await this.db.select({
            code: sellers.code,
            name: sellers.name,
            count: count(sellers.code)
        })
        .from(clients)
        .rightJoin(sellers, eq(sellers.id, clients.seller_id))
        .where(eq(clients.group_id, group_id))
        .groupBy(sql`${sellers.code}, ${sellers.name}`)
    }
}

import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq } from 'drizzle-orm'
import { ClientsSellerSchemaCreateType, ClientsSellerSchemaSelect, ClientsSellerSchemaSelectPaginated, ClientsSellerSchemaSelectPaginatedType, ClientsSellerSchemaSelectType, ClientsSellerSchemaUpdateType, companies_seller } from '@models/clients_seller.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { IRepository, RepositoryCore } from '@/core/repository.core'

export class ClientsSellerRepository extends RepositoryCore<ClientsSellerSchemaSelectType, ClientsSellerSchemaCreateType, ClientsSellerSchemaUpdateType> implements IRepository {
    constructor (public readonly db: MySql2Database) {
        const table = companies_seller

        const select = db.select({
            code: companies_seller.code,
            name: companies_seller.name
        })
        .from(table)

        super({ db, table, select, search_columns: [companies_seller.name] })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<ClientsSellerSchemaSelectPaginatedType> {
        const data = await super.getAllCore({
            query,
            where: eq(companies_seller.group_id, group_id)
        })

        return ClientsSellerSchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<ClientsSellerSchemaSelectType> {
        const data = await super.getOneCore({
            where: eq(companies_seller.code, code)
        })

        return ClientsSellerSchemaSelect.parse(data)
    }

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(companies_seller.code, code)
        })
    }

    public async create (params: ClientsSellerSchemaCreateType): Promise<string> {
        const code = await super.insertCore({
            params
        })

        return code
    }

    public async update (code: string, params: ClientsSellerSchemaUpdateType): Promise<string> {
        const data = await super.updateCore({
            params,
            where: eq(companies_seller.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await super.deleteCore(eq(companies_seller.code, code))
    }
}

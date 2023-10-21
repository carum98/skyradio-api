import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq } from 'drizzle-orm'
import { ICompanySellerRepository } from './repositories'
import { CompanySellerSchemaCreateType, CompanySellerSchemaSelect, CompanySellerSchemaSelectPaginated, CompanySellerSchemaSelectPaginatedType, CompanySellerSchemaSelectType, CompanySellerSchemaUpdateType, companies_seller } from '@models/companies_seller.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { RepositoryCore } from '@/core/repository.core'

export class CompaniesSellerRepository extends RepositoryCore<CompanySellerSchemaSelectType, CompanySellerSchemaCreateType, CompanySellerSchemaUpdateType> implements ICompanySellerRepository {
    constructor (public readonly db: MySql2Database) {
        const table = companies_seller

        const select = db.select({
            code: companies_seller.code,
            name: companies_seller.name
        })
        .from(table)

        super({ db, table, select })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<CompanySellerSchemaSelectPaginatedType> {
        const data = await super.getAllCore({
            query,
            where: eq(companies_seller.group_id, group_id)
        })

        return CompanySellerSchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<CompanySellerSchemaSelectType> {
        const data = await super.getOneCore({
            where: eq(companies_seller.code, code)
        })

        return CompanySellerSchemaSelect.parse(data)
    }

    public async create (params: CompanySellerSchemaCreateType): Promise<string> {
        const code = await super.insertCore({
            params
        })

        return code
    }

    public async update (code: string, params: CompanySellerSchemaUpdateType): Promise<string> {
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

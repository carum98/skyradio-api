import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq, sql } from 'drizzle-orm'
import { CompanySchemaCreateRawType, CompanySchemaSelectPaginatedType, CompanySchemaSelectType, CompanySchemaUpdateRawType, companies } from '@models/companies.model'
import { companies_modality } from '@/models/companies_modality.model'
import { companies_seller } from '@/models/companies_seller.model'
import { radios } from '@/models/radios.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { RepositoryCore } from '@/core/repository.core'

export class CompaniesRepository extends RepositoryCore<CompanySchemaSelectType, CompanySchemaCreateRawType, CompanySchemaUpdateRawType> {
    constructor (public readonly db: MySql2Database) {
        const table = companies

        const select = db.select({
            code: companies.code,
            name: companies.name,
            modality: {
                code: companies_modality.code,
                name: companies_modality.name
            },
            seller: {
                code: companies_seller.code,
                name: companies_seller.name
            },
            radios_count: sql<number>`(select count(${radios.id}) from ${radios} where ${radios.company_id} = ${companies.id})`
        })
        .from(table)
        .leftJoin(companies_modality, eq(companies_modality.id, companies.modality_id))
        .leftJoin(companies_seller, eq(companies_seller.id, companies.seller_id))

        super({ db, table, select, search_columns: [companies.name] })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<CompanySchemaSelectPaginatedType> {
        return await super.getAllCore({
            query,
            where: eq(companies.group_id, group_id)
        })
    }

    public async get (code: string): Promise<CompanySchemaSelectType> {
        return await super.getOneCore({
            where: eq(companies.code, code)
        })
    }

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(companies.code, code)
        })
    }

    public async create (params: CompanySchemaCreateRawType): Promise<string> {
        return await super.insertCore({
            params
        })
    }

    public async update (code: string, params: CompanySchemaUpdateRawType): Promise<string> {
        const isUpdated = await super.updateCore({
            params,
            where: eq(companies.code, code)
        })

        return isUpdated ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await super.deleteCore(eq(companies.code, code))
    }
}

import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq } from 'drizzle-orm'
import { CompanyModalitySchemaCreateType, CompanyModalitySchemaSelect, CompanyModalitySchemaSelectPaginated, CompanyModalitySchemaSelectPaginatedType, CompanyModalitySchemaSelectType, CompanyModalitySchemaUpdateType, companies_modality } from '@models/companies_modality.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { IRepository, RepositoryCore } from '@/core/repository.core'

export class CompaniesModalityRepository extends RepositoryCore<CompanyModalitySchemaSelectType, CompanyModalitySchemaCreateType, CompanyModalitySchemaUpdateType> implements IRepository {
    constructor (public readonly db: MySql2Database) {
        const table = companies_modality

        const select = db.select({
            code: companies_modality.code,
            name: companies_modality.name
        })
        .from(table)

        super({ db, table, select, search_columns: [companies_modality.name] })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<CompanyModalitySchemaSelectPaginatedType> {
        const data = await super.getAllCore({
            query,
            where: eq(companies_modality.group_id, group_id)
        })

        return CompanyModalitySchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<CompanyModalitySchemaSelectType> {
        const data = await super.getOneCore({
            where: eq(companies_modality.code, code)
        })

        return CompanyModalitySchemaSelect.parse(data)
    }

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(companies_modality.code, code)
        })
    }

    public async create (params: CompanyModalitySchemaCreateType): Promise<string> {
        const code = await super.insertCore({
            params
        })

        return code
    }

    public async update (code: string, params: CompanyModalitySchemaUpdateType): Promise<string> {
        const data = await super.updateCore({
            params,
            where: eq(companies_modality.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await super.deleteCore(eq(companies_modality.code, code))
    }
}

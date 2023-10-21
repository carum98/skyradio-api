import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq } from 'drizzle-orm'
import { ICompanyModalityRepository } from './repositories'
import { CompanyModalitySchemaCreateType, CompanyModalitySchemaSelect, CompanyModalitySchemaSelectPaginated, CompanyModalitySchemaSelectPaginatedType, CompanyModalitySchemaSelectType, CompanyModalitySchemaUpdateType, companies_modality } from '@models/companies_modality.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { RepositoryCore } from '@/core/repository.core'

export class CompaniesModalityRepository extends RepositoryCore<CompanyModalitySchemaSelectType> implements ICompanyModalityRepository {
    constructor (public readonly db: MySql2Database) {
        const table = companies_modality

        const select = db.select({
            code: companies_modality.code,
            name: companies_modality.name
        })
        .from(table)

        super({ db, table, select })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<CompanyModalitySchemaSelectPaginatedType> {
        const data = await this.paginate({
            query,
            where: eq(companies_modality.group_id, group_id)
        })

        return CompanyModalitySchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<CompanyModalitySchemaSelectType | null> {
        const data = await this.selector({
            where: eq(companies_modality.code, code)
        })

        if (data.length === 0) {
            return null
        }

        return CompanyModalitySchemaSelect.parse(data.at(0))
    }

    public async create (params: CompanyModalitySchemaCreateType): Promise<string> {
        const code = await this.insert<CompanyModalitySchemaCreateType>({
            params
        })

        return code
    }

    public async update (code: string, params: CompanyModalitySchemaUpdateType): Promise<string> {
        const data = await this.set<CompanyModalitySchemaUpdateType>({
            params,
            where: eq(companies_modality.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await this.softDelete(eq(companies_modality.code, code))
    }
}

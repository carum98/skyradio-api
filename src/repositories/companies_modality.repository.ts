import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq, and, isNull } from 'drizzle-orm'
import { ICompanyModalityRepository } from './repositories'
import { CompanyModalitySchemaCreateType, CompanyModalitySchemaSelect, CompanyModalitySchemaSelectPaginated, CompanyModalitySchemaSelectPaginatedType, CompanyModalitySchemaSelectType, CompanyModalitySchemaUpdateType, companies_modality } from '@models/companies_modality.model'
import { generateCode } from '@utils/code'
import { PaginationSchemaType } from '@/utils/pagination'
import { RepositoryCore } from '@/core/repository.core'

export class CompaniesModalityRepository extends RepositoryCore<CompanyModalitySchemaSelectType> implements ICompanyModalityRepository {
    constructor (public readonly db: MySql2Database) {
        super({
            db,
            table: companies_modality,
            deletedColumn: companies_modality.deleted_at
        })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<CompanyModalitySchemaSelectPaginatedType> {
        const data = await this.paginate(eq(companies_modality.group_id, group_id), query)

        return CompanyModalitySchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<CompanyModalitySchemaSelectType | null> {
        const data = await this.selector(eq(companies_modality.code, code))

        return data.length > 0
            ? CompanyModalitySchemaSelect.parse(data.at(0))
            : null
    }

    public async create (params: CompanyModalitySchemaCreateType): Promise<string> {
        const code = generateCode()

        await this.db.insert(companies_modality).values({
            ...params,
            code
        })

        return code
    }

    public async update (code: string, params: CompanyModalitySchemaUpdateType): Promise<string> {
        const data = await this.db.update(companies_modality)
            .set(params)
            .where(
                and(
                    eq(companies_modality.code, code),
                    isNull(companies_modality.deleted_at)
                )
            )

        return data[0].affectedRows > 0 ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        const where = eq(companies_modality.code, code)

        return await this.softDelete(where)
    }
}

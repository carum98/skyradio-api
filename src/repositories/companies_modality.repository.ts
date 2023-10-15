import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq } from 'drizzle-orm'
import { ICompanyModalityRepository } from './repositories'
import { CompanyModalitySchemaCreateType, CompanyModalitySchemaSelect, CompanyModalitySchemaSelectType, CompanyModalitySchemaUpdateType, companies_modality } from '@models/companies_modality.model'
import { generateCode } from '@utils/code'

export class CompaniesModalityRepository implements ICompanyModalityRepository {
    constructor (public readonly db: MySql2Database) {}

    public async getAll (group_id: number): Promise<CompanyModalitySchemaSelectType[]> {
        const data = await this.db.select().from(companies_modality)
            .where(eq(companies_modality.group_id, group_id))

        return CompanyModalitySchemaSelect.array().parse(data)
    }

    public async get (code: string): Promise<CompanyModalitySchemaSelectType | null> {
        const data = await this.db.select().from(companies_modality)
            .where(eq(companies_modality.code, code))

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
        const data = await this.db.update(companies_modality).set(params)
            .where(eq(companies_modality.code, code))

        return data[0].affectedRows > 0 ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        const data = await this.db.delete(companies_modality)
            .where(eq(companies_modality.code, code))

        return data[0].affectedRows > 0
    }
}

import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq } from 'drizzle-orm'
import { ICompanyRepository } from './repositories'
import { CompanySchemaCreateType, CompanySchemaSelect, CompanySchemaSelectType, CompanySchemaUpdateType, companies } from '@models/companies.model'

export class CompaniesRepository implements ICompanyRepository {
    constructor (public readonly db: MySql2Database) {}

    public async getAll (group_id: number): Promise<CompanySchemaSelectType[]> {
        const data = await this.db.select().from(companies).where(eq(companies.group_id, group_id))

        return CompanySchemaSelect.array().parse(data)
    }

    public async get (id: number): Promise<CompanySchemaSelectType | null> {
        const data = await this.db.select().from(companies).where(eq(companies.id, id))

        return data.length > 0
            ? CompanySchemaSelect.parse(data.at(0))
            : null
    }

    public async create (params: CompanySchemaCreateType): Promise<CompanySchemaSelectType> {
        const data = await this.db.insert(companies).values(params)

        const company = await this.get(data[0].insertId)

        return company as CompanySchemaSelectType
    }

    public async update (params: CompanySchemaUpdateType): Promise<CompanySchemaSelectType> {
        const data = await this.db.update(companies).set({ name: params.name }).where(eq(companies.id, params.id))

        const company = await this.get(data[0].insertId)

        return company as CompanySchemaSelectType
    }

    public async delete (id: string): Promise<boolean> {
        const data = await this.db.delete(companies).where(eq(companies.id, parseInt(id)))

        return data[0].affectedRows > 0
    }
}

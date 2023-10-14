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

    public async create (params: CompanySchemaCreateType): Promise<number> {
        const data = await this.db.insert(companies).values(params)

        return data[0].insertId
    }

    public async update (id: number, params: CompanySchemaUpdateType): Promise<number> {
        const data = await this.db.update(companies).set({ name: params.name }).where(eq(companies.id, id))

        return data[0].affectedRows > 0 ? id : 0
    }

    public async delete (id: number): Promise<boolean> {
        const data = await this.db.delete(companies).where(eq(companies.id, id))

        return data[0].affectedRows > 0
    }
}

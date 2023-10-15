import { MySql2Database } from 'drizzle-orm/mysql2'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { ICompanyRepository } from './repositories'
import { CompanySchemaCreateType, CompanySchemaSelect, CompanySchemaSelectType, CompanySchemaUpdateType, companies } from '@models/companies.model'
import { generateCode } from '@utils/code'
import { companies_modality } from '@/models/companies_modality.model'
import { companies_seller } from '@/models/companies_seller.model'

export class CompaniesRepository implements ICompanyRepository {
    constructor (public readonly db: MySql2Database) {}

    public async getAll (group_id: number): Promise<CompanySchemaSelectType[]> {
        const data = await this.db.select().from(companies)
            .leftJoin(companies_modality, eq(companies_modality.id, companies.modality_id))
            .leftJoin(companies_seller, eq(companies_seller.id, companies.seller_id))
            .where(
                and(
                    eq(companies.group_id, group_id),
                    isNull(companies.deleted_at)
                )
            )

        const values = data.map((item) => ({
            ...item.companies,
            seller: item.companies_seller,
            modality: item.companies_modality
        }))

        return CompanySchemaSelect.array().parse(values)
    }

    public async get (code: string): Promise<CompanySchemaSelectType | null> {
        const data = await this.db.select().from(companies)
            .leftJoin(companies_modality, eq(companies_modality.id, companies.modality_id))
            .leftJoin(companies_seller, eq(companies_seller.id, companies.seller_id))
            .where(
                and(
                    eq(companies.code, code),
                    isNull(companies.deleted_at)
                )
            )

        const values = data.map((item) => ({
            ...item.companies,
            seller: item.companies_seller,
            modality: item.companies_modality
        }))

        return values.length > 0
            ? CompanySchemaSelect.parse(values[0])
            : null
    }

    public async create (params: CompanySchemaCreateType): Promise<string> {
        const code = generateCode()

        await this.db.insert(companies).values({
            ...params,
            code
        })

        return code
    }

    public async update (code: string, params: CompanySchemaUpdateType): Promise<string> {
        const data = await this.db.update(companies).set(params)
            .where(
                and(
                    eq(companies.code, code),
                    isNull(companies.deleted_at)
                )
            )

        return data[0].affectedRows > 0 ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        const data = await this.db.update(companies)
            .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
            .where(eq(companies.code, code))

        return data[0].affectedRows > 0
    }
}

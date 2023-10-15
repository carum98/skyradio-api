import { MySql2Database } from 'drizzle-orm/mysql2'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { ICompanySellerRepository } from './repositories'
import { CompanySellerSchemaCreateType, CompanySellerSchemaSelect, CompanySellerSchemaSelectType, CompanySellerSchemaUpdateType, companies_seller } from '@models/companies_seller.model'
import { generateCode } from '@/utils/code'

export class CompaniesSellerRepository implements ICompanySellerRepository {
    constructor (public readonly db: MySql2Database) {}

    public async getAll (group_id: number): Promise<CompanySellerSchemaSelectType[]> {
        const data = await this.db.select().from(companies_seller)
            .where(
                and(
                    eq(companies_seller.group_id, group_id),
                    isNull(companies_seller.deleted_at)
                )
            )

        return CompanySellerSchemaSelect.array().parse(data)
    }

    public async get (code: string): Promise<CompanySellerSchemaSelectType | null> {
        const data = await this.db.select().from(companies_seller)
            .where(
                and(
                    eq(companies_seller.code, code),
                    isNull(companies_seller.deleted_at)
                )
            )

        return data.length > 0
            ? CompanySellerSchemaSelect.parse(data.at(0))
            : null
    }

    public async create (params: CompanySellerSchemaCreateType): Promise<string> {
        const code = generateCode()

        await this.db.insert(companies_seller).values({
            ...params,
            code
        })

        return code
    }

    public async update (code: string, params: CompanySellerSchemaUpdateType): Promise<string> {
        const data = await this.db.update(companies_seller).set(params)
            .where(
                and(
                    eq(companies_seller.code, code),
                    isNull(companies_seller.deleted_at)
                )
            )

        return data[0].affectedRows > 0 ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        const data = await this.db.update(companies_seller)
            .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
            .where(eq(companies_seller.code, code))

        return data[0].affectedRows > 0
    }
}

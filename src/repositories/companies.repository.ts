import { MySql2Database } from 'drizzle-orm/mysql2'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { ICompanyRepository } from './repositories'
import { CompanySchemaCreateType, CompanySchemaSelect, CompanySchemaSelectPaginated, CompanySchemaSelectPaginatedType, CompanySchemaSelectType, CompanySchemaUpdateType, companies } from '@models/companies.model'
import { generateCode } from '@utils/code'
import { companies_modality } from '@/models/companies_modality.model'
import { companies_seller } from '@/models/companies_seller.model'
import { SQL } from 'drizzle-orm/sql'
import { NotFoundError } from '@/utils/errors'
import { radios } from '@/models/radios.model'
import { PaginationSchemaType } from '@/utils/pagination'

export class CompaniesRepository implements ICompanyRepository {
    constructor (public readonly db: MySql2Database) {}

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<CompanySchemaSelectPaginatedType> {
        const data = await this.paginate(eq(companies.group_id, group_id), query)

        return CompanySchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<CompanySchemaSelectType | null> {
        const data = await this.selector(eq(companies.code, code))

        return data.length > 0
            ? CompanySchemaSelect.parse(data[0])
            : null
    }

    public async create (params: CompanySchemaCreateType): Promise<string> {
        const code = generateCode()

        await this.db.transaction(async (trx) => {
            const { modality_id, seller_id } = await this.findIdsByCodes(
                trx,
                params.modality_code,
                params.seller_code
            )

            await trx.insert(companies).values({
                ...params,
                code,
                seller_id,
                modality_id: modality_id ?? 0
            })
        })

        return code
    }

    public async update (code: string, params: CompanySchemaUpdateType): Promise<string> {
        const data = await this.db.transaction(async (trx) => {
            const { modality_id, seller_id } = await this.findIdsByCodes(
                trx,
                params.modality_code,
                params.seller_code
            )

            return await trx.update(companies).set({
                name: params.name,
                seller_id,
                modality_id
            })
            .where(
                and(
                    eq(companies.code, code),
                    isNull(companies.deleted_at)
                )
            )
        })

        return data[0].affectedRows > 0 ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        const data = await this.db.update(companies)
            .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
            .where(eq(companies.code, code))

        return data[0].affectedRows > 0
    }

    private async selector (
        where?: SQL,
        limit?: number,
        offset?: number
    ): Promise<CompanySchemaSelectType[]> {
        let query = this.db.select({
            companies: {
                code: companies.code,
                name: companies.name
            },
            companies_seller: {
                code: companies_seller.code,
                name: companies_seller.name
            },
            companies_modality: {
                code: companies_modality.code,
                name: companies_modality.name
            },
            radios_count: sql<number>`(select count(${radios.id}) from ${radios} where ${radios.company_id} = ${companies.id})`
        })
        .from(companies)
        .leftJoin(companies_modality, eq(companies_modality.id, companies.modality_id))
        .leftJoin(companies_seller, eq(companies_seller.id, companies.seller_id))

        if (where !== undefined) {
            query = query.where(
                and(
                    where,
                    isNull(companies.deleted_at)
                )
            )
        }

        if (limit !== undefined) {
            query = query.limit(limit)
        }

        if (offset !== undefined) {
            query = query.offset(offset)
        }

        const data = await query

        return data.map((item) => ({
            ...item.companies,
            seller: item.companies_seller,
            modality: item.companies_modality,
            radios_count: item.radios_count
        })) as CompanySchemaSelectType[]
    }

    private async findIdsByCodes (
        trx: MySql2Database,
        modality_code?: string,
        seller_code?: string
    ): Promise<{ modality_id?: number, seller_id?: number }> {
        const modality = modality_code === undefined
            ? null
            : await trx.select({ id: companies_modality.id }).from(companies_modality).where(eq(companies_modality.code, modality_code))

        if (modality_code !== undefined && modality?.length === 0) {
            throw new NotFoundError(`Modality code ${modality_code} not found`)
        }

        const seller = seller_code === undefined
            ? null
            : await trx.select({ id: companies_seller.id }).from(companies_seller).where(eq(companies_seller.code, seller_code))

        if (seller_code !== undefined && seller?.length === 0) {
            throw new NotFoundError(`Seller code ${seller_code} not found`)
        }

        const modality_id = modality?.at(0)?.id ?? undefined
        const seller_id = seller?.at(0)?.id ?? undefined

        return {
            modality_id,
            seller_id
        }
    }

    private async paginate (where: SQL, query: PaginationSchemaType): Promise<CompanySchemaSelectPaginatedType> {
        const data_count = await this.db.select({ count: sql<number>`count(${companies.id})` }).from(companies).where(and(
            where,
            isNull(companies.deleted_at)
        ))

        const offset = (query.page - 1) * query.per_page

        const data = await this.selector(where, query.per_page, offset)

        return CompanySchemaSelectPaginated.parse({
            data,
            pagination: {
                total: data_count[0].count,
                page: query.page,
                per_page: query.per_page,
                total_pages: Math.ceil(data_count[0].count / query.per_page)
            }
        })
    }
}

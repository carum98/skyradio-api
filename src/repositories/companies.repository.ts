import { MySql2Database } from 'drizzle-orm/mysql2'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { ICompanyRepository } from './repositories'
import { CompanySchemaCreateType, CompanySchemaSelect, CompanySchemaSelectPaginated, CompanySchemaSelectPaginatedType, CompanySchemaSelectType, CompanySchemaUpdateType, companies } from '@models/companies.model'
import { generateCode } from '@utils/code'
import { companies_modality } from '@/models/companies_modality.model'
import { companies_seller } from '@/models/companies_seller.model'
import { NotFoundError } from '@/utils/errors'
import { radios } from '@/models/radios.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { RepositoryCore } from '@/core/repository.core'

export class CompaniesRepository extends RepositoryCore<CompanySchemaSelectType, CompanySchemaCreateType, CompanySchemaUpdateType> implements ICompanyRepository {
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

        super({ db, table, select })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<CompanySchemaSelectPaginatedType> {
        const data = await super.getAllCore({
            query,
            where: eq(companies.group_id, group_id)
        })

        return CompanySchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<CompanySchemaSelectType> {
        const data = await super.getOneCore({
            where: eq(companies.code, code)
        })

        return CompanySchemaSelect.parse(data)
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
        return await super.deleteCore(eq(companies.code, code))
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
}

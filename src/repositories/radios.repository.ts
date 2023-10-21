import { MySql2Database } from 'drizzle-orm/mysql2'
import { IRadioRepository } from './repositories'
import { RadiosSchemaCreateType, RadiosSchemaSelect, RadiosSchemaSelectPaginated, RadiosSchemaSelectPaginatedType, RadiosSchemaSelectType, RadiosSchemaUpdateType, radios } from '@models/radios.model'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { radios_model } from '@models/radios_model.model'
import { radios_status } from '@models/radios_status.model'
import { sims } from '@models/sims.model'
import { generateCode } from '@utils/code'
import { sims_provider } from '@models/sims_provider.model'
import { NotFoundError } from '@/utils/errors'
import { companies } from '@/models/companies.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { RepositoryCore } from '@/core/repository.core'

export class RadiosRepository extends RepositoryCore<RadiosSchemaSelectType, RadiosSchemaCreateType, RadiosSchemaUpdateType> implements IRadioRepository {
    constructor (public readonly db: MySql2Database) {
        const table = radios

        const select = db.select({
            code: radios.code,
            name: radios.name,
            imei: radios.imei,
            serial: radios.serial,
            model: {
                code: radios_model.code,
                name: radios_model.name
            },
            status: {
                code: radios_status.code,
                name: radios_status.name
            },
            sim: {
                code: sims.code,
                number: sims.number
            },
            sim__provider: {
                code: sims_provider.code,
                name: sims_provider.name
            },
            company: {
                code: companies.code,
                name: companies.name
            }
        })
        .from(table)
        .leftJoin(radios_model, eq(radios.model_id, radios_model.id))
        .leftJoin(radios_status, eq(radios.status_id, radios_status.id))
        .leftJoin(sims, eq(radios.sim_id, sims.id))
        .leftJoin(sims_provider, eq(sims.provider_id, sims_provider.id))
        .leftJoin(companies, eq(radios.company_id, companies.id))

        super({ db, table, select })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<RadiosSchemaSelectPaginatedType> {
        const data = await this.paginate({
            query,
            where: eq(radios.group_id, group_id)
        })

        return RadiosSchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<RadiosSchemaSelectType> {
        const data = await this.getOne({
            where: eq(radios.code, code)
        })

        return RadiosSchemaSelect.parse(data)
    }

    public async getByCompany (company_code: string, query: PaginationSchemaType): Promise<RadiosSchemaSelectPaginatedType> {
        const company_id = await this.db.select({ id: companies.id })
            .from(companies)
            .where(eq(companies.code, company_code))

        const data = await this.paginate({
            query,
            where: eq(radios.company_id, company_id[0].id)
        })

        return RadiosSchemaSelectPaginated.parse(data)
    }

    public async create (params: RadiosSchemaCreateType): Promise<string> {
        const code = generateCode()

        await this.db.transaction(async (trx) => {
            const { model_id, status_id, sim_id, company_id } = await this.findIdsByCodes(
                trx,
                params.model_code,
                params.status_code,
                params.sim_code,
                params.company_code
            )

            await trx.insert(radios).values({
                ...params,
                code,
                model_id: model_id ?? 0,
                status_id,
                sim_id,
                company_id
            })
        })

        return code
    }

    public async update (code: string, params: RadiosSchemaUpdateType): Promise<string> {
        const data = await this.db.transaction(async (trx) => {
            const { model_id, status_id, sim_id, company_id } = await this.findIdsByCodes(
                trx,
                params.model_code,
                params.status_code,
                params.sim_code,
                params.company_code
            )

            return await trx.update(radios).set({
                name: params.name,
                model_id,
                status_id,
                sim_id,
                company_id
            })
                .where(
                    and(
                        eq(radios.code, code),
                        isNull(radios.deleted_at)
                    )
                )
        })

        return data[0].affectedRows > 0 ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        const data = await this.db.update(radios)
            .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
            .where(
                and(
                    eq(radios.code, code),
                    isNull(radios.deleted_at)
                )
            )

        return data[0].affectedRows > 0
    }

    private async findIdsByCodes (
        trx: MySql2Database,
        model_code?: string,
        status_code?: string,
        sim_code?: string,
        company_code?: string
    ): Promise<{ model_id?: number, status_id?: number, sim_id?: number, company_id?: number }> {
        const model = model_code === undefined
            ? null
            : await trx.select({ id: radios_model.id }).from(radios_model).where(eq(radios_model.code, model_code))

        if (model_code !== undefined && model?.length === 0) {
            throw new NotFoundError(`Modality code ${model_code} not found`)
        }

        const status = status_code === undefined
            ? null
            : await trx.select({ id: radios_status.id }).from(radios_status).where(eq(radios_status.code, status_code))

        if (status_code !== undefined && status?.length === 0) {
            throw new NotFoundError(`Seller code ${status_code} not found`)
        }

        const sim = sim_code === undefined
            ? null
            : await trx.select({ id: sims.id }).from(sims).where(eq(sims.code, sim_code))

        if (sim_code !== undefined && sim?.length === 0) {
            throw new NotFoundError(`Seller code ${sim_code} not found`)
        }

        const company = company_code === undefined
            ? null
            : await trx.select({ id: companies.id }).from(companies).where(eq(companies.code, company_code))

        if (company_code !== undefined && company?.length === 0) {
            throw new NotFoundError(`Company code ${company_code} not found`)
        }

        const model_id = model?.at(0)?.id ?? undefined
        const status_id = status?.at(0)?.id ?? undefined
        const sim_id = sim?.at(0)?.id ?? undefined
        const company_id = company?.at(0)?.id ?? undefined

        return {
            model_id,
            status_id,
            sim_id,
            company_id
        }
    }
}

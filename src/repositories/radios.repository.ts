import { MySql2Database } from 'drizzle-orm/mysql2'
import { RadiosSchemaCreateRawType, RadiosSchemaSelectPaginatedType, RadiosSchemaSelectType, RadiosSchemaUpdateRawType, radios } from '@models/radios.model'
import { eq } from 'drizzle-orm'
import { radios_model } from '@models/radios_model.model'
import { radios_status } from '@models/radios_status.model'
import { sims } from '@models/sims.model'
import { sims_provider } from '@models/sims_provider.model'
import { companies } from '@/models/companies.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { RepositoryCore } from '@/core/repository.core'

export class RadiosRepository extends RepositoryCore<RadiosSchemaSelectType, RadiosSchemaCreateRawType, RadiosSchemaUpdateRawType> {
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
        return await super.getAllCore({
            query,
            where: eq(radios.group_id, group_id)
        })
    }

    public async get (code: string): Promise<RadiosSchemaSelectType> {
        return await super.getOneCore({
            where: eq(radios.code, code)
        })
    }

    public async getByCompany (company_code: string, query: PaginationSchemaType): Promise<RadiosSchemaSelectPaginatedType> {
        const company_id = await this.db.select({ id: companies.id })
            .from(companies)
            .where(eq(companies.code, company_code))

        return await super.getAllCore({
            query,
            where: eq(radios.company_id, company_id[0].id)
        })
    }

    public async create (params: RadiosSchemaCreateRawType): Promise<string> {
        return await super.insertCore({
            params
        })
    }

    public async update (code: string, params: RadiosSchemaUpdateRawType): Promise<string> {
        const isUpdated = await super.updateCore({
            params,
            where: eq(radios.code, code)
        })

        return isUpdated ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await super.deleteCore(eq(radios.code, code))
    }
}

import { MySql2Database } from 'drizzle-orm/mysql2'
import { RadiosSchemaCreateRawType, RadiosSchemaSelectPaginatedType, RadiosSchemaSelectType, RadiosSchemaUpdateRawType, radios } from '@models/radios.model'
import { and, eq, inArray, isNull } from 'drizzle-orm'
import { radios_model } from '@models/radios_model.model'
import { radios_status } from '@models/radios_status.model'
import { sims } from '@models/sims.model'
import { sims_provider } from '@models/sims_provider.model'
import { clients } from '@/models/clients.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { IRepository, RepositoryCore } from '@/core/repository.core'

export class RadiosRepository extends RepositoryCore<RadiosSchemaSelectType, RadiosSchemaCreateRawType, RadiosSchemaUpdateRawType> implements IRepository {
    constructor (public readonly db: MySql2Database) {
        const table = radios

        const select = db.select({
            code: radios.code,
            name: radios.name,
            imei: radios.imei,
            serial: radios.serial,
            model: {
                code: radios_model.code,
                name: radios_model.name,
                color: radios_model.color
            },
            status: {
                code: radios_status.code,
                name: radios_status.name,
                color: radios_status.color
            },
            sim: {
                code: sims.code,
                number: sims.number
            },
            sim__provider: {
                code: sims_provider.code,
                name: sims_provider.name,
                color: sims_provider.color
            },
            client: {
                code: clients.code,
                name: clients.name,
                color: clients.color
            }
        })
        .from(table)
        .leftJoin(radios_model, eq(radios.model_id, radios_model.id))
        .leftJoin(radios_status, eq(radios.status_id, radios_status.id))
        .leftJoin(sims, eq(radios.sim_id, sims.id))
        .leftJoin(sims_provider, eq(sims.provider_id, sims_provider.id))
        .leftJoin(clients, eq(radios.client_id, clients.id))

        super({ db, table, select, search_columns: [radios.name, radios.imei, radios.serial] })
    }

    public async getAll (params: { group_id?: number, client_id?: number }, query: PaginationSchemaType): Promise<RadiosSchemaSelectPaginatedType> {
        const { group_id, client_id } = params
        const where = []

        if (group_id !== undefined) {
            where.push(eq(radios.group_id, group_id))
        }

        if (client_id !== undefined) {
            where.push(eq(radios.client_id, client_id))
        }

        return await super.getAllCore({
            query,
            where: and(...where)
        })
    }

    public async get (code: string): Promise<RadiosSchemaSelectType> {
        return await super.getOneCore({
            where: eq(radios.code, code)
        })
    }

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(radios.code, code)
        })
    }

    public async getIds (codes: string[]): Promise<number[]> {
        return await super.getIdsCore({
            where: inArray(radios.code, codes)
        })
    }

    public async create (params: RadiosSchemaCreateRawType): Promise<string> {
        return await super.insertCore({
            params
        })
    }

    public async createMany (params: RadiosSchemaCreateRawType[]): Promise<string[]> {
        return await super.insertManyCore({
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

    public async addClient (client_id: number, radios_codes: string[]): Promise<boolean> {
        const data = await this.db.update(radios)
            .set({ client_id })
            .where(inArray(radios.code, radios_codes))

        return data[0].affectedRows > 0
    }

    public async addSim (sim_id: number, radio_code: string): Promise<boolean> {
        const data = await this.db.update(radios)
            .set({ sim_id })
            .where(eq(radios.code, radio_code))

        return data[0].affectedRows > 0
    }

    public async swapClient (client_id: number, radio_code_from: string, radio_code_to: string): Promise<boolean> {
        const response = await Promise.all([
            this.db.update(radios)
                .set({ client_id: null })
                .where(eq(radios.code, radio_code_from)),
            this.db.update(radios)
                .set({ client_id })
                .where(eq(radios.code, radio_code_to))
        ])

        return response[0][0].affectedRows > 0 && response[1][0].affectedRows > 0
    }

    public async removeClient (client_id: number, radios_codes: string[]): Promise<boolean> {
        const data = await this.db.update(radios)
            .set({ client_id: null })
            .where(
                and(
                    inArray(radios.code, radios_codes),
                    eq(radios.client_id, client_id)
                )
            )

        return data[0].affectedRows > 0
    }

    public async removeSim (radio_code: string): Promise<boolean> {
        const data = await this.db.update(radios)
            .set({ sim_id: null })
            .where(eq(radios.code, radio_code))

        return data[0].affectedRows > 0
    }

    public async swapSim (radio_code: string, sim_id: number): Promise<boolean> {
        const data = await this.db.update(radios)
            .set({ sim_id })
            .where(eq(radios.code, radio_code))

        return data[0].affectedRows > 0
    }

    public async getAllBy (group_id: number, params: { client_code?: string, model_code?: string, available?: boolean }): Promise<RadiosSchemaSelectPaginatedType> {
        const { client_code } = params

        const where = [
            eq(radios.group_id, group_id)
        ]

        if (client_code !== undefined) {
            where.push(eq(clients.code, client_code))
        }

        if (params.model_code !== undefined) {
            where.push(eq(radios_model.code, params.model_code))
        }

        if (params.available === true) {
            where.push(isNull(radios.client_id))
            where.push(isNull(radios.deleted_at))
        }

        return await super.getAllCore({
            query: { page: 1, per_page: 1000, sort_by: 'created_at', sort_order: 'desc' },
            where: and(...where)
        })
    }
}

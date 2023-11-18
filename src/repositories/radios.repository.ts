import { MySql2Database } from 'drizzle-orm/mysql2'
import { RadiosSchemaCreateRawType, RadiosSchemaSelectPaginatedType, RadiosSchemaSelectType, RadiosSchemaUpdateRawType, radios } from '@models/radios.model'
import { and, eq, inArray } from 'drizzle-orm'
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
            client: {
                code: clients.code,
                name: clients.name
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

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(radios.code, code)
        })
    }

    public async getByClient (client_code: string, query: PaginationSchemaType): Promise<RadiosSchemaSelectPaginatedType> {
        const client_id = await this.db.select({ id: clients.id })
            .from(clients)
            .where(eq(clients.code, client_code))

        return await super.getAllCore({
            query,
            where: eq(radios.client_id, client_id[0].id)
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
}

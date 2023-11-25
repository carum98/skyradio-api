import { SimsSchemaCreateRawType, SimsSchemaSelectPaginatedType, SimsSchemaUpdateRawType, SimsShemaSelectType, sims } from '@/models/sims.model'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq } from 'drizzle-orm'
import { sims_provider } from '@models/sims_provider.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { IRepository, RepositoryCore } from '@/core/repository.core'
import { radios } from '@models/radios.model'
import { clients } from '@models/clients.model'

export class SimsRepository extends RepositoryCore<SimsShemaSelectType, SimsSchemaCreateRawType, SimsSchemaUpdateRawType> implements IRepository {
    constructor (public readonly db: MySql2Database) {
        const table = sims

        const select = db.select({
            code: sims.code,
            number: sims.number,
            serial: sims.serial,
            provider: {
                code: sims_provider.code,
                name: sims_provider.name,
                color: sims_provider.color
            },
            radio: {
                code: radios.code,
                name: radios.name,
                imei: radios.imei
            },
            radio__client: {
                code: clients.code,
                name: clients.name,
                color: clients.color
            }
        })
        .from(table)
        .leftJoin(sims_provider, eq(sims.provider_id, sims_provider.id))
        .leftJoin(radios, eq(radios.sim_id, sims.id))
        .leftJoin(clients, eq(radios.client_id, clients.id))

        super({ db, table, select, search_columns: [sims.number] })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<SimsSchemaSelectPaginatedType> {
        return await super.getAllCore({
            query,
            where: eq(sims.group_id, group_id)
        })
    }

    public async get (code: string): Promise<SimsShemaSelectType> {
        return await super.getOneCore({
            where: eq(sims.code, code)
        })
    }

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(sims.code, code)
        })
    }

    public async create (params: SimsSchemaCreateRawType): Promise<string> {
        return await super.insertCore({
            params
        })
    }

    public async update (code: string, params: SimsSchemaUpdateRawType): Promise<string> {
        const data = await super.updateCore({
            params,
            where: eq(sims.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await super.deleteCore(eq(sims.code, code))
    }
}

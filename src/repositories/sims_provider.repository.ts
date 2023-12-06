import { MySql2Database } from 'drizzle-orm/mysql2'
import { SimsProviderSchemaCounterType, SimsProviderShemaCreateType, SimsProviderShemaSelectPaginatedType, SimsProviderShemaSelectType, SimsProviderShemaUpdateType, sims_provider } from '@models/sims_provider.model'
import { count, eq, sql } from 'drizzle-orm'
import { PaginationSchemaType } from '@/utils/pagination'
import { IRepository, RepositoryCore } from '@/core/repository.core'
import { radios } from '@models/radios.model'
import { sims } from '@models/sims.model'

export class SimsProviderRepository extends RepositoryCore<SimsProviderShemaSelectType, SimsProviderShemaCreateType, SimsProviderShemaUpdateType> implements IRepository {
    constructor (public readonly db: MySql2Database) {
        const table = sims_provider

        const select = db.select({
            code: sims_provider.code,
            name: sims_provider.name,
            color: sims_provider.color
        })
        .from(table)

        super({ db, table, select, search_columns: [sims_provider.name] })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<SimsProviderShemaSelectPaginatedType> {
        return await super.getAllCore({
            query,
            where: eq(sims_provider.group_id, group_id)
        })
    }

    public async get (code: string): Promise<SimsProviderShemaSelectType> {
        return await super.getOneCore({
            where: eq(sims_provider.code, code)
        })
    }

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(sims_provider.code, code)
        })
    }

    public async create (params: SimsProviderShemaCreateType): Promise<string> {
        return await super.insertCore({
            params
        })
    }

    public async update (code: string, params: SimsProviderShemaUpdateType): Promise<string> {
        const data = await super.updateCore({
            params,
            where: eq(sims_provider.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await super.deleteCore(eq(sims_provider.code, code))
    }

    public async countByClient (client_id: number): Promise<SimsProviderSchemaCounterType[]> {
        return await this.db.select({
            code: sims_provider.code,
            name: sims_provider.name,
            color: sims_provider.color,
            count: count(sims_provider.code)
        })
        .from(radios)
        .rightJoin(sims, eq(radios.sim_id, sims.id))
        .rightJoin(sims_provider, eq(sims.provider_id, sims_provider.id))
        .where(eq(radios.client_id, client_id))
        .groupBy(sql`${sims_provider.code}, ${sims_provider.name}, ${sims_provider.color}`)
    }
}

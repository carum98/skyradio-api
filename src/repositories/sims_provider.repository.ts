import { MySql2Database } from 'drizzle-orm/mysql2'
import { ISimsProviderRepository } from './repositories'
import { SimsProviderShemaCreateType, SimsProviderShemaSelect, SimsProviderShemaSelectPaginated, SimsProviderShemaSelectPaginatedType, SimsProviderShemaSelectType, SimsProviderShemaUpdateType, sims_provider } from '@/models/sims_provider.model'
import { eq } from 'drizzle-orm'
import { PaginationSchemaType } from '@/utils/pagination'
import { RepositoryCore } from '@/core/repository.core'

export class SimsProviderRepository extends RepositoryCore<SimsProviderShemaSelectType, SimsProviderShemaCreateType, SimsProviderShemaUpdateType> implements ISimsProviderRepository {
    constructor (public readonly db: MySql2Database) {
        const table = sims_provider

        const select = db.select({
            code: sims_provider.code,
            name: sims_provider.name
        })
        .from(table)

        super({ db, table, select })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<SimsProviderShemaSelectPaginatedType> {
        const data = await super.getAllCore({
            query,
            where: eq(sims_provider.group_id, group_id)
        })

        return SimsProviderShemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<SimsProviderShemaSelectType> {
        const data = await super.getOneCore({
            where: eq(sims_provider.code, code)
        })

        return SimsProviderShemaSelect.parse(data)
    }

    public async create (params: SimsProviderShemaCreateType): Promise<string> {
        const code = await super.insertCore({
            params
        })

        return code
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
}

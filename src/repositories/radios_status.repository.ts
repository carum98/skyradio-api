import { MySql2Database } from 'drizzle-orm/mysql2'
import { RadiosStatusShemaCreateType, RadiosStatusShemaSelectPaginatedType, RadiosStatusShemaSelectType, RadiosStatusShemaUpdateType, radios_status } from '@models/radios_status.model'
import { eq } from 'drizzle-orm'
import { PaginationSchemaType } from '@/utils/pagination'
import { IRepository, RepositoryCore } from '@/core/repository.core'

export class RadiosStatusRepository extends RepositoryCore<RadiosStatusShemaSelectType, RadiosStatusShemaCreateType, RadiosStatusShemaUpdateType> implements IRepository {
    constructor (public readonly db: MySql2Database) {
        const table = radios_status

        const select = db.select({
            code: radios_status.code,
            name: radios_status.name,
            color: radios_status.color
        })
        .from(table)

        super({ db, table, select, search_columns: [radios_status.name] })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<RadiosStatusShemaSelectPaginatedType> {
        return await super.getAllCore({
            query,
            where: eq(radios_status.group_id, group_id)
        })
    }

    public async get (code: string): Promise<RadiosStatusShemaSelectType> {
        return await super.getOneCore({
            where: eq(radios_status.code, code)
        })
    }

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(radios_status.code, code)
        })
    }

    public async create (params: RadiosStatusShemaCreateType): Promise<string> {
        return await super.insertCore({
            params
        })
    }

    public async update (code: string, params: RadiosStatusShemaUpdateType): Promise<string> {
        const data = await super.updateCore({
            params,
            where: eq(radios_status.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await super.deleteCore(eq(radios_status.code, code))
    }
}

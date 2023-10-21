import { RepositoryCore } from '@/core/repository.core'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosModelShemaCreateType, RadiosModelShemaSelectPaginatedType, RadiosModelShemaSelectType, RadiosModelShemaUpdateType, radios_model } from '@models/radios_model.model'
import { eq } from 'drizzle-orm'
import { MySql2Database } from 'drizzle-orm/mysql2'

export class RadiosModelRepository extends RepositoryCore<RadiosModelShemaSelectType, RadiosModelShemaCreateType, RadiosModelShemaUpdateType> {
    constructor (public readonly db: MySql2Database) {
        const table = radios_model

        const select = db.select({
            code: radios_model.code,
            name: radios_model.name
        })
        .from(table)

        super({ db, table, select, search_columns: [radios_model.name] })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<RadiosModelShemaSelectPaginatedType> {
        return await super.getAllCore({
            query,
            where: eq(radios_model.group_id, group_id)
        })
    }

    public async get (code: string): Promise<RadiosModelShemaSelectType> {
        return await super.getOneCore({
            where: eq(radios_model.code, code)
        })
    }

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(radios_model.code, code)
        })
    }

    public async create (params: RadiosModelShemaCreateType): Promise<string> {
        return await super.insertCore({
            params
        })
    }

    public async update (code: string, params: RadiosModelShemaUpdateType): Promise<string> {
        const data = await super.updateCore({
            params,
            where: eq(radios_model.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await super.deleteCore(eq(radios_model.code, code))
    }
}

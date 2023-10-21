import { RepositoryCore } from '@/core/repository.core'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosModelShemaCreateType, RadiosModelShemaSelect, RadiosModelShemaSelectPaginated, RadiosModelShemaSelectPaginatedType, RadiosModelShemaSelectType, RadiosModelShemaUpdateType, radios_model } from '@models/radios_model.model'
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

        super({ db, table, select })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<RadiosModelShemaSelectPaginatedType> {
        const data = await this.paginate({
            query,
            where: eq(radios_model.group_id, group_id)
        })

        return RadiosModelShemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<RadiosModelShemaSelectType | null> {
        const data = await this.selector({
            where: eq(radios_model.code, code)
        })

        if (data.length === 0) {
            return null
        }

        return RadiosModelShemaSelect.parse(data.at(0))
    }

    public async create (params: RadiosModelShemaCreateType): Promise<string> {
        const code = await this.insert({
            params
        })

        return code
    }

    public async update (code: string, params: RadiosModelShemaUpdateType): Promise<string> {
        const data = await this.set({
            params,
            where: eq(radios_model.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await this.softDelete(eq(radios_model.code, code))
    }
}

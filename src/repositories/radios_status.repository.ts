import { MySql2Database } from 'drizzle-orm/mysql2'
import { IRadiosStatusRepository } from './repositories'
import { RadiosStatusShemaCreateType, RadiosStatusShemaSelect, RadiosStatusShemaSelectPaginated, RadiosStatusShemaSelectPaginatedType, RadiosStatusShemaSelectType, RadiosStatusShemaUpdateType, radios_status } from '@models/radios_status.model'
import { eq } from 'drizzle-orm'
import { PaginationSchemaType } from '@/utils/pagination'
import { RepositoryCore } from '@/core/repository.core'

export class RadiosStatusRepository extends RepositoryCore<RadiosStatusShemaSelectType, RadiosStatusShemaCreateType, RadiosStatusShemaUpdateType> implements IRadiosStatusRepository {
    constructor (public readonly db: MySql2Database) {
        const table = radios_status

        const select = db.select({
            code: radios_status.code,
            name: radios_status.name
        })
        .from(table)

        super({ db, table, select })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<RadiosStatusShemaSelectPaginatedType> {
        const data = await this.paginate({
            query,
            where: eq(radios_status.group_id, group_id)
        })

        return RadiosStatusShemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<RadiosStatusShemaSelectType> {
        const data = await this.getOne({
            where: eq(radios_status.code, code)
        })

        return RadiosStatusShemaSelect.parse(data)
    }

    public async create (params: RadiosStatusShemaCreateType): Promise<string> {
        const code = await this.insert({
            params
        })

        return code
    }

    public async update (code: string, params: RadiosStatusShemaUpdateType): Promise<string> {
        const data = await this.set({
            params,
            where: eq(radios_status.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await this.softDelete(eq(radios_status.code, code))
    }
}

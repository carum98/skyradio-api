import { IRepository, RepositoryCore } from '@/core/repository.core'
import { radios } from '@models/radios.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadioModelSchemaCounterType, RadiosModelShemaCreateType, RadiosModelShemaSelectPaginatedType, RadiosModelShemaSelectType, RadiosModelShemaUpdateType, radios_model } from '@models/radios_model.model'
import { count, eq, sql } from 'drizzle-orm'
import { MySql2Database } from 'drizzle-orm/mysql2'

export class RadiosModelRepository extends RepositoryCore<RadiosModelShemaSelectType, RadiosModelShemaCreateType, RadiosModelShemaUpdateType> implements IRepository {
    constructor (public readonly db: MySql2Database) {
        const table = radios_model

        const select = db.select({
            code: radios_model.code,
            name: radios_model.name,
            color: radios_model.color
        })
        .from(table)

        super({ db, table, select, search_columns: [radios_model.name] })
    }

    public async getAll (group_id: number, query?: PaginationSchemaType): Promise<RadiosModelShemaSelectPaginatedType> {
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

    public async countByClient (client_id: number): Promise<RadioModelSchemaCounterType[]> {
        return await this.db.select({
            code: radios_model.code,
            name: radios_model.name,
            color: radios_model.color,
            count: count(radios_model.code)
        })
        .from(radios)
        .rightJoin(radios_model, eq(radios_model.id, radios.model_id))
        .where(eq(radios.client_id, client_id))
        .groupBy(sql`${radios_model.code}, ${radios_model.name}, ${radios_model.color}`)
    }

    public async getAllWithId (group_id: number): Promise<Array<{ id: number, name: string }>> {
        return await this.db.select({
            id: radios_model.id,
            name: radios_model.name
        })
        .from(radios_model)
        .where(eq(radios_model.group_id, group_id))
    }
}

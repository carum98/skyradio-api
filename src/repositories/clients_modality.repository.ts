import { MySql2Database } from 'drizzle-orm/mysql2'
import { count, eq, sql } from 'drizzle-orm'
import { ClientsModalitySchemaCounterType, ClientsModalitySchemaCreateType, ClientsModalitySchemaSelect, ClientsModalitySchemaSelectPaginated, ClientsModalitySchemaSelectPaginatedType, ClientsModalitySchemaSelectType, ClientsModalitySchemaUpdateType, clients_modality } from '@models/clients_modality.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { IRepository, RepositoryCore } from '@/core/repository.core'
import { clients } from '@models/clients.model'

export class ClientsModalityRepository extends RepositoryCore<ClientsModalitySchemaSelectType, ClientsModalitySchemaCreateType, ClientsModalitySchemaUpdateType> implements IRepository {
    constructor (public readonly db: MySql2Database) {
        const table = clients_modality

        const select = db.select({
            code: clients_modality.code,
            name: clients_modality.name,
            color: clients_modality.color
        })
        .from(table)

        super({ db, table, select, search_columns: [clients_modality.name] })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<ClientsModalitySchemaSelectPaginatedType> {
        const data = await super.getAllCore({
            query,
            where: eq(clients_modality.group_id, group_id)
        })

        return ClientsModalitySchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<ClientsModalitySchemaSelectType> {
        const data = await super.getOneCore({
            where: eq(clients_modality.code, code)
        })

        return ClientsModalitySchemaSelect.parse(data)
    }

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(clients_modality.code, code)
        })
    }

    public async create (params: ClientsModalitySchemaCreateType): Promise<string> {
        const code = await super.insertCore({
            params
        })

        return code
    }

    public async update (code: string, params: ClientsModalitySchemaUpdateType): Promise<string> {
        const data = await super.updateCore({
            params,
            where: eq(clients_modality.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await super.deleteCore(eq(clients_modality.code, code))
    }

    public async countAll (): Promise<ClientsModalitySchemaCounterType[]> {
        return await this.db.select({
            code: clients_modality.code,
            name: clients_modality.name,
            color: clients_modality.color,
            count: count(clients_modality.code)
        })
        .from(clients)
        .rightJoin(clients_modality, eq(clients_modality.id, clients.modality_id))
        .groupBy(sql`${clients_modality.code}, ${clients_modality.name}, ${clients_modality.color}`)
    }
}

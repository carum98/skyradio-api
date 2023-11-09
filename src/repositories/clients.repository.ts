import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq, sql } from 'drizzle-orm'
import { ClientsSchemaCreateRawType, ClientsSchemaSelectPaginatedType, ClientsSchemaSelectType, ClientsSchemaUpdateRawType, clients } from '@models/clients.model'
import { companies_modality } from '@/models/clients_modality.model'
import { sellers } from '@models/sellers.model'
import { radios } from '@models/radios.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { IRepository, RepositoryCore } from '@/core/repository.core'

export class ClientsRepository extends RepositoryCore<ClientsSchemaSelectType, ClientsSchemaCreateRawType, ClientsSchemaUpdateRawType> implements IRepository {
    constructor (public readonly db: MySql2Database) {
        const table = clients

    const select = db.select({
            code: clients.code,
            name: clients.name,
            modality: {
                code: companies_modality.code,
                name: companies_modality.name
            },
            seller: {
                code: sellers.code,
                name: sellers.name
            },
            radios_count: sql<number>`(select count(${radios.id}) from ${radios} where ${radios.client_id} = ${clients.id})`
        })
        .from(table)
        .leftJoin(companies_modality, eq(companies_modality.id, clients.modality_id))
        .leftJoin(sellers, eq(sellers.id, clients.seller_id))

        super({ db, table, select, search_columns: [clients.name] })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<ClientsSchemaSelectPaginatedType> {
        return await super.getAllCore({
            query,
            where: eq(clients.group_id, group_id)
        })
    }

    public async get (code: string): Promise<ClientsSchemaSelectType> {
        return await super.getOneCore({
            where: eq(clients.code, code)
        })
    }

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(clients.code, code)
        })
    }

    public async create (params: ClientsSchemaCreateRawType): Promise<string> {
        return await super.insertCore({
            params
        })
    }

    public async update (code: string, params: ClientsSchemaUpdateRawType): Promise<string> {
        const isUpdated = await super.updateCore({
            params,
            where: eq(clients.code, code)
        })

        return isUpdated ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await super.deleteCore(eq(clients.code, code))
    }
}

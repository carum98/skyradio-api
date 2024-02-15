import { MySql2Database } from 'drizzle-orm/mysql2'
import { and, count, eq, sql } from 'drizzle-orm'
import { ClientsSchemaCounterType, ClientsSchemaCreateRawType, ClientsSchemaSelectPaginatedType, ClientsSchemaSelectType, ClientsSchemaUpdateRawType, clients } from '@models/clients.model'
import { clients_modality } from '@models/clients_modality.model'
import { sellers } from '@models/sellers.model'
import { radios } from '@models/radios.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { IRepository, RepositoryCore } from '@/core/repository.core'
import { radios_model } from '@models/radios_model.model'
import { sims_provider } from '@models/sims_provider.model'
import { sims } from '@models/sims.model'

export class ClientsRepository extends RepositoryCore<ClientsSchemaSelectType, ClientsSchemaCreateRawType, ClientsSchemaUpdateRawType> implements IRepository {
    constructor (public readonly db: MySql2Database) {
    const table = clients

    const select = db.select({
            code: clients.code,
            name: clients.name,
            color: clients.color,
            modality: {
                code: clients_modality.code,
                name: clients_modality.name,
                color: clients_modality.color
            },
            seller: {
                code: sellers.code,
                name: sellers.name
            },
            radios_count: sql<number>`(select count(${radios.id}) from ${radios} where ${radios.client_id} = ${clients.id})`
        })
        .from(table)
        .leftJoin(clients_modality, eq(clients_modality.id, clients.modality_id))
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

    public async getAllBy (group_id: number, params: { seller_code?: string }): Promise<ClientsSchemaSelectPaginatedType> {
        const { seller_code } = params

        const where = [
            eq(clients.group_id, group_id)
        ]

        if (seller_code !== undefined) {
            where.push(eq(sellers.code, seller_code))
        }

        return await super.getAllCore({
            query: { page: 1, per_page: 1000, sort_by: 'created_at', sort_order: 'desc' },
            where: and(...where)
        })
    }

    public async countAll (): Promise<ClientsSchemaCounterType[]> {
        const rows = await this.db.select({
            client: {
                code: clients.code,
                name: clients.name,
                color: clients.color,
                count: count(clients.code),
            },
            models: {
                code: radios_model.code,
                name: radios_model.name,
                color: radios_model.color,
                count: count(radios_model.code)
            },
            providers: {
                code: sims_provider.code,
                name: sims_provider.name,
                color: sims_provider.color,
                count: count(sims_provider.code)
            }
        })
        .from(clients)
        .leftJoin(radios, eq(radios.client_id, clients.id))
        .leftJoin(radios_model, eq(radios.model_id, radios_model.id))
        .leftJoin(sims, eq(radios.sim_id, sims.id))
        .leftJoin(sims_provider, eq(sims.provider_id, sims_provider.id))
        .groupBy(sql`${clients.code}, ${clients.name}, ${clients.color}, ${radios_model.code}, ${radios_model.name}, ${radios_model.color}, ${sims_provider.code}, ${sims_provider.name}, ${sims_provider.color}`)
        .orderBy(clients.code, radios_model.code, sims_provider.code)

        const result = rows.reduce<Record<string, ClientsSchemaCounterType>>((acc, row) => {
            const client = row.client
            const models = row.models
            const providers = row.providers

            const client_code = client.code

            if (!acc[client_code]) {
                acc[client_code] = {
                    ...client,
                    models: [],
                    providers: []
                }
            }

            if (models) {
                acc[client_code].models.push(models)
            }

            if (providers) {
                acc[client_code].providers.push(providers)
            }

            return acc
        }, {})

        const data = [...Object.values(result)]

        data.sort((a, b) => a.count - b.count)

        return data
    }
}

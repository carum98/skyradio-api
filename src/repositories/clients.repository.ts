import { MySql2Database } from 'drizzle-orm/mysql2'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { ClientsSchemaCounterType, ClientsSchemaCreateRawType, ClientsSchemaSelectPaginatedType, ClientsSchemaSelectType, ClientsSchemaUpdateRawType, clients } from '@models/clients.model'
import { clients_modality } from '@models/clients_modality.model'
import { sellers } from '@models/sellers.model'
import { radios } from '@models/radios.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { IRepository, RepositoryCore } from '@/core/repository.core'
import { radios_model } from '@models/radios_model.model'
import { sims_provider } from '@models/sims_provider.model'
import { console } from '@models/clients_console.model'
import { sims } from '@models/sims.model'
import { groupBy, groupByAndCount } from '@/utils'
import { licenses } from '@models/licenses.model'
import { apps } from '@models/apps.model'

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
            console: {
                code: console.code
            },
            console__license: {
                code: licenses.code,
                key: licenses.key
            },
            radios_count: sql<number>`(select count(${radios.id}) from ${radios} where ${radios.client_id} = ${clients.id} and ${radios.deleted_at} is null)`,
            apps_count: sql<number>`(select count(${apps.id}) from ${apps} where ${apps.client_id} = ${clients.id} and ${apps.deleted_at} is null)`
        })
        .from(table)
        .leftJoin(clients_modality, eq(clients_modality.id, clients.modality_id))
        .leftJoin(sellers, eq(sellers.id, clients.seller_id))
        .leftJoin(console, and(eq(clients.id, console.client_id), isNull(console.deleted_at)))
        .leftJoin(licenses, eq(licenses.id, console.license_id))

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

    public async countAll (group_id: number): Promise<ClientsSchemaCounterType[]> {
        interface ResultType {
            client: {
                code: string
                name: string
                color: string
            }
            models: {
                code: string
                name: string
                color: string
            } | null
            providers: {
                code: string
                name: string
                color: string
            } | null
        }

        const rows = await this.db.select({
            client: {
                code: clients.code,
                name: clients.name,
                color: clients.color
            },
            models: {
                code: radios_model.code,
                name: radios_model.name,
                color: radios_model.color
            },
            providers: {
                code: sims_provider.code,
                name: sims_provider.name,
                color: sims_provider.color
            }
        })
        .from(clients)
        .innerJoin(radios, eq(radios.client_id, clients.id))
        .leftJoin(radios_model, eq(radios.model_id, radios_model.id))
        .leftJoin(sims, eq(radios.sim_id, sims.id))
        .leftJoin(sims_provider, eq(sims.provider_id, sims_provider.id))
        .where(and(eq(clients.group_id, group_id), isNull(clients.deleted_at))) as ResultType[]

        const data = groupBy(rows, (v) => v.client.code)

        const result = Object.entries(data).map(([_, value]) => {
            const models = groupByAndCount(value, (v) => v.models.code)
            const providers = groupByAndCount(value.filter(v => v.providers), (v) => v.providers?.code)

            return {
                ...value.at(0).client,
                count: value.length,
                models: Object.values(models).map((v) => ({ ...v.models, count: v.count })),
                providers: Object.values(providers).map((v) => ({ ...v.providers, count: v.count }))
            } satisfies ClientsSchemaCounterType
        })

        const x = [...Object.values(result)]

        // Sort by count
        x.sort((a, b) => b.count - a.count)

        return x
    }
}

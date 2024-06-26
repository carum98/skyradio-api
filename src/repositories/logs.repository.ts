import { IRepository, RepositoryCore } from '@/core/repository.core'
import { apps } from '@/models/apps.model'
import { clients } from '@/models/clients.model'
import { radios } from '@/models/radios.model'
import { sims } from '@/models/sims.model'
import { users } from '@/models/users.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { LogsSchemaCreateType, LogsSchemaSelectPaginatedType, LogsSchemaSelectType, LogsSchemaUpdateType, actionsMessages, logs } from '@models/logs.model'
import { and, eq } from 'drizzle-orm'
import { MySql2Database } from 'drizzle-orm/mysql2'

export class LogsRepository extends RepositoryCore<LogsSchemaSelectType, LogsSchemaCreateType, LogsSchemaUpdateType> implements IRepository {
    constructor (public readonly db: MySql2Database) {
        const table = logs

        const select = db.select({
            user: {
                id: users.id,
                name: users.name
            },
            values__radio: {
                code: radios.code,
                imei: radios.imei
            },
            values__client: {
                code: clients.code,
                name: clients.name
            },
            values__sim: {
                code: sims.code,
                number: sims.number
            },
            values__app: {
                code: apps.code,
                name: apps.name
            },
            created_at: table.created_at,
            action: table.action
        })
        .from(table)
        .leftJoin(users, eq(table.user_id, users.id))
        .leftJoin(radios, eq(table.radio_id, radios.id))
        .leftJoin(clients, eq(table.client_id, clients.id))
        .leftJoin(sims, eq(table.sim_id, sims.id))
        .leftJoin(apps, eq(table.app_id, apps.id))

        super({ db, table, select })
    }

    public async getAll (params: { group_id?: number, radio_id?: number, client_id?: number, sim_id?: number, app_id?: number }, query: PaginationSchemaType): Promise<LogsSchemaSelectPaginatedType> {
        const { group_id, radio_id, client_id, sim_id, app_id } = params

        const where = []
        let rel = ''

        if (radio_id !== undefined) {
            rel = 'radios'
            where.push(eq(logs.radio_id, radio_id))
        } else if (client_id !== undefined) {
            rel = 'clients'
            where.push(eq(logs.client_id, client_id))
        } else if (sim_id !== undefined) {
            rel = 'sims'
            where.push(eq(logs.sim_id, sim_id))
        } else if (group_id !== undefined) {
            rel = 'groups'
            where.push(eq(logs.group_id, group_id))
        } else if (app_id !== undefined) {
            rel = 'apps'
            where.push(eq(logs.app_id, app_id))
        }

        const data = await super.getAllCore({
            query,
            where: and(...where)
        })

        return {
            ...data,
            data: data.data.map((item) => ({
                ...item,
                message: actionsMessages(item.action, rel)
            }))
        }
    }

    public async create (params: LogsSchemaCreateType): Promise<string> {
        return await super.insertCore({
            params
        })
    }

    public async createMany (params: LogsSchemaCreateType[]): Promise<string[]> {
        return await super.insertManyCore({
            params
        })
    }
}

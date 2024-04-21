import { RepositoryCore } from '@/core/repository.core'
import { licenses } from '@models/licenses.model'
import { AppsSchemaCreateRawType, AppsSchemaSelectPaginatedType, AppsSchemaSelectType, AppsSchemaUpdateRawType, apps } from '@models/apps.model'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { clients } from '@/models/clients.model'
import { and, eq } from 'drizzle-orm'
import { PaginationSchemaType } from '@/utils/pagination'
import { sellers } from '@models/sellers.model'

export class AppsRepository extends RepositoryCore<AppsSchemaSelectType, AppsSchemaCreateRawType, AppsSchemaUpdateRawType> {
    constructor (public readonly db: MySql2Database) {
        const table = apps

        const select = db.select({
            code: table.code,
            name: table.name,
            license: {
                code: licenses.code,
                key: licenses.key
            },
            client: {
                code: clients.code,
                name: clients.name,
                color: clients.color
            }
        })
        .from(table)
        .leftJoin(licenses, eq(licenses.id, table.license_id))
        .leftJoin(clients, eq(clients.id, table.client_id))
        .leftJoin(sellers, eq(clients.seller_id, sellers.id))

        super({ db, table, select, search_columns: [table.code] })
    }

    public async getAll (params: { group_id?: number, client_id?: number, user_id?: number }, query?: PaginationSchemaType): Promise<AppsSchemaSelectPaginatedType> {
        const { group_id, client_id, user_id } = params
        const where = []

        if (group_id !== undefined) {
            where.push(eq(clients.group_id, group_id))
        }

        if (client_id !== undefined) {
            where.push(eq(apps.client_id, client_id))
        }

        if (user_id !== undefined) {
            where.push(eq(sellers.user_id, user_id))
        }

        return await super.getAllCore({
            query,
            where: and(...where)
        })
    }

    public async get (code: string): Promise<AppsSchemaSelectType> {
        return await this.getOneCore({
            where: eq(apps.code, code)
        })
    }

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(apps.code, code)
        })
    }

    public async create (params: AppsSchemaCreateRawType): Promise<string> {
        return await this.insertCore({
            params
        })
    }

    public async update (code: string, params: AppsSchemaUpdateRawType): Promise<string> {
        const data = await this.updateCore({
            params,
            where: eq(apps.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await this.deleteCore(eq(apps.code, code))
    }
}

import { RepositoryCore } from '@/core/repository.core'
import { licenses } from '@models/licenses.model'
import { ConsoleSchemaCreateRawType, ConsoleSchemaSelectPaginatedType, ConsoleSchemaSelectType, ConsoleSchemaUpdateRawType, console } from '@models/clients_console.model'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { and, eq, isNotNull } from 'drizzle-orm'
import { clients } from '@/models/clients.model'
import { PaginationSchemaType } from '@/utils/pagination'

export class ClientsConsoleRepository extends RepositoryCore<ConsoleSchemaSelectType, ConsoleSchemaCreateRawType, ConsoleSchemaUpdateRawType> {
    constructor (public readonly db: MySql2Database) {
        const table = console

        const select = db.select({
            code: table.code,
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
        .rightJoin(clients, eq(clients.id, table.client_id))

        super({ db, table, select, search_columns: [table.code] })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<ConsoleSchemaSelectPaginatedType> {
        return await this.getAllCore({
            query,
            where: and(isNotNull(console.license_id), eq(clients.group_id, group_id))
        })
    }

    public async get (code: string): Promise<ConsoleSchemaSelectType> {
        return await this.getOneCore({
            where: eq(console.code, code)
        })
    }

    public async create (params: ConsoleSchemaCreateRawType): Promise<string> {
        return await this.insertCore({
            params
        })
    }

    public async update (code: string, params: ConsoleSchemaUpdateRawType): Promise<string> {
        const data = await this.updateCore({
            params,
            where: eq(console.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await this.deleteCore(eq(console.code, code))
    }

    public async getByClient (client_id: number): Promise<ConsoleSchemaSelectType> {
        return await this.getOneCore({
            where: eq(console.client_id, client_id)
        })
    }
}

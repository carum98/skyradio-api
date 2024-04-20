import { RepositoryCore } from '@/core/repository.core'
import { licenses } from '@models/licenses.model'
import { ConsoleSchemaCreateRawType, ConsoleSchemaSelectPaginatedType, ConsoleSchemaSelectType, ConsoleSchemaUpdateRawType, console } from '@models/clients_console.model'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { and, eq } from 'drizzle-orm'
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
        .leftJoin(clients, eq(clients.id, table.client_id))

        super({ db, table, select, search_columns: [table.code] })
    }

    public async getAll (params: { group_id?: number, client_id?: number }, query?: PaginationSchemaType): Promise<ConsoleSchemaSelectPaginatedType> {
        const { group_id, client_id } = params
        const where = []

        if (group_id !== undefined) {
            where.push(eq(clients.group_id, group_id))
        }

        if (client_id !== undefined) {
            where.push(eq(console.client_id, client_id))
        }

        return await super.getAllCore({
            query,
            where: and(...where)
        })
    }

    public async get (code: string): Promise<ConsoleSchemaSelectType> {
        return await this.getOneCore({
            where: eq(console.code, code)
        })
    }

    public async upsert (params: ConsoleSchemaCreateRawType): Promise<string> {
        const code = await this.db.select({ code: console.code })
            .from(console)
            .where(eq(console.client_id, params.client_id ?? 0))

        if (code.length > 0) {
            await this.db.update(console)
                .set({ ...params, deleted_at: null })
                .where(eq(console.code, code[0].code ?? 0))

            return code[0].code
        }

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

import { RepositoryCore } from '@/core/repository.core'
import { licenses } from '@models/licenses.model'
import { ConsoleSchemaCreateType, ConsoleSchemaSelectType, ConsoleSchemaUpdateType, console } from '@models/clients_console.model'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { and, eq, isNotNull } from 'drizzle-orm'
import { clients } from '@/models/clients.model'

export class ClientsConsoleRepository extends RepositoryCore<ConsoleSchemaSelectType, ConsoleSchemaCreateType, ConsoleSchemaUpdateType> {
    constructor (public readonly db: MySql2Database) {
        const table = console

        const select = db.select({
            code: table.code,
            license: {
                code: licenses.code,
                key: licenses.code
            },
            client: {
                code: clients.code,
                name: clients.name,
                color: clients.color
            }
        })
        .from(table)
        .leftJoin(licenses, eq(licenses.id, table.license_id))
        .rightJoin(clients, eq(clients.console_id, table.id))

        super({ db, table, select, search_columns: [table.code] })
    }

    public async getByClient (client_id: number): Promise<ConsoleSchemaSelectType> {
        return await this.getOneCore({
            where: and(eq(clients.id, client_id), isNotNull(console.license_id))
        })
    }
}

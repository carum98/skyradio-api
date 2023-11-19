import { IRepository, RepositoryCore } from '@/core/repository.core'
import { PaginationSchemaType } from '@/utils/pagination'
import { LogsSchemaCreateType, LogsSchemaSelectPaginatedType, LogsSchemaSelectType, LogsSchemaUpdateType, logs } from '@models/logs.model'
import { eq } from 'drizzle-orm'
import { MySql2Database } from 'drizzle-orm/mysql2'

export class LogsRepository extends RepositoryCore<LogsSchemaSelectType, LogsSchemaCreateType, LogsSchemaUpdateType> implements IRepository {
    constructor (public readonly db: MySql2Database) {
        const table = logs

        const select = db.select().from(table)

        super({ db, table, select })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<LogsSchemaSelectPaginatedType> {
        return await super.getAllCore({
            query,
            where: eq(logs.group_id, group_id)
        })
    }

    public async create (params: LogsSchemaCreateType): Promise<string> {
        return await super.insertCore({
            params
        })
    }
}

import { RepositoryCore } from '@/core/repository.core'
import { licenses } from '@models/licenses.model';
import { AppsSchemaCreateRawType, AppsSchemaSelectPaginatedType, AppsSchemaSelectType, AppsSchemaUpdateRawType, apps } from '@models/apps.model';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { clients } from '@/models/clients.model';
import { and, eq, isNotNull } from 'drizzle-orm';
import { PaginationSchemaType } from '@/utils/pagination';

export class AppsRepository extends RepositoryCore<AppsSchemaSelectType, AppsSchemaCreateRawType, AppsSchemaUpdateRawType> {
    constructor (public readonly db: MySql2Database) {
        const table = apps

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

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<AppsSchemaSelectPaginatedType> {
        return await this.getAllCore({
            query,
            where: and(isNotNull(apps.license_id), eq(clients.group_id, group_id))
        })
    }

    public async get (code: string): Promise<AppsSchemaSelectType> {
        return await this.getOneCore({
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

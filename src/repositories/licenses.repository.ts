import { RepositoryCore } from '@/core/repository.core'
import { PaginationSchemaType } from '@utils/pagination'
import { LicensesSchemaCreateType, LicensesSchemaSelectPaginatedType, LicensesSchemaSelectType, LicensesSchemaUpdateType, licenses } from '@models/licenses.model'
import { eq, sql } from 'drizzle-orm'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { console } from '@models/clients_console.model'
import { apps } from '@models/apps.model'

export class LicensesRepository extends RepositoryCore<LicensesSchemaSelectType, LicensesSchemaCreateType, LicensesSchemaUpdateType> {
    constructor (public readonly db: MySql2Database) {
        const table = licenses

        const select = db.select({
            code: licenses.code,
            key: licenses.key,
            is_active: sql<boolean>`EXISTS(SELECT 1 FROM clients_console WHERE clients_console.license_id=licenses.id AND clients_console.deleted_at IS NULL)OR EXISTS(SELECT 1 FROM apps WHERE apps.license_id=licenses.id AND apps.deleted_at IS NULL)`
        }).from(table)

        super({ db, table, select, search_columns: [licenses.key] })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<LicensesSchemaSelectPaginatedType> {
        return await super.getAllCore({
            query,
            where: eq(licenses.group_id, group_id)
        })
    }

    public async get (code: string): Promise<LicensesSchemaSelectType> {
        return await super.getOneCore({
            where: eq(licenses.code, code)
        })
    }

    public async getId (code: string): Promise<number> {
        return await super.getIdCore({
            where: eq(licenses.code, code)
        })
    }

    public async create (params: LicensesSchemaCreateType): Promise<string> {
        return await super.insertCore({
            params
        })
    }

    public async update (code: string, params: LicensesSchemaUpdateType): Promise<string> {
        const isUpdated = await super.updateCore({
            params,
            where: eq(licenses.code, code)
        })

        return isUpdated ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await super.deleteCore(eq(licenses.code, code))
    }

    // Remove all relations with clients_console and apps set to null
    public async clearRelations (id: number): Promise<void> {
        await Promise.all([
            this.db.update(console)
                .set({ license_id: null })
                .where(eq(console.license_id, id)),
            this.db.update(apps)
                .set({ license_id: null })
                .where(eq(apps.license_id, id))
        ])
    }
}

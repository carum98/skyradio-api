import { RepositoryCore } from '@/core/repository.core'
import { PaginationSchemaType } from '@utils/pagination'
import { LicensesSchemaCreateType, LicensesSchemaSelectPaginatedType, LicensesSchemaSelectType, LicensesSchemaUpdateType, licenses } from '@models/licenses.model'
import { eq } from 'drizzle-orm'
import { MySql2Database } from 'drizzle-orm/mysql2'

export class LicensesRepository extends RepositoryCore<LicensesSchemaSelectType, LicensesSchemaCreateType, LicensesSchemaUpdateType> {
    constructor (public readonly db: MySql2Database) {
        const table = licenses

        const select = db.select({
            code: licenses.code,
            key: licenses.key
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
}

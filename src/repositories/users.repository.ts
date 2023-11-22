import { UserSchemaCreateType, UserSchemaSelectPaginatedType, UserSchemaSelectType, UserSchemaUpdateType, users } from '@models/users.model'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq } from 'drizzle-orm'
import { RepositoryCore } from '@/core/repository.core'
import { PaginationSchemaType } from '@/utils/pagination'
import { groups } from '@/models/groups.model'

export class UserRepository extends RepositoryCore<UserSchemaSelectType, UserSchemaCreateType, UserSchemaUpdateType> {
    constructor (public readonly db: MySql2Database) {
        const table = users

        const select = db.select({
            code: users.code,
            name: users.name,
            email: users.email,
            role: users.role,
            group: {
                id: groups.id,
                name: groups.name
            }
        })
        .from(table)
        .leftJoin(groups, eq(users.group_id, groups.id))

        super({ db, table, select, search_columns: [users.email] })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<UserSchemaSelectPaginatedType> {
        return await super.getAllCore({
            query,
            where: eq(users.group_id, group_id)
        })
    }

    public async get (code: string): Promise<UserSchemaSelectType | null> {
        return await super.getOneCore({
            where: eq(users.code, code)
        })
    }

    public async create (params: UserSchemaCreateType): Promise<string> {
        return await super.insertCore({
            params
        })
    }

    public async update (code: string, params: UserSchemaUpdateType): Promise<string> {
        const data = await super.updateCore({
            params,
            where: eq(users.code, code)
        })

        return data ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        return await super.deleteCore(eq(users.code, code))
    }
}

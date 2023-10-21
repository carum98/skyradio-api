import { GroupSchemaCreateType, GroupSchemaSelect, GroupSchemaSelectPaginated, GroupSchemaSelectPaginatedType, GroupSchemaSelectType, GroupSchemaUpdateType, groups } from '@models/groups.model'
import { IGroupRepository } from './repositories'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq, isNull } from 'drizzle-orm'
import { PaginationSchemaType } from '@/utils/pagination'
import { RepositoryCore } from '@/core/repository.core'

export class GroupRepository extends RepositoryCore<GroupSchemaSelectType, GroupSchemaCreateType, GroupSchemaUpdateType> implements IGroupRepository {
    constructor (public readonly db: MySql2Database) {
        const table = groups

        const select = db.select({
            id: groups.id,
            name: groups.name
        })
        .from(table)

        super({ db, table, select })
    }

    public async getAll (query: PaginationSchemaType): Promise<GroupSchemaSelectPaginatedType> {
        const data = await this.paginate({
            query,
            where: isNull(groups.deleted_at)
        })

        return GroupSchemaSelectPaginated.parse(data)
    }

    public async get (id: number): Promise<GroupSchemaSelectType> {
        const data = await this.getOne(eq(groups.id, id))

        return GroupSchemaSelect.parse(data)
    }

    public async create (params: GroupSchemaCreateType): Promise<number> {
        const data = await this.db.insert(groups).values(params)

        return data[0].insertId
    }

    public async update (id: number, params: GroupSchemaUpdateType): Promise<number> {
        const data = await this.set({
            params,
            where: eq(groups.id, id)
        })

        return data ? id : 0
    }

    public async delete (id: number): Promise<boolean> {
        return await this.softDelete(eq(groups.id, id))
    }
}

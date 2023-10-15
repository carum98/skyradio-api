import { IUserRepository } from './repositories'
import { UserSchemaCreateType, UserSchemaSelect, UserSchemaSelectType, UserSchemaUpdateType, users } from '@models/users.model'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq, isNull, sql, and } from 'drizzle-orm'

export class UserRepository implements IUserRepository {
    constructor (public readonly db: MySql2Database) {}

    public async getAll (): Promise<UserSchemaSelectType[]> {
        const data = await this.db.select().from(users)
            .where(isNull(users.deleted_at))

        return UserSchemaSelect.array().parse(data)
    }

    public async get (id: number): Promise<UserSchemaSelectType | null> {
        const data = await this.db.select().from(users)
            .where(
                and(
                    eq(users.id, id),
                    isNull(users.deleted_at)
                )
            )

        return data.length > 0
            ? UserSchemaSelect.parse(data[0])
            : null
    }

    public async create (params: UserSchemaCreateType): Promise<number> {
        const data = await this.db.insert(users).values(params)

        return data[0].insertId
    }

    public async update (id: number, params: UserSchemaUpdateType): Promise<number> {
        const data = await this.db.update(users)
            .set(params)
            .where(
                and(
                    eq(users.id, id),
                    isNull(users.deleted_at)
                )
            )

        return data[0].affectedRows > 0 ? id : 0
    }

    public async delete (id: number): Promise<boolean> {
        const data = await this.db.update(users)
            .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
            .where(eq(users.id, id))

        return data[0].affectedRows > 0
    }
}

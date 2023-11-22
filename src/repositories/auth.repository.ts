import { IRepository } from '@/core/repository.core'
import { groups } from '@/models/groups.model'
import { refresh_tokens } from '@models/refresh-token.model'
import { UserSchema, UserSchemaType, UserSchemaSelectType, users, UserSchemaSelect } from '@models/users.model'
import { and, eq } from 'drizzle-orm'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { z } from 'zod'

export class AuthRepository implements IRepository {
    constructor (public readonly db: MySql2Database) {}

    public async login (email: string): Promise<UserSchemaType | null> {
        const data = await this.db.select().from(users)
            .where(eq(users.email, email))

        return data.length === 0 ? null : UserSchema.parse(data[0])
    }

    public async refreshToken (id: number, token: string): Promise<void> {
        const data = await this.db.select().from(refresh_tokens)
            .where(eq(refresh_tokens.user_id, id))

        if (data.length === 0) {
            await this.db.insert(refresh_tokens).values({ user_id: id, token })
        } else {
            await this.db.update(refresh_tokens).set({ token }).where(eq(refresh_tokens.user_id, id))
        }
    }

    public async checkRefreshToken (id: number, token: string): Promise<boolean> {
        const data = await this.db.select().from(refresh_tokens)
            .where(
                and(
                    eq(refresh_tokens.user_id, id),
                    eq(refresh_tokens.token, token)
                )
            )

        return data.length > 0
    }

    public async getUserById (id: number): Promise<UserSchemaSelectType & { id: number }> {
        const data = await this.db.select().from(users)
            .leftJoin(groups, eq(groups.id, users.group_id))
            .where(eq(users.id, id))

        return UserSchemaSelect.extend({ id: z.number() }).parse({
            ...data[0].users,
            group: data[0].groups
        })
    }
}

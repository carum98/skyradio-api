import { IRepository } from '@/core/repository.core'
import { refresh_tokens } from '@models/refresh-token.model'
import { UserSchema, UserSchemaType, users } from '@models/users.model'
import { and, eq } from 'drizzle-orm'
import { MySql2Database } from 'drizzle-orm/mysql2'

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

    public async getUserById (id: number): Promise<UserSchemaType> {
        const data = await this.db.select().from(users)
            .where(eq(users.id, id))

        return UserSchema.parse(data[0])
    }
}

import { refresh_tokens } from '@models/refresh-token.model'
import { UserSchemaSelect, UserSchemaSelectType, users } from '@models/users.model'
import { IAuthRepository } from './repositories'
import { and, eq } from 'drizzle-orm'
import { MySql2Database } from 'drizzle-orm/mysql2'

export class AuthRepository implements IAuthRepository {
    constructor (public readonly db: MySql2Database) {}

    public async login (email: string): Promise<UserSchemaSelectType | null> {
        const data = await this.db.select().from(users).where(eq(users.email, email))

        return data.length === 0 ? null : UserSchemaSelect.parse(data[0])
    }

    public async register (name: string, email: string, password: string): Promise<UserSchemaSelectType> {
        const data = await this.db.insert(users).values({ name, email, password, group_id: 1 })

        const user = await this.db.select().from(users).where(eq(users.id, data[0].insertId))

        return UserSchemaSelect.parse(user[0])
    }

    public async refreshToken (id: number, token: string): Promise<void> {
        const data = await this.db.select().from(refresh_tokens).where(eq(refresh_tokens.user_id, id))

        if (data.length === 0) {
            await this.db.insert(refresh_tokens).values({ user_id: id, token })
        } else {
            await this.db.update(refresh_tokens).set({ token }).where(eq(refresh_tokens.user_id, id))
        }
    }

    public async checkRefreshToken (id: number, token: string): Promise<boolean> {
        const data = await this.db.select().from(refresh_tokens).where(and(eq(refresh_tokens.user_id, id), eq(refresh_tokens.token, token)))

        return data.length > 0
    }
}

import { Database } from '@/database'
import { IAuthRepository } from './repositories'
import { UserSchema, UserSchemaType } from '@models/users.shema'

export class AuthRepository implements IAuthRepository {
    constructor (public readonly db: Database) {}

    public async login (email: string): Promise<UserSchemaType | null> {
        const data = await this.db.query('SELECT * FROM users WHERE email = ?', [email]) as any[]

        return data.length === 0 ? null : UserSchema.parse(data[0])
    }

    public async register (name: string, email: string, password: string): Promise<UserSchemaType> {
        const data = await this.db.query('INSERT INTO users (name, email, password, group_id) VALUES (?, ?, ?, 1)', [name, email, password])

        const user = await this.db.query('SELECT * FROM users WHERE id = ?', [data.insertId]) as any[]

        return UserSchema.parse(user[0])
    }

    public async refreshToken (id: number, token: string): Promise<void> {
        const data = await this.db.query('SELECT * FROM refresh_tokens WHERE user_id = ?', [id]) as any[]

        if (data.length === 0) {
            await this.db.query('INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)', [id, token])
        } else {
            await this.db.query('UPDATE refresh_tokens SET token = ? WHERE user_id = ?', [token, id])
        }
    }

    public async checkRefreshToken (id: number, token: string): Promise<boolean> {
        const data = await this.db.query('SELECT * FROM refresh_tokens WHERE user_id = ? AND token = ?', [id, token]) as any[]

        return data.length > 0
    }
}

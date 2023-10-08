import { Database } from '@/database'
import { IAuthRepository } from './repositories'
import { UserSchema, UserSchemaType } from '@models/users.shema'
import { NotFoundError } from '@utils/errors'

export class AuthRepository implements IAuthRepository {
    constructor (private readonly db: Database) {}

    public async login (email: string, password: string): Promise<UserSchemaType> {
        const data = await this.db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]) as any[]

        if (data.length === 0) {
            throw new NotFoundError('User not found')
        }

        return UserSchema.parse(data[0])
    }

    public async register (name: string, email: string, password: string): Promise<UserSchemaType> {
        const data = await this.db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password])

        const user = await this.db.query('SELECT * FROM users WHERE id = ?', [data.insertId]) as any[]

        return UserSchema.parse(user[0])
    }
}

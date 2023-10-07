import { Database } from '@/database'
import { IAuthRepository } from './repositories'

export class AuthRepository implements IAuthRepository {
    constructor (private readonly db: Database) {}

    public async login (user_name: string, password: string): Promise<any> {
        const data = await this.db.query('SELECT * FROM users WHERE user_name = ? AND password = ?', [user_name, password])

        return data
    }

    public async register (name: string, user_name: string, password: string): Promise<any> {
        const data = await this.db.query('INSERT INTO users (name, user_name, password) VALUES (?, ?, ?)', [name, user_name, password])

        return {
            id: data.insertId,
            name,
            user_name,
            password
        }
    }
}

import { Database } from '@/database'
import { IAuthRepository } from './repositories'

export class AuthRepository implements IAuthRepository {
    constructor (private readonly db: Database) {}

    public async login (email: string, password: string): Promise<any> {
        const data = await this.db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password])

        return data
    }

    public async register (name: string, email: string, password: string): Promise<any> {
        const data = await this.db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password])

        return {
            id: data.insertId,
            name,
            email,
            password
        }
    }
}

import { Database } from '@/database'

export class UserRepository {
    constructor (private readonly db: Database) {}

    public async getAll (): Promise<any> {
        const data = await this.db.query('SELECT * FROM users')

        return data
    }

    public async create (name: string, user_name: string, password: string): Promise<any> {
        const data = await this.db.query('INSERT INTO users (name, user_name, password) VALUES (?, ?, ?)', [name, user_name, password])

        return {
            id: data.insertId,
            name,
            user_name,
            password
        }
    }
}

import { Database } from '@/database'
import { NotFoundError } from '@utils/errors'
import { IUserRepository } from './repositories'

export class UserRepository implements IUserRepository {
    constructor (public readonly db: Database) {}

    public async getAll (): Promise<any> {
        const data = await this.db.query('SELECT users.*, `groups`.id as group_id, `groups`.name as group_name FROM users INNER JOIN `groups` ON users.group_id = `groups`.id')

        return data
    }

    public async get (id: string): Promise<any> {
        const data = await this.db.query('SELECT * FROM users WHERE id = ?', [id])

        if (data.length === 0) {
            throw new NotFoundError('User not found')
        }

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

    public async update (id: string, { name, user_name, password }: { name?: string, user_name?: string, password?: string }): Promise<any> {
        const updateFields = []
        const updateValues = []

        if (name != null) {
            updateFields.push('name = ?')
            updateValues.push(name)
        }

        if (user_name != null) {
            updateFields.push('user_name = ?')
            updateValues.push(user_name)
        }

        if (password != null) {
            updateFields.push('password = ?')
            updateValues.push(password)
        }

        if (updateFields.length === 0) {
            throw new Error('At least one field must be provided to update')
        }

        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`
        await this.db.query(query, [...updateValues, id])

        return {
            id,
            name,
            user_name,
            password
        }
    }

    public async delete (id: string): Promise<any> {
        const data = await this.db.query('DELETE FROM users WHERE id = ?', [id])

        return {
            id: data.insertId
        }
    }
}

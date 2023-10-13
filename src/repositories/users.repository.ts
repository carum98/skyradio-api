import { NotFoundError } from '@utils/errors'
import { IUserRepository } from './repositories'
import { UserSchemaSelect, UserSchemaSelectType, users } from '@models/users.model'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { eq } from 'drizzle-orm'

export class UserRepository implements IUserRepository {
    constructor (public readonly db: MySql2Database) {}

    public async getAll (): Promise<UserSchemaSelectType[]> {
        const data = await this.db.select().from(users)

        return UserSchemaSelect.array().parse(data)
    }

    public async get (id: string): Promise<UserSchemaSelectType> {
        const data = await this.db.select().from(users).where(eq(users.id, parseInt(id)))

        if (data.length === 0) {
            throw new NotFoundError('User not found')
        }

        return UserSchemaSelect.parse(data)
    }

    public async create (name: string, email: string, password: string): Promise<any> {
        const data = await this.db.insert(users).values({ name, email, password, group_id: 1 })

        return {
            id: data[0].insertId,
            name,
            email,
            password
        }
    }

    public async update (id: string, { name, user_name, password }: { name?: string, user_name?: string, password?: string }): Promise<any> {
        throw new Error('Method not implemented.')
        // const updateFields = []
        // const updateValues = []

        // if (name != null) {
        //     updateFields.push('name = ?')
        //     updateValues.push(name)
        // }

        // if (user_name != null) {
        //     updateFields.push('user_name = ?')
        //     updateValues.push(user_name)
        // }

        // if (password != null) {
        //     updateFields.push('password = ?')
        //     updateValues.push(password)
        // }

        // if (updateFields.length === 0) {
        //     throw new Error('At least one field must be provided to update')
        // }

        // const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`
        // await this.db.query(query, [...updateValues, id])

        // return {
        //     id,
        //     name,
        //     user_name,
        //     password
        // }
    }

    public async delete (id: string): Promise<any> {
        const data = await this.db.delete(users).where(eq(users.id, parseInt(id)))

        return {
            id: data[0].insertId
        }
    }
}

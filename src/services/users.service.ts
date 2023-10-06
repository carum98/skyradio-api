import { Request } from 'express'

import { UserRepository } from '@repositories/users.repository'
import { IService } from './service'
import { IUser } from '@models/users.model'

export class UserService implements IService<IUser> {
    constructor (private readonly repository: UserRepository) {}

    public async getAll (): Promise<IUser[]> {
        return await this.repository.getAll()
    }

    public async get (req: Request): Promise<IUser> {
        const { id } = req.params

        return await this.repository.get(id)
    }

    public async create (req: Request): Promise<IUser> {
        const { name, user_name, password } = req.body

        return await this.repository.create(name, user_name, password)
    }

    public async update (req: Request): Promise<IUser> {
        const { id } = req.params
        const { name, user_name, password } = req.body

        return await this.repository.update(id, { name, user_name, password })
    }

    public async delete (req: Request): Promise<IUser> {
        const { id } = req.params

        await this.repository.delete(id)

        const data = await this.repository.get(id)

        return data
    }
}

import { Request } from 'express'

import { IService } from './service'
import { UserRepository } from '@repositories/users.repository'
import { UserSchemaSelectType } from '@models/users.model'

export class UserService implements IService<UserSchemaSelectType> {
    constructor (private readonly repository: UserRepository) {}

    public async getAll (): Promise<UserSchemaSelectType[]> {
        return await this.repository.getAll()
    }

    public async get (req: Request): Promise<UserSchemaSelectType> {
        const { id } = req.params

        return await this.repository.get(id)
    }

    public async create (req: Request): Promise<UserSchemaSelectType> {
        throw new Error('Method not implemented.')
    }

    public async update (req: Request): Promise<UserSchemaSelectType> {
        throw new Error('Method not implemented.')
    }

    public async delete (req: Request): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
}

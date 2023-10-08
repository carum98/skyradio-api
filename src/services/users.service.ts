import { Request } from 'express'

import { IService } from './service'
import { UserRepository } from '@repositories/users.repository'
import { UserSchemaResponse, UserSchemaResponseType } from '@models/users.shema'

export class UserService implements IService<UserSchemaResponseType> {
    constructor (private readonly repository: UserRepository) {}

    public async getAll (): Promise<UserSchemaResponseType[]> {
        const response = await this.repository.getAll()

        return UserSchemaResponse.array().parse(response)
    }

    public async get (req: Request): Promise<UserSchemaResponseType> {
        const { id } = req.params

        const response = await this.repository.get(id)

        return UserSchemaResponse.parse(response)
    }

    public async create (req: Request): Promise<UserSchemaResponseType> {
        throw new Error('Method not implemented.')
    }

    public async update (req: Request): Promise<UserSchemaResponseType> {
        throw new Error('Method not implemented.')
    }

    public async delete (req: Request): Promise<UserSchemaResponseType> {
        throw new Error('Method not implemented.')
    }
}

import { UserRepository } from '@repositories/users.repository'
import { UserSchemaCreateType, UserSchemaSelectType, UserSchemaUpdateType } from '@models/users.model'
import { NotFoundError } from '@/utils/errors'
import { generatePassword } from '@/utils/hashed-password'

export class UserService {
    constructor (private readonly repository: UserRepository) {}

    public async getAll (): Promise<UserSchemaSelectType[]> {
        return await this.repository.getAll()
    }

    public async get (id: number): Promise<UserSchemaSelectType> {
        const user = await this.repository.get(id)

        if (user === null) {
            throw new NotFoundError('User not found')
        }

        return user
    }

    public async create (params: UserSchemaCreateType): Promise<UserSchemaSelectType> {
        const id = await this.repository.create({
            ...params,
            password: await generatePassword(params.password)
        })

        return await this.get(id)
    }

    public async update (id: number, params: UserSchemaUpdateType): Promise<UserSchemaSelectType> {
        const updateId = await this.repository.update(id, {
            ...params,
            password: params.password != null ? await generatePassword(params.password) : undefined
        })

        return await this.get(updateId)
    }

    public async delete (id: number): Promise<boolean> {
        return await this.repository.delete(id)
    }
}

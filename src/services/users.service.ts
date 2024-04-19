import { UserRepository } from '@repositories/users.repository'
import { UserSchemaCreateType, UserSchemaSelect, UserSchemaSelectPaginated, UserSchemaSelectPaginatedType, UserSchemaSelectType, UserSchemaUpdateType } from '@models/users.model'
import { generatePassword } from '@/utils/hashed-password'
import { PaginationSchemaType } from '@/utils/pagination'

export class UserService {
    constructor (private readonly repository: UserRepository) {}

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<UserSchemaSelectPaginatedType> {
        const data = await this.repository.getAll(group_id, query)

        return UserSchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<UserSchemaSelectType> {
        const data = await this.repository.get(code)

        return UserSchemaSelect.parse(data)
    }

    public async create (params: UserSchemaCreateType): Promise<UserSchemaSelectType> {
        const id = await this.repository.create({
            ...params,
            password: await generatePassword(params.password),
            role: params.user_role
        })

        return await this.get(id)
    }

    public async update (code: string, params: UserSchemaUpdateType): Promise<UserSchemaSelectType> {
        const updateId = await this.repository.update(code, {
            name: params.name,
            email: params.email,
            password: params.password !== undefined ? await generatePassword(params.password) : undefined,
            role: params.user_role
        })

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }
}

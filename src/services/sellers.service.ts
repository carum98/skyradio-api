import { DataSource } from '@/core/data-source.core'
import { PaginationSchemaType } from '@/utils/pagination'
import { SellersSchemaCreateType, SellersSchemaSelectPaginatedType, SellersSchemaSelectType, SellersSchemaUpdateType } from '@models/sellers.model'
import { SellersRepository } from '@repositories/sellers.repository'
import { UserRepository } from '@repositories/users.repository'

export class SellersService {
    private readonly repository: SellersRepository
    private readonly users: UserRepository

    constructor (datasource: DataSource) {
        this.repository = datasource.create(SellersRepository)
        this.users = datasource.create(UserRepository)
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<SellersSchemaSelectPaginatedType> {
        return await this.repository.getAll(group_id, query)
    }

    public async get (code: string): Promise<SellersSchemaSelectType> {
        return await this.repository.get(code)
    }

    public async create (params: SellersSchemaCreateType): Promise<SellersSchemaSelectType> {
        const { user_id } = await this.findIdsByCodes(params)

        const code = await this.repository.create({
            ...params,
            user_id
        })

        return await this.get(code)
    }

    public async update (code: string, params: SellersSchemaUpdateType): Promise<SellersSchemaSelectType> {
        const { user_id } = await this.findIdsByCodes(params)

        const updateId = await this.repository.update(code, {
            name: params.name,
            user_id
        })

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }

    private async findIdsByCodes ({ user_code }: { user_code?: string }): Promise<{ user_id?: number }> {
        const user_id = user_code !== undefined
            ? await this.users.getId(user_code)
            : undefined

        return {
            user_id
        }
    }
}

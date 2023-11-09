import { ClientsModalitySchemaUpdateType } from '@/models/clients_modality.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { SellersSchemaCreateType, SellersSchemaSelectPaginatedType, SellersSchemaSelectType } from '@models/sellers.model'
import { SellersRepository } from '@/repositories/sellers.repository'

export class SellersService {
    constructor (public readonly repository: SellersRepository) {}

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<SellersSchemaSelectPaginatedType> {
        return await this.repository.getAll(group_id, query)
    }

    public async get (code: string): Promise<SellersSchemaSelectType> {
        return await this.repository.get(code)
    }

    public async create (params: SellersSchemaCreateType): Promise<SellersSchemaSelectType> {
        const code = await this.repository.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: ClientsModalitySchemaUpdateType): Promise<SellersSchemaSelectType> {
        const updateId = await this.repository.update(code, params)

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }
}

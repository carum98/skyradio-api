import { ClientsModalitySchemaUpdateType } from '@/models/clients_modality.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { ClientsSellerSchemaCreateType, ClientsSellerSchemaSelectPaginatedType, ClientsSellerSchemaSelectType } from '@models/clients_seller.model'
import { ClientsSellerRepository } from '@repositories/clients_seller.repository'

export class ClientsSellerService {
    constructor (public readonly repository: ClientsSellerRepository) {}

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<ClientsSellerSchemaSelectPaginatedType> {
        return await this.repository.getAll(group_id, query)
    }

    public async get (code: string): Promise<ClientsSellerSchemaSelectType> {
        return await this.repository.get(code)
    }

    public async create (params: ClientsSellerSchemaCreateType): Promise<ClientsSellerSchemaSelectType> {
        const code = await this.repository.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: ClientsModalitySchemaUpdateType): Promise<ClientsSellerSchemaSelectType> {
        const updateId = await this.repository.update(code, params)

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }
}

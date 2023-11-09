import { PaginationSchemaType } from '@/utils/pagination'
import { ClientsModalitySchemaCreateType, ClientsModalitySchemaSelectPaginatedType, ClientsModalitySchemaSelectType, ClientsModalitySchemaUpdateType } from '@/models/clients_modality.model'
import { ClientsModalityRepository } from '@/repositories/clients_modality.repository'

export class ClientsModalityService {
    constructor (private readonly repository: ClientsModalityRepository) {}

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<ClientsModalitySchemaSelectPaginatedType> {
        return await this.repository.getAll(group_id, query)
    }

    public async get (code: string): Promise<ClientsModalitySchemaSelectType> {
        return await this.repository.get(code)
    }

    public async create (params: ClientsModalitySchemaCreateType): Promise<ClientsModalitySchemaSelectType> {
        const code = await this.repository.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: ClientsModalitySchemaUpdateType): Promise<ClientsModalitySchemaSelectType> {
        const data = await this.repository.update(code, params)

        return await this.get(data)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }
}

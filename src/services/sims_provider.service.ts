import { SimsProviderShemaCreateType, SimsProviderShemaSelect, SimsProviderShemaSelectPaginated, SimsProviderShemaSelectPaginatedType, SimsProviderShemaSelectType, SimsProviderShemaUpdateType } from '@/models/sims_provider.model'
import { SimsProviderRepository } from '@/repositories/sims_provider.repository'
import { PaginationSchemaType } from '@/utils/pagination'

export class SimsProviderService {
    constructor (public readonly repository: SimsProviderRepository) {}

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<SimsProviderShemaSelectPaginatedType> {
        const data = await this.repository.getAll(group_id, query)

        return SimsProviderShemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<SimsProviderShemaSelectType> {
        const data = await this.repository.get(code)

        return SimsProviderShemaSelect.parse(data)
    }

    public async create (params: SimsProviderShemaCreateType): Promise<SimsProviderShemaSelectType> {
        const code = await this.repository.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: SimsProviderShemaUpdateType): Promise<SimsProviderShemaSelectType> {
        const updateId = await this.repository.update(code, params)

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }
}

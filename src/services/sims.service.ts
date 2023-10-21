import { PaginationSchemaType } from '@/utils/pagination'
import { SimsSchemaSelectPaginatedType, SimsShemaCreateType, SimsShemaSelectType, SimsShemaUpdateType } from '@models/sims.model'
import { SimsRepository } from '@repositories/sims.repository'

export class SimsService {
    constructor (public readonly repository: SimsRepository) {}

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<SimsSchemaSelectPaginatedType> {
        return await this.repository.getAll(group_id, query)
    }

    public async get (code: string): Promise<SimsShemaSelectType> {
        return await this.repository.get(code)
    }

    public async create (params: SimsShemaCreateType): Promise<SimsShemaSelectType> {
        const code = await this.repository.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: SimsShemaUpdateType): Promise<SimsShemaSelectType> {
        const updateId = await this.repository.update(code, params)

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }
}

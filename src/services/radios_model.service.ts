import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosModelShemaCreateType, RadiosModelShemaSelect, RadiosModelShemaSelectPaginated, RadiosModelShemaSelectPaginatedType, RadiosModelShemaSelectType, RadiosModelShemaUpdateType } from '@models/radios_model.model'
import { RadiosModelRepository } from '@repositories/radios_model.repository'

export class RadiosModelService {
    constructor (private readonly repository: RadiosModelRepository) { }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<RadiosModelShemaSelectPaginatedType> {
        const data = await this.repository.getAll(group_id, query)

        return RadiosModelShemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<RadiosModelShemaSelectType> {
        const data = await this.repository.get(code)

        return RadiosModelShemaSelect.parse(data)
    }

    public async create (params: RadiosModelShemaCreateType): Promise<RadiosModelShemaSelectType> {
        const code = await this.repository.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: RadiosModelShemaUpdateType): Promise<RadiosModelShemaSelectType> {
        const updateId = await this.repository.update(code, params)

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }
}

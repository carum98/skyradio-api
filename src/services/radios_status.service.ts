import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosStatusShemaCreateType, RadiosStatusShemaSelect, RadiosStatusShemaSelectPaginated, RadiosStatusShemaSelectPaginatedType, RadiosStatusShemaSelectType, RadiosStatusShemaUpdateType } from '@models/radios_status.model'
import { RadiosStatusRepository } from '@repositories/radios_status.repository'

export class RadiosStatusService {
    constructor (public readonly repository: RadiosStatusRepository) {}

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<RadiosStatusShemaSelectPaginatedType> {
        const data = await this.repository.getAll(group_id, query)

        return RadiosStatusShemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<RadiosStatusShemaSelectType> {
        const data = await this.repository.get(code)

        return RadiosStatusShemaSelect.parse(data)
    }

    public async create (params: RadiosStatusShemaCreateType): Promise<RadiosStatusShemaSelectType> {
        const code = await this.repository.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: RadiosStatusShemaUpdateType): Promise<RadiosStatusShemaSelectType> {
        const updatecode = await this.repository.update(code, params)

        return await this.get(updatecode)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }
}

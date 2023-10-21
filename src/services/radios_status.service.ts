import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosStatusShemaCreateType, RadiosStatusShemaSelectPaginatedType, RadiosStatusShemaSelectType, RadiosStatusShemaUpdateType } from '@models/radios_status.model'
import { RadiosStatusRepository } from '@repositories/radios_status.repository'

export class RadiosStatusService {
    constructor (public readonly repository: RadiosStatusRepository) {}

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<RadiosStatusShemaSelectPaginatedType> {
        return await this.repository.getAll(group_id, query)
    }

    public async get (code: string): Promise<RadiosStatusShemaSelectType> {
        return await this.repository.get(code)
    }

    public async create (params: RadiosStatusShemaCreateType): Promise<RadiosStatusShemaSelectType> {
        const code = await this.repository.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: RadiosStatusShemaUpdateType): Promise<RadiosStatusShemaSelectType> {
        const updateId = await this.repository.update(code, params)

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }
}

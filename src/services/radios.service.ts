import { NotFoundError } from '@/utils/errors'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosSchemaCreateType, RadiosSchemaSelectPaginatedType, RadiosSchemaSelectType, RadiosSchemaUpdateType } from '@models/radios.model'
import { RadiosRepository } from '@repositories/radios.repository'

export class RadiosService {
    constructor (private readonly repository: RadiosRepository) {}

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<RadiosSchemaSelectPaginatedType> {
        return await this.repository.getAll(group_id, query)
    }

    public async get (code: string): Promise<RadiosSchemaSelectType> {
        const radio = await this.repository.get(code)

        if (radio === null) {
            throw new NotFoundError('Radio not found')
        }

        return radio
    }

    public async create (params: RadiosSchemaCreateType): Promise<RadiosSchemaSelectType> {
        const code = await this.repository.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: RadiosSchemaUpdateType): Promise<RadiosSchemaSelectType> {
        const updateId = await this.repository.update(code, params)

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }
}

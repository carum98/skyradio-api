import { DataSource } from '@/core/data-source.core'
import { SimsProviderRepository } from '@/repositories/sims_provider.repository'
import { PaginationSchemaType } from '@/utils/pagination'
import { SimsSchemaSelectPaginated, SimsSchemaSelectPaginatedType, SimsShemaCreateType, SimsShemaSelect, SimsShemaSelectType, SimsShemaUpdateType } from '@models/sims.model'
import { SimsRepository } from '@repositories/sims.repository'

export class SimsService {
    private readonly sims: SimsRepository
    private readonly provider: SimsProviderRepository

    constructor (datasource: DataSource) {
        this.sims = datasource.create(SimsRepository)
        this.provider = datasource.create(SimsProviderRepository)
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<SimsSchemaSelectPaginatedType> {
        const data = await this.sims.getAll(group_id, query)

        return SimsSchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<SimsShemaSelectType> {
        const data = await this.sims.get(code)

        return SimsShemaSelect.parse(data)
    }

    public async create (params: SimsShemaCreateType): Promise<SimsShemaSelectType> {
        const { provider_id = 0 } = await this.findIdsByCodes(params)

        const code = await this.sims.create({
            number: params.number,
            group_id: params.group_id,
            serial: params.serial,
            provider_id
        })

        return await this.get(code)
    }

    public async update (code: string, params: SimsShemaUpdateType): Promise<SimsShemaSelectType> {
        const { provider_id } = await this.findIdsByCodes(params)

        const updateId = await this.sims.update(code, {
            number: params.number,
            serial: params.serial,
            provider_id
        })

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.sims.delete(code)
    }

    private async findIdsByCodes ({ provider_code }: { provider_code?: string }): Promise<{ provider_id?: number }> {
        const provider_id = provider_code !== undefined
            ? await this.provider.getId(provider_code)
            : undefined

        return {
            provider_id
        }
    }
}

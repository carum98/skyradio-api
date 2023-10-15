import { NotFoundError } from '@/utils/errors'
import { SimsProviderShemaCreateType, SimsProviderShemaSelectType, SimsProviderShemaUpdateType } from '@/models/sims_provider.model'
import { SimsProviderRepository } from '@/repositories/sims_provider.repository'

export class SimsProviderService {
    constructor (public readonly repository: SimsProviderRepository) {}

    public async getAll (group_id: number): Promise<SimsProviderShemaSelectType[]> {
        return await this.repository.getAll(group_id)
    }

    public async get (code: string): Promise<SimsProviderShemaSelectType> {
        const provider = await this.repository.get(code)

        if (provider === null) {
            throw new NotFoundError('Provider not found')
        }

        return provider
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

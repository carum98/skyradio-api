import { DataSource } from '@/core/data-source.core'
import { RadiosSchemaSelect, RadiosSchemaSelectType } from '@models/radios.model'
import { RadiosRepository } from '@repositories/radios.repository'
import { SimsProviderRepository } from '@repositories/sims_provider.repository'
import { NotFoundError } from '@/utils/errors'
import { PaginationSchemaType } from '@/utils/pagination'
import { SimsRadioSchemaType, SimsSchemaSelectPaginated, SimsSchemaSelectPaginatedType, SimsShemaCreateType, SimsShemaSelect, SimsShemaSelectType, SimsShemaUpdateType } from '@models/sims.model'
import { SimsRepository } from '@repositories/sims.repository'

export class SimsService {
    private readonly sims: SimsRepository
    private readonly radios: RadiosRepository
    private readonly provider: SimsProviderRepository

    constructor (datasource: DataSource) {
        this.sims = datasource.create(SimsRepository)
        this.radios = datasource.create(RadiosRepository)
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

    public async getRadio (code: string): Promise<RadiosSchemaSelectType> {
        const sim = await this.sims.get(code)

        if (sim.radio === null) {
            throw new NotFoundError('Sim without radio')
        }

        const data = await this.radios.get(sim.radio.code)

        return RadiosSchemaSelect.parse(data)
    }

    public async addRadio (sim_code: string, params: SimsRadioSchemaType): Promise<boolean> {
        const { sim_id = 0 } = await this.findIdsByCodes({ sim_code })

        return await this.radios.addSim(sim_id, params.radio_code)
    }

    public async removeRadio (sim_code: string): Promise<boolean> {
        const radio = await this.getRadio(sim_code)

        return await this.radios.removeSim(radio.code)
    }

    private async findIdsByCodes ({ provider_code, radio_code, sim_code }: { provider_code?: string, radio_code?: string, sim_code?: string }): Promise<{ provider_id?: number, radio_id?: number, sim_id?: number }> {
        const provider_id = provider_code !== undefined
            ? await this.provider.getId(provider_code)
            : undefined

        const radio_id = radio_code !== undefined
            ? await this.radios.getId(radio_code)
            : undefined

        const sim_id = sim_code !== undefined
            ? await this.sims.getId(sim_code)
            : undefined

        return {
            provider_id,
            radio_id,
            sim_id
        }
    }
}

import { DataSource } from '@/core/data-source.core'
import { ClientsRepository } from '@/repositories/clients.repository'
import { RadiosModelRepository } from '@/repositories/radios_model.repository'
import { SimsRepository } from '@/repositories/sims.repository'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosSchemaCreateType, RadiosSchemaSelect, RadiosSchemaSelectPaginated, RadiosSchemaSelectPaginatedType, RadiosSchemaSelectType, RadiosSchemaUpdateType } from '@models/radios.model'
import { RadiosRepository } from '@repositories/radios.repository'

export class RadiosService {
    private readonly radios: RadiosRepository
    private readonly model: RadiosModelRepository
    private readonly status: RadiosModelRepository
    private readonly client: ClientsRepository
    private readonly sim: SimsRepository

    constructor (datasource: DataSource) {
        this.radios = datasource.create(RadiosRepository)
        this.model = datasource.create(RadiosModelRepository)
        this.status = datasource.create(RadiosModelRepository)
        this.client = datasource.create(ClientsRepository)
        this.sim = datasource.create(SimsRepository)
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<RadiosSchemaSelectPaginatedType> {
        const data = await this.radios.getAll(group_id, query)

        return RadiosSchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<RadiosSchemaSelectType> {
        const data = await this.radios.get(code)

        return RadiosSchemaSelect.parse(data)
    }

    public async create (params: RadiosSchemaCreateType): Promise<RadiosSchemaSelectType> {
        const { model_id = 0, status_id, client_id, sim_id } = await this.findIdsByCodes(params)

        const code = await this.radios.create({
            name: params.name,
            imei: params.imei,
            serial: params.serial,
            group_id: params.group_id,
            model_id,
            status_id,
            client_id,
            sim_id
        })

        return await this.get(code)
    }

    public async update (code: string, params: RadiosSchemaUpdateType): Promise<RadiosSchemaSelectType> {
        const { model_id, status_id, client_id, sim_id } = await this.findIdsByCodes(params)

        const updateCode = await this.radios.update(code, {
            name: params.name,
            model_id,
            status_id,
            client_id,
            sim_id
        })

        return await this.get(updateCode)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.radios.delete(code)
    }

    private async findIdsByCodes ({ model_code, status_code, client_code, sim_code }: { model_code?: string, status_code?: string, client_code?: string, sim_code?: string }): Promise<{ model_id?: number, status_id?: number, client_id?: number, sim_id?: number }> {
        const model_id = model_code !== undefined
            ? await this.model.getId(model_code)
            : undefined

        const status_id = status_code !== undefined
            ? await this.status.getId(status_code)
            : undefined

        const client_id = client_code !== undefined
            ? await this.client.getId(client_code)
            : undefined

        const sim_id = sim_code !== undefined
            ? await this.sim.getId(sim_code)
            : undefined

        return {
            model_id,
            status_id,
            client_id,
            sim_id
        }
    }
}

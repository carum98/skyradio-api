import { DataSource } from '@/core/data-source.core'
import { ClientsSchemaSelect, ClientsSchemaSelectType } from '@models/clients.model'
import { ClientsRepository } from '@/repositories/clients.repository'
import { RadiosModelRepository } from '@/repositories/radios_model.repository'
import { SimsRepository } from '@/repositories/sims.repository'
import { NotFoundError } from '@/utils/errors'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosCompanySchemaType, RadiosSchemaCreateType, RadiosSchemaSelect, RadiosSchemaSelectPaginated, RadiosSchemaSelectPaginatedType, RadiosSchemaSelectType, RadiosSchemaUpdateType, RadiosSimsSchemaType } from '@models/radios.model'
import { RadiosRepository } from '@repositories/radios.repository'
import { SimsShemaSelect, SimsShemaSelectType } from '@/models/sims.model'

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

    public async getClients (code: string): Promise<ClientsSchemaSelectType> {
        const radio = await this.radios.get(code)

        if (radio.client === null) {
            throw new NotFoundError('Radio without client')
        }

        const data = await this.client.get(radio.client.code)

        return ClientsSchemaSelect.parse(data)
    }

    public async addClient (code: string, params: RadiosCompanySchemaType): Promise<boolean> {
        const { client_id = 0 } = await this.findIdsByCodes({ client_code: params.client_code })

        return await this.radios.addClient(client_id, [code])
    }

    public async removeClient (code: string): Promise<boolean> {
        const client = await this.getClients(code)
        const { client_id = 0 } = await this.findIdsByCodes({ client_code: client.code })

        return await this.radios.removeClient(client_id, [code])
    }

    public async getSim (code: string): Promise<SimsShemaSelectType> {
        const radio = await this.radios.get(code)

        if (radio.sim === null) {
            throw new NotFoundError('Radio without sim')
        }

        const data = await this.sim.get(radio.sim.code)

        return SimsShemaSelect.parse(data)
    }

    public async addSim (code: string, params: RadiosSimsSchemaType): Promise<boolean> {
        const { sim_id = 0 } = await this.findIdsByCodes({ sim_code: params.sim_code })

        return await this.radios.addSim(sim_id, code)
    }

    public async removeSim (code: string): Promise<boolean> {
        return await this.radios.removeSim(code)
    }

    public async swapSim (code: string, params: RadiosSimsSchemaType): Promise<boolean> {
        const { sim_id = 0 } = await this.findIdsByCodes({ sim_code: params.sim_code })

        return await this.radios.swapSim(code, sim_id)
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

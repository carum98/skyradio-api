import { DataSource } from '@/core/data-source.core'
import { LogsSchemaCreateType, LogsSchemaSelectPaginated, LogsSchemaSelectPaginatedType } from '@models/logs.model'
import { LogsRepository } from '@/repositories/logs.repository'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosRepository } from '@repositories/radios.repository'
import { ClientsRepository } from '@repositories/clients.repository'
import { SimsRepository } from '@repositories/sims.repository'
import { SessionUserInfoSchemaType } from '@/core/auth.shemas'

export class LogsService {
    private readonly logs: LogsRepository
    private readonly radios: RadiosRepository
    private readonly client: ClientsRepository
    private readonly sim: SimsRepository

    constructor (datasource: DataSource) {
        this.logs = datasource.create(LogsRepository)
        this.radios = datasource.create(RadiosRepository)
        this.client = datasource.create(ClientsRepository)
        this.sim = datasource.create(SimsRepository)
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<LogsSchemaSelectPaginatedType> {
        const data = await this.logs.getAll(group_id, query)

        return LogsSchemaSelectPaginated.parse(data)
    }

    public async create (params: Omit<LogsSchemaCreateType, 'user_id' | 'group_id'>, session: SessionUserInfoSchemaType): Promise<void> {
        const { user_id, group_id } = session

        await this.logs.create({
            ...params,
            user_id,
            group_id
        })
    }

    public async createRadio (params: { radio_code: string, session: SessionUserInfoSchemaType }): Promise<void> {
        const { radio_code, session } = params

        const { radio_id = 0 } = await this.findIdsByCodes({ radio_code })

        await this.create({
            action: 'create-radio',
            radio_id
        }, session)
    }

    public async addRadioToClient (params: { radio_code: string, client_code: string, session: SessionUserInfoSchemaType }): Promise<void> {
        const { radio_code, client_code, session } = params

        const { radio_id = 0, client_id = 0 } = await this.findIdsByCodes({ radio_code, client_code })

        await this.create({
            action: 'add-radio-to-client',
            radio_id,
            client_id
        }, session)
    }

    public async removeRadioFromClient (params: { radio_code: string, client_code: string, session: SessionUserInfoSchemaType }): Promise<void> {
        const { radio_code, client_code, session } = params

        const { radio_id = 0, client_id = 0 } = await this.findIdsByCodes({
            radio_code,
            client_code
        })

        await this.create({
            action: 'remove-radio-from-client',
            radio_id,
            client_id
        }, session)
    }

    private async findIdsByCodes ({ client_code, sim_code, radio_code }: { client_code?: string, sim_code?: string, radio_code?: string }): Promise<{ client_id?: number, sim_id?: number, radio_id?: number }> {
        const client_id = client_code !== undefined
            ? await this.client.getId(client_code)
            : undefined

        const sim_id = sim_code !== undefined
            ? await this.sim.getId(sim_code)
            : undefined

        const radio_id = radio_code !== undefined
            ? await this.radios.getId(radio_code)
            : undefined

        return {
            client_id,
            sim_id,
            radio_id
        }
    }
}

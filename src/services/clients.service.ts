import { ClientsSchemaCreateType, ClientsSchemaSelect, ClientsSchemaSelectPaginated, ClientsSchemaSelectPaginatedType, ClientsSchemaSelectType, ClientsSchemaUpdateType, ClientsRadiosSchemaType, ClientRadiosSwapSchemaType, ClientsSchemaStatsByClientType, ClientsSchemaStatsByClient, ClientSchemaStatsType, ClientSchemaStats } from '@models/clients.model'
import { ClientsRepository } from '@/repositories/clients.repository'
import { RadiosRepository } from '@repositories/radios.repository'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosSchemaSelectPaginated, RadiosSchemaSelectPaginatedType } from '@models/radios.model'
import { ClientsModalityRepository } from '@/repositories/clients_modality.repository'
import { DataSource } from '@/core/data-source.core'
import { SellersRepository } from '@repositories/sellers.repository'
import { LogsRepository } from '@repositories/logs.repository'
import { LogsSchemaSelectPaginated, LogsSchemaSelectPaginatedType } from '@/models/logs.model'
import { RadiosModelRepository } from '@repositories/radios_model.repository'
import { SimsProviderRepository } from '@repositories/sims_provider.repository'
import { ClientsConsoleRepository } from '@repositories/clients_console.repository'
import { ConsoleSchemaSelect, ConsoleSchemaSelectType } from '@models/clients_console.model'
import { AppsRepository } from '@repositories/apps.repository'
import { AppsSchemaSelectPaginated, AppsSchemaSelectPaginatedType } from '@models/apps.model'

export class ClientsService {
    private readonly radios: RadiosRepository
    private readonly companies: ClientsRepository
    private readonly modality: ClientsModalityRepository
    private readonly seller: SellersRepository
    private readonly logs: LogsRepository
    private readonly models: RadiosModelRepository
    private readonly providers: SimsProviderRepository
    private readonly console: ClientsConsoleRepository
    private readonly apps: AppsRepository

    constructor (datasource: DataSource) {
        this.radios = datasource.create(RadiosRepository)
        this.companies = datasource.create(ClientsRepository)
        this.modality = datasource.create(ClientsModalityRepository)
        this.seller = datasource.create(SellersRepository)
        this.logs = datasource.create(LogsRepository)
        this.models = datasource.create(RadiosModelRepository)
        this.providers = datasource.create(SimsProviderRepository)
        this.console = datasource.create(ClientsConsoleRepository)
        this.apps = datasource.create(AppsRepository)
    }

    public async getAll (params: { group_id: number, user_id?: number }, query: PaginationSchemaType): Promise<ClientsSchemaSelectPaginatedType> {
        const { group_id, user_id } = params
        const data = await this.companies.getAll({ group_id, user_id }, query)

        return ClientsSchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<ClientsSchemaSelectType> {
        const data = await this.companies.get(code)

        return ClientsSchemaSelect.parse(data)
    }

    public async create (params: ClientsSchemaCreateType): Promise<ClientsSchemaSelectType> {
        const { modality_id = 0, seller_id } = await this.findIdsByCodes(params)

        const code = await this.companies.create({
            ...params,
            modality_id,
            seller_id
        })

        return await this.get(code)
    }

    public async update (code: string, params: ClientsSchemaUpdateType): Promise<ClientsSchemaSelectType> {
        const { modality_id, seller_id } = await this.findIdsByCodes(params)

        const updateId = await this.companies.update(code, {
            name: params.name,
            color: params.color,
            modality_id,
            seller_id
        })

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.companies.delete(code)
    }

    public async getRadios (client_code: string, query: PaginationSchemaType): Promise<RadiosSchemaSelectPaginatedType> {
        const { client_id = 0 } = await this.findIdsByCodes({ client_code })

        const data = await this.radios.getAll({ client_id }, query)

        return RadiosSchemaSelectPaginated.parse(data)
    }

    public async addRadios (code: string, params: ClientsRadiosSchemaType): Promise<boolean> {
        const { client_id = 0 } = await this.findIdsByCodes({ client_code: code })

        return await this.radios.addClient(client_id, params.radios_codes)
    }

    public async swapRadios (code: string, params: ClientRadiosSwapSchemaType): Promise<boolean> {
        const { client_id = 0 } = await this.findIdsByCodes({ client_code: code })

        return await this.radios.swapClient(client_id, params.radio_code_from, params.radio_code_to)
    }

    public async removeRadios (code: string, params: ClientsRadiosSchemaType): Promise<boolean> {
        const { client_id = 0 } = await this.findIdsByCodes({ client_code: code })

        return await this.radios.removeClient(client_id, params.radios_codes)
    }

    public async getLogs (code: string, query: PaginationSchemaType): Promise<LogsSchemaSelectPaginatedType> {
        const { client_id = 0 } = await this.findIdsByCodes({ client_code: code })

        const data = await this.logs.getAll({ client_id }, query)

        return LogsSchemaSelectPaginated.parse(data)
    }

    public async getApps (client_code: string, query: PaginationSchemaType): Promise<AppsSchemaSelectPaginatedType> {
        const { client_id = 0 } = await this.findIdsByCodes({ client_code })

        const data = await this.apps.getAll({ client_id }, query)

        return AppsSchemaSelectPaginated.parse(data)
    }

    public async getStatsByClient (client_code: string): Promise<ClientsSchemaStatsByClientType> {
        const { client_id = 0 } = await this.findIdsByCodes({ client_code })

        const [models, sims_providers] = await Promise.all([
            this.models.countByClient(client_id),
            this.providers.countByClient(client_id)
        ])

        return ClientsSchemaStatsByClient.parse({
            models,
            sims_providers
        })
    }

    public async getStats (group_id: number): Promise<ClientSchemaStatsType> {
        const [sellers, modality, clients] = await Promise.all([
            this.seller.countAll(group_id),
            this.modality.countAll(group_id),
            this.companies.countAll(group_id)
        ])

        return ClientSchemaStats.parse({
            sellers,
            modality,
            clients
        })
    }

    public async getConsole (client_code: string): Promise<ConsoleSchemaSelectType> {
        const { client_id = 0 } = await this.findIdsByCodes({ client_code })

        const data = await this.console.getByClient(client_id)

        return ConsoleSchemaSelect.parse(data)
    }

    private async findIdsByCodes ({ modality_code, seller_code, client_code }: { modality_code?: string, seller_code?: string, client_code?: string }): Promise<{ modality_id?: number, seller_id?: number, client_id?: number }> {
        const modality_id = modality_code !== undefined
            ? await this.modality.getId(modality_code)
            : undefined

        const seller_id = seller_code !== undefined
            ? await this.seller.getId(seller_code)
            : undefined

        const client_id = client_code !== undefined
            ? await this.companies.getId(client_code)
            : undefined

        return { modality_id, seller_id, client_id }
    }
}

import { DataSource } from '@/core/data-source.core'
import { ReportsSchemaClientsType, ReportsSchemaInventoryType, ReportsSchemaModelsType, ReportsSchemaSellersType, ReportsSchemaSimsProviderType } from '@models/reports.model'
import { ClientsRepository } from '@repositories/clients.repository'
import { RadiosRepository } from '@repositories/radios.repository'
import { RadiosModelRepository } from '@repositories/radios_model.repository'
import { SellersRepository } from '@repositories/sellers.repository'
import { SimsProviderRepository } from '@repositories/sims_provider.repository'
import { SimsRepository } from '@repositories/sims.repository'

import * as ClientsReports from '@/reports/clients.reports'
import * as ModelsReports from '@/reports/models.reports'
import * as SellersReports from '@/reports/sellers.reports'
import * as SimsProviderReports from '@/reports/sim_provider.reports'
import * as InventoryReports from '@/reports/inventory.reports'

export class ReportsService {
    private readonly client: ClientsRepository
    private readonly radios: RadiosRepository
    private readonly model: RadiosModelRepository
    private readonly seller: SellersRepository
    private readonly sims: SimsRepository
    private readonly provider: SimsProviderRepository

    constructor (datasource: DataSource) {
        this.client = datasource.create(ClientsRepository)
        this.radios = datasource.create(RadiosRepository)
        this.model = datasource.create(RadiosModelRepository)
        this.seller = datasource.create(SellersRepository)
        this.sims = datasource.create(SimsRepository)
        this.provider = datasource.create(SimsProviderRepository)
    }

    public async clients (group_id: number, params: ReportsSchemaClientsType): Promise<Buffer> {
        const client = await this.client.get(params.client_code)
        const radios = await this.radios.getAllBy(group_id, {
            client_code: params.client_code
        })

        if (params.format === 'xlsx') {
            return await ClientsReports.xlsx(client, radios.data)
        } else if (params.format === 'csv') {
            return await ClientsReports.csv(radios.data)
        } else if (params.format === 'pdf') {
            return await ClientsReports.pdf(client, radios.data)
        } else {
            throw new Error('Formato inválido')
        }
    }

    public async models (group_id: number, params: ReportsSchemaModelsType): Promise<Buffer> {
        const modelInfo = await this.model.get(params.model_code)
        const radios = await this.radios.getAllBy(group_id, {
            model_code: params.model_code
        })

        if (params.format === 'xlsx') {
            return await ModelsReports.xlsx(modelInfo, radios.data)
        } else if (params.format === 'csv') {
            return ModelsReports.csv(radios.data)
        } else if (params.format === 'pdf') {
            return await ModelsReports.pdf(modelInfo, radios.data)
        } else {
            throw new Error('Formato inválido')
        }
    }

    public async sellers (group_id: number, params: ReportsSchemaSellersType): Promise<Buffer> {
        const seller = await this.seller.get(params.seller_code)
        const clients = await this.client.getAllBy(group_id, {
            seller_code: params.seller_code
        })

        if (params.format === 'xlsx') {
            return await SellersReports.xlsx(seller, clients.data)
        } else if (params.format === 'csv') {
            return SellersReports.csv(clients.data)
        } else if (params.format === 'pdf') {
            return await SellersReports.pdf(seller, clients.data)
        } else {
            throw new Error('Formato inválido')
        }
    }

    public async simsProvider (group_id: number, params: ReportsSchemaSimsProviderType): Promise<Buffer> {
        const provider = await this.provider.get(params.provider_code)
        const sims = await this.sims.getAllBy(group_id, {
            provider_code: params.provider_code
        })

        if (params.format === 'xlsx') {
            return await SimsProviderReports.xlsx(provider, sims.data)
        } else if (params.format === 'csv') {
            return SimsProviderReports.csv(sims.data)
        } else if (params.format === 'pdf') {
            return await SimsProviderReports.pdf(provider, sims.data)
        } else {
            throw new Error('Formato inválido')
        }
    }

    public async inventory (group_id: number, params: ReportsSchemaInventoryType): Promise<Buffer> {
        const radios = await this.radios.getAllBy(group_id, { available: true })

        if (params.format === 'xlsx') {
            return await InventoryReports.xlsx(radios.data)
        } else if (params.format === 'csv') {
            return await InventoryReports.csv(radios.data)
        } else if (params.format === 'pdf') {
            return await InventoryReports.pdf(radios.data)
        } else {
            throw new Error('Formato inválido')
        }
    }
}

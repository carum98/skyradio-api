import { ClientsSchemaCreateType, ClientsSchemaSelect, ClientsSchemaSelectPaginated, ClientsSchemaSelectPaginatedType, ClientsSchemaSelectType, ClientsSchemaUpdateType, ClientsRadiosSchemaType, ClientRadiosSwapSchemaType, ClientsExportType } from '@models/clients.model'
import { ClientsRepository } from '@/repositories/clients.repository'
import { RadiosRepository } from '@repositories/radios.repository'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosSchemaSelectPaginated, RadiosSchemaSelectPaginatedType } from '@models/radios.model'
import { ClientsModalityRepository } from '@/repositories/clients_modality.repository'
import { DataSource } from '@/core/data-source.core'
import { SellersRepository } from '@repositories/sellers.repository'
import { LogsRepository } from '@repositories/logs.repository'
import { LogsSchemaSelectPaginated, LogsSchemaSelectPaginatedType } from '@/models/logs.model'
import XLSX from 'xlsx'

export class ClientsService {
    private readonly radios: RadiosRepository
    private readonly companies: ClientsRepository
    private readonly modality: ClientsModalityRepository
    private readonly seller: SellersRepository
    private readonly logs: LogsRepository

    constructor (datasource: DataSource) {
        this.radios = datasource.create(RadiosRepository)
        this.companies = datasource.create(ClientsRepository)
        this.modality = datasource.create(ClientsModalityRepository)
        this.seller = datasource.create(SellersRepository)
        this.logs = datasource.create(LogsRepository)
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<ClientsSchemaSelectPaginatedType> {
        const data = await this.companies.getAll(group_id, query)

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

    public async getRadios (code: string, query: PaginationSchemaType): Promise<RadiosSchemaSelectPaginatedType> {
        const data = await this.radios.getByClient(code, query)

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

    public async export (code: string, params: ClientsExportType): Promise<Buffer> {
        const client = await this.get(code)
        const radios = await this.getRadios(code, { page: 1, per_page: 1000 })

        const data = radios.data.map(radio => ({
            ...radio,
            model: radio.model.name,
            status: radio.status?.name ?? '-',
            sim: radio.sim?.number ?? '-'
        }))

        const ws = XLSX.utils.json_to_sheet(data, {
            origin: 'A2'
        })

        XLSX.utils.sheet_add_aoa(ws, [
            ['Cliente', client.name]
        ], { origin: 'A1' })

        const wb = XLSX.utils.book_new()

        XLSX.utils.book_append_sheet(wb, ws, 'Data')

        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

        return buf
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

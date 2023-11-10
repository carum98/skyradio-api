import { ClientsSchemaCreateType, ClientsSchemaSelect, ClientsSchemaSelectPaginated, ClientsSchemaSelectPaginatedType, ClientsSchemaSelectType, ClientsSchemaUpdateType, ClientsRadiosSchemaType, ClientRadiosSwapSchemaType } from '@models/clients.model'
import { ClientsRepository } from '@/repositories/clients.repository'
import { RadiosRepository } from '@repositories/radios.repository'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosSchemaSelectPaginated, RadiosSchemaSelectPaginatedType } from '@models/radios.model'
import { ClientsModalityRepository } from '@/repositories/clients_modality.repository'
import { DataSource } from '@/core/data-source.core'
import { SellersRepository } from '@/repositories/sellers.repository'

export class ClientsService {
    private readonly radios: RadiosRepository
    private readonly companies: ClientsRepository
    private readonly modality: ClientsModalityRepository
    private readonly seller: SellersRepository

    constructor (datasource: DataSource) {
        this.radios = datasource.create(RadiosRepository)
        this.companies = datasource.create(ClientsRepository)
        this.modality = datasource.create(ClientsModalityRepository)
        this.seller = datasource.create(SellersRepository)
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
        const { company_id = 0 } = await this.findIdsByCodes({ company_code: code })

        return await this.radios.addClient(company_id, params.radios_codes)
    }

    public async swapRadios (code: string, params: ClientRadiosSwapSchemaType): Promise<boolean> {
        const { company_id = 0 } = await this.findIdsByCodes({ company_code: code })

        return await this.radios.swapClient(company_id, params.radio_code_from, params.radio_code_to)
    }

    public async removeRadios (code: string, params: ClientsRadiosSchemaType): Promise<boolean> {
        const { company_id = 0 } = await this.findIdsByCodes({ company_code: code })

        return await this.radios.removeClient(company_id, params.radios_codes)
    }

    private async findIdsByCodes ({ modality_code, seller_code, company_code }: { modality_code?: string, seller_code?: string, company_code?: string }): Promise<{ modality_id?: number, seller_id?: number, company_id?: number }> {
        const modality_id = modality_code !== undefined
            ? await this.modality.getId(modality_code)
            : undefined

        const seller_id = seller_code !== undefined
            ? await this.seller.getId(seller_code)
            : undefined

        const company_id = company_code !== undefined
            ? await this.companies.getId(company_code)
            : undefined

        return { modality_id, seller_id, company_id }
    }
}

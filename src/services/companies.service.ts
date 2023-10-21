import { CompanySchemaCreateType, CompanySchemaSelect, CompanySchemaSelectPaginated, CompanySchemaSelectPaginatedType, CompanySchemaSelectType, CompanySchemaUpdateType } from '@models/companies.model'
import { CompaniesRepository } from '@repositories/companies.repository'
import { RadiosRepository } from '@repositories/radios.repository'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosSchemaSelectPaginatedType } from '@models/radios.model'
import { CompaniesModalityRepository } from '@/repositories/companies_modality.repository'
import { DataSource } from '@/core/data-source.core'
import { CompaniesSellerRepository } from '@/repositories/companies_seller.repository'

export class CompaniesService {
    private readonly radios: RadiosRepository
    private readonly companies: CompaniesRepository
    private readonly modality: CompaniesModalityRepository
    private readonly seller: CompaniesSellerRepository

    constructor (datasource: DataSource) {
        this.radios = datasource.create(RadiosRepository)
        this.companies = datasource.create(CompaniesRepository)
        this.modality = datasource.create(CompaniesModalityRepository)
        this.seller = datasource.create(CompaniesSellerRepository)
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<CompanySchemaSelectPaginatedType> {
        const data = await this.companies.getAll(group_id, query)

        return CompanySchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<CompanySchemaSelectType> {
        const data = await this.companies.get(code)

        return CompanySchemaSelect.parse(data)
    }

    public async create (params: CompanySchemaCreateType): Promise<CompanySchemaSelectType> {
        const { modality_id = 0, seller_id } = await this.findIdsByCodes(params)

        const code = await this.companies.create({
            ...params,
            modality_id,
            seller_id
        })

        return await this.get(code)
    }

    public async update (code: string, params: CompanySchemaUpdateType): Promise<CompanySchemaSelectType> {
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
        return await this.radios.getByCompany(code, query)
    }

    private async findIdsByCodes ({ modality_code, seller_code }: { modality_code?: string, seller_code?: string }): Promise<{ modality_id?: number, seller_id?: number }> {
        const modality_id = modality_code !== undefined
            ? await this.modality.getId(modality_code)
            : undefined

        const seller_id = seller_code !== undefined
            ? await this.seller.getId(seller_code)
            : undefined

        return { modality_id, seller_id }
    }
}

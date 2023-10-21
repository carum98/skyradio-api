import { CompanyModalitySchemaUpdateType } from '@/models/companies_modality.model'
import { NotFoundError } from '@/utils/errors'
import { PaginationSchemaType } from '@/utils/pagination'
import { CompanySellerSchemaCreateType, CompanySellerSchemaSelectPaginatedType, CompanySellerSchemaSelectType } from '@models/companies_seller.model'
import { CompaniesSellerRepository } from '@repositories/companies_seller.repository'

export class CompaniesSellerService {
    constructor (public readonly repository: CompaniesSellerRepository) {}

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<CompanySellerSchemaSelectPaginatedType> {
        return await this.repository.getAll(group_id, query)
    }

    public async get (code: string): Promise<CompanySellerSchemaSelectType> {
        const seller = await this.repository.get(code)

        if (seller === null) {
            throw new NotFoundError('Seller not found')
        }

        return seller
    }

    public async create (params: CompanySellerSchemaCreateType): Promise<CompanySellerSchemaSelectType> {
        const code = await this.repository.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: CompanyModalitySchemaUpdateType): Promise<CompanySellerSchemaSelectType> {
        const updateId = await this.repository.update(code, params)

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }
}

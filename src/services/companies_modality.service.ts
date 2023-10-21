import { PaginationSchemaType } from '@/utils/pagination'
import { CompanyModalitySchemaCreateType, CompanyModalitySchemaSelectPaginatedType, CompanyModalitySchemaSelectType, CompanyModalitySchemaUpdateType } from '@models/companies_modality.model'
import { CompaniesModalityRepository } from '@repositories/companies_modality.repository'

export class CompaniesModalityService {
    constructor (private readonly repository: CompaniesModalityRepository) {}

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<CompanyModalitySchemaSelectPaginatedType> {
        return await this.repository.getAll(group_id, query)
    }

    public async get (code: string): Promise<CompanyModalitySchemaSelectType> {
        return await this.repository.get(code)
    }

    public async create (params: CompanyModalitySchemaCreateType): Promise<CompanyModalitySchemaSelectType> {
        const code = await this.repository.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: CompanyModalitySchemaUpdateType): Promise<CompanyModalitySchemaSelectType> {
        const data = await this.repository.update(code, params)

        return await this.get(data)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }
}

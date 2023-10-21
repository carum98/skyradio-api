import { CompanySchemaCreateType, CompanySchemaSelectPaginatedType, CompanySchemaSelectType, CompanySchemaUpdateType } from '@models/companies.model'
import { CompaniesRepository } from '@repositories/companies.repository'
import { RadiosRepository } from '@repositories/radios.repository'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosSchemaSelectPaginatedType } from '@models/radios.model'

export class CompaniesService {
    constructor (
        private readonly repository: CompaniesRepository,
        private readonly radiosRepository: RadiosRepository
    ) {}

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<CompanySchemaSelectPaginatedType> {
        return await this.repository.getAll(group_id, query)
    }

    public async get (code: string): Promise<CompanySchemaSelectType> {
        return await this.repository.get(code)
    }

    public async create (params: CompanySchemaCreateType): Promise<CompanySchemaSelectType> {
        const code = await this.repository.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: CompanySchemaUpdateType): Promise<CompanySchemaSelectType> {
        const updateId = await this.repository.update(code, params)

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }

    public async getRadios (code: string, query: PaginationSchemaType): Promise<RadiosSchemaSelectPaginatedType> {
        return await this.radiosRepository.getByCompany(code, query)
    }
}

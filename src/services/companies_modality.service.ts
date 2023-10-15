import { NotFoundError } from '@/utils/errors'
import { CompanyModalitySchemaCreateType, CompanyModalitySchemaSelectType, CompanyModalitySchemaUpdateType } from '@models/companies_modality.model'
import { CompaniesModalityRepository } from '@repositories/companies_modality.repository'

export class CompaniesModalityService {
    constructor (private readonly repository: CompaniesModalityRepository) {}

    public async getAll (group_id: number): Promise<CompanyModalitySchemaSelectType[]> {
        return await this.repository.getAll(group_id)
    }

    public async get (code: string): Promise<CompanyModalitySchemaSelectType> {
        const company = await this.repository.get(code)

        if (company === null) {
            throw new NotFoundError('Company not found')
        }

        return company
    }

    public async create (params: CompanyModalitySchemaCreateType): Promise<CompanyModalitySchemaSelectType> {
        const code = await this.repository.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: CompanyModalitySchemaUpdateType): Promise<CompanyModalitySchemaSelectType> {
        const updateId = await this.repository.update(code, params)

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }
}

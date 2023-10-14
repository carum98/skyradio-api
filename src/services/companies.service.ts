import { CompanySchemaCreateType, CompanySchemaSelectType, CompanySchemaUpdateType } from '@models/companies.model'
import { CompaniesRepository } from '@repositories/companies.repository'
import { NotFoundError } from '@/utils/errors'

export class CompaniesService {
    constructor (private readonly repository: CompaniesRepository) {}

    public async getAll (group_id: number): Promise<CompanySchemaSelectType[]> {
        return await this.repository.getAll(group_id)
    }

    public async get (code: string): Promise<CompanySchemaSelectType> {
        const company = await this.repository.get(code)

        if (company === null) {
            throw new NotFoundError('Company not found')
        }

        return company
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
}

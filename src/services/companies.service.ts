import { CompanySchemaCreateType, CompanySchemaSelectType, CompanySchemaUpdateType } from '@models/companies.model'
import { CompaniesRepository } from '@repositories/companies.repository'
import { NotFoundError } from '@/utils/errors'

export class CompaniesService {
    constructor (private readonly repository: CompaniesRepository) {}

    public async getAll (group_id: number): Promise<CompanySchemaSelectType[]> {
        return await this.repository.getAll(group_id)
    }

    public async get (id: number): Promise<CompanySchemaSelectType> {
        const company = await this.repository.get(id)

        if (company === null) {
            throw new NotFoundError('Company not found')
        }

        return company
    }

    public async create (params: CompanySchemaCreateType): Promise<CompanySchemaSelectType> {
        const id = await this.repository.create(params)

        return await this.get(id)
    }

    public async update (id: number, params: CompanySchemaUpdateType): Promise<CompanySchemaSelectType> {
        const updateId = await this.repository.update(id, params)

        return await this.get(updateId)
    }

    public async delete (id: number): Promise<boolean> {
        return await this.repository.delete(id)
    }
}

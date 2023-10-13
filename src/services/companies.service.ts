import { Request } from 'express'
import { CompanySchemaCreateType, CompanySchemaSelectType, CompanySchemaUpdateType } from '@models/companies.model'
import { IService } from './service'
import { CompaniesRepository } from '@repositories/companies.repository'
import { NotFoundError } from '@/utils/errors'

export class CompaniesService implements IService<CompanySchemaSelectType> {
    constructor (private readonly repository: CompaniesRepository) {}

    public async getAll (req: Request): Promise<CompanySchemaSelectType[]> {
        const { group_id } = req.body

        return await this.repository.getAll(parseInt(group_id))
    }

    public async get (req: Request): Promise<CompanySchemaSelectType> {
        const { id } = req.params

        const company = await this.repository.get(parseInt(id))

        if (company === null) {
            throw new NotFoundError('Company not found')
        }

        return company
    }

    public async create (req: Request): Promise<CompanySchemaSelectType> {
        const params = req.body as CompanySchemaCreateType

        return await this.repository.create(params)
    }

    public async update (req: Request): Promise<CompanySchemaSelectType> {
        const params = req.body as CompanySchemaUpdateType
        return await this.repository.update(params)
    }

    public async delete (req: Request): Promise<boolean> {
        const { id } = req.params

        return await this.repository.delete(id)
    }
}

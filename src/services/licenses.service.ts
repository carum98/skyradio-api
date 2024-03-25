import { DataSource } from '@/core/data-source.core'
import { PaginationSchemaType } from '@utils/pagination'
import { LicensesRepository } from '@repositories/licenses.repository'
import { LicensesSchemaCreateType, LicensesSchemaSelect, LicensesSchemaSelectPaginated, LicensesSchemaSelectPaginatedType, LicensesSchemaSelectType, LicensesSchemaUpdateType } from '@models/licenses.model'

export class LicensesService {
    private readonly licenses: LicensesRepository

    constructor (datasource: DataSource) {
        this.licenses = datasource.create(LicensesRepository)
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<LicensesSchemaSelectPaginatedType> {
        const data = await this.licenses.getAll(group_id, query)

        return LicensesSchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<LicensesSchemaSelectType> {
        const data = await this.licenses.get(code)

        return LicensesSchemaSelect.parse(data)
    }

    public async create (params: LicensesSchemaCreateType): Promise<LicensesSchemaSelectType> {
        const code = await this.licenses.create(params)

        return await this.get(code)
    }

    public async update (code: string, params: LicensesSchemaUpdateType): Promise<LicensesSchemaSelectType> {
        const updateId = await this.licenses.update(code, params)

        return await this.get(updateId)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.licenses.delete(code)
    }
}

import { DataSource } from '@/core/data-source.core'
import { AppsSchemaCreateType, AppsSchemaSelectPaginatedType, AppsSchemaSelectType } from '@models/apps.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { AppsRepository } from '@repositories/apps.repository'
import { LicensesRepository } from '@repositories/licenses.repository'
import { ClientsRepository } from '@repositories/clients.repository'

export class AppsService {
    private readonly apps: AppsRepository
    private readonly license: LicensesRepository
    private readonly clients: ClientsRepository

    constructor (datasource: DataSource) {
        this.apps = datasource.create(AppsRepository)
        this.license = datasource.create(LicensesRepository)
        this.clients = datasource.create(ClientsRepository)
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<AppsSchemaSelectPaginatedType> {
        return await this.apps.getAll(group_id, query)
    }

    public async get (code: string): Promise<AppsSchemaSelectType> {
        return await this.apps.get(code)
    }

    public async create (params: AppsSchemaCreateType): Promise<AppsSchemaSelectType> {
        const { license_id = 0, client_id } = await this.findIdsByCodes(params)

        const code = await this.apps.create({
            ...params,
            license_id,
            client_id
        })

        return await this.get(code)
    }

    public async update (code: string, params: { license_code: string }): Promise<AppsSchemaSelectType> {
        const { license_id = 0 } = await this.findIdsByCodes(params)

        const data = await this.apps.update(code, {
            license_id
        })

        return await this.get(data)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.apps.delete(code)
    }

    private async findIdsByCodes ({ license_code, client_code }: { license_code?: string, client_code?: string }): Promise<{ license_id?: number, client_id?: number }> {
        const license_id = license_code !== undefined
            ? await this.license.getId(license_code)
            : undefined

        const client_id = client_code !== undefined
            ? await this.clients.getId(client_code)
            : undefined

        return {
            license_id,
            client_id
        }
    }
}

import { DataSource } from '@/core/data-source.core'
import { AppsSchemaCreateType, AppsSchemaSelectPaginated, AppsSchemaSelectPaginatedType, AppsSchemaSelectType, AppsSchemaUpdateType } from '@models/apps.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { AppsRepository } from '@repositories/apps.repository'
import { LicensesRepository } from '@repositories/licenses.repository'
import { ClientsRepository } from '@repositories/clients.repository'
import { LogsSchemaSelectPaginated, LogsSchemaSelectPaginatedType } from '@models/logs.model'
import { LogsRepository } from '@repositories/logs.repository'

export class AppsService {
    private readonly apps: AppsRepository
    private readonly license: LicensesRepository
    private readonly clients: ClientsRepository
    private readonly logs: LogsRepository

    constructor (datasource: DataSource) {
        this.apps = datasource.create(AppsRepository)
        this.license = datasource.create(LicensesRepository)
        this.clients = datasource.create(ClientsRepository)
        this.logs = datasource.create(LogsRepository)
    }

    public async getAll (params: { group_id: number, user_id?: number }, query: PaginationSchemaType): Promise<AppsSchemaSelectPaginatedType> {
        const { group_id, user_id } = params
        const data = await this.apps.getAll({ group_id, user_id }, query)

        return AppsSchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<AppsSchemaSelectType> {
        return await this.apps.get(code)
    }

    public async create (params: AppsSchemaCreateType): Promise<AppsSchemaSelectType> {
        const { license_id = 0, client_id } = await this.findIdsByCodes(params)

        await this.license.clearRelations(license_id)
        const code = await this.apps.create({
            ...params,
            license_id,
            client_id
        })

        return await this.get(code)
    }

    public async update (code: string, params: AppsSchemaUpdateType): Promise<AppsSchemaSelectType> {
        const { name } = params
        const { license_id } = await this.findIdsByCodes(params)

        if (license_id !== undefined) {
            await this.license.clearRelations(license_id)
        }

        const data = await this.apps.update(code, {
            name,
            license_id
        })

        return await this.get(data)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.apps.delete(code)
    }

    public async getLogs (code: string, query: PaginationSchemaType): Promise<LogsSchemaSelectPaginatedType> {
        const { app_id = 0 } = await this.findIdsByCodes({ app_code: code })

        const data = await this.logs.getAll({ app_id }, query)

        return LogsSchemaSelectPaginated.parse(data)
    }

    private async findIdsByCodes ({ license_code, client_code, app_code }: { license_code?: string, client_code?: string, app_code?: string }): Promise<{ license_id?: number, client_id?: number, app_id?: number }> {
        const license_id = license_code !== undefined
            ? await this.license.getId(license_code)
            : undefined

        const client_id = client_code !== undefined
            ? await this.clients.getId(client_code)
            : undefined

        const app_id = app_code !== undefined
            ? await this.apps.getId(app_code)
            : undefined

        return {
            license_id,
            client_id,
            app_id
        }
    }
}

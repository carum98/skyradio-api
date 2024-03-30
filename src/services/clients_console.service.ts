import { PaginationSchemaType } from '@utils/pagination'
import { ClientsConsoleRepository } from '@repositories/clients_console.repository'
import { ConsoleSchemaCreateType, ConsoleSchemaSelectPaginatedType, ConsoleSchemaSelectType, ConsoleSchemaUpdateType } from '@models/clients_console.model'
import { DataSource } from '@/core/data-source.core'
import { LicensesRepository } from '@repositories/licenses.repository'
import { ClientsRepository } from '@repositories/clients.repository'

export class ClientsConsoleService {
    private readonly repository: ClientsConsoleRepository
    private readonly license: LicensesRepository
    private readonly companies: ClientsRepository

    constructor (datasource: DataSource) {
        this.repository = datasource.create(ClientsConsoleRepository)
        this.license = datasource.create(LicensesRepository)
        this.companies = datasource.create(ClientsRepository)
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<ConsoleSchemaSelectPaginatedType> {
        return await this.repository.getAll(group_id, query)
    }

    public async get (code: string): Promise<ConsoleSchemaSelectType> {
        return await this.repository.get(code)
    }

    public async create (params: ConsoleSchemaCreateType): Promise<ConsoleSchemaSelectType> {
        const { license_id = 0, client_id } = await this.findIdsByCodes(params)

        await this.license.clearRelations(license_id)
        const code = await this.repository.upsert({
            license_id,
            client_id
        })

        return await this.get(code)
    }

    public async update (code: string, params: ConsoleSchemaUpdateType): Promise<ConsoleSchemaSelectType> {
        const { license_id } = await this.findIdsByCodes(params)

        if (license_id !== undefined) {
            await this.license.clearRelations(license_id)
        }

        const data = await this.repository.update(code, {
            license_id
        })

        return await this.get(data)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }

    private async findIdsByCodes ({ license_code, client_code }: { license_code?: string, client_code?: string }): Promise<{ license_id?: number, client_id?: number }> {
        const license_id = license_code !== undefined
            ? await this.license.getId(license_code)
            : undefined

        const client_id = client_code !== undefined
            ? await this.companies.getId(client_code)
            : undefined

        return {
            license_id,
            client_id
        }
    }
}

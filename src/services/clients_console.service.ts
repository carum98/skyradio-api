import { PaginationSchemaType } from '@utils/pagination'
import { ClientsConsoleRepository } from '@repositories/clients_console.repository'
import { ConsoleSchemaCreateType, ConsoleSchemaSelectPaginatedType, ConsoleSchemaSelectType, ConsoleSchemaUpdateType } from '@models/clients_console.model'
import { DataSource } from '@/core/data-source.core'
import { LicensesRepository } from '@repositories/licenses.repository'

export class ClientsConsoleService {
    private readonly repository: ClientsConsoleRepository
    private readonly license: LicensesRepository

    constructor (datasource: DataSource) {
        this.repository = datasource.create(ClientsConsoleRepository)
        this.license = datasource.create(LicensesRepository)
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<ConsoleSchemaSelectPaginatedType> {
        return await this.repository.getAll(group_id, query)
    }

    public async get (code: string): Promise<ConsoleSchemaSelectType> {
        return await this.repository.get(code)
    }

    public async create (params: ConsoleSchemaCreateType): Promise<ConsoleSchemaSelectType> {
        const { license_id = 0 } = await this.findIdsByCodes(params)

        const code = await this.repository.create({
            license_id
        })

        return await this.get(code)
    }

    public async update (code: string, params: ConsoleSchemaUpdateType): Promise<ConsoleSchemaSelectType> {
        const { license_id = 0 } = await this.findIdsByCodes(params)

        const data = await this.repository.update(code, {
            license_id
        })

        return await this.get(data)
    }

    public async delete (code: string): Promise<boolean> {
        return await this.repository.delete(code)
    }

    private async findIdsByCodes ({ license_code }: { license_code?: string }): Promise<{ license_id?: number }> {
        const license_id = license_code !== undefined
            ? await this.license.getId(license_code)
            : undefined

        return {
            license_id
        }
    }
}

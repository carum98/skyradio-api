import { DataSource } from '@/core/data-source.core'
import { LogsSchemaSelectPaginated, LogsSchemaSelectPaginatedType, ActionsType } from '@models/logs.model'
import { LogsRepository } from '@/repositories/logs.repository'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosRepository } from '@repositories/radios.repository'
import { ClientsRepository } from '@repositories/clients.repository'
import { SimsRepository } from '@repositories/sims.repository'
import { SessionUserInfoSchemaType } from '@/core/auth.shemas'
import { AppsRepository } from '@repositories/apps.repository'

interface Relations {
    radio_code: string
    client_code: string
    sim_code: string
    app_code: string
    radios_codes: string[]
    sims_codes: string[]
}

interface LogsPropsBase {
    session: SessionUserInfoSchemaType
    action: ActionsType
}

interface LogsProps<T extends keyof Relations = keyof Relations> extends Omit<LogsPropsBase, 'action'> {
    params: Pick<Relations, T>
}

interface LogsPropsCreate extends LogsPropsBase {
    params: Partial<Relations>
}

export class LogsService {
    private readonly logs: LogsRepository
    private readonly radios: RadiosRepository
    private readonly client: ClientsRepository
    private readonly sim: SimsRepository
    private readonly apps: AppsRepository

    constructor (datasource: DataSource) {
        this.logs = datasource.create(LogsRepository)
        this.radios = datasource.create(RadiosRepository)
        this.client = datasource.create(ClientsRepository)
        this.sim = datasource.create(SimsRepository)
        this.apps = datasource.create(AppsRepository)
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<LogsSchemaSelectPaginatedType> {
        const data = await this.logs.getAll({ group_id }, query)

        return LogsSchemaSelectPaginated.parse(data)
    }

    private async create (props: LogsPropsCreate): Promise<void> {
        const { session, action, params } = props

        const { user_id, group_id } = session
        const { radio_id, client_id, sim_id, app_id, radios_ids, sims_ids } = await this.findIdsByCodes(params)

        if (radios_ids !== undefined) {
            await this.logs.createMany(radios_ids.map(radio_id => ({
                action,
                radio_id,
                user_id,
                group_id
            })))
        } else if (sims_ids !== undefined) {
            await this.logs.createMany(sims_ids.map(sim_id => ({
                action,
                sim_id,
                user_id,
                group_id
            })))
        } else {
            await this.logs.create({
                action,
                client_id,
                radio_id,
                sim_id,
                user_id,
                app_id,
                group_id
            })
        }
    }

    public async createRadio (props: LogsProps<'radio_code'>): Promise<void> {
        await this.create({
            action: 'create-radio',
            ...props
        })
    }

    public async createRadioMany (props: LogsProps<'radios_codes'>): Promise<void> {
        await this.create({
            action: 'create-radio',
            ...props
        })
    }

    public async createClient (props: LogsProps<'client_code'>): Promise<void> {
        await this.create({
            action: 'create-client',
            ...props
        })
    }

    public async createSim (props: LogsProps<'sim_code'>): Promise<void> {
        await this.create({
            action: 'create-sim',
            ...props
        })
    }

    public async createSimMany (props: LogsProps<'sims_codes'>): Promise<void> {
        await this.create({
            action: 'create-sim',
            ...props
        })
    }

    public async addRadioToClient (props: LogsProps<'radio_code' | 'client_code'>): Promise<void> {
        await this.create({
            action: 'add-radio-to-client',
            ...props
        })
    }

    public async addSimToRadio (props: LogsProps<'radio_code' | 'sim_code'>): Promise<void> {
        await this.create({
            action: 'add-sim-to-radio',
            ...props
        })
    }

    public async removeRadioFromClient (props: LogsProps<'radio_code' | 'client_code'>): Promise<void> {
        await this.create({
            action: 'remove-radio-from-client',
            ...props
        })
    }

    public async removeSimFromRadio (props: LogsProps<'radio_code' | 'sim_code'>): Promise<void> {
        await this.create({
            action: 'remove-sim-from-radio',
            ...props
        })
    }

    public async swapRadioFromClient (props: LogsProps<'radio_code' | 'client_code'>): Promise<void> {
        await this.create({
            action: 'swap-radio-from-client',
            ...props
        })
    }

    public async swapSimFromRadio (props: LogsProps<'radio_code' | 'sim_code'>): Promise<void> {
        await this.create({
            action: 'swap-sim-from-radio',
            ...props
        })
    }

    public async createApp (props: LogsProps<'app_code'>): Promise<void> {
        await this.create({
            action: 'create-app',
            ...props
        })
    }

    public async addAppToClient (props: LogsProps<'app_code' | 'client_code'>): Promise<void> {
        await this.create({
            action: 'add-app-to-client',
            ...props
        })
    }

    public async enableConsole (props: LogsProps<'client_code'>): Promise<void> {
        await this.create({
            action: 'enable-console',
            ...props
        })
    }

    public async disableConsole (props: LogsProps<'client_code'>): Promise<void> {
        await this.create({
            action: 'disable-console',
            ...props
        })
    }

    // Multiple methods
    public async addRadiosToClient (props: LogsProps<'client_code'>, radios_code: string[]): Promise<void> {
        await Promise.all(radios_code.map(async radio_code => {
            await this.addRadioToClient({
                session: props.session,
                params: {
                    radio_code,
                    client_code: props.params.client_code
                }
            })
        }))
    }

    public async removeRadiosFromClient (props: LogsProps<'client_code'>, radios_code: string[]): Promise<void> {
        await Promise.all(radios_code.map(async radio_code => {
            await this.removeRadioFromClient({
                session: props.session,
                params: {
                    radio_code,
                    client_code: props.params.client_code
                }
            })
        }))
    }

    private async findIdsByCodes (params: Partial<Relations>): Promise<{ client_id?: number, sim_id?: number, radio_id?: number, app_id?: number, radios_ids?: number[], sims_ids?: number[] }> {
        const { client_code, sim_code, radio_code, app_code, radios_codes, sims_codes } = params

        const client_id = client_code !== undefined
            ? await this.client.getId(client_code)
            : undefined

        const sim_id = sim_code !== undefined
            ? await this.sim.getId(sim_code)
            : undefined

        const radio_id = radio_code !== undefined
            ? await this.radios.getId(radio_code)
            : undefined

        const app_id = app_code !== undefined
            ? await this.apps.getId(app_code)
            : undefined

        const radios_ids = radios_codes !== undefined
            ? await this.radios.getIds(radios_codes)
            : undefined

        const sims_ids = sims_codes !== undefined
            ? await this.sim.getIds(sims_codes)
            : undefined

        return {
            client_id,
            sim_id,
            radio_id,
            app_id,
            radios_ids,
            sims_ids
        }
    }
}

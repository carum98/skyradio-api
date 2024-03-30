import { Request, Response } from 'express'
import { ClientsConsoleService } from '@services/clients_console.service'
import { PaginationSchemaType } from '@/utils/pagination'
import { LogsService } from '@services/logs.service'
import { ConsoleSchemaCreateType } from '@models/clients_console.model'
import { SessionUserInfoSchemaType } from '@/core/auth.shemas'

export class ClientsConsoleController {
    constructor (
        private readonly service: ClientsConsoleService,
        private readonly logs: LogsService
    ) {}

    public getAll = async (req: Request, res: Response): Promise<void> => {
        const { group_id } = req.body
        const query = req.query as unknown as PaginationSchemaType

        const data = await this.service.getAll(parseInt(group_id), query)

        res.json(data)
    }

    public get = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const data = await this.service.get(code)

        res.json(data)
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        const params = req.body as ConsoleSchemaCreateType & SessionUserInfoSchemaType

        const data = await this.service.create(params)

        await this.logs.enableConsole({
            session: req.body,
            params: {
                client_code: params.client_code
            }
        })

        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body

        const data = await this.service.update(code, params)

        res.json(data)
    }

    public delete = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const console = await this.service.get(code)
        const data = await this.service.delete(code)

        if (console.client !== null) {
            await this.logs.disableConsole({
                session: req.body,
                params: {
                    client_code: console.client?.code 
                }
            })
        }

        if (data) {
            res.status(204).json()
        } else {
            res.status(400).json()
        }
    }
}

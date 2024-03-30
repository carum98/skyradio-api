import { Request, Response } from 'express'
import { PaginationSchemaType } from '@/utils/pagination'
import { AppsService } from '@services/apps.service'
import { SessionUserInfoSchemaType } from '@/core/auth.shemas'
import { AppsSchemaCreateType, AppsSchemaUpdateType } from '@models/apps.model'
import { LogsService } from '@services/logs.service'

export class AppsController {
    constructor (
        private readonly service: AppsService,
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
        const params = req.body as AppsSchemaCreateType & SessionUserInfoSchemaType

        const data = await this.service.create(params)

        await this.logs.createApp({
            session: params,
            params: {
                app_code: data.code
            }
        })

        await this.logs.addAppToClient({
            session: params,
            params: {
                app_code: data.code,
                client_code: params.client_code
            }
        })

        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as AppsSchemaUpdateType

        const data = await this.service.update(code, params)

        res.json(data)
    }

    public delete = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const data = await this.service.delete(code)

        if (data) {
            res.status(204).json()
        } else {
            res.status(400).json()
        }
    }

    public getLogs = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const query = req.query as unknown as PaginationSchemaType

        const data = await this.service.getLogs(code, query)

        res.json(data)
    }
}

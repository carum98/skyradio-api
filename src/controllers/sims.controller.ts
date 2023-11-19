import { Request, Response } from 'express'
import { SimsService } from '@/services/sims.service'
import { SimsShemaCreateType, SimsShemaUpdateType, SimsRadioSchemaType } from '@/models/sims.model'
import { PaginationSchemaType } from '@/utils/pagination'
import { LogsService } from '@/services/logs.service'
import { SessionUserInfoSchemaType } from '@/core/auth.shemas'

export class SimsController {
    constructor (
        private readonly service: SimsService,
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
        const params = req.body as SimsShemaCreateType & SessionUserInfoSchemaType

        const data = await this.service.create(params)

        await this.logs.createSim({
            session: params,
            params: {
                sim_code: data.code
            }
        })

        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as SimsShemaUpdateType

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

    public getRadio = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const data = await this.service.getRadio(code)

        res.json(data)
    }

    public addRadio = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as SimsRadioSchemaType

        const data = await this.service.addRadio(code, params)

        if (data) {
            res.status(204).json()
        } else {
            res.status(400).json()
        }
    }

    public removeRadio = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const data = await this.service.removeRadio(code)

        if (data) {
            res.status(204).json()
        } else {
            res.status(400).json()
        }
    }
}

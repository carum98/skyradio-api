import { Request, Response } from 'express'
import { SimsService } from '@/services/sims.service'
import { SimsShemaCreateType, SimsShemaUpdateType } from '@/models/sims.model'

export class SimsController {
    constructor (private readonly service: SimsService) {}

    public getAll = async (req: Request, res: Response): Promise<void> => {
        const { group_id } = req.body

        const data = await this.service.getAll(parseInt(group_id))

        res.json(data)
    }

    public get = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const data = await this.service.get(code)

        res.json(data)
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        const params = req.body as SimsShemaCreateType

        const data = await this.service.create(params)

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
}

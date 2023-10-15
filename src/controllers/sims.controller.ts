import { Request, Response } from 'express'
import { SimsService } from '@/services/sims.service'

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
        const { number, serial, group_id, provider_id } = req.body

        const data = await this.service.create({
            number,
            serial,
            group_id: parseInt(group_id),
            provider_id: parseInt(provider_id)
        })

        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const { number, serial, provider_id } = req.body

        const data = await this.service.update(code, {
            number,
            serial,
            provider_id: parseInt(provider_id)
        })

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

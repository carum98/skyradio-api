import { Request, Response } from 'express'
import { GroupsService } from '@/services/groups.service'

export class GroupsController {
    constructor (private readonly service: GroupsService) {}

    public getAll = async (_req: Request, res: Response): Promise<void> => {
        const data = await this.service.getAll()
        res.json(data)
    }

    public get = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params

        const data = await this.service.get(parseInt(id))

        res.json(data)
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        const { name } = req.body

        const data = await this.service.create({
            name
        })

        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params
        const { name } = req.body

        const data = await this.service.update(parseInt(id), {
            name
        })

        res.json(data)
    }

    public delete = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params

        const data = await this.service.delete(parseInt(id))

        if (data) {
            res.status(204).json()
        } else {
            res.status(400).json()
        }
    }
}

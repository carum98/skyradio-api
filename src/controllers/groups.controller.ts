import { Request, Response } from 'express'
import { GroupsService } from '@/services/groups.service'

export class GroupsController {
    constructor (private readonly service: GroupsService) {}

    public getAll = async (_req: Request, res: Response): Promise<void> => {
        const data = await this.service.getAll()
        res.json(data)
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.create(req)
        res.json(data)
    }

    public get = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.get(req)
        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.update(req)
        res.json(data)
    }

    public delete = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.delete(req)
        res.json(data)
    }
}

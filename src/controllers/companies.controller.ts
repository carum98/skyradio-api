import { Request, Response } from 'express'
import { CompaniesService } from '@services/companies.service'

export class CompaniesController {
    constructor (private readonly service: CompaniesService) {}

    public getAll = async (req: Request, res: Response): Promise<void> => {
        const { group_id } = req.body

        const data = await this.service.getAll(parseInt(group_id))

        res.json(data)
    }

    public get = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params

        const data = await this.service.get(parseInt(id))

        res.json(data)
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        const { name, group_id } = req.body

        const data = await this.service.create({
            name,
            group_id: parseInt(group_id)
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

        res.json(data)
    }
}

import { Request, Response } from 'express'
import { CompaniesService } from '@services/companies.service'

export class CompaniesController {
    constructor (private readonly service: CompaniesService) {}

    public getAll = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.getAll(req)
        res.json(data)
    }

    public get = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.get(req)
        res.json(data)
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.create(req)
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

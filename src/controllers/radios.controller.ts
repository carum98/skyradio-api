import { Request, Response } from 'express'
import { RadiosService } from '@services/radios.service'
import { RadiosSchemaCreateType, RadiosSchemaUpdateType } from '@/models/radios.model'
import { PaginationSchemaType } from '@/utils/pagination'

export class RadiosController {
    constructor (private readonly service: RadiosService) {}

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
        const params = req.body as RadiosSchemaCreateType

        const data = await this.service.create(params)

        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const params = req.body as RadiosSchemaUpdateType

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

    public getClients = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const data = await this.service.getClients(code)

        res.json(data)
    }
}

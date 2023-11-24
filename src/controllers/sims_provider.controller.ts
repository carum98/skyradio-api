import { Request, Response } from 'express'
import { SimsProviderService } from '@services/sims_provider.service'
import { PaginationSchemaType } from '@/utils/pagination'
import { SimsProviderShemaCreateType, SimsProviderShemaUpdateType } from '@models/sims_provider.model'

export class SimsProviderController {
    constructor (private readonly service: SimsProviderService) {}

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
        const params = req.body as SimsProviderShemaCreateType

        const data = await this.service.create(params)

        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const { name, color } = req.body as SimsProviderShemaUpdateType

        const data = await this.service.update(code, {
            name,
            color
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

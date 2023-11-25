import { Request, Response } from 'express'
import { RadiosStatusService } from '@services/radios_status.service'
import { PaginationSchemaType } from '@/utils/pagination'
import { RadiosStatusShemaCreateType, RadiosStatusShemaUpdateType } from '@models/radios_status.model'

export class RadiosStatusController {
    constructor (public readonly service: RadiosStatusService) {}

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
        const params = req.body as RadiosStatusShemaCreateType

        const data = await this.service.create(params)

        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const { name, color } = req.body as RadiosStatusShemaUpdateType

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

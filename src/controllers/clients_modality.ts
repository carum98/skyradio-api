import { Request, Response } from 'express'
import { ClientsModalityService } from '@/services/clients_modality.service'
import { PaginationSchemaType } from '@/utils/pagination'
import { ClientsModalitySchemaCreateType, ClientsModalitySchemaUpdateType } from '@models/clients_modality.model'

export class ClientsModalityController {
    constructor (private readonly service: ClientsModalityService) {}

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
        const params = req.body as ClientsModalitySchemaCreateType

        const data = await this.service.create(params)

        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const { color, name } = req.body as ClientsModalitySchemaUpdateType

        const data = await this.service.update(code, {
            color,
            name
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

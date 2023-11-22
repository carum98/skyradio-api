import { Request, Response } from 'express'
import { UserService } from '@services/users.service'
import { PaginationSchemaType } from '@/utils/pagination'

export class UserController {
    constructor (private readonly service: UserService) {}

    public getAll = async (req: Request, res: Response): Promise<void> => {
        const { group_id } = req.body
        const query = req.query as unknown as PaginationSchemaType

        const data = await this.service.getAll(group_id, query)
        res.json(data)
    }

    public get = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params

        const data = await this.service.get(code)

        res.json(data)
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        const { name, email, password, group_id, role } = req.body

        const data = await this.service.create({
            name,
            email,
            password,
            group_id: parseInt(group_id),
            role
        })

        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.params
        const { name, email, password } = req.body

        const data = await this.service.update(code, {
            name,
            email,
            password
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

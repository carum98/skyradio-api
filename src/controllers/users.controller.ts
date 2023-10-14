import { Request, Response } from 'express'
import { UserService } from '@services/users.service'

export class UserController {
    constructor (private readonly service: UserService) {}

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
        const { name, email, password, group_id } = req.body

        const data = await this.service.create({
            name,
            email,
            password,
            group_id: parseInt(group_id),
            role: 'admin'
        })

        res.json(data)
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params
        const { name, email, password } = req.body

        const data = await this.service.update(parseInt(id), {
            name,
            email,
            password
        })

        res.json(data)
    }

    public delete = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params

        const data = await this.service.delete(parseInt(id))

        res.json(data)
    }
}

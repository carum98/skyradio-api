import { Request, Response } from 'express'
import { UserService } from '@services/users.service'

export class UserController {
    constructor (private readonly service: UserService) {}

    public getAll = async (_req: Request, res: Response): Promise<void> => {
        const data = await this.service.getAll()

        res.json(data)
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        const { name, user_name, password } = req.body

        const data = await this.service.create(name, user_name, password)

        res.json({
            id: data.insertId,
            name,
            user_name,
            password
        })
    }
}

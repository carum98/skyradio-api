import { Request, Response } from 'express'
import { UserService } from '@services/users.service'

export class UserController {
    constructor (private readonly service: UserService) {}

    public getAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.service.getAll()
            res.json(data)
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.service.create(req)
            res.json(data)
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }

    public get = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.service.get(req)
            res.json(data)
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }

    public update = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.service.update(req)
            res.json(data)
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }

    public delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.service.delete(req)
            res.json(data)
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }
}

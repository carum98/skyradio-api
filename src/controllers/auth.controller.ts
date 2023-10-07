import { AuthService } from '@/services/auth.service'
import { Request, Response } from 'express'

export class AuthController {
    constructor (private readonly service: AuthService) {}

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.service.login(req)
            res.json(data)
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }

    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.service.register(req)
            res.json(data)
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }
}

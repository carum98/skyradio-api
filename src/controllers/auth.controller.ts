import { AuthService } from '@/services/auth.service'
import { Request, Response } from 'express'

export class AuthController {
    constructor (private readonly service: AuthService) {}

    public login = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.login(req)
        res.json(data)
    }

    public register = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.register(req)
        res.json(data)
    }

    public refreshToken = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.refreshToken(req)
        res.json(data)
    }
}

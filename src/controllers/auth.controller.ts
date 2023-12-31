import { AuthService } from '@services/auth.service'
import { Request, Response } from 'express'

export class AuthController {
    constructor (private readonly service: AuthService) {}

    public login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body

        const data = await this.service.login(email, password)

        res.json(data)
    }

    public refreshToken = async (req: Request, res: Response): Promise<void> => {
        const { user_id, group_id, refresh_token, role } = req.body

        const data = await this.service.refreshToken(refresh_token, {
            user_id,
            group_id,
            role
        })

        res.json(data)
    }
}

import { IAuthRepository } from '@repositories/repositories'
import { Request } from 'express'

export class AuthService {
    constructor (private readonly repository: IAuthRepository) {}

    public async login (req: Request): Promise<any> {
        const { user_name, password } = req.body

        return await this.repository.login(user_name, password)
    }

    public async register (req: Request): Promise<any> {
        const { name, user_name, password } = req.body

        return await this.repository.register(name, user_name, password)
    }
}

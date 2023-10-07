import { AuthLoginSchemaType, AuthRegisterSchemaType, AuthLoginResponseSchemaType, AuthLoginResponseSchema } from '@models/auth.shemas'
import { IAuthRepository } from '@repositories/repositories'
import { Request } from 'express'

export class AuthService {
    constructor (private readonly repository: IAuthRepository) { }

    public async login (req: Request): Promise<AuthLoginResponseSchemaType> {
        const { email, password } = req.body as AuthLoginSchemaType

        await this.repository.login(email, password)

        const response = {
            token: 'token'
        }

        return AuthLoginResponseSchema.parse(response)
    }

    public async register (req: Request): Promise<any> {
        const { name, email, password } = req.body as AuthRegisterSchemaType

        return await this.repository.register(name, email, password)
    }
}

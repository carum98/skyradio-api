import { generate } from '@/utils/jwt'
import { AuthLoginSchemaType, AuthRegisterSchemaType, AuthTokenResponseSchema, AuthTokenResponseSchemaType } from '@models/auth.shemas'
import { IAuthRepository } from '@repositories/repositories'
import { Request } from 'express'

export class AuthService {
    constructor (private readonly repository: IAuthRepository) { }

    public async login (req: Request): Promise<AuthTokenResponseSchemaType> {
        const { email, password } = req.body as AuthLoginSchemaType

        const user = await this.repository.login(email, password)
        const response = await generate(user.id)
        await this.repository.refreshToken(user.id, response.refreshToken)

        return AuthTokenResponseSchema.parse(response)
    }

    public async register (req: Request): Promise<AuthTokenResponseSchemaType> {
        const { name, email, password } = req.body as AuthRegisterSchemaType

        const user = await this.repository.register(name, email, password)
        const response = await generate(user.id)
        await this.repository.refreshToken(user.id, response.refreshToken)

        return AuthTokenResponseSchema.parse(response)
    }
}

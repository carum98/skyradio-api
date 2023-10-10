import { UnauthorizedError } from '@utils/errors'
import { generate } from '@/utils/jwt'
import { IAuthRepository } from '@repositories/repositories'
import { Request } from 'express'

import {
    AuthLoginSchemaType,
    AuthRegisterSchemaType,
    AuthTokenResponseSchema,
    AuthTokenResponseSchemaType
} from '@models/auth.shemas'

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

    public async refreshToken (req: Request): Promise<AuthTokenResponseSchemaType> {
        const { user_id, refresh_token } = req.body

        const exists = await this.repository.checkRefreshToken(user_id, refresh_token)

        if (!exists) {
            throw new UnauthorizedError('Token invalid')
        }

        const response = await generate(user_id)
        await this.repository.refreshToken(user_id, response.refreshToken)

        return AuthTokenResponseSchema.parse(response)
    }
}

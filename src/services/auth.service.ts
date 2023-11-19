import { NotFoundError, UnauthorizedError } from '@utils/errors'
import { generate } from '@/utils/jwt'
import { AuthRepository } from '@repositories/auth.repository'
import { comparePassword } from '@/utils/hashed-password'
import { SessionUserInfoSchemaType, AuthTokenResponseSchema, AuthTokenResponseSchemaType } from '@/core/auth.shemas'

export class AuthService {
    constructor (private readonly repository: AuthRepository) { }

    public async login (email: string, password: string): Promise<AuthTokenResponseSchemaType> {
        const user = await this.repository.login(email)

        if (user === null) {
            throw new NotFoundError('User not found')
        }

        const passwordIsValid = await comparePassword(password, user.password)

        if (!passwordIsValid) {
            throw new UnauthorizedError('Invalid password')
        }

        return await this.generateToken(user.id)
    }

    public async refreshToken (refresh_token: string, tokenContent: SessionUserInfoSchemaType): Promise<AuthTokenResponseSchemaType> {
        const exists = await this.repository.checkRefreshToken(tokenContent.user_id, refresh_token)

        if (!exists) {
            throw new UnauthorizedError('Token not found')
        }

        return await this.generateToken(tokenContent.user_id)
    }

    private async generateToken (user_id: number): Promise<AuthTokenResponseSchemaType> {
        const user = await this.repository.getUserById(user_id)

        const response = await generate({
            user_id: user.id,
            group_id: user.group.id,
            role: user.role
        })

        await this.repository.refreshToken(user.id, response.refreshToken)

        return AuthTokenResponseSchema.parse({
            ...response,
            user
        })
    }
}

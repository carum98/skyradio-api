import { NotFoundError, UnauthorizedError } from '@utils/errors'
import { generate } from '@/utils/jwt'
import { AuthRepository } from '@repositories/auth.repository'
import { comparePassword } from '@/utils/hashed-password'
import { AuthTokenContentSchemaType, AuthTokenResponseSchema, AuthTokenResponseSchemaType } from '@/core/auth.shemas'
import { UserSchemaSelectType } from '@/models/users.model'

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

        return await this.generateToken(user)
    }

    public async refreshToken (refresh_token: string, tokenContent: AuthTokenContentSchemaType): Promise<AuthTokenResponseSchemaType> {
        const exists = await this.repository.checkRefreshToken(tokenContent.user_id, refresh_token)

        if (!exists) {
            throw new UnauthorizedError('Token not found')
        }

        const user = await this.repository.getUserById(tokenContent.user_id)

        return await this.generateToken(user)
    }

    private async generateToken (user: UserSchemaSelectType): Promise<AuthTokenResponseSchemaType> {
        const response = await generate({
            user_id: user.id,
            group_id: user.group_id,
            role: user.role
        })

        await this.repository.refreshToken(user.id, response.refreshToken)

        return AuthTokenResponseSchema.parse({
            ...response,
            user
        })
    }
}

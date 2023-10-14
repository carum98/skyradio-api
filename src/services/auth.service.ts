import { NotFoundError, UnauthorizedError } from '@utils/errors'
import { generate } from '@/utils/jwt'
import { AuthRepository } from '@repositories/auth.repository'
import { comparePassword } from '@/utils/hashed-password'
import { AuthTokenContentSchemaType, AuthTokenResponseSchema, AuthTokenResponseSchemaType } from '@/core/auth.shemas'
import { UserRolesType } from '@/models/users.model'

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

        return await this.generateToken(user.id, user.group_id, user.role)
    }

    public async refreshToken (refresh_token: string, tokenContent: AuthTokenContentSchemaType): Promise<AuthTokenResponseSchemaType> {
        const exists = await this.repository.checkRefreshToken(tokenContent.user_id, refresh_token)

        if (!exists) {
            throw new UnauthorizedError('Token not found')
        }

        return await this.generateToken(
            tokenContent.user_id,
            tokenContent.group_id,
            tokenContent.role
        )
    }

    private async generateToken (user_id: number, group_id: number, role: UserRolesType): Promise<AuthTokenResponseSchemaType> {
        const response = await generate({
            user_id,
            group_id,
            role
        })

        await this.repository.refreshToken(user_id, response.refreshToken)

        return AuthTokenResponseSchema.parse(response)
    }
}

import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '@config/jwt.config'
import { AuthTokenResponseSchemaType } from '@/core/auth.shemas'

export async function generate (user_id: number, group_id: number): Promise<AuthTokenResponseSchemaType> {
    const payload = {
        user_id,
        group_id
    }

    const token = jwt.sign(payload, config.token.secret, {
        expiresIn: config.token.expiresIn
    })

    const refreshToken = jwt.sign(payload, config.refreshToken.secret, {
        expiresIn: config.refreshToken.expiresIn
    })

    return {
        token,
        refreshToken,
        expiredAt: Date.now() + config.token.expiresIn * 1000
    }
}

export function verify (token: string): string | JwtPayload {
    return jwt.verify(token, config.token.secret)
}

export function verifyRefreshToken (token: string): string | JwtPayload {
    return jwt.verify(token, config.refreshToken.secret)
}

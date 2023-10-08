import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '@config/jwt.config'

export async function generate (userId: number): Promise<object> {
    const payload = {
        userId
    }

    const token = jwt.sign(payload, config.token.secret, {
        expiresIn: config.token.expiresIn
    })

    const refreshToken = jwt.sign(payload, config.refreshToken.secret, {
        expiresIn: config.refreshToken.expiresIn
    })

    const data = {
        token,
        refreshToken,
        expiredAt: Date.now() + config.token.expiresIn * 1000
    }

    return data
}

export function verify (token: string): string | JwtPayload {
    return jwt.verify(token, config.token.secret)
}

export function verifyRefreshToken (token: string): string | JwtPayload {
    return jwt.verify(token, config.refreshToken.secret)
}

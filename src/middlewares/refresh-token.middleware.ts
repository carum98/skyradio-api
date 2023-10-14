import { Request, Response, NextFunction } from 'express'
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken'

import { verifyRefreshToken } from '@utils/jwt'
import { UnauthorizedError } from '@utils/errors'

export function refreshTokenMiddleware (req: Request, _res: Response, next: NextFunction): void {
    const { refresh_token } = req.body

    if (refresh_token == null) {
        throw new UnauthorizedError('Token not found')
    }

    try {
        const payload = verifyRefreshToken(refresh_token)

        req.body.user_id = (payload as JwtPayload).user_id
        req.body.group_id = (payload as JwtPayload).group_id

        next()
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            throw new UnauthorizedError('Token expired')
        }

        throw new UnauthorizedError('Invalid token')
    }
}

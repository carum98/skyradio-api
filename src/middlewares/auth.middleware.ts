import { Request, Response, NextFunction } from 'express'
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken'

import { verify } from '@utils/jwt'
import { UnauthorizedError } from '@utils/errors'

export function authMiddleware (req: Request, _res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ').at(-1)

    if (token == null) {
        throw new UnauthorizedError('Token not found')
    }

    try {
        const payload = verify(token)

        req.body.userId = (payload as JwtPayload).userId

        next()
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            throw new UnauthorizedError('Token expired')
        }

        throw new UnauthorizedError('Invalid token')
    }
}

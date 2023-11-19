import { Request, Response, NextFunction } from 'express'
import { TokenExpiredError } from 'jsonwebtoken'

import { verify } from '@utils/jwt'
import { UnauthorizedError } from '@utils/errors'
import { SessionUserInfoSchema } from '@/core/auth.shemas'
import { ZodError } from 'zod'

export function authMiddleware (req: Request, _res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ').at(-1)

    if (token == null) {
        throw new UnauthorizedError('Token not found')
    }

    try {
        const payload = verify(token)

        const payloadContent = SessionUserInfoSchema.parse(payload)

        req.body.user_id = payloadContent.user_id
        req.body.group_id = payloadContent.group_id
        req.body.role = payloadContent.role

        next()
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            throw new UnauthorizedError('Token expired')
        }

        if (err instanceof ZodError) {
            throw new UnauthorizedError('Invalid token payload')
        }

        throw new UnauthorizedError('Invalid token')
    }
}

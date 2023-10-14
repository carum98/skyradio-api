import { UserRolesType } from '@models/users.model'
import { Request, Response, NextFunction } from 'express'

export function rolesMiddleware (roles: UserRolesType[]) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { role: user_role } = req.body

        if (roles.includes(user_role)) {
            return next()
        } else {
            res.status(403).json({ message: 'Forbidden' })
        }
    }
}

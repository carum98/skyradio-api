import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export function errorMiddleware (err: Error, _req: Request, res: Response, next: NextFunction): void {
    if (err instanceof ZodError) {
        res.status(500).json({ message: 'Internal server error (Format)' })
    } else {
        res.status(500).json({ message: 'Internal server error' })
    }
}

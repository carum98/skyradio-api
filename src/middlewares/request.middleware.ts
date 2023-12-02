import { SessionUserInfoSchema } from '@/core/auth.shemas'
import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'

interface IRequest {
    body?: AnyZodObject
    query?: AnyZodObject
    params?: AnyZodObject
}

interface IError {
    errors: Array<{
        field: string
        message: string
    }>
}

export function requestMiddleware ({ body, query, params }: IRequest) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (params != null) req.params = params.parse(req.params)
            if (body != null) req.body = SessionUserInfoSchema.partial().merge(body).parse(req.body)
            if (query != null) req.query = query.passthrough().parse(req.query)

            next()
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json(buildErrorMessage(error))
            } else {
                res.status(500).json({ message: 'Internal server error' })
            }
        }
    }
}

function buildErrorMessage (error: ZodError): IError {
    const data: IError = {
        errors: []
    }

    error.errors.forEach((err) => {
        data.errors.push({
            field: err.path.join('.'),
            message: err.message
        })
    })

    return data
}

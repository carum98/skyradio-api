import multer from 'multer'
import { Request, Response, NextFunction } from 'express'

const storage = multer.memoryStorage()
const upload = multer({ storage })
const single = upload.single('file')

export function fileMiddleware () {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const body = req.body

        single(req, res, () => {
            req.body = body
            next()
        })
    }
}

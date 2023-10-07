import express, { RequestHandler, Router } from 'express'
import util from 'node:util'

import { RouteBase } from '@routes/routes'
import { Database } from '@/database'

import { AuthRepository } from '@repositories/auth.repository'
import { AuthService } from '@services/auth.service'
import { AuthController } from '@controllers/auth.controller'
import { requestMiddleware } from '@middlewares/request.middleware'
import { AuthLoginSchema, AuthRegisterSchema } from '@models/auth.shemas'

export class AuthRouter implements RouteBase {
    public readonly path: string
    public readonly router: Router

    constructor (db: Database) {
        const repository = new AuthRepository(db)
        const service = new AuthService(repository)
        const controller = new AuthController(service)

        const router = express.Router()

        router.post(
            '/login',
            requestMiddleware({ body: AuthLoginSchema }) as RequestHandler,
            util.callbackify(controller.login) as RequestHandler
        )

        router.post(
            '/register',
            requestMiddleware({ body: AuthRegisterSchema }) as RequestHandler,
            util.callbackify(controller.register) as RequestHandler
        )

        this.path = '/'
        this.router = router
    }
}

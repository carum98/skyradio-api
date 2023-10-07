import express, { RequestHandler, Router } from 'express'

import { RouteBase } from '@/routes/routes'
import { Database } from '@/database'

import { AuthRepository } from '@/repositories/auth.repository'
import { AuthService } from '@/services/auth.service'
import { AuthController } from '@/controllers/auth.controller'

export class AuthRouter implements RouteBase {
    public readonly path: string
    public readonly router: Router

    constructor (db: Database) {
        const repository = new AuthRepository(db)
        const service = new AuthService(repository)
        const controller = new AuthController(service)

        const router = express.Router()

        router.post('/login', controller.login as RequestHandler)
        router.post('/register', controller.register as RequestHandler)

        this.path = '/'
        this.router = router
    }
}

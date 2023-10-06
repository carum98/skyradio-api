import express, { RequestHandler, Router } from 'express'

import { RouteBase } from '@/routes/routes'
import { Database } from '@/database'

import { UserController } from '@controllers/users.controller'
import { UserRepository } from '@repositories/users.repository'
import { UserService } from '@services/users.service'

export class UserRouter implements RouteBase {
    public readonly path: string
    public readonly router: Router

    constructor (db: Database) {
        const repository = new UserRepository(db)
        const service = new UserService(repository)
        const controller = new UserController(service)

        const router = express.Router()

        router.get('/', controller.getAll as RequestHandler)
        router.post('/', controller.create as RequestHandler)

        this.path = '/users'
        this.router = router
    }
}

import { Database } from '@/database'

import { UserController } from '@controllers/users.controller'
import { UserRepository } from '@repositories/users.repository'
import { UserService } from '@services/users.service'
import { RouterCore } from '@/core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'

export class UserRouter extends RouterCore {
    constructor (db: Database) {
        super({
            path: '/users',
            middlewares: [authMiddleware]
         })

        const repository = new UserRepository(db)
        const service = new UserService(repository)
        const controller = new UserController(service)

        this.get({
            name: '/',
            handler: controller.getAll
        })

        this.post({
            name: '/',
            handler: controller.create
        })

        this.get({
            name: '/:id',
            handler: controller.get
        })

        this.put({
            name: '/:id',
            handler: controller.update
        })

        this.delete({
            name: '/:id',
            handler: controller.delete
        })
    }
}

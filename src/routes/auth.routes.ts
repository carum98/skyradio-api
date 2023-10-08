import { Database } from '@/database'

import { AuthRepository } from '@repositories/auth.repository'
import { AuthService } from '@services/auth.service'
import { AuthController } from '@controllers/auth.controller'
import { requestMiddleware } from '@middlewares/request.middleware'
import { AuthLoginSchema, AuthRegisterSchema } from '@models/auth.shemas'
import { RouterCore } from '@/core/router.core'

export class AuthRouter extends RouterCore {
    constructor (db: Database) {
        super({ path: '/' })

        const repository = new AuthRepository(db)
        const service = new AuthService(repository)
        const controller = new AuthController(service)

        this.post({
            name: '/login',
            middlewares: [requestMiddleware({ body: AuthLoginSchema })],
            handler: controller.login
        })

        this.post({
            name: '/register',
            middlewares: [requestMiddleware({ body: AuthRegisterSchema })],
            handler: controller.register
        })
    }
}

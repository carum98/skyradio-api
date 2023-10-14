import { AuthRepository } from '@repositories/auth.repository'
import { AuthService } from '@services/auth.service'
import { AuthController } from '@controllers/auth.controller'
import { requestMiddleware } from '@middlewares/request.middleware'
import { refreshTokenMiddleware } from '@middlewares/refresh-token.middleware'
import { AuthLoginSchema, AuthRefreshTokenSchema } from '@/core/auth.shemas'
import { RouterCore } from '@/core/router.core'
import { DataSource } from '@/core/data-source.core'

export class AuthRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({ path: '/' })

        const repository = datasource.create(AuthRepository)
        const service = new AuthService(repository)
        const controller = new AuthController(service)

        this.post({
            name: '/login',
            middlewares: [
                requestMiddleware({ body: AuthLoginSchema })
            ],
            handler: controller.login
        })

        this.post({
            name: '/refresh-token',
            middlewares: [
                requestMiddleware({ body: AuthRefreshTokenSchema }),
                refreshTokenMiddleware
            ],
            handler: controller.refreshToken
        })
    }
}

import { UserController } from '@controllers/users.controller'
import { UserRepository } from '@repositories/users.repository'
import { UserService } from '@services/users.service'
import { RouterCore } from '@/core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'
import { DataSource } from '@/core/data-source.core'
import { requestMiddleware } from '@middlewares/request.middleware'
import { UserSchemaCreate, UserSchemaUniqueIdentifier, UserSchemaUpdate } from '@models/users.model'
import { rolesMiddleware } from '@middlewares/roles.middleware'
import { PaginationSchema } from '@/utils/pagination'

export class UserRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/users',
            middlewares: [
                authMiddleware,
                rolesMiddleware(['admin'])
            ]
        })

        const repository = datasource.create(UserRepository)
        const service = new UserService(repository)
        const controller = new UserController(service)

        this.get({
            name: '/',
            handler: controller.getAll,
            middlewares: [
                requestMiddleware({
                    query: PaginationSchema
                })
            ]
        })

        this.post({
            name: '/',
            handler: controller.create,
            middlewares: [
                requestMiddleware({
                    body: UserSchemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: UserSchemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                requestMiddleware({
                    params: UserSchemaUniqueIdentifier,
                    body: UserSchemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                requestMiddleware({
                    params: UserSchemaUniqueIdentifier
                })
            ]
        })
    }
}

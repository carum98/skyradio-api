import { GroupsController } from '@controllers/groups.controller'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'
import { GroupRepository } from '@repositories/groups.repository'
import { GroupsService } from '@services/groups.service'
import { requestMiddleware } from '@middlewares/request.middleware'
import { GroupSchemaCreate, GroupSchemaUniqueIdentifier, GroupSchemaUpdate } from '@models/groups.model'

export class GroupsRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/groups',
            middlewares: [authMiddleware]
        })

        const repository = datasource.create(GroupRepository)
        const service = new GroupsService(repository)
        const controller = new GroupsController(service)

        this.get({
            name: '/',
            handler: controller.getAll
        })

        this.post({
            name: '/',
            handler: controller.create,
            middlewares: [
                requestMiddleware({
                    body: GroupSchemaCreate
                })
            ]
        })

        this.get({
            name: '/:id',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: GroupSchemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:id',
            handler: controller.update,
            middlewares: [
                requestMiddleware({
                    params: GroupSchemaUniqueIdentifier,
                    body: GroupSchemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:id',
            handler: controller.delete,
            middlewares: [
                requestMiddleware({
                    params: GroupSchemaUniqueIdentifier
                })
            ]
        })
    }
}

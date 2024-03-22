import { AppsController } from '@controllers/apps.controller'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { requestMiddleware } from '@middlewares/request.middleware'
import { AppsService } from '@services/apps.service'
import { authMiddleware } from '@middlewares/auth.middleware'
import { PaginationSchema } from '@utils/pagination'
import { AppsSchemaCreate, AppsSchemaUniqueIdentifier, AppsSchemaUpdate } from '@models/apps.model'

export class AppsRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/apps',
            middlewares: [authMiddleware]
        })

        const service = new AppsService(datasource)
        const controller = new AppsController(service)

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
                    body: AppsSchemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: AppsSchemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                requestMiddleware({
                    params: AppsSchemaUniqueIdentifier,
                    body: AppsSchemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                requestMiddleware({
                    params: AppsSchemaUniqueIdentifier
                })
            ]
        })
    }
}

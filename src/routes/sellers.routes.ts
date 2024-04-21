import { SellersController } from '@/controllers/sellers'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { PaginationSchema } from '@/utils/pagination'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { rolesMiddleware } from '@middlewares/roles.middleware'
import { SellersSchemaCreate, SellersSchemaUniqueIdentifier, SellersSchemaUpdate } from '@models/sellers.model'
import { SellersService } from '@/services/sellers.service'

export class SellersRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/sellers',
            middlewares: [authMiddleware]
        })

        const service = new SellersService(datasource)
        const controller = new SellersController(service)

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
                rolesMiddleware(['admin']),
                requestMiddleware({
                    body: SellersSchemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: SellersSchemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: SellersSchemaUniqueIdentifier,
                    body: SellersSchemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: SellersSchemaUniqueIdentifier
                })
            ]
        })
    }
}

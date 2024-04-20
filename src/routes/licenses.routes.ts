import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { LicensesSchemaCreate, LicensesSchemaUniqueIdentifier, LicensesSchemaUpdate } from '@models/licenses.model'
import { LicensesService } from '@services/licenses.service'
import { PaginationSchema } from '@utils/pagination'
import { LicensesController } from '@controllers/licenses.controller'
import { rolesMiddleware } from '@middlewares/roles.middleware'

export class LicensesRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/licenses',
            middlewares: [authMiddleware]
        })

        const service = new LicensesService(datasource)
        const controller = new LicensesController(service)

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
                rolesMiddleware(['admin', 'user']),
                requestMiddleware({
                    body: LicensesSchemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: LicensesSchemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                rolesMiddleware(['admin', 'user']),
                requestMiddleware({
                    params: LicensesSchemaUniqueIdentifier,
                    body: LicensesSchemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                rolesMiddleware(['admin', 'user']),
                requestMiddleware({
                    params: LicensesSchemaUniqueIdentifier
                })
            ]
        })
    }
}

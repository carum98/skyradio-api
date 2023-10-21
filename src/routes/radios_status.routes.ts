import { RadiosStatusController } from '@/controllers/radios_status.controller'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { rolesMiddleware } from '@middlewares/roles.middleware'
import { RadiosStatusRepository } from '@repositories/radios_status.repository'
import { RadiosStatusService } from '@services/radios_status.service'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { RadiosStatusShemaCreate, RadiosStatusShemaUniqueIdentifier, RadiosStatusShemaUpdate } from '@models/radios_status.model'
import { PaginationSchema } from '@/utils/pagination'

export class RadiosStatusRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/radios-status',
            middlewares: [authMiddleware]
        })

        const repository = datasource.create(RadiosStatusRepository)
        const service = new RadiosStatusService(repository)
        const controller = new RadiosStatusController(service)

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
                    body: RadiosStatusShemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: RadiosStatusShemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: RadiosStatusShemaUniqueIdentifier,
                    body: RadiosStatusShemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: RadiosStatusShemaUniqueIdentifier
                })
            ]
        })
    }
}

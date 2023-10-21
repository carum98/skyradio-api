import { SimsController } from '@controllers/sims.controller'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { SimsService } from '@services/sims.service'
import { authMiddleware } from '@middlewares/auth.middleware'
import { SimsRepository } from '@repositories/sims.repository'
import { requestMiddleware } from '@middlewares/request.middleware'
import { SimsShemaCreate, SimsShemaUniqueIdentifier, SimsShemaUpdate } from '@models/sims.model'
import { PaginationSchema } from '@/utils/pagination'

export class SimsRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/sims',
            middlewares: [
                authMiddleware
            ]
        })

        const repository = datasource.create(SimsRepository)
        const service = new SimsService(repository)
        const controller = new SimsController(service)

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
                    body: SimsShemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: SimsShemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                requestMiddleware({
                    params: SimsShemaUniqueIdentifier,
                    body: SimsShemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                requestMiddleware({
                    params: SimsShemaUniqueIdentifier
                })
            ]
        })
    }
}

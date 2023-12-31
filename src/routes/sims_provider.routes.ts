import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { rolesMiddleware } from '@middlewares/roles.middleware'
import { authMiddleware } from '@middlewares/auth.middleware'
import { SimsProviderRepository } from '@/repositories/sims_provider.repository'
import { SimsProviderService } from '@services/sims_provider.service'
import { SimsProviderController } from '@controllers/sims_provider.controller'
import { requestMiddleware } from '@middlewares/request.middleware'
import { SimsProviderShemaCreate, SimsProviderShemaUniqueIdentifier, SimsProviderShemaUpdate } from '@/models/sims_provider.model'
import { PaginationSchema } from '@/utils/pagination'

export class SimsProviderRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/sims-provider',
            middlewares: [authMiddleware]
        })

        const repository = datasource.create(SimsProviderRepository)
        const service = new SimsProviderService(repository)
        const controller = new SimsProviderController(service)

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
                    body: SimsProviderShemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: SimsProviderShemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: SimsProviderShemaUniqueIdentifier,
                    body: SimsProviderShemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: SimsProviderShemaUniqueIdentifier
                })
            ]
        })
    }
}

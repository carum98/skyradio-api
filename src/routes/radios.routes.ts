import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { RadiosRepository } from '@repositories/radios.repository'
import { authMiddleware } from '@middlewares/auth.middleware'
import { RadiosService } from '@services/radios.service'
import { RadiosController } from '@controllers/radios.controller'
import { requestMiddleware } from '@middlewares/request.middleware'
import { RadiosSchemaCreate, RadiosSchemaUniqueIdentifier, RadiosSchemaUpdate } from '@models/radios.model'

export class RadiosRauter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/radios',
            middlewares: [authMiddleware]
        })

        const repository = datasource.create(RadiosRepository)
        const service = new RadiosService(repository)
        const controller = new RadiosController(service)

        this.get({
            name: '/',
            handler: controller.getAll
        })

        this.post({
            name: '/',
            handler: controller.create,
            middlewares: [
                requestMiddleware({
                    body: RadiosSchemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: RadiosSchemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                requestMiddleware({
                    params: RadiosSchemaUniqueIdentifier,
                    body: RadiosSchemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                requestMiddleware({
                    params: RadiosSchemaUniqueIdentifier
                })
            ]
        })
    }
}

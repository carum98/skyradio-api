import { RadiosModelController } from '@/controllers/radios_model.controller'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { RadiosModelRepository } from '@repositories/radios_model.repository'
import { RadiosModelService } from '@services/radios_model.service'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@/middlewares/request.middleware'
import { RadiosModelShemaCreate, RadiosModelShemaUniqueIdentifier, RadiosModelShemaUpdate } from '@/models/radios_model.model'
import { rolesMiddleware } from '@/middlewares/roles.middleware'

export class RadiosModelRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/radios-model',
            middlewares: [authMiddleware]
        })

        const repository = datasource.create(RadiosModelRepository)
        const service = new RadiosModelService(repository)
        const controller = new RadiosModelController(service)

        this.get({
            name: '/',
            handler: controller.getAll
        })

        this.post({
            name: '/',
            handler: controller.create,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    body: RadiosModelShemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: RadiosModelShemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: RadiosModelShemaUniqueIdentifier,
                    body: RadiosModelShemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: RadiosModelShemaUniqueIdentifier
                })
            ]
        })
    }
}

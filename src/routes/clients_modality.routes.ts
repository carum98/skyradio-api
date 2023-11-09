import { ClientsModalityController } from '@controllers/clients_modality'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { ClientsModalitySchemaCreate, ClientsModalitySchemaUniqueIdentifier, ClientsModalitySchemaUpdate } from '@/models/clients_modality.model'
import { ClientsModalityRepository } from '@/repositories/clients_modality.repository'
import { ClientsModalityService } from '@/services/clients_modality.service'
import { rolesMiddleware } from '@/middlewares/roles.middleware'
import { PaginationSchema } from '@/utils/pagination'

export class CompaniesModalityRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/clients-modality',
            middlewares: [authMiddleware]
        })

        const repository = datasource.create(ClientsModalityRepository)
        const service = new ClientsModalityService(repository)
        const controller = new ClientsModalityController(service)

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
                    body: ClientsModalitySchemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: ClientsModalitySchemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: ClientsModalitySchemaUniqueIdentifier,
                    body: ClientsModalitySchemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: ClientsModalitySchemaUniqueIdentifier
                })
            ]
        })
    }
}

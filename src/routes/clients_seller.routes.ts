import { ClientsSellerController } from '@/controllers/clients_seller'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { PaginationSchema } from '@/utils/pagination'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { rolesMiddleware } from '@middlewares/roles.middleware'
import { ClientsSellerSchemaCreate, ClientsSellerSchemaUniqueIdentifier, ClientsSellerSchemaUpdate } from '@models/clients_seller.model'
import { ClientsSellerRepository } from '@repositories/clients_seller.repository'
import { ClientsSellerService } from '@services/clients_seller.service'

export class ClientsSellerRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/clients-seller',
            middlewares: [authMiddleware]
        })

        const repository = datasource.create(ClientsSellerRepository)
        const service = new ClientsSellerService(repository)
        const controller = new ClientsSellerController(service)

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
                    body: ClientsSellerSchemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: ClientsSellerSchemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: ClientsSellerSchemaUniqueIdentifier,
                    body: ClientsSellerSchemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: ClientsSellerSchemaUniqueIdentifier
                })
            ]
        })
    }
}

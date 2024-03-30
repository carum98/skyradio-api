import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { ClientsConsoleService } from '@services/clients_console.service'
import { authMiddleware } from '@middlewares/auth.middleware'
import { ClientsConsoleController } from '@controllers/clients_console.controller'
import { requestMiddleware } from '@middlewares/request.middleware'
import { PaginationSchema } from '@utils/pagination'
import { ConsoleSchemaCreate, ConsoleSchemaUniqueIdentifier, ConsoleSchemaUpdate } from '@models/clients_console.model'
import { LogsService } from '@/services/logs.service'

export class ClientsConsoleRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/consoles',
            middlewares: [authMiddleware]
        })

        const service = new ClientsConsoleService(datasource)
        const logs = new LogsService(datasource)
        const controller = new ClientsConsoleController(service, logs)

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
                    body: ConsoleSchemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: ConsoleSchemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                requestMiddleware({
                    params: ConsoleSchemaUniqueIdentifier,
                    body: ConsoleSchemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                requestMiddleware({
                    params: ConsoleSchemaUniqueIdentifier
                })
            ]
        })
    }
}

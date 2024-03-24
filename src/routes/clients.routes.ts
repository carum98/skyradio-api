import { ClientsController } from '@/controllers/clients.controller'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { ClientsService } from '@services/clients.service'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { ClientRadiosSwapSchema, ClientsRadiosSchema, ClientsSchemaCreate, ClientsSchemaUniqueIdentifier, ClientsSchemaUpdate } from '@models/clients.model'
import { PaginationSchema } from '@utils/pagination'
import { LogsService } from '@services/logs.service'
import { ConsoleSchemaCreate } from '@models/clients_console.model'
import { ClientsConsoleService } from '@services/clients_console.service'
import { AppsService } from '@services/apps.service'
import { AppsSchemaCreate } from '@models/apps.model'

export class ClientsRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/clients',
            middlewares: [authMiddleware]
        })

        const service = new ClientsService(datasource)
        const logs = new LogsService(datasource)
        const console = new ClientsConsoleService(datasource)
        const app = new AppsService(datasource)
        const controller = new ClientsController(service, logs, console, app)

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
                    body: ClientsSchemaCreate
                })
            ]
        })

        this.get({
            name: '/stats/all',
            handler: controller.getStats
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: ClientsSchemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                requestMiddleware({
                    params: ClientsSchemaUniqueIdentifier,
                    body: ClientsSchemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                requestMiddleware({
                    params: ClientsSchemaUniqueIdentifier
                })
            ]
        })

        this.get({
            name: '/:code/radios',
            handler: controller.getRadios,
            middlewares: [
                requestMiddleware({
                    query: PaginationSchema,
                    params: ClientsSchemaUniqueIdentifier
                })
            ]
        })

        this.post({
            name: '/:code/radios',
            handler: controller.addRadios,
            middlewares: [
                requestMiddleware({
                    params: ClientsSchemaUniqueIdentifier,
                    body: ClientsRadiosSchema
                })
            ]
        })

        this.put({
            name: '/:code/radios',
            handler: controller.swapRadios,
            middlewares: [
                requestMiddleware({
                    params: ClientsSchemaUniqueIdentifier,
                    body: ClientRadiosSwapSchema
                })
            ]
        })

        this.delete({
            name: '/:code/radios',
            handler: controller.removeRadios,
            middlewares: [
                requestMiddleware({
                    params: ClientsSchemaUniqueIdentifier,
                    body: ClientsRadiosSchema
                })
            ]
        })

        this.get({
            name: '/:code/logs',
            handler: controller.getLogs,
            middlewares: [
                requestMiddleware({
                    params: ClientsSchemaUniqueIdentifier,
                    query: PaginationSchema
                })
            ]
        })

        this.get({
            name: '/:code/stats',
            handler: controller.getStatsByClient,
            middlewares: [
                requestMiddleware({
                    params: ClientsSchemaUniqueIdentifier
                })
            ]
        })

        this.get({
            name: '/:code/console',
            handler: controller.getConsole,
            middlewares: [
                requestMiddleware({
                    params: ClientsSchemaUniqueIdentifier
                })
            ]
        })

        this.post({
            name: '/:code/console',
            handler: controller.addConsole,
            middlewares: [
                requestMiddleware({
                    params: ClientsSchemaUniqueIdentifier,
                    body: ConsoleSchemaCreate.omit({ client_code: true })
                })
            ]
        })

        this.get({
            name: '/:code/apps',
            handler: controller.getApps,
            middlewares: [
                requestMiddleware({
                    query: PaginationSchema,
                    params: ClientsSchemaUniqueIdentifier
                })
            ]
        })

        this.post({
            name: '/:code/apps',
            handler: controller.addApp,
            middlewares: [
                requestMiddleware({
                    params: ClientsSchemaUniqueIdentifier,
                    body: AppsSchemaCreate.omit({ client_code: true })
                })
            ]
        })
    }
}

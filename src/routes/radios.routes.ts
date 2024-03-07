import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'
import { RadiosService } from '@services/radios.service'
import { RadiosController } from '@controllers/radios.controller'
import { requestMiddleware } from '@middlewares/request.middleware'
import { fileMiddleware } from '@middlewares/file.middleware'
import { RadiosCompanySchema, RadiosSchemaCreate, RadiosSchemaUniqueIdentifier, RadiosSchemaUpdate, RadiosSimsSchema } from '@models/radios.model'
import { PaginationSchema } from '@/utils/pagination'
import { LogsService } from '@/services/logs.service'
import { ImportService } from '@/services/import.service'

export class RadiosRauter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/radios',
            middlewares: [authMiddleware]
        })

        const service = new RadiosService(datasource)
        const logs = new LogsService(datasource)
        const importt = new ImportService(datasource)
        const controller = new RadiosController(service, logs, importt)

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

        this.get({
            name: '/:code/clients',
            handler: controller.getClients,
            middlewares: [
                requestMiddleware({
                    params: RadiosSchemaUniqueIdentifier
                })
            ]
        })

        this.post({
            name: '/:code/clients',
            handler: controller.addClient,
            middlewares: [
                requestMiddleware({
                    params: RadiosSchemaUniqueIdentifier,
                    body: RadiosCompanySchema
                })
            ]
        })

        this.delete({
            name: '/:code/clients',
            handler: controller.removeClient,
            middlewares: [
                requestMiddleware({
                    params: RadiosSchemaUniqueIdentifier
                })
            ]
        })

        this.get({
            name: '/:code/sims',
            handler: controller.getSim,
            middlewares: [
                requestMiddleware({
                    params: RadiosSchemaUniqueIdentifier
                })
            ]
        })

        this.post({
            name: '/:code/sims',
            handler: controller.addSim,
            middlewares: [
                requestMiddleware({
                    params: RadiosSchemaUniqueIdentifier,
                    body: RadiosSimsSchema
                })
            ]
        })

        this.put({
            name: '/:code/sims',
            handler: controller.swapSim,
            middlewares: [
                requestMiddleware({
                    params: RadiosSchemaUniqueIdentifier,
                    body: RadiosSimsSchema
                })
            ]
        })

        this.delete({
            name: '/:code/sims',
            handler: controller.removeSim,
            middlewares: [
                requestMiddleware({
                    params: RadiosSchemaUniqueIdentifier
                })
            ]
        })

        this.get({
            name: '/:code/logs',
            handler: controller.getLogs,
            middlewares: [
                requestMiddleware({
                    params: RadiosSchemaUniqueIdentifier,
                    query: PaginationSchema
                })
            ]
        })

        this.post({
            name: '/imports',
            handler: controller.import,
            middlewares: [
                fileMiddleware(),
            ]
        })
    }
}

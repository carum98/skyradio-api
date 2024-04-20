import { SimsController } from '@controllers/sims.controller'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { SimsService } from '@services/sims.service'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { SimsRadioSchema, SimsShemaCreate, SimsShemaUniqueIdentifier, SimsShemaUpdate } from '@models/sims.model'
import { PaginationSchema } from '@/utils/pagination'
import { LogsService } from '@/services/logs.service'
import { rolesMiddleware } from '@/middlewares/roles.middleware'
import { fileMiddleware } from '@/middlewares/file.middleware'
import { ImportService } from '@/services/import.service'

export class SimsRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/sims',
            middlewares: [
                authMiddleware
            ]
        })

        const service = new SimsService(datasource)
        const logs = new LogsService(datasource)
        const importt = new ImportService(datasource)
        const controller = new SimsController(service, logs, importt)

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
                rolesMiddleware(['admin', 'user']),
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
                rolesMiddleware(['admin', 'user']),
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
                rolesMiddleware(['admin', 'user']),
                requestMiddleware({
                    params: SimsShemaUniqueIdentifier
                })
            ]
        })

        this.get({
            name: '/:code/radios',
            handler: controller.getRadio,
            middlewares: [
                requestMiddleware({
                    params: SimsShemaUniqueIdentifier
                })
            ]
        })

        this.post({
            name: '/:code/radios',
            handler: controller.addRadio,
            middlewares: [
                rolesMiddleware(['admin', 'user']),
                requestMiddleware({
                    params: SimsShemaUniqueIdentifier,
                    body: SimsRadioSchema
                })
            ]
        })

        this.delete({
            name: '/:code/radios',
            handler: controller.removeRadio,
            middlewares: [
                rolesMiddleware(['admin', 'user']),
                requestMiddleware({
                    params: SimsShemaUniqueIdentifier
                })
            ]
        })

        this.get({
            name: '/:code/logs',
            handler: controller.getLogs,
            middlewares: [
                requestMiddleware({
                    params: SimsShemaUniqueIdentifier,
                    query: PaginationSchema
                })
            ]
        })

        this.post({
            name: '/imports',
            handler: controller.import,
            middlewares: [
                rolesMiddleware(['admin']),
                fileMiddleware(),
                requestMiddleware({
                    file: {
                        maxSize: 1024 * 1024 * 2,
                        types: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
                    }
                })
            ]
        })
    }
}

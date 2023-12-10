import { ReportsController } from '@/controllers/reports.controller'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { requestMiddleware } from '@/middlewares/request.middleware'
import { ReportSchemaSellers, ReportSchemaSimsProvider, ReportsSchemaClients, ReportsSchemaModels } from '@models/reports.model'
import { ReportsService } from '@/services/reports.service'

export class ReportsRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/reports',
            middlewares: [authMiddleware]
        })

        const service = new ReportsService(datasource)
        const controller = new ReportsController(service)

        this.post({
            name: '/clients',
            handler: controller.clients,
            middlewares: [
                requestMiddleware({
                    body: ReportsSchemaClients
                })
            ]
        })

        this.post({
            name: '/models',
            handler: controller.models,
            middlewares: [
                requestMiddleware({
                    body: ReportsSchemaModels
                })
            ]
        })

        this.post({
            name: '/sellers',
            handler: controller.sellers,
            middlewares: [
                requestMiddleware({
                    body: ReportSchemaSellers
                })
            ]
        })

        this.post({
            name: '/sims-provider',
            handler: controller.simsProvider,
            middlewares: [
                requestMiddleware({
                    body: ReportSchemaSimsProvider
                })
            ]
        })
    }
}

import { CompaniesController } from '@controllers/companies.controller'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { CompaniesRepository } from '@repositories/companies.repository'
import { CompaniesService } from '@services/companies.service'
import { authMiddleware } from '@middlewares/auth.middleware'

export class CompaniesRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/companies',
            middlewares: [authMiddleware]
        })

        const repository = datasource.create(CompaniesRepository)
        const service = new CompaniesService(repository)
        const controller = new CompaniesController(service)

        this.get({
            name: '/',
            handler: controller.getAll
        })

        this.post({
            name: '/',
            handler: controller.create
        })

        this.get({
            name: '/:id',
            handler: controller.get
        })

        this.put({
            name: '/:id',
            handler: controller.update
        })

        this.delete({
            name: '/:id',
            handler: controller.delete
        })
    }
}

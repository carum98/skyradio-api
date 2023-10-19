import { CompaniesController } from '@controllers/companies.controller'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { CompaniesRepository } from '@repositories/companies.repository'
import { CompaniesService } from '@services/companies.service'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { CompanySchemaCreate, CompanySchemaUniqueIdentifier, CompanySchemaUpdate } from '@models/companies.model'
import { RadiosRepository } from '@repositories/radios.repository'
import { PaginationSchema } from '@/utils/pagination'

export class CompaniesRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/companies',
            middlewares: [authMiddleware]
        })

        const repository = datasource.create(CompaniesRepository)
        const radiosRepository = datasource.create(RadiosRepository)
        const service = new CompaniesService(repository, radiosRepository)
        const controller = new CompaniesController(service)

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
                    body: CompanySchemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: CompanySchemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                requestMiddleware({
                    params: CompanySchemaUniqueIdentifier,
                    body: CompanySchemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                requestMiddleware({
                    params: CompanySchemaUniqueIdentifier
                })
            ]
        })

        this.get({
            name: '/:code/radios',
            handler: controller.getRadios,
            middlewares: [
                requestMiddleware({
                    query: PaginationSchema,
                    params: CompanySchemaUniqueIdentifier
                })
            ]
        })
    }
}

import { CompaniesModalityController } from '@controllers/companies_modality'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { CompanyModalitySchemaCreate, CompanyModalitySchemaUniqueIdentifier, CompanyModalitySchemaUpdate } from '@models/companies_modality.model'
import { CompaniesModalityRepository } from '@repositories/companies_modality.repository'
import { CompaniesModalityService } from '@services/companies_modality.service'
import { rolesMiddleware } from '@/middlewares/roles.middleware'

export class CompaniesModalityRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/companies-modality',
            middlewares: [authMiddleware]
        })

        const repository = datasource.create(CompaniesModalityRepository)
        const service = new CompaniesModalityService(repository)
        const controller = new CompaniesModalityController(service)

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
                    body: CompanyModalitySchemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: CompanyModalitySchemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: CompanyModalitySchemaUniqueIdentifier,
                    body: CompanyModalitySchemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: CompanyModalitySchemaUniqueIdentifier
                })
            ]
        })
    }
}

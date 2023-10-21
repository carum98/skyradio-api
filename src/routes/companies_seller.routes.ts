import { CompaniesSellerController } from '@/controllers/companies_seller'
import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { PaginationSchema } from '@/utils/pagination'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { rolesMiddleware } from '@middlewares/roles.middleware'
import { CompanySellerSchemaCreate, CompanySellerSchemaUniqueIdentifier, CompanySellerSchemaUpdate } from '@models/companies_seller.model'
import { CompaniesSellerRepository } from '@repositories/companies_seller.repository'
import { CompaniesSellerService } from '@services/companies_seller.service'

export class CompaniesSellerRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/companies-seller',
            middlewares: [authMiddleware]
        })

        const repository = datasource.create(CompaniesSellerRepository)
        const service = new CompaniesSellerService(repository)
        const controller = new CompaniesSellerController(service)

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
                    body: CompanySellerSchemaCreate
                })
            ]
        })

        this.get({
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: CompanySellerSchemaUniqueIdentifier
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: CompanySellerSchemaUniqueIdentifier,
                    body: CompanySellerSchemaUpdate
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                rolesMiddleware(['admin']),
                requestMiddleware({
                    params: CompanySellerSchemaUniqueIdentifier
                })
            ]
        })
    }
}

import { DataSource } from '@/core/data-source.core'
import { RouterCore } from '@/core/router.core'
import { TemplatesService } from '@services/templates.service'
import { authMiddleware } from '@middlewares/auth.middleware'
import { TemplatesController } from '@controllers/templates.controllers'

export class TemplatesRouter extends RouterCore {
    constructor (datasource: DataSource) {
        super({
            path: '/templates',
            middlewares: [authMiddleware]
        })

        const service = new TemplatesService(datasource)
        const controller = new TemplatesController(service)

        this.get({
            name: '/radios',
            handler: controller.getRadiosTemplate
        })

        this.get({
            name: '/sims',
            handler: controller.getSimsTemplate
        })
    }
}

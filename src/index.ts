import { Server } from '@/server'

import { UserRouter } from '@routes/users.routes'
import { AuthRouter } from '@routes/auth.routes'
import { CompaniesRouter } from '@routes/companies.routes'
import { GroupsRouter } from '@routes/groups.routes'
import { CompaniesModalityRouter } from '@routes/companies_modality.routes'
import { CompaniesSellerRouter } from '@routes/companies_seller.routes'
import { SimsProviderRouter } from '@routes/sims_provider.routes'
import { SimsRouter } from '@routes/sims.routes'
import { RadiosModelRouter } from '@routes/radios_model.routes'
import { RadiosStatusRouter } from '@routes/radios_status.routes'

import { errorMiddleware } from '@middlewares/errors.middleware'
import { DataSource } from './core/data-source.core'

const datasource = new DataSource()

const server = new Server()

// Setup routes
server.routes([
    new AuthRouter(datasource),
    new UserRouter(datasource),
    new CompaniesRouter(datasource),
    new GroupsRouter(datasource),
    new CompaniesModalityRouter(datasource),
    new CompaniesSellerRouter(datasource),
    new SimsProviderRouter(datasource),
    new SimsRouter(datasource),
    new RadiosModelRouter(datasource),
    new RadiosStatusRouter(datasource)
])

// Error middleware
server.middleware(errorMiddleware)

server.listen(process.env.PORT ?? 3000)

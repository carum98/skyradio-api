import { Server } from '@/server'

import { UserRouter } from '@routes/users.routes'
import { AuthRouter } from '@routes/auth.routes'
import { ClientsRouter } from '@/routes/clients.routes'
import { GroupsRouter } from '@routes/groups.routes'
import { CompaniesModalityRouter } from '@routes/clients_modality.routes'
import { SellersRouter } from '@routes/sellers.routes'
import { SimsProviderRouter } from '@routes/sims_provider.routes'
import { SimsRouter } from '@routes/sims.routes'
import { RadiosModelRouter } from '@routes/radios_model.routes'
import { RadiosStatusRouter } from '@routes/radios_status.routes'
import { RadiosRauter } from '@routes/radios.routes'
import { ReportsRouter } from './routes/reports.routes'

import { errorMiddleware } from '@middlewares/errors.middleware'
import { DataSource } from './core/data-source.core'

const datasource = new DataSource()

const server = new Server()

// Setup routes
server.routes([
    new AuthRouter(datasource),
    new UserRouter(datasource),
    new ClientsRouter(datasource),
    new GroupsRouter(datasource),
    new CompaniesModalityRouter(datasource),
    new SellersRouter(datasource),
    new SimsProviderRouter(datasource),
    new SimsRouter(datasource),
    new RadiosModelRouter(datasource),
    new RadiosStatusRouter(datasource),
    new RadiosRauter(datasource),
    new ReportsRouter(datasource)
])

// Error middleware
server.middleware(errorMiddleware)

server.listen(process.env.PORT ?? 3000)

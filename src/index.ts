import databaseConfig from '@config/database.config'

import { Database } from '@/database'
import { Server } from '@/server'

import { UserRouter } from '@routes/users.routes'
import { AuthRouter } from '@routes/auth.routes'

import { errorMiddleware } from '@middlewares/errors.middleware'

const database = new Database(databaseConfig)

const server = new Server()

// Setup routes
server.routes([
    new AuthRouter(database),
    new UserRouter(database)
])

// Error middleware
server.middleware(errorMiddleware)

server.listen(process.env.PORT ?? 3000)

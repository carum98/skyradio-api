import databaseConfig from '@config/database.config'

import { Database } from '@/database'
import { Server } from '@/server'

import { UserRouter } from '@routes/users.routes'
import { AuthRouter } from '@routes/auth.routes'

import { authMiddleware } from '@middlewares/auth.middleware'
import { errorMiddleware } from '@middlewares/errors.middleware'

const database = new Database(databaseConfig)

const server = new Server()

// Unauthorized routes
server.routes([
    new AuthRouter(database)
])

// Middleware for authorized routes
server.middleware(authMiddleware)

// Authorized routes
server.routes([
    new UserRouter(database)
])

// Error middleware
server.middleware(errorMiddleware)

server.listen(process.env.PORT ?? 3000)

import databaseConfig from '@config/database.config'

import { Database } from '@/database'
import { Server } from '@/server'

import { UserRouter } from '@routes/users.routes'
import { AuthRouter } from './routes/auth.routes'

const database = new Database(databaseConfig)

const server = new Server()

server.routes([
    new AuthRouter(database),
    new UserRouter(database)
])

server.listen(process.env.PORT ?? 3000)

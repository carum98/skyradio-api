import databaseConfig from '@config/database.config'

import { Database } from '@/database'
import { Server } from '@/server'

import { UserRouter } from '@routes/users.routes'

const database = new Database(databaseConfig)

const server = new Server()

server.routes([
    new UserRouter(database)
])

server.listen(process.env.PORT ?? 3000)

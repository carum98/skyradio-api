import { Database } from './database'
import { Server } from './server'
import { UserController } from './controllers/users.controller'
import { usersRoutes } from './routes/users.routes'
import databaseConfig from '../config/database.config'

const port = process.env.PORT ?? 3000

const database = new Database(databaseConfig)

const server = new Server(
    [
        ['/users', usersRoutes(new UserController(database))]
    ]
)

server.listen(port)

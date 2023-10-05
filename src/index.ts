import { Database } from './database'
import { Server } from './server'
import { UserController } from './controllers/users.controller'
import { usersRoutes } from './routes/users.routes'

const port = process.env.PORT ?? 3000

const database = new Database({
	host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

const server = new Server(
    [
        ['/users', usersRoutes(new UserController(database))]
    ]
)

server.listen(port)

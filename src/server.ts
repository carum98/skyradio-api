import express, { Express } from 'express'
import { RouteBase } from '@routes/routes'
import { errorMiddleware } from '@middlewares/errors.middleware'

export class Server {
    private readonly app: Express

    constructor () {
        this.app = express()
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))

        console.log('Server initialized')
    }

    public listen (port: number | string): void {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    }

    public routes (routes: RouteBase[]): void {
        routes.forEach(item => {
            this.app.use(item.path, item.router)
        })

        this.app.use(errorMiddleware)
    }
}

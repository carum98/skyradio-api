import express, { Express } from 'express'
import { RouteBase } from '@routes/routes'

export class Server {
    private readonly app: Express

    constructor () {
        this.app = express()
        this.app.use(express.json())
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
    }
}

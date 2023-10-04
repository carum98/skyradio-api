import express, { Express, Router } from 'express'

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

    public routes (routes: Array<[string, Router]>): void {
        routes.forEach(route => {
            this.app.use(route[0], route[1])
        })
    }
}

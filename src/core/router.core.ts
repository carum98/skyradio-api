import util from 'node:util'

import { RequestHandler, Router } from 'express'
import { IRouterCore, IRouterCoreConstructor, RouteCoreMethod, RouteCoreParams, RouteCoreMiddleware } from './router'

export class RouterCore implements IRouterCore {
    public readonly path: string
    public readonly router: Router

    private readonly _middlewares?: RouteCoreMiddleware

    constructor (params: IRouterCoreConstructor) {
        this.path = params.path
        this.router = Router()

        this._middlewares = params.middlewares
    }

    public get (params: RouteCoreParams): void {
        this._requestHandler('get', params)
    }

    public post (params: RouteCoreParams): void {
        this._requestHandler('post', params)
    }

    public put (params: RouteCoreParams): void {
        this._requestHandler('put', params)
    }

    public delete (params: RouteCoreParams): void {
        this._requestHandler('delete', params)
    }

    private _requestHandler (method: RouteCoreMethod, params: RouteCoreParams): void {
        this.router[method](
            params.name,
            this._handleMiddleware(params.middlewares),
            util.callbackify(params.handler) as RequestHandler
        )
    }

    private _handleMiddleware (middleware?: RouteCoreMiddleware): RequestHandler[] | RequestHandler {
        const global =
            Array.isArray(this._middlewares)
                ? this._middlewares
                : this._middlewares != null
                    ? [this._middlewares]
                    : []

        const local =
            Array.isArray(middleware)
                ? middleware
                : middleware != null
                    ? [middleware]
                    : []

        return [...global, ...local] as RequestHandler[]
    }
}

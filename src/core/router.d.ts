import { RequestParamHandler } from 'express'

type RouteCoreMethod = 'get' | 'post' | 'put' | 'delete'

type RouteCoreMiddleware = RequestParamHandler[] | RequestParamHandler

interface RouteCoreParams {
    name: string
    middlewares?: RouteCoreMiddleware
    handler: RequestParamHandler
}

type RouterCoreRequestHandler = (params: RouteCoreParams) => void

interface IRouterCoreConstructor {
    path: string
    middlewares?: RouteCoreMiddleware
}

interface IRouterCore {
    readonly path: string
    readonly router: Router

    get: RouterCoreRequestHandler
    post: RouterCoreRequestHandler
    put: RouterCoreRequestHandler
    delete: RouterCoreRequestHandler
}

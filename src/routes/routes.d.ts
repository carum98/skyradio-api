import { Router } from 'express'

export interface RouteBase {
    readonly path: string
    readonly router: Router
}

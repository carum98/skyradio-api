import express, { Router, RequestHandler } from 'express'
import { UserController } from '@controllers/users.controller'

export function usersRoutes (controller: UserController): Router {
    const router = express.Router()

    router.get('/', controller.getAll as RequestHandler)
    router.post('/', controller.create as RequestHandler)

    return router
}

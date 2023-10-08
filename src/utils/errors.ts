export class HttpError extends Error {
    public readonly statusCode: number

    constructor (message: string, code: number) {
        super(message)
        this.statusCode = code
    }
}

export class NotFoundError extends HttpError {
    constructor (message: string = 'Not found') {
        super(message, 404)
    }
}

export class UnauthorizedError extends HttpError {
    constructor (message: string = 'Unauthorized') {
        super(message, 401)
    }
}

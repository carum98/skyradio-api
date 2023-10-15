import crypto from 'crypto'

export function generateCode (): string {
    return crypto.randomBytes(3).toString('hex')
}

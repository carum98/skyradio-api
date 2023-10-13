import { Request } from 'express'

interface IService<T> {
    public async getAll: (req: Request) => Promise<T[]>
    public async get: (req: Request) => Promise<T>
    public async create: (req: Request) => Promise<T>
    public async update: (req: Request) => Promise<T>
    public async delete: (req: Request) => Promise<boolean>
}

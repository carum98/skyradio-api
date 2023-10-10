import { UserSchemaType } from '@models/users.shema'

export interface IRepository {
    private readonly db: Database
}

export interface IAuthRepository extends IRepository {
    login: (email: string, password: string) => Promise<UserSchemaType>
    register: (name: string, email: string, password: string) => Promise<UserSchemaType>
    refreshToken: (id: number, token: string) => Promise<void>
    checkRefreshToken: (id: number, token: string) => Promise<boolean>
}

export interface IUserRepository extends IRepository {
    getAll: () => Promise<UserSchemaType[]>
    get: (id: string) => Promise<UserSchemaType>
    create: (name: string, email: string, password: string) => Promise<UserSchemaType>
    update: (id: string, { name, email, password }: { name?: string, email?: string, password?: string }) => Promise<UserSchemaType>
    delete: (id: string) => Promise<void>
}

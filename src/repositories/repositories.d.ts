import { UserSchemaSelectType } from '@models/users.model'
import { CompanySchemaSelectType, CompanySchemaCreateType, CompanySchemaUpdateType } from '@models/companies.model'

export interface IRepository {
    private readonly db: Database
}

export interface IAuthRepository extends IRepository {
    login: (email: string) => Promise<UserSchemaSelectType | null>
    register: (name: string, email: string, password: string) => Promise<UserSchemaSelectType>
    refreshToken: (id: number, token: string) => Promise<void>
    checkRefreshToken: (id: number, token: string) => Promise<boolean>
}

export interface IUserRepository extends IRepository {
    getAll: () => Promise<UserSchemaSelectType[]>
    get: (id: string) => Promise<UserSchemaSelectType>
    create: (name: string, email: string, password: string) => Promise<UserSchemaSelectType>
    update: (id: string, { name, email, password }: { name?: string, email?: string, password?: string }) => Promise<UserSchemaSelectType>
    delete: (id: string) => Promise<void>
}

export interface ICompanyRepository extends IRepository {
    getAll: (group_id: number) => Promise<CompanySchemaSelectType[]>
    get: (id: number) => Promise<CompanySchemaSelectType | null>
    create: (params: CompanySchemaCreateType) => Promise<CompanySchemaSelectType>
    update: (params: CompanySchemaUpdateType) => Promise<CompanySchemaSelectType>
    delete: (id: string) => Promise<boolean>
}

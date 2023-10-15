import { UserSchemaCreateType, UserSchemaSelectType, UserSchemaUpdateType, UserSchemaType } from '@models/users.model'
import { CompanySchemaSelectType, CompanySchemaCreateType, CompanySchemaUpdateType } from '@models/companies.model'
import { GroupSchemaCreateType, GroupSchemaSelectType, GroupSchemaUpdateType } from '@models/groups.model'
import { CompanyModalitySchemaSelectType, CompanyModalitySchemaCreateType } from '@models/companies_modality.model'

export interface IRepository {
    private readonly db: Database
}

export interface IAuthRepository extends IRepository {
    login: (email: string) => Promise<UserSchemaType | null>
    refreshToken: (id: number, token: string) => Promise<void>
    checkRefreshToken: (id: number, token: string) => Promise<boolean>
}

export interface IUserRepository extends IRepository {
    getAll: () => Promise<UserSchemaSelectType[]>
    get: (id: number) => Promise<UserSchemaSelectType | null>
    create: (params: UserSchemaCreateType) => Promise<number>
    update: (id: number, params: UserSchemaUpdateType) => Promise<number>
    delete: (id: number) => Promise<boolean>
}

export interface ICompanyRepository extends IRepository {
    getAll: (group_id: number) => Promise<CompanySchemaSelectType[]>
    get: (code: string) => Promise<CompanySchemaSelectType | null>
    create: (params: CompanySchemaCreateType) => Promise<string>
    update: (code: string, params: CompanySchemaUpdateType) => Promise<string>
    delete: (code: string) => Promise<boolean>
}

export interface ICompanyModalityRepository extends IRepository {
    getAll: (group_id: number) => Promise<CompanyModalitySchemaSelectType[]>
    get: (code: string) => Promise<CompanyModalitySchemaSelectType | null>
    create: (params: CompanyModalitySchemaCreateType) => Promise<string>
    update: (code: string, params: CompanySchemaUpdateType) => Promise<string>
    delete: (code: string) => Promise<boolean>
}

export interface IGroupRepository extends IRepository {
    getAll: () => Promise<GroupSchemaSelectType[]>
    get: (id: number) => Promise<GroupSchemaSelectType | null>
    create: (params: GroupSchemaCreateType) => Promise<number>
    update: (id: number, params: GroupSchemaUpdateType) => Promise<number>
    delete: (id: number) => Promise<boolean>
}

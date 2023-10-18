import { UserSchemaCreateType, UserSchemaSelectType, UserSchemaUpdateType, UserSchemaType } from '@models/users.model'
import { CompanySchemaSelectType, CompanySchemaCreateType, CompanySchemaUpdateType } from '@models/companies.model'
import { GroupSchemaCreateType, GroupSchemaSelectType, GroupSchemaUpdateType } from '@models/groups.model'
import { CompanyModalitySchemaSelectType, CompanyModalitySchemaCreateType } from '@models/companies_modality.model'
import { CompanySellerSchemaCreateType, CompanySellerSchemaSelectType, CompanySellerSchemaUpdateType } from '@models/companies_seller.model'
import { SimsProviderShemaCreateType, SimsProviderShemaSelectType, SimsProviderShemaUpdateType } from '@models/sims_provider.model'
import { SimsShemaCreateType, SimsShemaSelectType, SimsShemaUpdateType } from '@models/sims.model'
import { RadiosModelShemaCreateType, RadiosModelShemaSelectType, RadiosModelShemaUpdateType } from '@models/radios_model.model'
import { RadiosStatusShemaCreateType, RadiosStatusShemaSelectType, RadiosStatusShemaUpdateType } from '@models/radios_status.model'
import { RadiosSchemaCreateType, RadiosSchemaSelectType, RadiosSchemaUpdateType } from '@models/radios.model'

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

export interface ICompanySellerRepository extends IRepository {
    getAll: (group_id: number) => Promise<CompanySellerSchemaSelectType[]>
    get: (code: string) => Promise<CompanySellerSchemaSelectType | null>
    create: (params: CompanySellerSchemaCreateType) => Promise<string>
    update: (code: string, params: CompanySellerSchemaUpdateType) => Promise<string>
    delete: (code: string) => Promise<boolean>
}

export interface IGroupRepository extends IRepository {
    getAll: () => Promise<GroupSchemaSelectType[]>
    get: (id: number) => Promise<GroupSchemaSelectType | null>
    create: (params: GroupSchemaCreateType) => Promise<number>
    update: (id: number, params: GroupSchemaUpdateType) => Promise<number>
    delete: (id: number) => Promise<boolean>
}

export interface ISimsRepository extends IRepository {
    getAll: (group_id: number) => Promise<SimsShemaSelectType[]>
    get: (code: string) => Promise<SimsShemaSelectType | null>
    create: (params: SimsShemaCreateType) => Promise<string>
    update: (code: string, params: SimsShemaUpdateType) => Promise<string>
    delete: (code: string) => Promise<boolean>
}

export interface ISimsProviderRepository extends IRepository {
    getAll: (group_id: number) => Promise<SimsProviderShemaSelectType[]>
    get: (code: string) => Promise<SimsProviderShemaSelectType | null>
    create: (params: SimsProviderShemaCreateType) => Promise<string>
    update: (code: string, params: SimsProviderShemaUpdateType) => Promise<string>
    delete: (code: string) => Promise<boolean>
}

export interface IRadioRepository extends IRepository {
    getAll: (group_id: number, query: PaginationSchemaType) => Promise<RadiosSchemaSelectPaginatedType>
    get: (code: string) => Promise<RadiosSchemaSelectType | null>
    create: (params: RadiosSchemaCreateType) => Promise<string>
    update: (code: string, params: RadiosSchemaUpdateType) => Promise<string>
    delete: (code: string) => Promise<boolean>
    getByCompany: (company_code: string) => Promise<RadiosSchemaSelectType[]>
}

export interface IRadiosModelRepository extends IRepository {
    getAll: (group_id: number) => Promise<RadiosModelShemaSelectType[]>
    get: (code: string) => Promise<RadiosModelShemaSelectType | null>
    create: (params: RadiosModelShemaCreateType) => Promise<string>
    update: (code: string, params: RadiosModelShemaUpdateType) => Promise<string>
    delete: (code: string) => Promise<boolean>
}

export interface IRadiosStatusRepository extends IRepository {
    getAll: (group_id: number) => Promise<RadiosStatusShemaSelectType[]>
    get: (code: string) => Promise<RadiosStatusShemaSelectType | null>
    create: (params: RadiosStatusShemaCreateType) => Promise<string>
    update: (code: string, params: RadiosStatusShemaUpdateType) => Promise<string>
    delete: (code: string) => Promise<boolean>
}

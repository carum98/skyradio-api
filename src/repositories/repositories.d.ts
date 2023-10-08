import { UserSchemaType } from '@models/users.shema'

export interface IAuthRepository {
    login: (email: string, password: string) => Promise<UserSchemaType>
    register: (name: string, email: string, password: string) => Promise<UserSchemaType>
}

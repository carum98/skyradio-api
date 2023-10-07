export interface IAuthRepository {
    login: (user_name: string, password: string) => Promise<any>
    register: (name: string, user_name: string, password: string) => Promise<any>
}

import { UserRepository } from '@repositories/users.repository'

export class UserService {
    constructor (private readonly repository: UserRepository) {}

    public async getAll (): Promise<any> {
        const data = await this.repository.getAll()

        return data
    }

    public async create (name: string, user_name: string, password: string): Promise<any> {
        const data = await this.repository.create(name, user_name, password)

        return data
    }
}

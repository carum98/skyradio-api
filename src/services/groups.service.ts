import { Request } from 'express'
import { GroupSchemaCreateType, GroupSchemaSelectType, GroupSchemaUpdateType } from '@models/groups.model'
import { IService } from './service'
import { GroupRepository } from '@/repositories/groups.repository'
import { NotFoundError } from '@/utils/errors'

export class GroupsService implements IService<GroupSchemaSelectType> {
    constructor (private readonly repository: GroupRepository) {}

    public async getAll (): Promise<GroupSchemaSelectType[]> {
        return await this.repository.getAll()
    }

    public async get (req: Request): Promise<GroupSchemaSelectType> {
        const { id } = req.params

        const group = await this.repository.get(parseInt(id))

        if (group === null) {
            throw new NotFoundError('Group not found')
        }

        return group
    }

    public async create (req: Request): Promise<GroupSchemaSelectType> {
        const params = req.body as GroupSchemaCreateType

        return await this.repository.create(params)
    }

    public async update (req: Request): Promise<GroupSchemaSelectType> {
        const body = req.body

        const params = {
            id: parseInt(req.params.id),
            name: body.name as string
        } satisfies GroupSchemaUpdateType

        const group = await this.repository.update(params)

        if (group === null) {
            throw new NotFoundError('Group not found')
        }

        return group
    }

    public async delete (req: Request): Promise<boolean> {
        const { id } = req.params

        return await this.repository.delete(parseInt(id))
    }
}

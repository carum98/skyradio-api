import { MySql2Database } from 'drizzle-orm/mysql2'
import { IRadiosStatusRepository } from './repositories'
import { RadiosStatusShemaCreateType, RadiosStatusShemaSelect, RadiosStatusShemaSelectType, RadiosStatusShemaUpdateType, radios_status } from '@models/radios_status.model'
import { eq, and, isNull, sql } from 'drizzle-orm'
import { generateCode } from '@/utils/code'

export class RadiosStatusRepository implements IRadiosStatusRepository {
    constructor (public readonly db: MySql2Database) {}

    public async getAll (group_id: number): Promise<RadiosStatusShemaSelectType[]> {
        const data = await this.db.select().from(radios_status)
            .where(
                and(
                    eq(radios_status.group_id, group_id),
                    isNull(radios_status.deleted_at)
                )
            )

        return RadiosStatusShemaSelect.array().parse(data)
    }

    public async get (code: string): Promise<RadiosStatusShemaSelectType | null> {
        const data = await this.db.select().from(radios_status)
            .where(
                and(
                    eq(radios_status.code, code),
                    isNull(radios_status.deleted_at)
                )
            )

        return data.length > 0
            ? RadiosStatusShemaSelect.parse(data.at(0))
            : null
    }

    public async create (params: RadiosStatusShemaCreateType): Promise<string> {
        const code = generateCode()

        await this.db.insert(radios_status).values({
            ...params,
            code
        })

        return code
    }

    public async update (code: string, params: RadiosStatusShemaUpdateType): Promise<string> {
        const data = await this.db.update(radios_status).set(params)
            .where(
                and(
                    eq(radios_status.code, code),
                    isNull(radios_status.deleted_at)
                )
            )

        return data[0].affectedRows > 0 ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        const data = await this.db.update(radios_status)
            .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
            .where(
                and(
                    eq(radios_status.code, code),
                    isNull(radios_status.deleted_at)
                )
            )

        return data[0].affectedRows > 0
    }
}

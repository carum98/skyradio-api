import { generateCode } from '@/utils/code'
import { RadiosModelShemaCreateType, RadiosModelShemaSelect, RadiosModelShemaSelectType, RadiosModelShemaUpdateType, radios_model } from '@models/radios_model.model'
import { eq, and, isNull, sql } from 'drizzle-orm'
import { MySql2Database } from 'drizzle-orm/mysql2'

export class RadiosModelRepository {
    constructor (public readonly db: MySql2Database) { }

    public async getAll (group_id: number): Promise<RadiosModelShemaSelectType[]> {
        const data = await this.db.select().from(radios_model)
            .where(
                and(
                    eq(radios_model.group_id, group_id),
                    isNull(radios_model.deleted_at)
                )
            )

        return RadiosModelShemaSelect.array().parse(data)
    }

    public async get (code: string): Promise<RadiosModelShemaSelectType | null> {
        const data = await this.db.select().from(radios_model)
            .where(
                and(
                    eq(radios_model.code, code),
                    isNull(radios_model.deleted_at)
                )
            )

        return data.length > 0
            ? RadiosModelShemaSelect.parse(data.at(0))
            : null
    }

    public async create (params: RadiosModelShemaCreateType): Promise<string> {
        const code = generateCode()

        await this.db.insert(radios_model).values({
            ...params,
            code
        })

        return code
    }

    public async update (code: string, params: RadiosModelShemaUpdateType): Promise<string> {
        const data = await this.db.update(radios_model).set(params)
            .where(
                and(
                    eq(radios_model.code, code),
                    isNull(radios_model.deleted_at)
                )
            )

        return data[0].affectedRows > 0 ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        const data = await this.db.update(radios_model)
            .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
            .where(
                and(
                    eq(radios_model.code, code),
                    isNull(radios_model.deleted_at)
                )
            )

        return data[0].affectedRows > 0
    }
}

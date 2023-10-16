import { MySql2Database } from 'drizzle-orm/mysql2'
import { IRadioRepository } from './repositories'
import { RadiosSchemaCreateType, RadiosSchemaSelect, RadiosSchemaSelectType, RadiosSchemaUpdateType, radios } from '@models/radios.model'
import { SQL, and, eq, isNull, sql } from 'drizzle-orm'
import { radios_model } from '@models/radios_model.model'
import { radios_status } from '@models/radios_status.model'
import { sims } from '@models/sims.model'
import { generateCode } from '@/utils/code'
import { sims_provider } from '@/models/sims_provider.model'

export class RadiosRepository implements IRadioRepository {
    constructor (public readonly db: MySql2Database) {}

    public async getAll (group_id: number): Promise<RadiosSchemaSelectType[]> {
        const data = await this.selector(and(
            eq(radios.group_id, group_id),
            isNull(radios.deleted_at)
        ))

        return RadiosSchemaSelect.array().parse(data)
    }

    public async get (code: string): Promise<RadiosSchemaSelectType | null> {
        const data = await this.selector(and(
            eq(radios.code, code),
            isNull(radios.deleted_at)
        ))

        return data.length > 0
            ? RadiosSchemaSelect.parse(data[0])
            : null
    }

    public async create (params: RadiosSchemaCreateType): Promise<string> {
        const code = generateCode()

        await this.db.insert(radios).values({
            ...params,
            code
        })

        return code
    }

    public async update (code: string, params: RadiosSchemaUpdateType): Promise<string> {
        const data = await this.db.update(radios).set(params)
            .where(
                and(
                    eq(radios.code, code),
                    isNull(radios.deleted_at)
                )
            )

        return data[0].affectedRows > 0 ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        const data = await this.db.update(radios)
            .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
            .where(
                and(
                    eq(radios.code, code),
                    isNull(radios.deleted_at)
                )
            )

        return data[0].affectedRows > 0
    }

    private async selector (where: SQL | undefined): Promise<RadiosSchemaSelectType[]> {
        const data = await this.db.select({
            radios: {
                code: radios.code,
                name: radios.name,
                imei: radios.imei,
                serial: radios.serial
            },
            radios_model: {
                code: radios_model.code,
                name: radios_model.name
            },
            radios_status: {
                code: radios_status.code,
                name: radios_status.name
            },
            sims: {
                code: sims.code,
                number: sims.number
            },
            sims_provider: {
                code: sims_provider.code,
                name: sims_provider.name
            }
        })
            .from(radios)
            .leftJoin(radios_model, eq(radios.model_id, radios_model.id))
            .leftJoin(radios_status, eq(radios.status_id, radios_status.id))
            .leftJoin(sims, eq(radios.sim_id, sims.id))
            .leftJoin(sims_provider, eq(sims.provider_id, sims_provider.id))
            .where(where)

        return data.map((item) => ({
            ...item.radios,
            model: item.radios_model,
            status: item.radios_status,
            sim: item.sims !== null
                ? { ...item.sims, provider: item.sims_provider }
                : null
        })) as RadiosSchemaSelectType[]
    }
}

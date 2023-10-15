import { MySql2Database } from 'drizzle-orm/mysql2'
import { ISimsProviderRepository } from './repositories'
import { SimsProviderShemaCreateType, SimsProviderShemaSelect, SimsProviderShemaSelectType, SimsProviderShemaUpdateType, sims_provider } from '@/models/sims_provider.model'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { generateCode } from '@/utils/code'

export class SimsProviderRepository implements ISimsProviderRepository {
    constructor (public readonly db: MySql2Database) { }

    public async getAll (group_id: number): Promise<SimsProviderShemaSelectType[]> {
        const data = await this.db.select().from(sims_provider)
            .where(
                and(
                    eq(sims_provider.group_id, group_id),
                    isNull(sims_provider.deleted_at)
                )
            )

        return SimsProviderShemaSelect.array().parse(data)
    }

    public async get (code: string): Promise<SimsProviderShemaSelectType | null> {
        const data = await this.db.select().from(sims_provider)
            .where(
                and(
                    eq(sims_provider.code, code),
                    isNull(sims_provider.deleted_at)
                )
            )

        return data.length > 0
            ? SimsProviderShemaSelect.parse(data.at(0))
            : null
    }

    public async create (params: SimsProviderShemaCreateType): Promise<string> {
        const code = generateCode()

        await this.db.insert(sims_provider).values({
            ...params,
            code
        })

        return code
    }

    public async update (code: string, params: SimsProviderShemaUpdateType): Promise<string> {
        const data = await this.db.update(sims_provider).set(params)
            .where(
                and(
                    eq(sims_provider.code, code),
                    isNull(sims_provider.deleted_at)
                )
            )

        return data[0].affectedRows > 0 ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        const data = await this.db.update(sims_provider)
            .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
            .where(eq(sims_provider.code, code))

        return data[0].affectedRows > 0
    }
}

import { SimsShemaCreateType, SimsShemaSelect, SimsShemaSelectType, SimsShemaUpdateType, sims } from '@/models/sims.model'
import { ISimsRepository } from './repositories'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { SQL, and, eq, isNull, sql } from 'drizzle-orm'
import { sims_provider } from '@/models/sims_provider.model'
import { generateCode } from '@/utils/code'

export class SimsRepository implements ISimsRepository {
    constructor (public readonly db: MySql2Database) {}

    public async getAll (group_id: number): Promise<SimsShemaSelectType[]> {
        const data = await this.selector(and(
            eq(sims.group_id, group_id),
            isNull(sims.deleted_at)
        ))

        return SimsShemaSelect.array().parse(data)
    }

    public async get (code: string): Promise<SimsShemaSelectType | null> {
        const data = await this.selector(and(
            eq(sims.code, code),
            isNull(sims.deleted_at)
        ))

        return data.length > 0
            ? SimsShemaSelect.parse(data[0])
            : null
    }

    public async create (params: SimsShemaCreateType): Promise<string> {
        const code = generateCode()

        await this.db.insert(sims).values({
            ...params,
            code
        })

        return code
    }

    public async update (code: string, params: SimsShemaUpdateType): Promise<string> {
        const data = await this.db.update(sims).set(params)
            .where(
                and(
                    eq(sims.code, code),
                    isNull(sims.deleted_at)
                )
            )

        return data[0].affectedRows > 0 ? code : ''
    }

    public async delete (code: string): Promise<boolean> {
        const data = await this.db.update(sims)
            .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
            .where(eq(sims.code, code))

        return data[0].affectedRows > 0
    }

    private async selector (where: SQL | undefined): Promise<SimsShemaSelectType[]> {
        const data = await this.db.select()
            .from(sims)
            .leftJoin(sims_provider, eq(sims.provider_id, sims_provider.id))
            .where(where)

        return data.map((item) => {
            return {
                ...item.sims,
                provider: item.sims_provider
            }
        }) as SimsShemaSelectType[]
    }
}

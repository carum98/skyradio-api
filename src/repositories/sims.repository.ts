import { SimsShemaCreateType, SimsShemaSelect, SimsShemaSelectType, SimsShemaUpdateType, sims } from '@/models/sims.model'
import { ISimsRepository } from './repositories'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { SQL, and, eq, isNull, sql } from 'drizzle-orm'
import { sims_provider } from '@/models/sims_provider.model'
import { generateCode } from '@/utils/code'
import { NotFoundError } from '@/utils/errors'

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

        await this.db.transaction(async (trx) => {
            const { provider_id } = await this.findIdsByCodes(
                trx,
                params.provider_code
            )

            await trx.insert(sims).values({
                ...params,
                code,
                provider_id: provider_id ?? 0
            })
        })

        return code
    }

    public async update (code: string, params: SimsShemaUpdateType): Promise<string> {
        const data = await this.db.transaction(async (trx) => {
            const { provider_id } = await this.findIdsByCodes(
                trx,
                params.provider_code
            )

            return await trx.update(sims).set({
                    ...params,
                    provider_id: provider_id ?? 0
            })
            .where(
                and(
                    eq(sims.code, code),
                    isNull(sims.deleted_at)
                )
            )
        })

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

    private async findIdsByCodes (
        trx: MySql2Database,
        provider_code?: string
    ): Promise<{ provider_id?: number }> {
        const provider = provider_code === undefined
            ? null
            : await trx.select({ id: sims_provider.id }).from(sims_provider).where(eq(sims_provider.code, provider_code))

        if (provider_code !== undefined && provider?.length === 0) {
            throw new NotFoundError(`Provider code ${provider_code} not found`)
        }

        const provider_id = provider?.at(0)?.id ?? undefined

        return {
            provider_id
        }
    }
}

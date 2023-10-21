import { SimsSchemaSelectPaginated, SimsSchemaSelectPaginatedType, SimsShemaCreateType, SimsShemaSelect, SimsShemaSelectType, SimsShemaUpdateType, sims } from '@/models/sims.model'
import { ISimsRepository } from './repositories'
import { MySql2Database } from 'drizzle-orm/mysql2'
import { and, eq, isNull } from 'drizzle-orm'
import { sims_provider } from '@/models/sims_provider.model'
import { generateCode } from '@/utils/code'
import { NotFoundError } from '@/utils/errors'
import { PaginationSchemaType } from '@/utils/pagination'
import { RepositoryCore } from '@/core/repository.core'

export class SimsRepository extends RepositoryCore<SimsShemaSelectType, SimsShemaCreateType, SimsShemaUpdateType> implements ISimsRepository {
    constructor (public readonly db: MySql2Database) {
        const table = sims

        const select = db.select({
            code: sims.code,
            number: sims.number,
            provider_id: sims.provider_id,
            provider_code: sims_provider.code,
            provider_name: sims_provider.name
        })
        .from(table)
        .leftJoin(sims_provider, eq(sims.provider_id, sims_provider.id))

        super({
            db,
            table,
            select,
            deleted_column: sims.deleted_at
         })
    }

    public async getAll (group_id: number, query: PaginationSchemaType): Promise<SimsSchemaSelectPaginatedType> {
        const data = await this.paginate({
            query,
            where: eq(sims.group_id, group_id)
        })

        return SimsSchemaSelectPaginated.parse(data)
    }

    public async get (code: string): Promise<SimsShemaSelectType | null> {
        const data = await this.selector({
            where: eq(sims.code, code)
        })

        if (data.length === 0) {
            return null
        }

        return SimsShemaSelect.parse(data.at(0))
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
        return await this.softDelete(eq(sims.code, code))
    }

    // private async selector (where: SQL | undefined): Promise<SimsShemaSelectType[]> {
    //     const data = await this.db.select()
    //         .from(sims)
    //         .leftJoin(sims_provider, eq(sims.provider_id, sims_provider.id))
    //         .where(where)

    //     return data.map((item) => {
    //         return {
    //             ...item.sims,
    //             provider: item.sims_provider
    //         }
    //     }) as SimsShemaSelectType[]
    // }

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

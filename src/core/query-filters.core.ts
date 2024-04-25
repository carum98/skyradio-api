import { SQL, sql } from 'drizzle-orm'

/**
 * { user: { code: { equal: "12345" } } }
 * { role: { equal: "admin" } }
 */
export type Filter = Record<string, Record<string, string | object>>

const conditions = {
    equal: '=',
    like: 'LIKE',
    not_equal: '!=',
    is_null: 'IS NULL',
    is_not_null: 'IS NOT NULL',
    in: 'IN',
    not_in: 'NOT IN'
} as const as Record<string, string>

export function queryFiltersSQL (filters?: Filter): SQL[] {
    const sqlChunks: SQL[] = []

    if (filters !== undefined) {
        sqlChunks.push(...parseFilter(filters))
    }

    return sqlChunks
}

function parseFilter (filters: Filter): SQL[] {
    const sqlChunks: SQL[] = []

    for (const [table, value] of Object.entries(filters)) {
        for (const [key, data] of Object.entries(value)) {
            const { table_column, condition_symbol, rawData } = parseData(table, key, data)

            const queryChunks = [
                sql.raw(table_column),
                sql.raw(condition_symbol)
            ]

            const queryChunk = parseValue(condition_symbol, rawData)

            sqlChunks.push(sql.join([...queryChunks, queryChunk], sql.raw(' ')))
        }
    }

    return sqlChunks
}

function parseData (table: string, key: string, data: string | object): { table_column: string, condition_symbol: string, rawData: string } {
    if (typeof data === 'string') {
        return {
            table_column: table,
            condition_symbol: conditions[key],
            rawData: data
        }
    } else {
        const [condition, rawData] = Object.entries(data)[0] as [string, string]

        return {
            table_column: `${table}.${key}`,
            condition_symbol: conditions[condition],
            rawData
        }
    }
}

function parseValue (condition: string, data: string): SQL {
    if ([conditions.in, conditions.not_in].includes(condition)) {
        const values = data.split(',').map((value) => sql`${value}`)
        return sql`(${sql.join(values, sql.raw(','))})`
    } else {
        return sql`${data}`
    }
}

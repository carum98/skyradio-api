import mysql, { Pool } from 'mysql2/promise'

export class Database {
    private readonly db: Pool

    constructor (config: object) {
        this.db = mysql.createPool(config)
        console.log('Database connected')
    }

    public async query (query: string, values?: Array<string | number>): Promise<any> {
        const [rows] = await this.db.query(query, values)

        return rows
    }
}

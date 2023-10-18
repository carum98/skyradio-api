import DatabaseConfig from '@config/database.config'
import { IRepository } from '@/repositories/repositories'
import mysql from 'mysql2/promise'
import { MySql2Database, drizzle } from 'drizzle-orm/mysql2'

export class DataSource {
    private readonly _db: MySql2Database
    private readonly _repositories: Map<string, IRepository> = new Map()

    constructor () {
        const connection = mysql.createPool(DatabaseConfig as object)
        this._db = drizzle(connection)
    }

    public create<T extends IRepository>(Type: new(db: MySql2Database) => T): T {
        const name = Type.name

        if (!this._repositories.has(name)) {
            console.log(`Creating repository ${name}`)
            this._repositories.set(name, new Type(this._db))
        }

        return this._repositories.get(name) as T
    }
}

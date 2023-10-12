import DatabaseConfig from '@config/database.config'
import { IRepository } from '@/repositories/repositories'
import mysql from 'mysql2/promise'
import { MySql2Database, drizzle } from 'drizzle-orm/mysql2'

export class DataSource {
    private readonly _db: MySql2Database

    constructor () {
        const connection = mysql.createPool(DatabaseConfig as object)
        this._db = drizzle(connection)
    }

    public create<T extends IRepository>(Type: new(db: MySql2Database) => T): T {
        console.log('create', Type)
        return new Type(this._db)
    }
}

import DatabaseConfig from '@config/database.config'
import { Database } from '@/database'
import { IRepository } from '@/repositories/repositories'

export class DataSource {
    private readonly _db: Database

    constructor () {
        this._db = new Database(DatabaseConfig)
    }

    public create<T extends IRepository>(Type: new(db: Database) => T): T {
        console.log('create', Type)
        return new Type(this._db)
    }
}

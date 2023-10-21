import { MySql2Database } from 'drizzle-orm/mysql2'

export interface IRepository {
    private readonly db: MySql2Database
}

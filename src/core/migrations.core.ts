import DatabaseConfig from '@config/database.config'
import { drizzle } from 'drizzle-orm/mysql2'
import { migrate } from 'drizzle-orm/mysql2/migrator'
import { createConnection } from 'mysql2'

export async function init (): Promise<void> {
    const connection = createConnection(DatabaseConfig as object)
    const db = drizzle(connection)

    console.log('Migrating database...')
    await migrate(db, { migrationsFolder: 'database' })
    console.log('Migrations completed!')

    process.exit(0)
}

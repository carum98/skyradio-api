
import DatabaseConfig from '@config/database.config'
import { Database } from '@/database'

import fs from 'fs'

export async function init (): Promise<void> {
    const db = new Database(DatabaseConfig)

    console.log('Running migrations...')

    // Read all files in migrations folder
    const files = fs.readdirSync('./database/migrations')

    // Migrations inside database
    const migrationsDB = await db.query('SELECT migration FROM migrations') as Array<{ migration: string }>

    // Filter non migrated files
    const migrationFiles = files.filter(file => {
        const migration = migrationsDB.find(migration => migration.migration === file)
        return migration == null
    })

    console.log(`Found ${migrationFiles.length} migrations`)

    // Run migrations
    for (const file of migrationFiles) {
        try {
            const sql = fs.readFileSync(`./database/migrations/${file}`, 'utf8')

            await db.query(sql)
            await db.query('INSERT INTO migrations (migration) VALUES (?)', [file])
        } catch (error) {
            console.log(error)
            console.log(`Error running migration ${file}`)
        }
    }

    console.log('Migrations finished')
    await db.close()
}

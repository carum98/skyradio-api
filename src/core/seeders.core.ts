import DatabaseConfig from '@config/database.config'
import { Database } from '@/database'

import fs from 'fs'

export async function init (): Promise<void> {
    const db = new Database(DatabaseConfig)

    console.log('Running seeders...')

    const fileName = process.argv.at(-1)

    if (fileName == null) {
        console.log('No seeder specified')
    } else {
        try {
            const sql = fs.readFileSync(`./database/seeders/${fileName}.seeder.sql`, 'utf-8').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()

            if (sql == null) {
                console.log(`Seeder ${fileName} not found`)
                return
            }

            await db.query(sql)
        } catch (error) {
            console.log(error)
            console.log(`Error running seeder ${fileName}`)
        }
    }

    console.log('Seeders finished')
    await db.close()
}

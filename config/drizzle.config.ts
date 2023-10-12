import { Config } from 'drizzle-kit'
import DatabaseConfig from '@config/database.config'

export default {
  schema: './src/models/shema.ts',
  out: './database',
  driver: 'mysql2',
  introspect: {
    casing: 'preserve'
  },
  dbCredentials: DatabaseConfig as any
} satisfies Config

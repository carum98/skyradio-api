import { defineConfig } from 'drizzle-kit'
import DatabaseConfig from '@config/database.config'

export default defineConfig({
  schema: './src/models/*.model.ts',
  out: './database',
  dialect: 'mysql',
  introspect: {
    casing: 'preserve'
  },
  dbCredentials: DatabaseConfig as any
})

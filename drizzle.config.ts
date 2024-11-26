import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './src/db/schema/schema.ts',
    out: './src/db/migration',

    dbCredentials: {url:process.env.DATABASE_URL!} 
})


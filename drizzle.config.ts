import { defineConfig } from "drizzle-kit";
import { readConfig } from "././src/config";

const config = readConfig();
const db_url = config.dbUrl;

export default defineConfig({
  schema: "./src/lib/database/schema/schema.ts",
  out: "./src/lib/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "rss_aggregator",
    ssl: false,
  },
});
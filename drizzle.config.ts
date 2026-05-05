import { defineConfig } from "drizzle-kit";
import { readConfig } from "././src/config";

const config = readConfig();
const db_url = config.dbUrl;

export default defineConfig({
  schema: "src/lib/database/schema/schema.ts",
  out: "src/lib/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: db_url,
  },
});
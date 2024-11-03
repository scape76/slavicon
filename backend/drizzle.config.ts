import { type Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ["project_y_*"],
} satisfies Config;

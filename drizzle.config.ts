import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./drizzle/schema.ts",
    out: "./drizzle/migrations",
    strict: true,
    verbose: true,
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
  });
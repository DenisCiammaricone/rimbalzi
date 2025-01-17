import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "mysql",
    schema: "./src/db/schema",
    out: "./migrations",
    dbCredentials: {
        host: (process.env.DB_HOST || ""), // It does not accept undefined values and env values can be undefined
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: (process.env.DB_NAME || ""),
    }
});

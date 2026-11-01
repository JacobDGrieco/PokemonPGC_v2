import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Keeps migration and schema commands on Neon's direct connection while the
 * serverless application continues to use its pooled runtime connection.
 */
export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	datasource: {
		url: env("DB_DATABASE_URL_UNPOOLED"),
	},
});

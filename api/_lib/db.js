import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

/** Preserves today's strict pg TLS behavior when pg 9 changes sslmode semantics. */
function requireVerifiedDatabaseTls(connectionString) {
	const databaseUrl = new URL(connectionString);
	const sslMode = databaseUrl.searchParams.get("sslmode");
	if (["prefer", "require", "verify-ca"].includes(sslMode)) {
		databaseUrl.searchParams.set("sslmode", "verify-full");
	}
	return databaseUrl.toString();
}

/** Creates the shared Prisma 7 client over Neon's pooled runtime connection. */
function createPrismaClient() {
	const connectionString = String(process.env.DB_DATABASE_URL || "").trim();
	if (!connectionString) {
		throw new Error("DB_DATABASE_URL is required to initialize Prisma.");
	}

	const adapter = new PrismaPg({
		connectionString: requireVerifiedDatabaseTls(connectionString),
		// Match Prisma 6's bounded connection wait instead of pg's unlimited default.
		connectionTimeoutMillis: 5_000,
	});
	return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.__ppgcPrisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.__ppgcPrisma = prisma;
}

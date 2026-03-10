import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
	globalForPrisma.__ppgcPrisma ||
	new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.__ppgcPrisma = prisma;
}
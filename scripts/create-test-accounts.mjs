import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "../api/_lib/db.js";

const TEST_ACCOUNTS = [
	{ tier: "free", email: "test-free@pokemonpgc.local", subscriptionStatus: null },
	{ tier: "great", email: "test-great@pokemonpgc.local", subscriptionStatus: "active" },
	{ tier: "ultra", email: "test-ultra@pokemonpgc.local", subscriptionStatus: "active" },
	{ tier: "master", email: "test-master@pokemonpgc.local", subscriptionStatus: "active" },
];

function randomPassword(length = 24) {
	return crypto.randomBytes(length).toString("base64url");
}

async function upsertTestAccount({ tier, email, subscriptionStatus }) {
	const password = randomPassword();
	const passwordHash = await bcrypt.hash(password, 10);

	const user = await prisma.user.upsert({
		where: { email },
		update: {
			passwordHash,
			emailVerifiedAt: new Date(),
			sessionVersion: { increment: 1 },
			icon: "default",
			tier,
			subscriptionStatus,
			stripeCustomerId: null,
			stripeSubscriptionId: null,
			paypalSubscriptionId: null,
		},
		create: {
			email,
			passwordHash,
			emailVerifiedAt: new Date(),
			icon: "default",
			tier,
			subscriptionStatus,
		},
		select: {
			id: true,
			email: true,
			tier: true,
		},
	});

	return { ...user, password };
}

async function main() {
	const created = [];
	for (const account of TEST_ACCOUNTS) {
		created.push(await upsertTestAccount(account));
	}

	console.log("Test accounts ready:");
	for (const account of created) {
		console.log(
			`${account.tier.padEnd(6)} ${account.email}  password=${account.password}`
		);
	}
}

try {
	await main();
} finally {
	await prisma.$disconnect();
}

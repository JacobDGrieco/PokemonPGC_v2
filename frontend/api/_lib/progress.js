import { prisma } from "./db.js";

export async function getUserSaves(userId) {
	return prisma.gameSave.findMany({
		where: { userId },
		orderBy: { gameKey: "asc" },
	});
}

export async function upsertUserSave(userId, gameKey, data) {
	return prisma.gameSave.upsert({
		where: {
			userId_gameKey: {
				userId,
				gameKey,
			},
		},
		update: {
			data,
		},
		create: {
			userId,
			gameKey,
			data,
		},
	});
}
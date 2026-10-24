import { prisma } from "./db.js";

export const USER_SAVE_RESPONSE_SELECT = Object.freeze({
	gameKey: true,
	data: true,
	updatedAt: true,
});

export const USER_SAVE_WRITE_SELECT = Object.freeze({
	gameKey: true,
	updatedAt: true,
});

export async function getUserSaves(userId) {
	return prisma.gameSave.findMany({
		where: { userId },
		orderBy: { gameKey: "asc" },
		select: USER_SAVE_RESPONSE_SELECT,
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
		select: USER_SAVE_WRITE_SELECT,
	});
}

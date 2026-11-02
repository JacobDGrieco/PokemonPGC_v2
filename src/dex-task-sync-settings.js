/**
 * Resolves persisted, per-title directional sync preferences.
 *
 * Checklist-to-Dex updates remain enabled unless a user explicitly opts out.
 * The reverse direction is deliberately opt-in because owning a species does
 * not prove that its linked static encounter or gift task was completed.
 */
import { DEX_VARIANTS, baseOf } from "./modals/dex-config.js";

export function getDexTaskSyncGameKey(gameKey) {
	const baseKey = baseOf(gameKey);
	const variants = DEX_VARIANTS[baseKey];
	return Array.isArray(variants) && variants.length
		? baseOf(variants[0])
		: baseKey;
}

export function isDexToTaskSyncEnabled(state, gameKey) {
	const key = getDexTaskSyncGameKey(gameKey);
	return !!state?.dexToTaskSyncByGame?.[key];
}

export function setDexToTaskSyncEnabled(state, gameKey, enabled) {
	if (!state || typeof state !== "object") return false;
	const key = getDexTaskSyncGameKey(gameKey);
	if (!key) return false;

	state.dexToTaskSyncByGame = {
		...(state.dexToTaskSyncByGame || {}),
		[key]: !!enabled,
	};
	return true;
}

export function isTaskToDexSyncEnabled(state, gameKey) {
	const key = getDexTaskSyncGameKey(gameKey);
	return state?.taskToDexSyncByGame?.[key] !== false;
}

export function setTaskToDexSyncEnabled(state, gameKey, enabled) {
	if (!state || typeof state !== "object") return false;
	const key = getDexTaskSyncGameKey(gameKey);
	if (!key) return false;

	state.taskToDexSyncByGame = {
		...(state.taskToDexSyncByGame || {}),
		[key]: !!enabled,
	};
	return true;
}

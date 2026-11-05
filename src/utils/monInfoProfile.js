/** Normalize imported gender-ratio variants without changing stored Mon Info data. */
import { monInfoGenerationForGame } from "./monInfoTypes.js";

/** Return the mechanics that actually exist in the selected game. */
export function monInfoMechanicsForGame(gameKey) {
	const normalizedGameKey = String(gameKey || "").toLowerCase();
	const generation = monInfoGenerationForGame(normalizedGameKey);
	const hasBreeding =
		generation >= 2 &&
		!normalizedGameKey.startsWith("letsg") &&
		!normalizedGameKey.startsWith("legends");
	return {
		generation,
		hasAbilities: generation >= 3,
		hasHiddenAbilities: generation >= 5,
		hasBreeding,
		hasFriendship: generation >= 2,
		hasGender: generation >= 2,
	};
}

export function monInfoAbilitiesForGame(abilities, gameKey) {
	const mechanics = monInfoMechanicsForGame(gameKey);
	if (!mechanics.hasAbilities) return [];
	const values = Array.isArray(abilities) ? abilities : [];
	return mechanics.hasHiddenAbilities
		? values
		: values.filter((ability) => !/\(Hidden\)\s*$/i.test(String(ability)));
}

/** Convert an imported Egg cycle count to the selected game's displayed base steps. */
export function monInfoEggStepsForGame({
	gameKey,
	hatchCounter,
	eggGroups = [],
	authoredSteps = null,
} = {}) {
	const mechanics = monInfoMechanicsForGame(gameKey);
	if (!mechanics.hasBreeding) return null;
	if (
		(Array.isArray(eggGroups) ? eggGroups : []).some((group) =>
			/no eggs|undiscovered/i.test(String(group)),
		)
	) {
		return null;
	}
	if (authoredSteps != null && Number.isFinite(Number(authoredSteps))) {
		return Number(authoredSteps);
	}
	const cycles = Number(hatchCounter);
	if (!Number.isFinite(cycles)) return null;
	const key = String(gameKey || "").toLowerCase();
	let stepsPerCycle = 256;
	if (mechanics.generation === 4) stepsPerCycle = 255;
	else if (mechanics.generation === 5 || mechanics.generation === 6)
		stepsPerCycle = 257;
	else if (
		key.startsWith("sword") ||
		key.startsWith("shield") ||
		key.startsWith("scarlet") ||
		key.startsWith("violet")
	)
		stepsPerCycle = 128;
	else if (
		key.startsWith("brilliantdiamond") ||
		key.startsWith("shiningpearl")
	)
		stepsPerCycle = 255;
	return cycles * stepsPerCycle;
}

export function parseMonInfoGenderRatio(value) {
	if (value == null || value === "") return null;
	if (typeof value === "object") {
		const male = value.maleRatio ?? value.male ?? null;
		const female = value.femaleRatio ?? value.female ?? null;
		if (male != null || female != null) {
			return { male: String(male ?? "?"), female: String(female ?? "?") };
		}
	}

	const text = String(value).trim();
	if (!text) return null;
	if (/genderless/i.test(text)) return { text: "Genderless" };

	const maleMatch = text.match(/([\d.]+)\s*%\s*(?:male|♂)/i);
	const femaleMatch = text.match(/([\d.]+)\s*%\s*(?:female|♀)/i);
	if (maleMatch && femaleMatch) {
		return { male: maleMatch[1], female: femaleMatch[1] };
	}
	return { text };
}

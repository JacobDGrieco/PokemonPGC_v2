/** Generation-aware type-effectiveness rules for Mon Info. */
import {
	generationForVersionGroup,
	versionGroupForGameKey,
} from "../../data/reference-indexes/game-mapping.js";

export const TYPE_CHART = {
	Normal: { Rock: 0.5, Steel: 0.5, Ghost: 0 },
	Fire: {
		Fire: 0.5,
		Water: 0.5,
		Grass: 2,
		Ice: 2,
		Bug: 2,
		Rock: 0.5,
		Dragon: 0.5,
		Steel: 2,
	},
	Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
	Grass: {
		Fire: 0.5,
		Water: 2,
		Grass: 0.5,
		Poison: 0.5,
		Ground: 2,
		Flying: 0.5,
		Bug: 0.5,
		Rock: 2,
		Dragon: 0.5,
		Steel: 0.5,
	},
	Electric: {
		Water: 2,
		Electric: 0.5,
		Grass: 0.5,
		Ground: 0,
		Flying: 2,
		Dragon: 0.5,
	},
	Ice: {
		Fire: 0.5,
		Water: 0.5,
		Grass: 2,
		Ground: 2,
		Flying: 2,
		Dragon: 2,
		Steel: 0.5,
		Ice: 0.5,
	},
	Fighting: {
		Normal: 2,
		Ice: 2,
		Rock: 2,
		Dark: 2,
		Steel: 2,
		Poison: 0.5,
		Flying: 0.5,
		Psychic: 0.5,
		Bug: 0.5,
		Fairy: 0.5,
		Ghost: 0,
	},
	Poison: {
		Grass: 2,
		Fairy: 2,
		Poison: 0.5,
		Ground: 0.5,
		Rock: 0.5,
		Ghost: 0.5,
		Steel: 0,
	},
	Ground: {
		Fire: 2,
		Electric: 2,
		Poison: 2,
		Rock: 2,
		Steel: 2,
		Grass: 0.5,
		Bug: 0.5,
		Flying: 0,
	},
	Flying: {
		Grass: 2,
		Fighting: 2,
		Bug: 2,
		Electric: 0.5,
		Rock: 0.5,
		Steel: 0.5,
	},
	Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
	Bug: {
		Grass: 2,
		Psychic: 2,
		Dark: 2,
		Fire: 0.5,
		Fighting: 0.5,
		Poison: 0.5,
		Flying: 0.5,
		Ghost: 0.5,
		Steel: 0.5,
		Fairy: 0.5,
	},
	Rock: {
		Fire: 2,
		Ice: 2,
		Flying: 2,
		Bug: 2,
		Fighting: 0.5,
		Ground: 0.5,
		Steel: 0.5,
	},
	Ghost: { Psychic: 2, Ghost: 2, Dark: 0.5, Normal: 0 },
	Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
	Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
	Steel: {
		Rock: 2,
		Ice: 2,
		Fairy: 2,
		Fire: 0.5,
		Water: 0.5,
		Electric: 0.5,
		Steel: 0.5,
	},
	Fairy: {
		Fighting: 2,
		Dragon: 2,
		Dark: 2,
		Fire: 0.5,
		Poison: 0.5,
		Steel: 0.5,
	},
};

const GENERATION_ONE_TYPES = [
	"Normal",
	"Fire",
	"Water",
	"Electric",
	"Grass",
	"Ice",
	"Fighting",
	"Poison",
	"Ground",
	"Flying",
	"Psychic",
	"Bug",
	"Rock",
	"Ghost",
	"Dragon",
];
const PRE_FAIRY_TYPES = [...GENERATION_ONE_TYPES, "Dark", "Steel"];
export const ALL_TYPES = [...PRE_FAIRY_TYPES, "Fairy"];

export function monInfoGenerationForGame(gameKey) {
	if (!String(gameKey || "").trim()) return 9;
	return generationForVersionGroup(versionGroupForGameKey(gameKey));
}

/** Return only attacking types that existed in the selected game. */
export function monInfoTypesForGame(gameKey) {
	const generation = monInfoGenerationForGame(gameKey);
	if (generation <= 1) return GENERATION_ONE_TYPES;
	if (generation <= 5) return PRE_FAIRY_TYPES;
	return ALL_TYPES;
}

function typeMultiplier(attackingType, defendingType, generation) {
	// Generation I shipped with these four effectiveness differences.
	if (generation <= 1) {
		if (attackingType === "Ghost" && defendingType === "Psychic") return 0;
		if (attackingType === "Bug" && defendingType === "Poison") return 2;
		if (attackingType === "Poison" && defendingType === "Bug") return 2;
		if (attackingType === "Ice" && defendingType === "Fire") return 1;
	}
	// Steel resisted Ghost and Dark until Generation VI.
	if (
		generation <= 5 &&
		defendingType === "Steel" &&
		(attackingType === "Ghost" || attackingType === "Dark")
	) {
		return 0.5;
	}
	return TYPE_CHART[attackingType]?.[defendingType] ?? 1;
}

export function computeTypeDefenseBuckets(types, gameKey) {
	const generation = monInfoGenerationForGame(gameKey);
	const defendingTypes = (types || []).map(normalizeTypeName).filter(Boolean);
	return monInfoTypesForGame(gameKey).map((attackingType) => ({
		type: attackingType,
		mult: defendingTypes.reduce(
			(multiplier, defendingType) =>
				multiplier *
				typeMultiplier(attackingType, defendingType, generation),
			1,
		),
	}));
}

function normalizeTypeName(type) {
	if (!type) return null;
	const normalized = String(type).toLowerCase();
	return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

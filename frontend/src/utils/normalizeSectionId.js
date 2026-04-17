const LEGACY_SECTION_SUFFIX_MAP = {
	"extra-credit": "extraCredit",
	"trainer-cards": "trainerCards",
	"side-quests": "sideQuests",
	"mega-stones": "megaStones",
	"mabels-research": "mabelsResearch",
};

export function normalizeSectionSuffix(sectionSuffix) {
	const raw = String(sectionSuffix || "");
	return LEGACY_SECTION_SUFFIX_MAP[raw] || raw;
}

export function normalizeSectionId(sectionId) {
	const raw = String(sectionId || "");
	if (!raw.includes(":")) return raw;

	const [gameKey, sectionSuffix] = raw.split(":", 2);
	if (!gameKey || !sectionSuffix) return raw;
	return `${gameKey}:${normalizeSectionSuffix(sectionSuffix)}`;
}

export function normalizeTaskId(taskId) {
	const raw = String(taskId || "");
	const match = raw.match(/^([^:]+:tasks:)([^:]+)(:.*)$/);
	if (!match) return raw;

	const [, prefix, sectionSuffix, rest] = match;
	return `${prefix}${normalizeSectionSuffix(sectionSuffix)}${rest}`;
}

export function normalizeRecordKeys(record, normalizeKey) {
	const out = {};
	for (const [key, value] of Object.entries(record || {})) {
		out[normalizeKey(key)] = value;
	}
	return out;
}

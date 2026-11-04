/**
 * Stable runtime paths for generated Mon Info form shards. Full catalog keys
 * are retained so unrelated forms never collide through sprite abbreviations.
 */
export function runtimeFormSlug(formKey) {
	const normalized = String(formKey || "base")
		.trim()
		.toLowerCase()
		.replace(/!/g, "-exclamation-")
		.replace(/\?/g, "-question-")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/-+/g, "-");
	return normalized || "base";
}

export function runtimeSpeciesDirectory(nationalDexId) {
	return String(Number(nationalDexId) || 0).padStart(4, "0");
}

export function runtimeShardKey(nationalDexId, formKey) {
	return `${runtimeSpeciesDirectory(nationalDexId)}/${runtimeFormSlug(formKey)}.json`;
}

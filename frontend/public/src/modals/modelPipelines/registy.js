export function detectModelPipeline(glbUrl) {
	const u = String(glbUrl || "").toLowerCase();

	const isLGPE = u.includes("/gen6-7/") && u.includes("/lgpe/");
	if (isLGPE) return "lgpe";

	const is3DS = u.includes("/gen6-7/");
	if (is3DS) return "3DS";

	const isSwSh = u.includes("/gen8/") && u.includes("/sword-shield/");
	if (isSwSh) return "swsh";

	const isPLA = u.includes("/gen8/") && (u.includes("/legendsarceus/"));
	if (isPLA) return "la";

	const isSV = u.includes("/gen9/") && u.includes("/scarlet-violet/");
	if (isSV) return "scvi";

	const isPLZA = u.includes("/gen9/") && (u.includes("/legendsza/"));
	if (isPLZA) return "lza";

	return null;
}

export function resolveVariantModelUrl(glbUrl, variant) {
	// variant: "base" | "shiny"
	// swap /base-model/ <-> /shiny-model/ only when needed
	if (variant === "shiny") {
		return glbUrl.replace("/base-model/", "/shiny-model/");
	}
	return glbUrl.replace("/shiny-model/", "/base-model/");
}
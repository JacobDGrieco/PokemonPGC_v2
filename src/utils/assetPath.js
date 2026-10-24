export function assetPath(path) {
	const cleanPath = String(path || "").replace(/^\/+/, "");
	const rawBase =
		typeof globalThis !== "undefined" && globalThis.__ASSET_BASE_URL__
			? String(globalThis.__ASSET_BASE_URL__).trim()
			: "";
	const base = rawBase.replace(/\/+$/, "");

	if (!cleanPath) return base || "";
	if (!base) return `/${cleanPath}`;

	return `${base}/${cleanPath}`;
}

// Compatibility alias for legacy imports while new code uses the public name.
export const _assetPath = assetPath;

export function _assetPath(path) {
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

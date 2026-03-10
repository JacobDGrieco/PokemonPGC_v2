const RAW_BASE =
	typeof globalThis !== "undefined" && globalThis.__ASSET_BASE_URL__
		? String(globalThis.__ASSET_BASE_URL__).trim()
		: "";

window._assetPath = function _assetPath(path) {
	const cleanPath = String(path || "").replace(/^\/+/, "");
	const base = RAW_BASE.replace(/\/+$/, "");

	if (!cleanPath) return base || "";
	if (!base) return `/${cleanPath}`;

	return `${base}/${cleanPath}`;
};
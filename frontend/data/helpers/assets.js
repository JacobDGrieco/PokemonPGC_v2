const RAW_BASE = String(import.meta.env.VITE_BLOB_ASSET_BASE_URL || "").trim();

window._assetPath = function _assetPath(path) {
	const cleanPath = String(path || "").replace(/^\/+/, "");
	const base = RAW_BASE.replace(/\/+$/, "");

	if (!cleanPath) return base || "";
	if (!base) return `/${cleanPath}`;

	return `${base}/${cleanPath}`;
};
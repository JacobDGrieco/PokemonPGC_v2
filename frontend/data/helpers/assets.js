const RAW_BASE = String(import.meta.env.BLOB_READ_WRITE_TOKEN || "").trim();

window._assetPath = function _assetPath(path) {
	const cleanPath = String(path || "").replace(/^\/+/, "");
	const base = RAW_BASE.replace(/\/+$/, "");

	if (!cleanPath) return base || "";
	if (!base) return `/${cleanPath}`;

	return `${base}/${cleanPath}`;
};
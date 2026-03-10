function _pad(v, zeroes) {
	const s = String(v ?? "");

	// Handle form IDs like "130-f" / "386-a" / "869-cs-b"
	const parts = s.split("-");
	const head = parts[0];

	// If head isn't a number, just return original string
	if (!/^\d+$/.test(head)) return s;

	const padded = head.padStart(zeroes, "0");
	return parts.length > 1 ? `${padded}-${parts.slice(1).join("-")}` : padded;
};
window.pad3 = (v) => _pad(v, 3);
window.pad4 = (v) => _pad(v, 4);

function normFormKey(form) {
	if (!form) return "";
	return String(form)
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "_"); // spaces -> underscores
}

window.spacer = "spacer";

window._slugify = function (s, opts) {
	const o = opts || {};
	const keepPlus = !!o.keepPlus;

	// Build allowed charset (same behavior as now, but configurable)
	const allowed = keepPlus ? "a-z0-9\\+" : "a-z0-9";
	const reNonAllowed = new RegExp(`[^${allowed}]+`, "g");

	return String(s ?? "")
		.trim()
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/['’]/g, "")
		.replace(reNonAllowed, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
};

window._fullId = function (gameKey, bucket, type, form) {
	const gk = String(gameKey || "").trim();
	const b = String(bucket || "").trim();
	const t = String(type || "").trim();
	if (!gk || !b || !t) return "";

	if (form == null || form === "") return `${gk}:${b}:${t}`;
	return `${gk}:${b}:${t}:${String(form).trim().toLowerCase()}`;
};
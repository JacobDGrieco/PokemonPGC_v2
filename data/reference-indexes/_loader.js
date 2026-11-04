/** Lazy fetchers keep large generated reference JSON outside Vite's module graph. */
const manifestPromises = new Map();
const detailPromises = new Map();

export function loadReferenceManifest(kind) {
	if (kind !== "moves" && kind !== "abilities") {
		return Promise.reject(new Error(`Unknown reference index: ${kind}`));
	}
	if (!manifestPromises.has(kind)) {
		manifestPromises.set(kind, fetchJson(referenceUrl(kind, "manifest.json")));
	}
	return manifestPromises.get(kind);
}

export function loadReferenceDetail(kind, relativePath) {
	const detailKey = `${kind}/${String(relativePath || "").replace(/^\/+/, "")}`;
	if (!detailPromises.has(detailKey)) {
		detailPromises.set(detailKey, fetchJson(referenceUrl(kind, relativePath)));
	}
	return detailPromises.get(detailKey);
}

function referenceUrl(kind, relativePath) {
	const base = String(import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
	const cleanPath = String(relativePath || "").replace(/^\/+/, "");
	return `${base}/reference-indexes/${kind}/${cleanPath}`;
}

async function fetchJson(url) {
	const response = await fetch(url, { headers: { Accept: "application/json" } });
	if (!response.ok) {
		throw new Error(`Reference data request failed (${response.status}) for ${url}`);
	}
	return response.json();
}

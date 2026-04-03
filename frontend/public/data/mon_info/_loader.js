// src/data/mon_info/_loader.js
function baseNum(natiId) {
	const num = parseInt(String(natiId).split("-")[0], 10);
	return Number.isFinite(num) ? num : null;
}

export function monInfoUrl(natiId) {
	const num = parseInt(String(natiId).split("-")[0], 10);
	if (!Number.isFinite(num)) return null;

	// _loader.js lives in src/data/mon_info/, so the files are alongside it.
	return new URL(`../data/mon_info/${pad4(num)}.js`, import.meta.url).href;
}

export function monInfoFormUrl(natiId, formKey) {
	const num = baseNum(natiId);
	if (num == null || !formKey) return null;

	const suffix = window.formKeyToSuffix(num, formKey);
	if (!suffix) return null;

	return new URL(`../data/mon_info/${pad4(num)}-${suffix}.js`, import.meta.url).href;
}

const _loaded = new Set();

export async function ensureMonInfoLoaded(natiId, formKey = null) {
	// always load base
	const url = monInfoUrl(natiId);
	if (!url) return false;

	if (!_loaded.has(url)) {
		await import(url);
		_loaded.add(url);
	}

	// optionally load form file (ignore if missing)
	const fUrl = monInfoFormUrl(natiId, formKey);
	if (fUrl && !_loaded.has(fUrl)) {
		try {
			await import(fUrl);
			_loaded.add(fUrl);
		} catch {
			// no form file exists; that's fine
		}
	}

	return true;
}
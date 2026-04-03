// src/data/mon_info/_loader.js
const monInfoModules = import.meta.glob('./*.js');
const _loaded = new Set();

function pad4(n) {
	return String(n).padStart(4, '0');
}

function baseNum(natiId) {
	const num = parseInt(String(natiId).split('-')[0], 10);
	return Number.isFinite(num) ? num : null;
}

function moduleKeyForBase(num) {
	return `./${pad4(num)}.js`;
}

function moduleKeyForForm(num, formKey) {
	const suffix = window.formKeyToSuffix?.(num, formKey);
	if (!suffix) return null;
	return `./${pad4(num)}-${suffix}.js`;
}

export function monInfoUrl(natiId) {
	const num = baseNum(natiId);
	if (num == null) return null;
	return new URL(moduleKeyForBase(num), import.meta.url).href;
}

export function monInfoFormUrl(natiId, formKey) {
	const num = baseNum(natiId);
	if (num == null || !formKey) return null;
	const key = moduleKeyForForm(num, formKey);
	return key ? new URL(key, import.meta.url).href : null;
}

async function importByKey(key, { optional = false } = {}) {
	if (!key || _loaded.has(key)) return false;
	const loader = monInfoModules[key];
	if (!loader) {
		if (optional) return false;
		throw new Error(`Missing mon info module: ${key}`);
	}
	await loader();
	_loaded.add(key);
	return true;
}

export async function ensureMonInfoLoaded(natiId, formKey = null) {
	const num = baseNum(natiId);
	if (num == null) return false;

	await importByKey(moduleKeyForBase(num));

	const formKeyPath = formKey ? moduleKeyForForm(num, formKey) : null;
	if (formKeyPath) {
		await importByKey(formKeyPath, { optional: true });
	}

	return true;
}

import { store, getAllGameKeys } from "./store.js";
import { bootstrapTasks } from "./tasks.js";
import { getCurrentUser, saveGameSave, fetchGameSave } from "../api.js";

/* ===================== IDB tiny helper ===================== */
const DB_NAME = "ppgc-backups";
const DB_STORE = "handles";
const DISABLE_FS_PICKERS = true;

function idbOpen() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => req.result.createObjectStore(DB_STORE);
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function idbGet(key) {
	const db = await idbOpen();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(DB_STORE, "readonly");
		const req = tx.objectStore(DB_STORE).get(key);
		req.onsuccess = () => resolve(req.result || null);
		req.onerror = () => reject(req.error);
	});
}
async function idbSet(key, val) {
	const db = await idbOpen();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(DB_STORE, "readwrite");
		tx.objectStore(DB_STORE).put(val, key);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}

/* ===================== FS helpers ===================== */
const DIR_KEY = "backupDirV1";

async function ensureDirHandle() {
	if (DISABLE_FS_PICKERS) throw new Error("File system access temporarily disabled");

	let handle = await idbGet(DIR_KEY);
	// Handles are structured-cloneable in IDB; permission may still need confirming
	if (handle && (await verifyWritePermission(handle))) {
		return handle;
	}
	// Ask once; afterwards we save handle to IDB and write silently.
	handle = await window.showDirectoryPicker({ id: "PPGC-Backups" });
	const ok = await verifyWritePermission(handle);
	if (!ok) throw new Error("Write permission denied.");
	await idbSet(DIR_KEY, handle);
	return handle;
}

async function verifyWritePermission(handle) {
	if (!handle) return false;
	const perm = await handle.queryPermission({ mode: "readwrite" });
	if (perm === "granted") return true;
	if (perm === "prompt") {
		const p2 = await handle.requestPermission({ mode: "readwrite" });
		return p2 === "granted";
	}
	return false;
}

async function writeJsonFile(dirHandle, filename, obj) {
	const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
	const writable = await fileHandle.createWritable();
	await writable.write(
		new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" })
	);
	await writable.close();
}

function slug(x) {
	return String(x)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/* ===================== Canonical walkers ===================== */
// These read ONLY from your registered data so we cover 100% of IDs every time.
function getSectionsForGame(gameKey) {
	const sections = window.DATA?.sections?.[gameKey] || []; // [{id,title}]
	return sections.map((s) => s.id);
}

function collectAllTaskIdsFromData(gameKey) {
	const tasksByGroup = window.DATA?.tasks || {}; // expects keys like "legendsza-catching": [...]
	const sectionIds = getSectionsForGame(gameKey);
	const out = [];
	const visit = (node) => {
		if (!node || !node.id) return;
		out.push(node.id);
		if (Array.isArray(node.children)) node.children.forEach(visit);
	};
	sectionIds.forEach((groupId) => {
		const rows = tasksByGroup[groupId] || [];
		rows.forEach(visit);
	});
	return Array.from(new Set(out));
}

function collectAllDexIdsFromData(gameKey) {
	const dexArr = window.DATA?.dex?.[gameKey] || [];
	return dexArr.map((d) => d.id);
}

function collectAllFashionKeysFromData(gameKey) {
	const cats = window.DATA?.fashion?.[gameKey]?.categories || [];
	const out = [];
	for (const category of cats) {
		const catId = category.id;
		for (const item of category.items || []) {
			const itemId = item.id; // can be number or string; we keep as-is for lookup
			const forms = Array.isArray(item.forms) ? item.forms : [];
			if (!forms.length) {
				out.push({
					categoryId: catId,
					itemId,
					formLookup: null, // ← lookup key (null = whole item)
					jsonKey: `${slug(catId)}:${slug(itemId)}:-`, // ← pretty JSON key
				});
			} else {
				forms.forEach((f, idx) => {
					const name = typeof f === "string" ? f : f?.name || String(idx + 1);
					// If a form id exists, prefer it; else itemId-{1..N}
					const formId =
						typeof f === "object" && f?.id
							? String(f.id)
							: `${slug(itemId)}-${idx + 1}`;
					out.push({
						categoryId: catId,
						itemId,
						formLookup: name, // ← store uses NAME as the key
						jsonKey: `${slug(catId)}:${slug(itemId)}:${slug(formId)}`,
					});
				});
			}
		}
	}
	return out;
}

function getDexCanonicalForms(gameKey, dexId) {
	const arr = window.DATA?.dex?.[gameKey] || [];
	const entry = arr.find((d) => String(d.id) === String(dexId));
	const list = Array.isArray(entry?.forms) ? entry.forms : [];
	// Always return STRING KEYS, never objects
	return list
		.map((f) =>
			typeof f === "string"
				? f
				: f && (f.name || f.id)
					? String(f.name || f.id)
					: ""
		)
		.filter(Boolean);
}

// Status priority so we can compute the "highest" status
const STATUS_PRIORITY = {
	unknown: 0,
	seen: 1,
	caught: 2,
	shiny: 3,
	alpha: 4,
	shiny_alpha: 5,
};
function liftStatus(base, ...others) {
	let best = STATUS_PRIORITY[base] ?? 0;
	for (const s of others) {
		const p = STATUS_PRIORITY[s] ?? 0;
		if (p > best) best = p;
	}
	// return the status string that matches priority value
	for (const [k, v] of Object.entries(STATUS_PRIORITY)) {
		if (v === best) return k;
	}
	return "unknown";
}

/* ===================== Reading CURRENT values ===================== */
// We prefer store getters. If missing, we fall back to DOM queries (best-effort).
function readTaskState(taskId) {
	if (window.store?.getTaskState) return window.store.getTaskState(taskId);

	// Fallback DOM (expects data-task-id wrapper with either a checkbox or a slider/count)
	const root = document.querySelector(`[data-task-id="${CSS.escape(taskId)}"]`);
	if (!root) return { type: "check", done: false };

	const slider = root.querySelector('input[type="range"]');
	if (slider) {
		const cc = Number.parseInt(
			slider.getAttribute("data-current-count") || slider.value || "0",
			10
		);
		const ct = Number.parseInt(
			slider.getAttribute("data-current-tier") || "0",
			10
		);
		return { type: "tiered", currentCount: cc, currentTier: ct };
	}
	const cb = root.querySelector('input[type="checkbox"]');
	return { type: "check", done: !!cb?.checked };
}

function readDexState(gameKey, dexId) {
	// If you later provide store.getDexStatus(gameKey, dexId) returning {status, forms:{[k]:status}}
	if (window.store?.getDexStatus)
		return window.store.getDexStatus(gameKey, dexId);

	// DOM fallback:
	const cell = document.querySelector(`.dex-cell[data-dex-id="${dexId}"]`);
	const status =
		cell?.querySelector("select[data-dex-status]")?.value ||
		cell?.getAttribute("data-dex-status") ||
		"unknown";
	const forms = {};
	document
		.querySelectorAll(`.dex-form[data-dex-id="${dexId}"]`)
		.forEach((f) => {
			const key =
				f.getAttribute("data-form-key") ||
				f.getAttribute("data-form-name") ||
				f.id ||
				"";
			if (!key) return;
			const formStatus =
				f.querySelector("select[data-dex-form-status]")?.value ||
				f.getAttribute("data-status") ||
				"unknown";
			forms[key] = formStatus;
		});
	return { status, forms };
}

function readFashionState(gameKey, categoryId, itemId, formLookup) {
	if (window.store?.getFashionState)
		return window.store.getFashionState(
			gameKey,
			categoryId,
			itemId,
			formLookup
		);
}

/* ===================== Snapshot builder ===================== */
export function collectSnapshot(gameKey) {
	const when = new Date().toISOString();

	// Tasks
	const allTaskIds = collectAllTaskIdsFromData(gameKey);
	const tasks = {};
	for (const id of allTaskIds) {
		tasks[id] = readTaskState(id);
	}

	// Dex
	const allDexIds = collectAllDexIdsFromData(gameKey);
	const dex = {};
	for (const id of allDexIds) {
		// 1) read current (store getter preferred, else DOM)
		const cur = readDexState(gameKey, id); // { status, forms }
		const baseStatus = cur?.status ?? "unknown";
		const forms = { ...(cur?.forms || {}) };

		// 2) ensure ALL canonical forms are present (default "unknown")
		const canonicalForms = getDexCanonicalForms(gameKey, id);
		for (const fname of canonicalForms) {
			if (!(fname in forms)) forms[fname] = "unknown";
		}

		// 3) lift parent status if any form outranks it
		const formStatuses = Object.values(forms);
		const lifted = liftStatus(baseStatus, ...formStatuses);

		dex[id] = { status: lifted, forms };
	}

	// Fashion
	const fashion = {};
	const fKeys = collectAllFashionKeysFromData(gameKey);
	for (const k of fKeys) {
		const { categoryId, itemId, formLookup, jsonKey } = k;
		fashion[jsonKey] = readFashionState(
			gameKey,
			categoryId,
			itemId,
			formLookup
		);
	}

	// Distributions (simple boolean map per game)
	const distributions =
		window.store?.distributionsStatus instanceof Map
			? window.store.distributionsStatus.get(gameKey) || {}
			: {};

	// Research tasks (per-game bucket stored under dexResearchStatus)
	const research =
		window.store?.dexResearchStatus instanceof Map
			? window.store.dexResearchStatus.get(gameKey) || {}
			: {};

	// Curry (status + per-form buckets)
	const curry = {
		status:
			window.store?.curryStatus instanceof Map
				? window.store.curryStatus.get(gameKey) || {}
				: {},
		forms:
			window.store?.curryFormsStatus instanceof Map
				? window.store.curryFormsStatus.get(gameKey) || {}
				: {},
	};

	// Sandwich (status + per-form buckets)
	const sandwich = {
		status:
			window.store?.sandwichStatus instanceof Map
				? window.store.sandwichStatus.get(gameKey) || {}
				: {},
		forms:
			window.store?.sandwichFormsStatus instanceof Map
				? window.store.sandwichFormsStatus.get(gameKey) || {}
				: {},
	};

	// Meta (just helpful context)
	const meta = {
		gameKey,
		generatedAt: when,
		version: "v1",
	};

	return {
		meta,
		tasks,
		dex,
		fashion,
		distributions,
		research,
		curry,
		sandwich,
	};
}


/* ===================== Backup orchestration ===================== */
let backupTimer = null;
const AUTO_ENABLED_KEY = "ppgc_autobackups_enabled";

function getAutoBackupsEnabled() {
	try {
		const v = localStorage.getItem(AUTO_ENABLED_KEY);
		return v === null ? true : v === "true"; // default: ON
	} catch {
		return true;
	}
}

function setAutoBackupsEnabled(enabled) {
	try {
		localStorage.setItem(AUTO_ENABLED_KEY, enabled ? "true" : "false");
	} catch { }
	// (re)apply scheduler immediately
	initBackups(_lastInitOptions || { minutes: 10 });
}

let _lastInitOptions = null;

function currentGameKey() {
	// Prefer current nav state from the store
	const fromStore = store?.state?.gameKey;
	if (fromStore) return fromStore;

	// Fallbacks: DOM attributes or a safe default
	const fromAttr =
		document.querySelector("#content")?.getAttribute("data-game-key") ||
		document.body?.getAttribute("data-game-key") ||
		window.PPGC?.currentGameKey ||
		null;

	return fromAttr || "legendsza";
}

export async function backupNow() {
	const gameKey = currentGameKey();
	const dir = await ensureDirHandle();

	const snap = collectSnapshot(gameKey);
	const filename = `${gameKey}.json`;
	await writeJsonFile(dir, filename, snap);

	await upsertManifestEntries(dir, {
		[gameKey]: { path: filename },
	});

	emitBackupDone(gameKey);
}

export async function backupAllNow() {
	const dir = await ensureDirHandle();
	const when = new Date().toISOString();
	const games = getAllGameKeys();

	for (const gameKey of games) {
		const snap = collectSnapshot(gameKey);
		const filename = `${gameKey}.json`;
		await writeJsonFile(dir, filename, snap);

		await upsertManifestEntries(dir, {
			[gameKey]: { path: filename },
		});

		emitBackupDone(gameKey);
	}

	const metaName = `meta-all.json`;
	await writeJsonFile(dir, metaName, { generatedAt: when, games });

	await upsertManifestEntries(dir, {
		"meta-all": { path: metaName },
	});
}

export function initBackups({ minutes = 10 } = {}) {
	_lastInitOptions = { minutes };
	// Ask browser to persist storage (helps keep IDB/permissions)
	if (navigator?.storage?.persist) {
		navigator.storage.persist().catch(() => { });
	}
	if (backupTimer) clearInterval(backupTimer);
	if (!getAutoBackupsEnabled()) {
		backupTimer = null;
		return;
	}
	backupTimer = setInterval(() => {
		backupAllNow().catch((err) =>
			console.debug("[PPGC backup] skipped:", err?.message || err)
		);
	}, Math.max(1, minutes) * 60 * 1000);
}

export async function isBackupFolderGranted() {
	try {
		const handle = await (async () => {
			const h = await idbGet(DIR_KEY);
			if (!h) return null;
			const perm = await h.queryPermission({ mode: "readwrite" });
			if (perm === "granted") return h;
			const req = await h.requestPermission({ mode: "readwrite" });
			return req === "granted" ? h : null;
		})();
		return !!handle;
	} catch {
		return false;
	}
}

// Fire a DOM event so UI can update “Last backup” indicator
function emitBackupDone(gameKey) {
	try {
		const ts = new Date().toISOString();
		window.dispatchEvent(
			new CustomEvent("ppgc:backup:done", { detail: { gameKey, ts } })
		);
		// cache last ts for quick reads
		localStorage.setItem("ppgc_last_backup_ts", ts);
		localStorage.setItem("ppgc_last_backup_game", gameKey || "");
	} catch { }
}

export async function chooseBackupFolder() {
	if (DISABLE_FS_PICKERS) throw new Error("Manual backup folder selection disabled");

	const dirHandle = await window.showDirectoryPicker({ id: "PPGC-Backups" });
	const perm = await dirHandle.requestPermission({ mode: "readwrite" });
	if (perm !== "granted")
		throw new Error("Write permission denied for chosen folder.");

	await idbSet(DIR_KEY, dirHandle);

	// Ensure manifest exists the moment a folder is chosen
	await loadOrInitManifest(dirHandle);
	return true;
}

/* ====================== Server Backup ======================= */
let serverAutoSaveId = null;
let serverChangeSaveTimeout = null;

export async function initialServerBackup() {
	try {
		const games = getAllGameKeys();
		for (const gameKey of games) {
			if (!gameKey) continue;
			const snap = collectSnapshot(gameKey);
			await saveGameSave(gameKey, snap);
		}
	} catch (err) {
		console.debug(
			"[PPGC initial server backup] skipped:",
			err?.message || err
		);
	}
}

export function scheduleServerSave(gameKey, delayMs = 10_000) {
	try {
		// Debounce: reset the timer on each call
		if (serverChangeSaveTimeout !== null) {
			clearTimeout(serverChangeSaveTimeout);
		}

		serverChangeSaveTimeout = window.setTimeout(async () => {
			serverChangeSaveTimeout = null;
			try {
				const effectiveGameKey = gameKey || currentGameKey();
				if (!effectiveGameKey) return;

				const snap = collectSnapshot(effectiveGameKey);
				await saveGameSave(effectiveGameKey, snap);
			} catch (err) {
				console.debug(
					"[PPGC server change-backup] skipped:",
					err?.message || err
				);
			}
		}, delayMs);
	} catch (err) {
		console.debug(
			"[PPGC server change-backup] schedule failed:",
			err?.message || err
		);
	}
}
if (typeof window !== "undefined") {
	window.addEventListener("ppgc:store:saved", (e) => {
		const gameKey = e?.detail?.gameKey || null;
		scheduleServerSave(gameKey);
	});
}

export async function loadAllGames() {
	try {
		const games = getAllGameKeys();
		for (const gameKey of games) {
			if (!gameKey) continue;
			try {
				await loadGame(gameKey);
			} catch (err) {
				console.debug(
					"[PPGC server load-all] skipped game",
					gameKey,
					err?.message || err
				);
			}
		}
	} catch (err) {
		console.debug(
			"[PPGC server load-all] failed:",
			err?.message || err
		);
	}
}

export async function loadGame(gameKey) {
	try {
		if (!gameKey) return;

		const res = await fetchGameSave(gameKey);
		if (!res || !res.save || !res.save.data) return;

		const snap = res.save.data;
		applySnapshotToStore(snap);

		// Optional: let the UI know an import happened
		window.dispatchEvent(
			new CustomEvent("ppgc:import:done", {
				detail: {
					scope: "game-server",
					gameKey,
					ts: new Date().toISOString(),
				},
			})
		);
	} catch (err) {
		console.debug(
			"[PPGC server load] skipped game",
			gameKey,
			err?.message || err
		);
	}
}

export function startServerAutoBackup() {
	if (serverAutoSaveId != null) return;

	// 5 minutes
	const intervalMs = 5 * 60 * 1000;

	serverAutoSaveId = window.setInterval(async () => {
		try {
			const gameKey = currentGameKey();
			if (!gameKey) return;

			const snap = collectSnapshot(gameKey);
			await saveGameSave(gameKey, snap);
		} catch (err) {
			console.debug("[PPGC server auto-backup] skipped:", err?.message || err);
		}
	}, intervalMs);
}

export function stopServerAutoBackup() {
	if (serverAutoSaveId != null) {
		window.clearInterval(serverAutoSaveId);
		serverAutoSaveId = null;
	}
}


/* ===================== Manifest helpers ===================== */
const MANIFEST_NAME = "ppgc.manifest.json";
const SCHEMA_VERSION = 1;

async function readJsonFile(dirHandle, filename) {
	try {
		const fh = await dirHandle.getFileHandle(filename, { create: false });
		const f = await fh.getFile();
		return JSON.parse(await f.text());
	} catch {
		return null;
	}
}

async function writeManifest(dirHandle, manifest) {
	const fileHandle = await dirHandle.getFileHandle(MANIFEST_NAME, {
		create: true,
	});
	const writable = await fileHandle.createWritable();
	await writable.write(
		new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" })
	);
	await writable.close();
}

/** Stable-ish instance id for this backup folder (create once and keep in file). */
function makeInstanceId() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(
			c ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
		).toString(16)
	);
}

async function loadOrInitManifest(dirHandle) {
	let m = await readJsonFile(dirHandle, MANIFEST_NAME);
	if (!m) {
		m = {
			app: "PokemonPGC",
			schemaVersion: SCHEMA_VERSION,
			createdAt: new Date().toISOString(),
			updatedAt: null,
			instanceId: makeInstanceId(),
			files: {}, // logicalKey -> { path, size, lastModified, sha256 }
		};
		await writeManifest(dirHandle, m);
	}
	return m;
}

async function sha256Hex(blobOrString) {
	const data =
		typeof blobOrString === "string"
			? new TextEncoder().encode(blobOrString)
			: await blobOrString.arrayBuffer();
	const digest = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(digest))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

/** Upsert one or more file entries: updates `.files` and `updatedAt`. */
async function upsertManifestEntries(
	dirHandle,
	entries /* { [logicalKey]: { path, fileHandle? } } */
) {
	const manifest = await loadOrInitManifest(dirHandle);
	for (const [key, info] of Object.entries(entries)) {
		const fh =
			info.fileHandle ||
			(await dirHandle.getFileHandle(info.path, { create: false }));
		const f = await fh.getFile();
		const sha256 = await sha256Hex(f);
		manifest.files[key] = {
			path: info.path,
			size: f.size,
			lastModified: f.lastModified || Date.now(),
			sha256,
		};
	}
	manifest.updatedAt = new Date().toISOString();
	await writeManifest(dirHandle, manifest);
}

/* ===================== Import helpers ===================== */

async function readTextFile(dirHandle, filename) {
	const fh = await dirHandle.getFileHandle(filename, { create: false });
	const f = await fh.getFile();
	return await f.text();
}

async function readJsonChecked(dirHandle, filename, expectedSha256) {
	const txt = await readTextFile(dirHandle, filename);
	const gotSha = await sha256Hex(txt);
	if (expectedSha256 && expectedSha256 !== gotSha) {
		throw new Error(`Checksum mismatch for ${filename}`);
	}
	return JSON.parse(txt);
}

function applyTasksSnapshotToStore(tasksObj) {
	// Update tasks by DFS across all sections; mutate node then save later
	const visitAll = (cb) => {
		for (const [, rows] of window.store?.tasksStore?.entries?.() || []) {
			const dfs = (arr) => {
				for (const t of arr || []) {
					if (!t) continue;
					cb(t);
					if (Array.isArray(t.children)) {
						dfs(t.children);
					}
				}
			};
			dfs(rows);
		}
	};

	visitAll((node) => {
		const snap = tasksObj[String(node.id)];
		if (!snap) return;
		if (snap.type === "tiered") {
			node.type = "tiered";
			node.currentTier = Number(snap.currentTier || 0);
			node.currentCount = Number(snap.currentCount || 0);
		} else {
			node.type = "check";
			node.done = !!snap.done;
		}
	});
}

function applyDexSnapshotToStore(gameKey, dexObj) {
	// Top-level status map: Map<gameKey, { [monId]: status }>
	const dexStatus = window.store?.dexStatus;
	const byGame = dexStatus?.get?.(gameKey) || {};
	for (const [monId, rec] of Object.entries(dexObj || {})) {
		byGame[String(monId)] = rec?.status || "unknown";
	}
	dexStatus?.set?.(gameKey, byGame);

	// Per-form statuses: Map<gameKey, { [monId]: { forms: { [formName]: status } } }>
	const dexForms = window.store?.dexFormsStatus;
	const byGameForms = dexForms?.get?.(gameKey) || {};
	for (const [monId, rec] of Object.entries(dexObj || {})) {
		const forms = rec?.forms || {};
		byGameForms[String(monId)] = { forms: { ...forms } };
	}
	dexForms?.set?.(gameKey, byGameForms);
}

function parseFashionJsonKey(jsonKey) {
	// keys look like "<catSlug>:<itemSlug>:-" OR "<catSlug>:<itemSlug>:<formSlug>"
	const parts = String(jsonKey).split(":");
	if (parts.length < 3) return null;
	const [catSlug, itemSlug, formSlug] = parts;

	// Find matching category/item in DATA (by slug of ids)
	const games = Object.keys(window.DATA?.fashion || {});
	for (const g of games) {
		const cats = window.DATA.fashion[g]?.categories || [];
		for (const cat of cats) {
			const catId = String(cat.id);
			const catIdSlug = catId.toLowerCase().replace(/[^a-z0-9]+/g, "-");
			if (catIdSlug !== catSlug) continue;

			for (const item of cat.items || []) {
				const itemId = String(item.id);
				const itemIdSlug = itemId.toLowerCase().replace(/[^a-z0-9]+/g, "-");
				if (itemIdSlug !== itemSlug) continue;

				return { gameKey: g, categoryId: catId, itemId, formSlug };
			}
		}
	}
	return null;
}

function mapFormSlugToName(gameKey, categoryId, itemId, formSlug) {
	if (formSlug === "-") return null; // whole item toggle
	const cats = window.DATA?.fashion?.[gameKey]?.categories || [];
	const cat = cats.find((c) => String(c.id) === String(categoryId));
	const item = cat?.items?.find((i) => String(i.id) === String(itemId));
	const forms = Array.isArray(item?.forms) ? item.forms : [];
	// Try explicit form.id slug match first
	for (let idx = 0; idx < forms.length; idx++) {
		const f = forms[idx];
		const fid = typeof f === "object" && f?.id ? String(f.id) : null;
		const fidSlug = fid ? fid.toLowerCase().replace(/[^a-z0-9]+/g, "-") : null;
		if (fidSlug && fidSlug === formSlug) {
			return typeof f === "string" ? f : f.name || String(idx + 1);
		}
	}
	// Else if we encoded "itemId-{idx+1}" we can recover the index:
	const m = formSlug.match(/-(\d+)$/);
	if (m) {
		const idx = Math.max(1, parseInt(m[1], 10)) - 1;
		const f = forms[idx];
		if (f) return typeof f === "string" ? f : f.name || String(idx + 1);
	}
	return null; // fallback; importer will skip unknowns
}

function ensureStoreMap(propName) {
	if (!window.store) return null;
	const cur = window.store[propName];
	if (cur instanceof Map) return cur;
	const m = new Map();
	window.store[propName] = m;
	return m;
}

function ensureFashionMaps(gameKey) {
	const fs = window.store?.fashionStatus;
	const ff = window.store?.fashionFormsStatus;

	if (!fs?.get?.(gameKey)) fs?.set?.(gameKey, new Map());
	if (!ff?.get?.(gameKey)) ff?.set?.(gameKey, new Map());

	return {
		fash: fs.get(gameKey),
		fashForms: ff.get(gameKey),
	};
}

function applyFashionSnapshotToStore(gameKeyDefault, fashionObj) {
	for (const [jsonKey, val] of Object.entries(fashionObj || {})) {
		const meta = parseFashionJsonKey(jsonKey);
		if (!meta) continue;
		const { gameKey = gameKeyDefault, categoryId, itemId, formSlug } = meta;
		const { fash, fashForms } = ensureFashionMaps(gameKey);

		const catKey = String(categoryId);
		const itemKey = String(itemId);
		if (!fash.get(catKey)) fash.set(catKey, {});
		if (!fashForms.get(catKey)) fashForms.set(catKey, {});

		if (formSlug === "-") {
			// whole-item toggle
			const pack = fash.get(catKey);
			pack[itemKey] = !!val;
			fash.set(catKey, pack);
		} else {
			// per-form toggle (using NAME as store’s key)
			const formName = mapFormSlugToName(gameKey, categoryId, itemId, formSlug);
			if (!formName) continue;
			const pack = fashForms.get(catKey);
			const itemPack = pack[itemKey] || { forms: {} };
			itemPack.forms[formName] = !!val;
			pack[itemKey] = itemPack;
			fashForms.set(catKey, pack);
		}
	}
}

function applyDistributionsSnapshotToStore(gameKey, distributionsObj) {
	const map = window.store?.distributionsStatus;
	if (!(map instanceof Map)) return;
	const rec =
		distributionsObj && typeof distributionsObj === "object" ? distributionsObj : {};
	map.set(gameKey, { ...rec });
}

function applyResearchSnapshotToStore(gameKey, researchObj) {
	const map = ensureStoreMap("dexResearchStatus");
	if (!map) return;

	const rec =
		researchObj && typeof researchObj === "object" ? researchObj : {};
	map.set(gameKey, { ...rec });
}

function applyCurrySnapshotToStore(gameKey, curryObj) {
	if (!curryObj || typeof curryObj !== "object") curryObj = {};
	const statusMap = window.store?.curryStatus;
	const formsMap = window.store?.curryFormsStatus;

	if (statusMap instanceof Map) {
		const rawStatus =
			curryObj.status && typeof curryObj.status === "object" ? curryObj.status : {};
		statusMap.set(gameKey, { ...rawStatus });
	}

	if (formsMap instanceof Map) {
		const rawForms =
			curryObj.forms && typeof curryObj.forms === "object" ? curryObj.forms : {};
		const normalized = {};
		for (const [curryId, node] of Object.entries(rawForms)) {
			normalized[curryId] = {
				all: !!node?.all,
				forms: node?.forms || {},
			};
		}
		formsMap.set(gameKey, normalized);
	}
}

function applySandwichSnapshotToStore(gameKey, sandwichObj) {
	if (!sandwichObj || typeof sandwichObj !== "object") sandwichObj = {};
	const statusMap = window.store?.sandwichStatus;
	const formsMap = window.store?.sandwichFormsStatus;

	if (statusMap instanceof Map) {
		const rawStatus =
			sandwichObj.status && typeof sandwichObj.status === "object"
				? sandwichObj.status
				: {};
		statusMap.set(gameKey, { ...rawStatus });
	}

	if (formsMap instanceof Map) {
		const rawForms =
			sandwichObj.forms && typeof sandwichObj.forms === "object"
				? sandwichObj.forms
				: {};
		const normalized = {};
		for (const [sandwichId, node] of Object.entries(rawForms)) {
			normalized[sandwichId] = {
				all: !!node?.all,
				forms: node?.forms || {},
			};
		}
		formsMap.set(gameKey, normalized);
	}
}

function applySnapshotToStore(snap) {
	try {
		if (!snap || typeof snap !== "object") return;

		const gameKey = snap.meta?.gameKey || null;

		// --- Make sure all sections for this game exist in tasksStore ---
		if (gameKey && window.store?.tasksStore && typeof bootstrapTasks === "function") {
			const sections = window.DATA?.sections?.[gameKey] || [];
			for (const s of sections) {
				const sectionId = s.id;
				if (!sectionId) continue;

				// If this section hasn't been bootstrapped yet in this runtime,
				// create its task rows from DATA.tasks so imports can update them.
				if (!window.store.tasksStore.has(sectionId)) {
					try {
						bootstrapTasks(sectionId, window.store.tasksStore);
					} catch (e) {
						console.debug(
							"[PPGC import] bootstrapTasks failed for section",
							sectionId,
							e
						);
					}
				}
			}
		}

		// --- Apply sections from snapshot ---

		// Tasks (no gameKey needed)
		if (snap.tasks) {
			applyTasksSnapshotToStore(snap.tasks);
		}

		// Dex
		if (gameKey && snap.dex) {
			applyDexSnapshotToStore(gameKey, snap.dex);
		}

		// Fashion
		if (gameKey && snap.fashion) {
			applyFashionSnapshotToStore(gameKey, snap.fashion);
		}

		// Distributions
		if (gameKey && snap.distributions) {
			applyDistributionsSnapshotToStore(gameKey, snap.distributions);
		}

		// Research tasks (new key: `research`, but still accept legacy `extraCredit`)
		const researchPayload = snap.research || snap.extraCredit || null;
		if (gameKey && researchPayload) {
			applyResearchSnapshotToStore(gameKey, researchPayload);
		}

		// Curry
		if (gameKey && snap.curry) {
			applyCurrySnapshotToStore(gameKey, snap.curry);
		}

		// Sandwich
		if (gameKey && snap.sandwich) {
			applySandwichSnapshotToStore(gameKey, snap.sandwich);
		}

		// Persist everything back to localStorage
		if (window.store?.save) {
			window.store.save();
		}
	} catch (err) {
		console.error("[PPGC import] failed to apply snapshot", err);
	}
}

export async function importGameFromFolder(gameKey) {
	const dir = await ensureDirHandle(); // or fail if permission is gone
	const manifest = await loadOrInitManifest(dir);
	const entry = manifest.files?.[gameKey];
	if (!entry?.path) throw new Error(`No snapshot for ${gameKey} in manifest.`);

	const snap = await readJsonChecked(dir, entry.path, entry.sha256);
	applySnapshotToStore(snap);
	window.store?.save?.();

	// tell UI
	window.dispatchEvent(
		new CustomEvent("ppgc:import:done", {
			detail: { scope: "game", gameKey, ts: new Date().toISOString() },
		})
	);
}

export async function importAllFromFolder() {
	const dir = await ensureDirHandle();
	const manifest = await loadOrInitManifest(dir);

	// Prefer meta-all if present to decide which games to import
	let games = [];
	if (manifest.files?.["meta-all"]?.path) {
		const meta = await readJsonChecked(
			dir,
			manifest.files["meta-all"].path,
			manifest.files["meta-all"].sha256
		);
		games = Array.isArray(meta?.games) ? meta.games : [];
	}
	if (!games.length) {
		// fallback: keys in manifest except meta-all
		games = Object.keys(manifest.files || {}).filter((k) => k !== "meta-all");
	}

	for (const g of games) {
		if (!manifest.files[g]?.path) continue;
		const snap = await readJsonChecked(
			dir,
			manifest.files[g].path,
			manifest.files[g].sha256
		);
		applySnapshotToStore(snap);
	}
	window.store?.save?.();

	window.dispatchEvent(
		new CustomEvent("ppgc:import:done", {
			detail: { scope: "all", games, ts: new Date().toISOString() },
		})
	);
}

export async function autoImportOnStart({ mode = "all" } = {}) {
	if (DISABLE_FS_PICKERS) return;

	try {
		try {
			const raw = localStorage.getItem("ppgc_v1");
			if (raw) {
				const obj = JSON.parse(raw);
				const hasContent =
					obj &&
					typeof obj === "object" &&
					(Object.keys(obj.sections || {}).length ||
						Object.keys(obj.tasks || {}).length ||
						Object.keys(obj.dexStatus || {}).length);
				if (hasContent) return; // keep user's local state
			}
		} catch { }

		// If the folder is still granted, just go
		const granted = await isBackupFolderGranted();
		if (!granted) return;

		if (mode === "game") {
			const gk =
				document.querySelector("#content")?.getAttribute("data-game-key") ||
				document.body?.getAttribute("data-game-key") ||
				window.PPGC?.currentGameKey ||
				null;
			if (gk) await importGameFromFolder(gk);
		} else {
			await importAllFromFolder();
		}
	} catch (e) {
		console.debug("[PPGC import] skipped:", e?.message || e);
	}
}
export { getAutoBackupsEnabled, setAutoBackupsEnabled };

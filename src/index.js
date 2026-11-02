/**
 * Boots the compatibility-sensitive checklist runtime after React has mounted.
 *
 * This module installs browser APIs, expands registered sync metadata, restores
 * persistence, and coordinates legacy rendering. Route code imports it lazily;
 * keep initialization order and idempotency intact when moving responsibilities.
 */

import "./registry.js";
import "../data/bootstraps/lite.js";

import { store } from "./store.js";
import {
	initBackups,
	autoImportOnStart,
	startServerAutoBackup,
	stopServerAutoBackup,
	loadAllGames,
	setCloudSyncEnabled,
} from "./persistence.js";
import * as api from "../api.js";
import { initLayoutSwitcher } from "./ui/layoutSwitcher.js";
import { elements } from "./ui/dom.js";
import { renderCrumbs } from "./ui/crumbs.js";
import { emitPpgcUiSync } from "./react-bridge/storeBridge.js";
import { bootstrapTasksForGame } from "./react-bridge/progressSummary.js";
import { initHistory } from "./history.js";
import { ensurePpgcRoot } from "./runtime/globals.js";
import { installUiGlobals } from "./runtime/uiGlobals.js";
import { assetPath } from "./utils/assetPath.js";
import { ensureSyncSetsExpandedForGame } from "./sync.js";
import { TIERS, TIER_ORDER } from "./config/tiers.js";

const PPGC = ensurePpgcRoot();
installUiGlobals();
window.__PPGC_FRONTEND_LOADED__ = true;

// ------------------------------------------------------------
// 3) Rendering
// ------------------------------------------------------------
let accountMenuOpen = false;

async function ensureDexMonInfoLoaded() {
	// loads setupMonInfoModal + openMonInfo (and whatever it imports)
	return await import("./modals/dex-mon-info.js");
}

async function ensureModelViewerLoaded() {
	// loads the model viewer modal code only when needed
	return await import("./modals/model-viewer.js");
}

async function ensureDistributionsLoaded() {
	return await import("./modals/distributions.js");
}

// ------------------------------------------------------------
// Lazy-load per-generation seed data (tasks/layouts/dex/sync)
// ------------------------------------------------------------

function resolveGenKeyForGame(gameKey) {
	const gamesByGen = window.DATA?.games || {};
	for (const [genKey, arr] of Object.entries(gamesByGen)) {
		if ((arr || []).some((g) => g?.key === gameKey)) return genKey;
	}
	return null;
}

function _getLoadedGensSet() {
	window.PPGC = window.PPGC || {};
	if (!PPGC._loadedGenData) PPGC._loadedGenData = new Set();
	return PPGC._loadedGenData;
}

function _getGenLoadPromises() {
	window.PPGC = window.PPGC || {};
	if (!PPGC._genLoadPromises) PPGC._genLoadPromises = new Map();
	return PPGC._genLoadPromises;
}

function _getPreparedSharedGenSet() {
	window.PPGC = window.PPGC || {};
	if (!PPGC._preparedSharedGenData) PPGC._preparedSharedGenData = new Set();
	return PPGC._preparedSharedGenData;
}

const SHARED_GEN_PRELOAD_KEYS = new Set(["gen8", "gen9", "gen9_2"]);

function prepareSharedGenData(genKey) {
	if (!SHARED_GEN_PRELOAD_KEYS.has(genKey)) return;

	const prepared = _getPreparedSharedGenSet();
	if (prepared.has(genKey)) return;

	const games = window.DATA?.games?.[genKey] || [];
	for (const game of games) {
		if (!game?.key) continue;
		ensureSyncSetsExpandedForGame(game.key);
		bootstrapTasksForGame(game.key, store);
	}

	prepared.add(genKey);
}

async function ensureGenDataLoaded(genKey) {
	if (!genKey) return false;

	const loaded = _getLoadedGensSet();
	if (loaded.has(genKey)) return false;

	const promises = _getGenLoadPromises();
	if (promises.has(genKey)) {
		await promises.get(genKey);
		return true;
	}

	const p = (async () => {
		switch (genKey) {
			case "gen1":
				await import("../data/bootstraps/gen1.js");
				break;
			case "gen2":
				await import("../data/bootstraps/gen2.js");
				break;
			case "gen3":
				await import("../data/bootstraps/gen3.js");
				break;
			case "gen4":
				await import("../data/bootstraps/gen4.js");
				break;
			case "gen5":
				await import("../data/bootstraps/gen5.js");
				break;
			case "gen6":
				await import("../data/bootstraps/gen6.js");
				break;
			case "gen7":
				await import("../data/bootstraps/gen7.js");
				break;
			case "gen7_2":
				await import("../data/bootstraps/gen7_2.js");
				break;
			case "gen8":
				await import("../data/bootstraps/gen8.js");
				break;
			case "gen8_2":
				await import("../data/bootstraps/gen8_2.js");
				break;
			case "gen9":
				await import("../data/bootstraps/gen9.js");
				break;
			case "gen9_2":
				await import("../data/bootstraps/gen9_2.js");
				break;
			case "home":
				await import("../data/bootstraps/home.js");
				break;
			default:
				console.warn("[bootstrap] Unknown genKey:", genKey);
		}
		loaded.add(genKey);
		promises.delete(genKey);
	})();

	promises.set(genKey, p);
	await p;
	prepareSharedGenData(genKey);
	return true;
}

function ensureGenDataForState(state) {
	const lvl = state?.level;
	// ✅ Tools/MonInfo need HOME dex (window.DATA.dex.home) for the Mon Info cards/list
	if (lvl === "tools" || lvl === "moninfo") {
		const loaded = _getLoadedGensSet();
		if (!loaded.has("home")) {
			ensureGenDataLoaded("home")
				.then(() => {
					try {
						renderAll();
					} catch {}
				})
				.catch((e) =>
					console.debug("[bootstrap] home load failed:", e),
				);
			return false; // not ready yet
		}
		return true;
	}

	// ✅ NEW: "Game view" (sections summary for a gen) needs that gen's seed data too
	if (lvl === "game" && state?.genKey) {
		const genKey = state.genKey;

		const loaded = _getLoadedGensSet();
		if (loaded.has(genKey)) return true;

		ensureGenDataLoaded(genKey)
			.then(() => {
				try {
					renderAll();
				} catch {}
			})
			.catch((e) => console.debug("[bootstrap] gen load failed:", e));

		return false; // not ready yet
	}

	// Existing behavior: only required when entering a specific game/section.
	const gameKey = state?.gameKey;
	if (!gameKey) return true;

	const genKey = resolveGenKeyForGame(gameKey);
	if (!genKey) return true;

	const loaded = _getLoadedGensSet();
	if (loaded.has(genKey)) return true;

	ensureGenDataLoaded(genKey)
		.then(() => {
			try {
				renderAll();
			} catch {}
		})
		.catch((e) => console.debug("[bootstrap] gen load failed:", e));

	return false;
}

/**
 * Re-render all primary UI regions based on current store state.
 * - Sidebar (generations / games / sections)
 * - Breadcrumbs
 * - Main content panel
 */
function renderAll() {
	window.PPGC = window.PPGC || {};
	PPGC._storeRef = store;
	PPGC._tasksStoreRef = store.tasksStore;
	PPGC.gen1SpriteColor = store.state.gen1SpriteMode === "color";
	PPGC.gen1SpriteRegion = store.state.gen1RegionMode === "jp" ? "jp" : "rf";
	renderCrumbs(store, elements);

	const ready = ensureGenDataForState(store.state);
	if (!ready) {
		emitPpgcUiSync({ state: store.state, loading: true });
		return;
	}

	emitPpgcUiSync({ state: store.state, loading: false });
}
initHistory({ store, renderAll });

// ------------------------------------------------------------
// 4) Account / auth UI
// ------------------------------------------------------------

let currentUser = null;
let currentUserIcon = "default";
let authBootstrapPromise = null;

function applyAccountButtonIcon(btn, icon) {
	const nextIcon = String(icon || "default");
	const isCustom = nextIcon.startsWith("data:image/");

	btn.dataset.icon = isCustom ? "custom" : nextIcon;
	btn.classList.toggle("has-custom-icon", isCustom);
	btn.style.backgroundImage = isCustom ? `url("${nextIcon}")` : "";
}

/**
 * Uses the server-serialized effective tier, which already accounts for paid
 * and complimentary access, while failing closed to Free for unknown values.
 */
function resolveAccountTierKey(user) {
	const tierKey = String(user?.tier || "free").toLowerCase();
	return TIER_ORDER.includes(tierKey) ? tierKey : "free";
}

function updateAccountButton() {
	const btn = document.getElementById("ppgc-account-button");
	if (!btn) return;

	const loggedIn = !!currentUser;
	const tierKey = resolveAccountTierKey(currentUser);
	const tierLabel = TIERS[tierKey]?.label || TIERS.free.label;
	btn.classList.toggle("logged-in", loggedIn);
	if (loggedIn) btn.dataset.tier = tierKey;
	else delete btn.dataset.tier;
	btn.title = loggedIn
		? `Logged in as ${currentUser.email} · ${tierLabel} tier`
		: "Log in / Sign up";
	btn.setAttribute(
		"aria-label",
		loggedIn
			? `Open account settings. Logged in as ${currentUser.email}. ${tierLabel} tier.`
			: "Log in or sign up",
	);

	applyAccountButtonIcon(btn, currentUserIcon || "default");
}

async function refreshCurrentUser() {
	try {
		const res = await api.getCurrentUser();
		currentUser = res && res.user ? res.user : null;
	} catch {
		currentUser = null;
	}

	// NEW: sync API layer with current user
	api.setApiCurrentUser(currentUser);

	currentUserIcon = currentUser?.icon || "default";
	updateAccountButton();
	window.PPGC = window.PPGC || {};
	PPGC.currentUser = currentUser;
	window.dispatchEvent(new CustomEvent("ppgc:auth:changed"));

	if (currentUser) {
		setCloudSyncEnabled(false);
		try {
			await loadAllGames();
		} catch (e) {
			console.debug("[auth] session restore load failed:", e);
		}
		setCloudSyncEnabled(true);
		startServerAutoBackup();
	} else {
		setCloudSyncEnabled(false);
		stopServerAutoBackup();
	}

	return currentUser;
}

function ensureAuthBootstrap() {
	if (!authBootstrapPromise) {
		authBootstrapPromise = refreshCurrentUser().catch((err) => {
			console.debug("[auth] session restore failed:", err);
			return null;
		});
	}
	return authBootstrapPromise;
}

async function handleLogout() {
	try {
		await api.logout();
	} catch (e) {
		console.debug("[auth] logout failed (ignored):", e);
	}
	currentUser = null;
	currentUserIcon = "default";
	updateAccountButton();
	closeAccountMenu();
	closeAuthModal();

	// NEW: clear logged-in user in api.js
	api.setApiCurrentUser(null);
	setCloudSyncEnabled(false);

	window.PPGC = window.PPGC || {};
	PPGC.currentUser = currentUser;

	stopServerAutoBackup();
	window.location.reload();
}

function closeAuthModal() {
	window.PPGC?.closeAuthDialog?.();
}

/**
 * Completes the legacy session handoff after React authenticates a user.
 * Cloud saving stays paused until the initial server state has been loaded.
 */
async function completeAuthLogin(authenticatedUser) {
	currentUser = authenticatedUser;
	currentUserIcon = currentUser.icon || "default";
	updateAccountButton();
	api.setApiCurrentUser(currentUser);
	window.PPGC = window.PPGC || {};
	PPGC.currentUser = currentUser;
	setCloudSyncEnabled(false);
	try {
		await loadAllGames();
	} catch (error) {
		console.debug("[auth] initial load failed (ignored):", error);
	}
	setCloudSyncEnabled(true);
	startServerAutoBackup();
	window.dispatchEvent(new CustomEvent("ppgc:auth:changed"));
}

async function openAuthModal(mode = "login") {
	await window.PPGC?.ensureModalMounted?.("auth");
	window.PPGC?.openAuthDialog?.(mode);
}

function getAccountMenu() {
	return document.getElementById("ppgc-account-menu");
}

function closeAccountMenu() {
	const menu = getAccountMenu();
	if (!menu) return;
	menu.hidden = true;
	menu.classList.remove("open");
	accountMenuOpen = false;
}

function resolveGameLabel(gameKey) {
	const gamesByGen = window.DATA?.games || {};
	for (const arr of Object.values(gamesByGen)) {
		const hit = (arr || []).find((g) => g?.key === gameKey);
		if (hit) return hit.label || hit.title || hit.key;
	}
	return gameKey || "Unknown game";
}

function navigateToTask(sectionId, taskId = null) {
	if (!sectionId) return;
	const gameKey = (sectionId || "").split(":")[0] || null;
	if (gameKey) {
		store.state.gameKey = gameKey;
	}
	store.state.sectionId = sectionId;
	store.state.level = "section";
	renderAll();
	if (!taskId) return;
	requestAnimationFrame(() => {
		const target = document.querySelector(
			`[data-task-id="${CSS.escape(String(taskId))}"]`,
		);
		target?.scrollIntoView({ block: "center", behavior: "smooth" });
	});
}
async function initAuthUI() {
	const accountBtn = document.getElementById("ppgc-account-button");
	const accountMenu = document.getElementById("ppgc-account-menu");
	if (!accountBtn || !accountMenu) return;

	// Wire the account button immediately — navigation doesn't need the auth overlay
	if (
		!accountBtn._ppgcWired &&
		accountBtn.dataset.reactAccountButton !== "true"
	) {
		accountBtn._ppgcWired = true;
		accountBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			try {
				const storeRef = window.PPGC?._storeRef;
				const s = storeRef?.state;
				if (s && s.level && s.level !== "account") {
					PPGC._lastNonAccountState = { ...s };
				}
			} catch {}
			window.location.assign("/account/general");
		});
	}

	accountMenu.addEventListener("click", (e) => {
		const btn = e.target.closest("button[data-action]");
		if (!btn) return;
		const action = btn.dataset.action;
		if (action === "settings") {
			closeAccountMenu();
			window.location.assign("/account/general");
		} else if (action === "logout") {
			handleLogout();
		}
	});

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			closeAccountMenu();
		}
	});

	// Close menu when clicking elsewhere
	document.addEventListener("click", (e) => {
		const withinAccountUi = e.target.closest(
			"#ppgc-account-button, #ppgc-account-menu, .header-account",
		);
		if (!withinAccountUi) {
			closeAccountMenu();
		}
	});

	try {
		await ensureAuthBootstrap();
		if (currentUser) startServerAutoBackup();
	} catch {}
}

// ------------------------------------------------------------
// 5) App bootstrap
// ------------------------------------------------------------

// Run expensive, non-blocking work after first paint.
function runWhenIdle(fn, timeout = 1500) {
	if ("requestIdleCallback" in window) {
		window.requestIdleCallback(() => fn(), { timeout });
		return;
	}
	setTimeout(fn, 0);
}

// NOTE:
// - Sync-set expansion can be expensive (walks a lot of seed data).
// - Auto-import can be expensive (file reads + parsing).
// Neither is required for the initial Home render.

(function initLazyModals() {
	// Expose helpers for other modules to use
	window.PPGC = window.PPGC || {};
	PPGC.ensureModelViewerLoaded = ensureModelViewerLoaded;
	PPGC.ensureDistributionsLoaded = ensureDistributionsLoaded;
})();

window.__PPGC_NO_IMG__ = assetPath("no-image.svg");
initLayoutSwitcher(renderAll);
renderAll();
PPGC.authBootstrapPromise = ensureAuthBootstrap();
// Defer until after React's initial render has committed the DOM.
setTimeout(initAuthUI, 0);
initBackups({ minutes: 5 });

runWhenIdle(() => {
	try {
		autoImportOnStart({ mode: "all" });
	} catch (e) {
		console.debug("[import] autoImportOnStart skipped:", e);
	}
}, 3000);

window.addEventListener("ppgc:import:done", () => {
	try {
		renderAll();
		localStorage.setItem("ppgc_last_import_ts", new Date().toISOString());
	} catch {
		// ignore render/import errors here; user can refresh if something breaks
	}
});

// ------------------------------------------------------------
// 6) Header brand links (Home + Mon Info)
// ------------------------------------------------------------
(function wireHeaderBrandLinks() {
	const home = document.getElementById("ppgcHomeBtn");
	const moninfo = document.getElementById("ppgcMonInfoBtn");
	if (!home || !moninfo) return;

	const wireOnce = (el, handler) => {
		if (el.dataset.wired === "1") return;
		el.dataset.wired = "1";
		el.addEventListener("click", (e) => {
			e.preventDefault();
			handler();
		});
	};

	wireOnce(home, () => {
		// go to the main "All games" page
		PPGC.navigateToState({
			level: "gen",
			genKey: null,
			gameKey: null,
			sectionId: null,
		});
	});

	wireOnce(moninfo, () => {
		// open the Info/Tools area (default tool = info)
		PPGC.navigateToState({
			level: "tools",
			toolsKey: "info",
			genKey: null,
			gameKey: null,
			sectionId: null,
			monInfoId: null,
			monInfoGameKey: null,
			monInfoForm: null,
		});
	});
})();

// ------------------------------------------------------------
// 7) Guard modals from over-eager browser extensions
// ------------------------------------------------------------

/**
 * Prevent third-party content scripts from hijacking focus/input
 * inside our modals, while still allowing native form controls to
 * work normally.
 */
(function shieldModalsFromExtensions() {
	const isInsideShield = (el) => {
		if (!el || !el.closest) return false;

		// Do NOT shield native inputs (user needs these to work)
		if (
			el.tagName === "SELECT" ||
			el.tagName === "INPUT" ||
			el.tagName === "TEXTAREA"
		) {
			return false;
		}

		// Shield generic modal content areas
		return !!el.closest(
			"#modal, #researchModal, #collectionModal, #formsModal, #monInfoModal, #modelViewerModal",
		);
	};

	const stopIfInside = (e) => {
		if (isInsideShield(e.target)) {
			e.stopImmediatePropagation();
		}
	};

	document.addEventListener("focusin", stopIfInside, true);
	document.addEventListener("input", stopIfInside, true);
	document.addEventListener("keydown", stopIfInside, true);
})();

// ------------------------------------------------------------
// 8) Debug helpers
// ------------------------------------------------------------

// Quick access from devtools: PPGC.renderAll()
window.PPGC = window.PPGC || {};
PPGC.renderAll = renderAll;
PPGC.openAuthModal = openAuthModal;
PPGC.completeAuthLogin = completeAuthLogin;
PPGC.navigateToTask = navigateToTask;
PPGC.api = api;
PPGC.setAccountButtonIcon = (icon) => {
	// Subscription views replace PPGC.currentUser before updating the icon.
	// Sync that object here so the tier ring changes in the same render pass.
	if (PPGC.currentUser) currentUser = PPGC.currentUser;
	currentUserIcon = icon || "default";
	if (currentUser) currentUser.icon = currentUserIcon;
	PPGC.currentUser = currentUser;
	updateAccountButton();
};
PPGC.handleLogout = handleLogout;
PPGC.resolveGameLabel = resolveGameLabel;
PPGC.refreshCurrentUser = refreshCurrentUser;
PPGC.ensureAuthBootstrap = ensureAuthBootstrap;
PPGC.ensureGenDataLoaded = ensureGenDataLoaded;
PPGC.ensureGenDataLoadedForGame = async function ensureGenDataLoadedForGame(
	gameKey,
) {
	const genKey = resolveGenKeyForGame(gameKey);
	if (!genKey) return null;
	await ensureGenDataLoaded(genKey);
	return genKey;
};
PPGC.openMonInfo = async (...args) => {
	await window.PPGC?.ensureModalMounted?.("monInfo");
	const m = await ensureDexMonInfoLoaded();
	return m.openMonInfo?.(...args);
};

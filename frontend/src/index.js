// ------------------------------------------------------------
// 1) Imports
// ------------------------------------------------------------

import "./registry.js";
import "../data/bootstraps/lite.js";

import { store } from "./store.js";
import {
	initBackups,
	autoImportOnStart,
	startServerAutoBackup,
	stopServerAutoBackup,
	initialServerBackup,
	loadAllGames,
} from "./persistence.js";
import * as api from "../api.js";
import { initLayoutSwitcher } from "./ui/layoutSwitcher.js";
import { elements } from "./ui/dom.js";
import { renderCrumbs } from "./ui/crumbs.js";
import { emitPpgcUiSync } from './react-bridge/storeBridge.js';
import { initHistory } from "./history.js";
import { ensurePpgcRoot } from "./runtime/globals.js";
import { installUiGlobals } from "./runtime/uiGlobals.js";
import { _assetPath } from "./utils/assetPath.js";

const PPGC = ensurePpgcRoot();
installUiGlobals();

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
			case "gen1": await import("../data/bootstraps/gen1.js"); break;
			case "gen2": await import("../data/bootstraps/gen2.js"); break;
			case "gen3": await import("../data/bootstraps/gen3.js"); break;
			case "gen4": await import("../data/bootstraps/gen4.js"); break;
			case "gen5": await import("../data/bootstraps/gen5.js"); break;
			case "gen6": await import("../data/bootstraps/gen6.js"); break;
			case "gen7": await import("../data/bootstraps/gen7.js"); break;
			case "gen7_2": await import("../data/bootstraps/gen7_2.js"); break;
			case "gen8": await import("../data/bootstraps/gen8.js"); break;
			case "gen8_2": await import("../data/bootstraps/gen8_2.js"); break;
			case "gen9": await import("../data/bootstraps/gen9.js"); break;
			case "gen9_2": await import("../data/bootstraps/gen9_2.js"); break;
			case "home": await import("../data/bootstraps/home.js"); break;
			default:
				console.warn("[bootstrap] Unknown genKey:", genKey);
		}
		loaded.add(genKey);
		promises.delete(genKey);
	})();

	promises.set(genKey, p);
	await p;
	return true;
}

function ensureGenDataForState(state) {
	const lvl = state?.level;

	// ✅ Tools/MonInfo need HOME dex (window.DATA.dex.home) for the Mon Info cards/list
	if (lvl === "tools" || lvl === "moninfo") {
		const loaded = _getLoadedGensSet();
		if (!loaded.has("home")) {
			ensureGenDataLoaded("home")
				.then(() => { try { renderAll(); } catch { } })
				.catch((e) => console.debug("[bootstrap] home load failed:", e));
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
			.then(() => { try { renderAll(); } catch { } })
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
		.then(() => { try { renderAll(); } catch { } })
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
	PPGC.gen1SpriteColor = store.state.gen1SpriteMode === 'color';
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
// 4) Backup controls UI (floating gear menu)
// ------------------------------------------------------------

/**
 * Injects and wires the floating "Backup" gear menu.
 * - Lets user choose a backup folder
 * - Trigger manual backup/import
 * - Toggle automatic backups
 * The controls are only mounted once per page load.
 */
function mountBackupControls() {
	if (document.getElementById("ppgc-backup-controls")) return;

	const wrap = document.createElement("div");
	wrap.id = "ppgc-backup-controls";

	wrap.innerHTML = `
    <button
      id="ppgc-account-button"
      aria-haspopup="dialog"
      aria-controls="ppgc-auth-overlay"
      title="Log in / Sign up"
    >
      <!-- little trainer silhouette -->
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 11.5c1.93 0 3.5-1.79 3.5-4s-1.57-4-3.5-4-3.5 1.79-3.5 4 1.57 4 3.5 4zm0 2c-2.76 0-5.5 1.57-5.5 3.5V19h11v-2c0-1.93-2.74-3.5-5.5-3.5z"/>
      </svg>
    </button>
    <div id="ppgc-account-menu" class="ppgc-account-menu" hidden>
      <button type="button" data-action="settings">Account settings</button>
      <button type="button" data-action="logout">Log out</button>
    </div>
  `;

	document.body.appendChild(wrap);
}

// ------------------------------------------------------------
// 5) Account / auth UI
// ------------------------------------------------------------

let currentUser = null;
let currentUserIcon = "default";

function updateAccountButton() {
	const btn = document.getElementById("ppgc-account-button");
	if (!btn) return;

	const loggedIn = !!currentUser;
	btn.classList.toggle("logged-in", loggedIn);
	btn.title = loggedIn
		? `Logged in as ${currentUser.email}`
		: "Log in / Sign up";

	// reflect icon choice
	btn.dataset.icon = currentUserIcon || "default";
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

	window.PPGC = window.PPGC || {};
	PPGC.currentUser = currentUser;

	stopServerAutoBackup();
	window.location.reload();
}

function closeAuthModal() {
	const overlay = document.getElementById("ppgc-auth-overlay");
	if (!overlay) return;
	const form = document.getElementById("ppgc-auth-form");
	const statusEl = document.getElementById("ppgc-auth-status");

	overlay.hidden = true;
	document.body.classList.remove("ppgc-auth-open");

	if (form) form.reset();
	if (statusEl) {
		statusEl.textContent = "";
		statusEl.classList.remove("error");
	}
}

function openAuthModal(mode = "login") {
	const overlay = document.getElementById("ppgc-auth-overlay");
	if (!overlay) return;

	const form = document.getElementById("ppgc-auth-form");
	const statusEl = document.getElementById("ppgc-auth-status");
	const tabs = overlay.querySelectorAll(".ppgc-auth-tabs button");
	const submitBtn = document.getElementById("ppgc-auth-submit");

	let currentMode = mode; // "login" or "signup"

	function setMode(nextMode) {
		currentMode = nextMode;
		tabs.forEach((btn) => {
			btn.classList.toggle("active", btn.dataset.mode === currentMode);
		});
		if (submitBtn) {
			submitBtn.textContent = currentMode === "login" ? "Log in" : "Sign up";
		}
		if (statusEl) {
			statusEl.textContent = "";
			statusEl.classList.remove("error");
		}
	}

	setMode(mode);
	overlay.hidden = false;
	document.body.classList.add("ppgc-auth-open");

	// Wire tabs
	tabs.forEach((btn) => {
		btn.onclick = () => setMode(btn.dataset.mode);
	});

	if (form) {
		form.onsubmit = async (e) => {
			e.preventDefault();
			if (!statusEl) return;

			statusEl.textContent =
				currentMode === "login" ? "Logging in..." : "Signing up...";
			statusEl.classList.remove("error");

			const formData = new FormData(form);
			const email = String(formData.get("email") || "").trim();
			const password = String(formData.get("password") || "").trim();

			try {
				let res;
				if (currentMode === "login") {
					res = await api.login(email, password);
				} else {
					res = await api.signup(email, password);
				}

				if (res && res.error) {
					statusEl.textContent = res.error;
					statusEl.classList.add("error");
					return;
				}

				// Temporary in-memory auth: res = { id, email }
				if (res && res.email) {
					currentUser = {
						id: res.id,
						email: res.email,
						icon: res.icon || "default",
					};
					currentUserIcon = currentUser.icon;
					updateAccountButton();

					// NEW: tell api.js that someone is logged in
					api.setApiCurrentUser(currentUser);

					window.PPGC = window.PPGC || {};
					PPGC.currentUser = currentUser;

					if (currentMode === "signup") {
						// New account: push current game up once so DB has something
						try { await initialServerBackup(); } catch (e) { console.debug('[auth] initial backup failed (ignored):', e); }
					} else {
						// Existing account: pull ALL games down from the cloud
						try { await loadAllGames(); } catch (e) { console.debug('[auth] initial load failed (ignored):', e); }
					}

					startServerAutoBackup();

					statusEl.textContent = "Success!";
					window.dispatchEvent(new CustomEvent('ppgc:auth:changed'));
					closeAuthModal();
				}
			} catch (err) {
				console.error(err);
				statusEl.textContent = "Something went wrong. Try again.";
				statusEl.classList.add("error");
			}
		};
	}
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
	const gameKey = (sectionId || '').split('-')[0] || null;
	if (gameKey) {
		store.state.gameKey = gameKey;
	}
	store.state.sectionId = sectionId;
	store.state.level = 'section';
	renderAll();
	if (!taskId) return;
	requestAnimationFrame(() => {
		const target = document.querySelector(`[data-task-id="${CSS.escape(String(taskId))}"]`);
		target?.scrollIntoView({ block: 'center', behavior: 'smooth' });
	});
}
async function initAuthUI() {
	const accountBtn = document.getElementById("ppgc-account-button");
	const accountMenu = document.getElementById("ppgc-account-menu");
	if (!accountBtn || !accountMenu) return;

	// Wire the account button immediately — navigation doesn't need the auth overlay
	if (!accountBtn._ppgcWired) {
		accountBtn._ppgcWired = true;
		accountBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			try {
				const storeRef = window.PPGC?._storeRef;
				const s = storeRef?.state;
				if (s && s.level && s.level !== "account") {
					PPGC._lastNonAccountState = { ...s };
				}
			} catch { }
			PPGC.navigateTo("account");
		});
	}

	// Overlay may not be in the DOM yet (React renders async) — retry until it appears
	const overlay = document.getElementById("ppgc-auth-overlay");
	if (!overlay) {
		setTimeout(initAuthUI, 100);
		return;
	}

	const closeBtn = overlay.querySelector(".ppgc-auth-close");

	accountMenu.addEventListener("click", (e) => {
		const btn = e.target.closest("button[data-action]");
		if (!btn) return;
		const action = btn.dataset.action;
		if (action === "settings") {
			closeAccountMenu();
			PPGC.navigateTo("account");
		} else if (action === "logout") {
			handleLogout();
		}
	});

	if (closeBtn) {
		closeBtn.addEventListener("click", () => closeAuthModal());
	}

	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) closeAuthModal();
	});

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			closeAuthModal();
			closeAccountMenu();
		}
	});

	// Close menu when clicking elsewhere
	document.addEventListener("click", (e) => {
		const withinControls = e.target.closest("#ppgc-backup-controls");
		if (!withinControls) {
			closeAccountMenu();
		}
	});

	// Initialize button state from server session (if any) AFTER first paint
	setTimeout(async () => {
		try {
			await refreshCurrentUser();
			if (currentUser) startServerAutoBackup();
		} catch { }
	}, 0);
}

// ------------------------------------------------------------
// 6) App bootstrap
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
	// Load in background after first paint
	setTimeout(() => {
		ensureDexMonInfoLoaded()
			.then((m) => m.setupMonInfoModal?.())
			.catch((e) => console.debug("[lazy] dex-mon-info load failed:", e));
	}, 0);

	// Expose helpers for other modules to use
	window.PPGC = window.PPGC || {};
	PPGC.ensureModelViewerLoaded = ensureModelViewerLoaded;
	PPGC.ensureDistributionsLoaded = ensureDistributionsLoaded;
})();

window.__PPGC_NO_IMG__ = _assetPath('no-image.svg');
initLayoutSwitcher(renderAll);
renderAll();
mountBackupControls();
// Defer until after React's initial render has committed the DOM (AuthModal etc.)
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
// Header brand links (Home + Mon Info)
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
		return !!el.closest("#modal, #researchModal, #fashionModal, #formsModal, #medalsModal");
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
PPGC.navigateToTask = navigateToTask;
PPGC.api = api;
PPGC.handleLogout = handleLogout;
PPGC.resolveGameLabel = resolveGameLabel;
PPGC.ensureGenDataLoaded = ensureGenDataLoaded;
PPGC.ensureGenDataLoadedForGame = async function ensureGenDataLoadedForGame(gameKey) {
	const genKey = resolveGenKeyForGame(gameKey);
	if (!genKey) return null;
	await ensureGenDataLoaded(genKey);
	return genKey;
};
PPGC.openMonInfo = async (...args) => {
	const m = await ensureDexMonInfoLoaded();
	return m.openMonInfo?.(...args);
};
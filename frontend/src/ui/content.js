import { ring } from "./rings.js";
import { save } from "../store.js";
import {
	fashionSummaryCardFor,
	wireFashionModal,
} from "../modals/fashion.js";
import {
	ensureSections,
	bootstrapTasks,
	renderTaskLayout,
	renderTaskList,
	setDescendantsDone,
} from "../tasks.js";
import {
	allGamesList,
	getGameRowsForGen,
	getSectionAddonPcts,
	summarizeTasks,
} from "../progress.js";
import {
	backupAllNow,
	chooseBackupFolder,
	isBackupFolderGranted,
	importAllFromFolder,
	getAutoBackupsEnabled,
	setAutoBackupsEnabled,
} from "../persistence.js";
import { ensureSyncSetsExpandedForGame } from "../sync.js";
import { getSeedTaskIdsBySection } from "../taskRegistry.js";
import { dexSummaryCardFor, dexPctFor, wireDexModal } from "../modals/dex.js";
import { renderDistributionCardsFor } from "../modals/distributions.js";
import { renderCurryCardsFor } from "../modals/curry.js";
import { renderSandwichCardsFor } from "../modals/sandwich.js";
import { renderStickerCardsFor } from "../modals/sticker.js";
import { ensureMonInfoLoaded } from "../../data/mon_info/_loader.js";
import { renderMonInfoInto } from "../modals/dex-mon-info.js";
import { medalsSectionCardFor, wireMedalsModal } from "../modals/medal.js";

const dexApiSingleton = { api: null };
const fashionApiSingleton = { api: null };
const medalsApiSingleton = { api: null };
// const SUPPORTED_SAVE_IMPORT_GAMES = new Set(["red"]);

const MONINFO_GAME_PRIORITY = [
	"legendsza",
	"scarlet",
	"violet",
	"legendsarceus",
	"brilliantdiamond-national",
	"shiningpearl-national",
	"sword",
	"shield",
	"letsgopikachu",
	"letsgoeevee",
	"ultrasun-alola",
	"ultramoon-alola",
	"sun-alola",
	"moon-alola",
	"omegaruby",
	"alphasapphire",
	"x-national",
	"y-national",
	"black2-national",
	"white2-national",
	"black-national",
	"white-national",
	"heartgold-national",
	"soulsilver-national",
	"platinum-national",
	"diamond-national",
	"pearl-national",
	"firered-national",
	"leafgreen-national",
	"emerald-national",
	"ruby-national",
	"sapphire-national",
	"crystal",
	"gold",
	"silver",
	"yellow",
	"red",
	"blue",
	"green",
];

/* ==================== Global helpers (tooltips, etc.) ===================== */

(function ensureGlobalHelpers() {
	window.PPGC = window.PPGC || {};

	/**
	 * Hide and destroy any tooltip-like elements we know about.
	 * Used during teardown / navigation to avoid stray positioned nodes.
	 */
	function hideAllTooltips() {
		try {
			const nodes = document.querySelectorAll(
				'[role="tooltip"], .tooltip, #tooltip'
			);
			nodes.forEach((el) => el.remove());

			if (window.PPGC._tooltipTimer) {
				clearTimeout(window.PPGC._tooltipTimer);
				window.PPGC._tooltipTimer = null;
			}
			window.PPGC._tooltipEl = null;
		} catch (e) {
			console.warn("hideAllTooltips failed:", e);
		}
	}

	window.PPGC.hideTooltips = hideAllTooltips;
})();

// ===== Missing asset logger (Dev Console only) =====
(function installMissingAssetLogger() {
	window.PPGC = window.PPGC || {};
	if (window.PPGC.__missingAssetLoggerInstalled) return;
	window.PPGC.__missingAssetLoggerInstalled = true;

	const buckets = {
		taskImages: new Set(),
		sprites: new Set(),
		textures: new Set(),
		otherImages: new Set(),
		models: new Set(),
	};

	let flushTimer = 0;

	function kindLabel(kind) {
		if (kind === "taskImages") return "task images";
		if (kind === "sprites") return "sprites";
		if (kind === "textures") return "textures";
		if (kind === "models") return "models";
		return "images";
	}

	function normalizeName(v) {
		const s = String(v || "").trim();
		if (!s) return "(unknown)";
		// prefer a short-ish display (filename) but keep full path if needed
		try {
			const u = new URL(s, location.href);
			const parts = u.pathname.split("/").filter(Boolean);
			return parts.slice(-2).join("/"); // last two segments is usually enough
		} catch {
			return s.split("/").slice(-2).join("/");
		}
	}

	function guessKindFromUrl(url) {
		const u = String(url || "").toLowerCase();

		// You can tune these to match your folder names
		if (u.includes("/tasks/") || u.includes("task-item-img")) return "taskImages";
		if (u.includes("/sprites/") || u.includes("pokemon_home")) return "sprites";

		// Texture-ish heuristics (covers many pipelines: _col/_nor/_emi/_amb etc.)
		if (
			u.includes("/tex") ||
			u.includes("/textures/") ||
			/(_col|_nor|_nrm|_emi|_amb|_rare|_mra|_mask)\b/.test(u)
		) return "textures";

		if (/\.(glb|gltf)(\?|$)/.test(u)) return "models";

		return "otherImages";
	}

	function scheduleFlush() {
		if (flushTimer) return;
		flushTimer = window.setTimeout(() => {
			flushTimer = 0;

			const emit = (kind) => {
				const items = Array.from(buckets[kind]);
				if (!items.length) return;
				buckets[kind].clear();

				// One clean message per bucket (collapsed)
				console.groupCollapsed(
					`%c[assets] Missing ${kindLabel(kind)}: ${items.length}`,
					"color:#f7c948;font-weight:600;"
				);
				console.log({ missing: items });
				console.groupEnd();
			};

			emit("taskImages");
			emit("sprites");
			emit("textures");
			emit("models");
			emit("otherImages");
		}, 50);
	}

	// Public API (so your other modules can report explicitly)
	window.PPGC.reportMissingAsset = function reportMissingAsset(kind, nameOrUrl) {
		const k = buckets[kind] ? kind : guessKindFromUrl(nameOrUrl);
		buckets[k].add(normalizeName(nameOrUrl));
		scheduleFlush();
	};

	// Catch ALL <img> load failures (including those created by Three.js loaders)
	window.addEventListener(
		"error",
		(e) => {
			const t = e?.target;
			if (!(t instanceof HTMLImageElement)) return;

			const src = t.currentSrc || t.src || "";
			const kind =
				t.classList?.contains("task-item-img") ? "taskImages" :
					(t.classList?.contains("evo-img") ||
						t.classList?.contains("moninfo-hero-img")) ? "sprites" :
						guessKindFromUrl(src);

			window.PPGC.reportMissingAsset(kind, src);
		},
		true // capture is required for resource errors
	);
})();


/* ====================== Global task search (header) ======================= */

const TASK_SEARCH_MIN_CHARS = 2;
let _taskSearchIndex = null;

/**
 * Build a flat search index of all tasks from window.DATA.tasks.
 * Each entry contains task text, tooltip text, game + section labels, etc.
 */
function _buildTaskSearchIndex() {
	const idx = [];
	const tasksBySection = window.DATA?.tasks || {};
	const gamesByGen = window.DATA?.games || {};
	const sectionsByGame = window.DATA?.sections || {};

	// Map gameKey -> { label, genKey }
	const gameMeta = {};
	for (const [genKey, arr] of Object.entries(gamesByGen)) {
		(arr || []).forEach((g) => {
			if (!g || !g.key) return;
			gameMeta[g.key] = {
				label: g.label || g.key,
				genKey,
			};
		});
	}

	const gameKeyFromSectionId = (sectionId) =>
		(sectionId || "").split("-")[0] || "";

	for (const [sectionId, rootTasks] of Object.entries(tasksBySection)) {
		const gameKey = gameKeyFromSectionId(sectionId);
		const gm = gameMeta[gameKey] || { label: gameKey, genKey: null };
		const sectionDefs = sectionsByGame[gameKey] || [];
		const sec =
			sectionDefs.find((s) => (s.id || sectionId) === sectionId) || {};
		const sectionTitle = sec.title || sectionId;

		(function walk(arr) {
			for (const t of arr || []) {
				if (!t || typeof t !== "object") continue;

				const text = t.text ? String(t.text) : "";
				const tooltip = t.tooltip ? String(t.tooltip) : "";
				const hay = (text + " " + tooltip).toLowerCase();

				if (hay.trim()) {
					idx.push({
						id: t.id,
						text,
						textLower: text.toLowerCase(),
						tooltip,
						haystack: hay,
						gameKey,
						gameLabel: gm.label,
						genKey: gm.genKey,
						sectionId,
						sectionTitle,
					});
				}

				if (Array.isArray(t.children) && t.children.length) {
					walk(t.children);
				}
			}
		})(rootTasks || []);
	}

	return idx;
}

function _ensureTaskSearchIndex() {
	if (!_taskSearchIndex) {
		_taskSearchIndex = _buildTaskSearchIndex();
	}
	return _taskSearchIndex;
}

function _clearTaskSearchUI(clearInput = true) {
	const input = document.getElementById("taskSearchInput");
	const resultsEl = document.getElementById("taskSearchResults");
	if (clearInput && input) input.value = "";
	if (resultsEl) {
		resultsEl.innerHTML = "";
		resultsEl.classList.remove("is-open");
	}
}

/**
 * Run a search against the global index, update the dropdown with the top 5.
 * Matches task.text and any tooltip text.
 */
function _performTaskSearch(rawQuery) {
	const numOfResults = 15;

	const resultsEl = document.getElementById("taskSearchResults");
	if (!resultsEl) return;

	const query = (rawQuery || "").trim().toLowerCase();
	resultsEl.innerHTML = "";
	resultsEl.classList.remove("is-open");

	if (!query || query.length < TASK_SEARCH_MIN_CHARS) return;

	const index = _ensureTaskSearchIndex();
	const matches = [];

	for (const entry of index) {
		const pos = entry.haystack.indexOf(query);
		if (pos === -1) continue;

		// Simple scoring: prefer matches in the main text, and earlier positions.
		let score = pos;
		const textPos = entry.textLower.indexOf(query);
		if (textPos !== -1) score -= 10;

		matches.push({ entry, score });
	}

	if (!matches.length) return;

	matches.sort((a, b) => a.score - b.score);
	const top = matches.slice(0, numOfResults).map((m) => m.entry);

	const frag = document.createDocumentFragment();
	top.forEach((e) => {
		const item = document.createElement("button");
		item.type = "button";
		item.className = "task-search-item";
		item.setAttribute("data-task-search-hit", "1");
		item.setAttribute("data-game", e.gameKey || "");
		if (e.genKey) item.setAttribute("data-gen", e.genKey);
		item.setAttribute("data-section", e.sectionId || "");

		item.innerHTML = `
	  <div class="task-search-item-text">${e.text}</div>
	  <div class="task-search-item-meta small">
		${(e.gameLabel || e.gameKey || "").trim()} — ${e.sectionTitle}
	  </div>
	`;
		frag.appendChild(item);
	});

	resultsEl.appendChild(frag);
	resultsEl.classList.add("is-open");
}

/**
 * Wire the header search input once (global, not per-render).
 */
function wireGlobalTaskSearch() {
	if (window.PPGC._taskSearchWired) return;

	const input = document.getElementById("taskSearchInput");
	const resultsEl = document.getElementById("taskSearchResults");
	if (!input || !resultsEl) return;

	window.PPGC._taskSearchWired = true;

	input.addEventListener("input", () => {
		_performTaskSearch(input.value);
	});

	input.addEventListener("keydown", (evt) => {
		if (evt.key === "Escape") {
			_clearTaskSearchUI();
			input.blur();
		}
	});

	// Click on results → navigate to that game + section
	resultsEl.addEventListener("click", (evt) => {
		const target = evt.target.closest("[data-task-search-hit]");
		if (!target) return;

		const gameKey = target.getAttribute("data-game");
		const genKey = target.getAttribute("data-gen") || null;
		const sectionId = target.getAttribute("data-section");
		const store = window.PPGC._storeRef;

		if (!store || !gameKey || !sectionId) return;

		window.PPGC.navigateToState({
			level: "section",
			gameKey,
			genKey,
			sectionId,
		});
		_clearTaskSearchUI();
	});

	// Click anywhere else → close the dropdown
	document.addEventListener("click", (evt) => {
		if (
			evt.target === input ||
			input.contains(evt.target) ||
			resultsEl.contains(evt.target)
		) {
			return;
		}
		_clearTaskSearchUI(false); // just hide, keep text
	});
}

function applySidebarCollapsed(collapsed) {
	document.body.classList.toggle("sidebar-collapsed", !!collapsed);

	// keep ARIA in sync
	const btn = document.getElementById("sidebarToggle");
	const sidebar = document.getElementById("sidebar");
	if (btn) btn.setAttribute("aria-pressed", collapsed ? "true" : "false");
	if (sidebar) sidebar.setAttribute("aria-hidden", collapsed ? "true" : "false");
}

function wireSidebarToggle() {
	// ✅ wire once across re-renders
	if (window.PPGC._sidebarToggleWired) return;

	const btn = document.getElementById("sidebarToggle");
	if (!btn) return;

	window.PPGC._sidebarToggleWired = true;

	// Use your actual store ref (this is the one you set each render)
	const storeRef = window.PPGC?._storeRef || window.store;

	// ✅ apply persisted state once at startup
	applySidebarCollapsed(!!storeRef?.state?.sidebarCollapsed);

	btn.addEventListener("click", () => {
		const next = !document.body.classList.contains("sidebar-collapsed");
		applySidebarCollapsed(next);

		if (storeRef?.state) storeRef.state.sidebarCollapsed = next;

		// Persist immediately
		if (typeof storeRef?.save === "function") storeRef.save();
		else save();
	});
}

/* ============================ Local helpers =============================== */

function _isExtraCreditSection(sec) {
	const t = (sec?.title || "").trim().toLowerCase();
	return t === "distributions" || t === "extra credit";
}

// Bootstraps *all* sections for a game into the live tasks store.
// This is used when entering a SECTION view so intra-game navigation and
// cross-section sync metadata is available without repeated bootstraps.
function bootstrapTasksForGame(gameKey, store) {
	if (!gameKey || !store?.tasksStore) return;
	const sections = ensureSections(gameKey);
	for (const sec of sections) {
		bootstrapTasks(sec.id, store.tasksStore);
	}
}

/**
 * Compute a section's percent:
 * - bootstrap tasks
 * - compute task completion
 * - add any addon meters (Dex, forms, research, etc.)
 *
 * Returns a number 0..200 (extra credit can push total above 100 in some views).
 */
function _computeSectionPct(sec, gameKey, genKey, store) {
	// NOTE: For summary views (Home/Gen/Game), we intentionally do NOT
	// bootstrap heavy task trees. If the section is already bootstrapped
	// (e.g., because the user opened a section), we use the live tasksStore.
	// Otherwise we compute task completion from the lightweight
	// store.taskProgressById map + seed task ids.

	// Extra meters (Dex, forms, research, custom)
	const addon = getSectionAddonPcts(
		sec,
		gameKey,
		genKey,
		(a, b) => dexPctFor(a, b, store),
		window.PPGC.sectionMeters
	);

	let baseDone = 0;
	let baseTotal = 0;

	if (store.tasksStore && store.tasksStore.has(sec.id)) {
		const tasksArr = store.tasksStore.get(sec.id) || [];
		({ done: baseDone, total: baseTotal } = summarizeTasks(tasksArr));
	} else {
		const bySection = getSeedTaskIdsBySection();
		const ids = bySection.get(sec.id) || [];
		baseTotal = ids.length;
		if (baseTotal) {
			const progress = store.taskProgressById;
			let d = 0;
			for (const id of ids) {
				if (progress && progress.get(String(id))) d++;
			}
			baseDone = d;
		}
	}

	const extraDone = addon.reduce(
		(a, p) => a + Math.max(0, Math.min(100, p)) / 100,
		0
	);

	const done = baseDone + extraDone;
	const total = baseTotal + addon.length;

	return total > 0 ? (done / total) * 100 : 0;
}

/**
 * When a game is toggled Started / Not started, auto-toggle any
 * tagged tasks + dex entries for that game.
 *
 * We look for:
 *   - tasks where t.startGame === true or t.tags includes "startGame"
 *   - dex mons where mon.startGame === true or mon.tags includes "startGame"
 */
function applyGameStartSync(gameKey, started, store) {
	if (!gameKey || !window.DATA) return;

	// ---------- Tasks ----------
	ensureSyncSetsExpandedForGame(gameKey);
	bootstrapTasksForGame(gameKey, store);
	const sections = ensureSections(gameKey);
	for (const sec of sections) {
		const tasksArr = store.tasksStore.get(sec.id) || [];

		(function walk(arr) {
			for (const t of arr || []) {
				if (!t || typeof t !== "object") continue;

				const tags = Array.isArray(t.tags) ? t.tags : [];
				const tagged =
					t.startGame === true || tags.includes("startGame");

				if (tagged) {
					// Flip this task (and its children) to match the game start state
					setDescendantsDone(t, !!started);
				}

				if (Array.isArray(t.children) && t.children.length) {
					walk(t.children);
				}
			}
		})(tasksArr);
	}

	// ---------- Dex ----------
	const dexList = (window.DATA.dex && window.DATA.dex[gameKey]) || [];
	if (dexList.length) {
		const speciesMap = store.dexStatus.get(gameKey) || {};

		for (const mon of dexList) {
			if (!mon) continue;
			const tags = Array.isArray(mon.tags) ? mon.tags : [];
			const tagged =
				mon.startGame === true || tags.includes("startGame");
			if (!tagged) continue;

			if (started) {
				// If unknown, bump to "caught"
				const prev = speciesMap[mon.id] || "unknown";
				speciesMap[mon.id] = prev === "unknown" ? "caught" : prev;
			} else {
				// Reset to "unknown" when un-starting the game
				speciesMap[mon.id] = "unknown";
			}
		}

		store.dexStatus.set(gameKey, speciesMap);
	}

	// ---------- Fashion ----------
	const fashionData = window.DATA.fashion?.[gameKey];
	if (fashionData && Array.isArray(fashionData.categories)) {
		for (const cat of fashionData.categories) {
			const catId = cat.id;
			const items = cat.items || [];

			for (const item of items) {
				const hasForms = Array.isArray(item.forms) && item.forms.length > 0;

				// MAIN ITEM tagged?
				const mainTagged = item.startGame === true ||
					(Array.isArray(item.tags) && item.tags.includes("startGame"));

				if (hasForms) {
					// FORMS: check each form individually
					for (const form of item.forms) {
						const tagged = form.startGame === true ||
							(Array.isArray(form.tags) && form.tags.includes("startGame"));

						if (!tagged) continue;

						// load existing node
						const catMap = store.fashionFormsStatus.get(gameKey) || new Map();
						const rec = catMap.get(catId) || {};
						const node = rec[item.id] || { all: false, forms: {} };

						node.forms = node.forms || {};
						node.forms[form.name] = started;  // TRUE on start, FALSE on unstart

						// recompute .all
						const total = item.forms.length;
						const done = Object.values(node.forms).filter(Boolean).length;
						node.all = done === total;

						rec[item.id] = node;
						catMap.set(catId, rec);
						store.fashionFormsStatus.set(gameKey, catMap);
					}
				} else if (mainTagged) {
					// NO-FORM item: flip whole item
					const catMap = store.fashionStatus.get(gameKey) || new Map();
					const rec = catMap.get(catId) || {};
					rec[item.id] = !!started;
					catMap.set(catId, rec);
					store.fashionStatus.set(gameKey, catMap);
				}
			}
		}
	}

	save(); // Persist everything
}

/* ======================== Account page renderer =========================== */

function renderAccountPage(store, els) {
	const elContent = els.elContent;
	elContent.innerHTML = "";

	const currentUser = window.PPGC?.currentUser || null;
	const email = currentUser?.email || "(not signed in)";
	const signedIn = !!currentUser;
	const activeTab = store.state.accountTab || "general";

	const wrap = document.createElement("div");
	wrap.className = "account-page";
	wrap.innerHTML = `
  <div class="account-layout">
	<div class="account-main"></div>
  </div>
  `;
	elContent.appendChild(wrap);

	const main = wrap.querySelector(".account-main");

	/* ---------- A) Sidebar: Account-specific entries ---------- */

	(function wireAccountSidebar() {
		const sidebarList = document.getElementById("sideList");
		const sidebarTitle = document.getElementById("navTitle");
		const backBtn = document.getElementById("navBack");

		if (sidebarTitle) {
			sidebarTitle.textContent = "Account";
		}
		if (backBtn) {
			// Keep Back visible on the Account page
			backBtn.classList.remove("hidden");

			// Intercept Back clicks ONLY while we're on Account, so we don't break normal Back behavior elsewhere
			if (!window.PPGC._accountBackInterceptorWired) {
				backBtn.addEventListener(
					"click",
					(e) => {
						const s = window.PPGC?._storeRef?.state;
						if (s?.level !== "account") return; // let normal handler run outside Account

						e.preventDefault();
						e.stopImmediatePropagation();

						const prev = window.PPGC._lastNonAccountState;

						if (prev && prev.level && prev.level !== "account") {
							window.PPGC.navigateToState({ ...prev });
						} else {
							// fallback: go home
							window.PPGC.navigateToState({
								level: "gen",
								genKey: null,
								gameKey: null,
								sectionId: null,
							});
						}
					},
					true // capture so we win over any existing Back handler
				);

				window.PPGC._accountBackInterceptorWired = true;
			}
		}

		if (!sidebarList) return;
		sidebarList.innerHTML = "";

		const sections = [
			{ key: "general", label: "General" },
			{ key: "backup", label: "Backups & Import" },
			{ key: "import", label: "Save Data Import" },
		];

		sections.forEach((sec) => {
			const li = document.createElement("div");
			li.className =
				"dir-item" + (sec.key === activeTab ? " active" : "");
			li.dataset.section = sec.key;
			li.innerHTML = `
		<div class="label">
		  <span class="icon"></span>
		  <span>${sec.label}</span>
		</div>
		<div>›</div>
	  `;

			li.addEventListener("click", () => {
				window.PPGC.navigateToState({
					level: "account",
					accountTab: sec.key,
					genKey: null,
					gameKey: null,
					sectionId: null,
				});
			});

			sidebarList.appendChild(li);
		});
	})();

	/* ---------- B) Render the active tab as its own card ---------- */

	if (activeTab === "general") {
		renderAccountGeneralSection(wrap, {
			email,
			signedIn,
		});
	} else if (activeTab === "backup") {
		renderAccountBackupSection(wrap, store);
	} else if (activeTab === "import") {
		renderAccountSaveImportSection(wrap);
	}
}
function renderAccountGeneralSection(wrap, { email, signedIn }) {
	const main = wrap.querySelector(".account-main");
	if (!main) return;

	const card = document.createElement("section");
	card.className = "card account-section";
	card.id = "account-section-general";
	card.innerHTML = `
	<div class="card-hd">
	  <h2>Account</h2>
	</div>
	<div class="card-bd">
	  <div class="account-meta" id="accountMeta">
		<div><strong>Email:</strong> ${email}</div>
		<div><strong>Status:</strong> ${signedIn ? "Signed in" : "Guest"}</div>
	  </div>

	  <div class="account-actions">
		<button class="primary" type="button" id="accountLoginBtn">
		  ${signedIn ? "Switch account" : "Log in / Sign up"}
		</button>
		<button
		  class="ghost"
		  type="button"
		  id="accountLogoutBtn"
		  ${signedIn ? "" : "hidden"}
		>
		  Log out
		</button>
	  </div>

	  <div class="account-icon-picker">
		<h3>Poké Ball icon</h3>
		<div class="account-icon-grid">
		  <button type="button" class="account-icon-option" data-icon="default" title="Poké Ball">
			<span>⚪</span>
		  </button>
		  <button type="button" class="account-icon-option" data-icon="great" title="Great Ball">
			<span>🔵</span>
		  </button>
		  <button type="button" class="account-icon-option" data-icon="ultra" title="Ultra Ball">
			<span>🟡</span>
		  </button>
		</div>
	  </div>

	  <div class="account-preferences">
		<h3>Preferences</h3>
		<div class="account-pref-block">
		  <div class="account-pref-title">Overall game progress bar</div>
		  <p class="small">
			Controls how the gold bar at the top of <strong>Game Summary — All Games</strong> is calculated.
		  </p>
		  <div class="account-pref-options">
			<label>
			  <input type="radio" name="gameSummaryMode" value="all" />
			  Use all games
			</label>
			<label>
			  <input type="radio" name="gameSummaryMode" value="started" />
			  Use started games only
			</label>
		  </div>
		</div>

		<div class="account-pref-block">
		  <div class="account-pref-title">Pokédex sprites (Gen 5+)</div>
		  <p class="small">
			Choose between static sprites (PNG) and animated sprites (WebM). Animated sprites only apply for games from <strong>Black/White</strong> onward.
		  </p>
		  <div class="account-pref-options">
			<label class="small" for="account-dex-sprite-mode" style="display:block; margin-bottom:6px;">
				Sprite mode
			</label>
			<select id="account-dex-sprite-mode" class="flag-select" style="min-width: 220px;">
				<option value="static">Static (PNG)</option>
				<option value="animated">Animated (WebM)</option>
			</select>
			</div>
		</div>
	  </div>
	</div>
  `;
	main.appendChild(card);

	const loginBtn = card.querySelector("#accountLoginBtn");
	const logoutBtn = card.querySelector("#accountLogoutBtn");
	const accountMetaEl = card.querySelector("#accountMeta");
	const iconButtons = card.querySelectorAll(".account-icon-option");
	const summaryModeInputs = card.querySelectorAll('input[name="gameSummaryMode"]');
	const dexSpriteSelect = card.querySelector("#account-dex-sprite-mode");

	function refreshGeneralSection() {
		const storeRef = window.PPGC?._storeRef;
		const u = window.PPGC?.currentUser || null;
		const email = u?.email || "(not signed in)";
		const signedIn = !!u;

		if (accountMetaEl) {
			accountMetaEl.innerHTML = `
		<div><strong>Email:</strong> ${email}</div>
		<div><strong>Status:</strong> ${signedIn ? "Signed in" : "Guest"}</div>
	  `;
		}

		if (loginBtn) {
			loginBtn.textContent = signedIn ? "Switch account" : "Log in / Sign up";
		}
		if (logoutBtn) {
			logoutBtn.hidden = !signedIn;
		}

		const currentIcon = u?.icon || "default";
		iconButtons.forEach((btn) => {
			const icon = btn.dataset.icon;
			btn.classList.toggle("selected", icon === currentIcon);
		});

		// NEW: sync game summary mode radios
		const mode =
			storeRef?.state?.gameSummaryAggregateMode === "started"
				? "started"
				: "all";

		summaryModeInputs.forEach((input) => {
			input.checked = input.value === mode;
		});

		if (dexSpriteSelect) {
			dexSpriteSelect.value = storeRef?.state?.dexSpriteMode === "animated"
				? "animated"
				: "static";
		}
	}

	if (loginBtn) {
		loginBtn.addEventListener("click", () => {
			if (window.PPGC?.openAuthModal) {
				window.PPGC.openAuthModal("login");
			} else {
				const overlay = document.getElementById("ppgc-auth-overlay");
				if (overlay) overlay.hidden = false;
			}
		});
	}

	if (logoutBtn) {
		logoutBtn.addEventListener("click", () => {
			if (window.PPGC?.handleLogout) {
				window.PPGC.handleLogout();
			}
		});
	}

	iconButtons.forEach((btn) => {
		btn.addEventListener("click", async () => {
			const icon = btn.dataset.icon;
			const u = window.PPGC?.currentUser || null;

			// visual update
			iconButtons.forEach((b) => b.classList.remove("selected"));
			btn.classList.add("selected");

			const accBtn = document.getElementById("ppgc-account-button");
			if (accBtn) accBtn.dataset.icon = icon;

			if (!u || !window.PPGC?.api?.updateMe) return;

			try {
				const res = await window.PPGC.api.updateMe({ icon });
				if (res && res.user) {
					window.PPGC.currentUser = res.user;
				}
			} catch (err) {
				console.debug("[account] failed to update icon (ignored):", err);
			} finally {
				refreshGeneralSection();
			}
		});
	});

	if (summaryModeInputs && summaryModeInputs.length) {
		summaryModeInputs.forEach((input) => {
			input.addEventListener("change", () => {
				if (!input.checked) return;
				const mode = input.value === "started" ? "started" : "all";
				const storeRef = window.PPGC?._storeRef;
				if (!storeRef) return;

				storeRef.state.gameSummaryAggregateMode = mode;
				save();

				window.PPGC?.renderAll?.();
			});
		});
	}

	if (dexSpriteSelect) {
		dexSpriteSelect.addEventListener("change", () => {
			const storeRef = window.PPGC?._storeRef;
			if (!storeRef) return;

			storeRef.state.dexSpriteMode =
				dexSpriteSelect.value === "animated" ? "animated" : "static";

			save();

			window.PPGC?.renderDexGridIfOpen?.();
			window.PPGC?.renderAll?.();
		});
	}


	// initial populate
	refreshGeneralSection();
}
function renderAccountBackupSection(wrap, store) {
	const main = wrap.querySelector(".account-main");
	if (!main) return;

	const card = document.createElement("section");
	card.className = "card account-section";
	card.id = "account-section-backup";
	card.innerHTML = `
	<div class="card-hd">
	  <h2>Backups &amp; Import</h2>
	  <p class="small">
		Uses the same backup folder and settings as before: choose a folder once, then
		run manual backup/import as needed.
	  </p>
	</div>
	<div class="card-bd">
	  <div class="account-backup-panel">
		<div class="backup-row backup-row-main">
		  <div class="backup-main-left">
			<span class="dot" id="account-backup-dot" title="No backup folder chosen"></span>
			<div class="backup-main-labels">
			  <div class="backup-main-title">Manual backup / import</div>
			  <div class="backup-main-hint small">
				Click <strong>Backup</strong> to save.<br/>
				Click <strong>Import</strong> to restore from folder.
			  </div>
			</div>
		  </div>
		  <div class="backup-main-actions">
			<button
			  id="account-backup-now"
			  class="primary"
			  title="Click: Backup current game • Alt+Click: Backup all games"
			>
			  Backup
			</button>
			<button
			  id="account-import-now"
			  title="Click: Import All • Alt+Click: Import Current Game"
			>
			  Import
			</button>
		  </div>
		</div>

		<div class="backup-row backup-row-auto">
		  <div class="backup-auto-labels">
			<div class="backup-auto-title">Automatic backups</div>
			<div class="backup-auto-hint small">
			  When enabled, the app will periodically back up to your chosen folder.
			</div>
		  </div>
		  <label class="switch" id="account-auto" title="Toggle automatic backups">
			<input type="checkbox" id="account-auto-toggle" />
			<span class="slider" aria-hidden="true"></span>
			<span class="sr">Auto Backup</span>
		  </label>
		</div>

		<div class="backup-row backup-row-folder">
		  <div class="backup-folder-labels">
			<div class="backup-folder-title">Backup folder</div>
			<div class="backup-folder-hint small">
			  Choose or change the folder that backups are written to.
			</div>
		  </div>
		  <button id="account-backup-folder">Choose Folder</button>
		</div>

		<div class="backup-row backup-row-meta">
		  <span class="meta" id="account-backup-meta"></span>
		</div>
	  </div>
	</div>
  `;
	main.appendChild(card);

	const dot = card.querySelector("#account-backup-dot");
	const btnNow = card.querySelector("#account-backup-now");
	const btnImport = card.querySelector("#account-import-now");
	const btnFolder = card.querySelector("#account-backup-folder");
	const autoToggle = card.querySelector("#account-auto-toggle");
	const meta = card.querySelector("#account-backup-meta");

	if (!dot || !btnNow || !btnImport || !btnFolder || !autoToggle || !meta) {
		return;
	}

	function resolveGameLabel(gameKey) {
		if (window.PPGC?.resolveGameLabel) {
			return window.PPGC.resolveGameLabel(gameKey);
		}
		return gameKey || "Unknown game";
	}

	function formatTs(ts) {
		if (!ts) return "never";
		try {
			const d = new Date(ts);
			return d.toLocaleString();
		} catch {
			return ts;
		}
	}

	async function refreshStatus() {
		const granted = await isBackupFolderGranted();

		dot.classList.toggle("ok", !!granted);
		dot.title = granted
			? "Backups will run silently"
			: "Click 'Choose Folder' to enable silent backups";

		btnFolder.textContent = granted ? "Change Folder" : "Choose Folder";

		const ts = localStorage.getItem("ppgc_last_backup_ts");
		const gameKey = localStorage.getItem("ppgc_last_backup_game") || "";

		if (!ts) {
			meta.textContent = "Last: never";
		} else {
			const label = resolveGameLabel(gameKey);
			meta.textContent = `Last: ${formatTs(ts)} — ${label}`;
		}

		autoToggle.checked = getAutoBackupsEnabled();
	}

	btnNow.addEventListener("click", async () => {
		btnNow.disabled = true;
		btnNow.textContent = "Backing up all…";
		try {
			await backupAllNow(); // always all games
		} catch (err) {
			console.debug("[backup] failed:", err);
		} finally {
			btnNow.disabled = false;
			btnNow.textContent = "Backup";
			refreshStatus();
		}
	});

	btnImport.addEventListener("click", async () => {
		btnImport.disabled = true;
		btnImport.textContent = "Importing all…";
		try {
			await importAllFromFolder(); // always all games
		} catch (err) {
			console.debug("[import] failed:", err);
		} finally {
			btnImport.disabled = false;
			btnImport.textContent = "Import";
			refreshStatus();
		}
	});

	btnFolder.addEventListener("click", async () => {
		try {
			await chooseBackupFolder();
		} catch (e) {
			console.debug("[backup] chooseFolder:", e);
		} finally {
			refreshStatus();
		}
	});

	autoToggle.addEventListener("change", () => {
		setAutoBackupsEnabled(autoToggle.checked);
		dot.title = autoToggle.checked ? "Auto-backups ON" : "Auto-backups OFF";
	});

	window.addEventListener("ppgc:backup:done", refreshStatus);
	refreshStatus();
}
function renderAccountSaveImportSection(wrap) {
	const main = wrap.querySelector(".account-main");
	if (!main) return;

	const card = document.createElement("section");
	card.className = "card account-section";
	card.id = "account-section-import";
	card.innerHTML = `
	<div class="card-hd">
	  <h2>Save Data Import</h2>
	  <p class="small">
		Choose a supported game and upload a <code>.sav</code> file.
		We’ll preview all task changes before applying them.
	  </p>
	</div>
	<div class="card-bd">
	  <div class="account-import-grid"></div>
	</div>
  `;
	main.appendChild(card);

	const importGrid = card.querySelector(".account-import-grid");
	if (!importGrid) return;

	const tabs = window.DATA?.tabs || [];
	const gamesByGen = window.DATA?.games || {};

	tabs.forEach((tab) => {
		const genKey = tab.key;
		const genLabel = tab.label || genKey;
		const games = gamesByGen[genKey] || [];

		if (!games || !games.length) return;

		const genSection = document.createElement("section");
		genSection.className = "account-import-gen";
		genSection.innerHTML = `
	  <h4 class="account-import-gen-title">${genLabel}</h4>
	  <div class="account-import-games-row"></div>
	`;

		const row = genSection.querySelector(".account-import-games-row");

		games.forEach((g) => {
			const card = document.createElement("article");
			card.className = "account-import-game";
			card.setAttribute("data-game-key", g.key);
			card.setAttribute("data-gen-key", genKey);

			const imgPath = `./imgs/game-icons/${g.key}.png`;
			const isSupported = SUPPORTED_SAVE_IMPORT_GAMES.has(g.key);

			card.innerHTML = `
		<div class="account-import-game-art"
		  style="background-image: url('${imgPath}')"
		  aria-hidden="true"></div>
		<div class="account-import-game-title">${g.label}</div>
		<button
		  type="button"
		  class="button account-import-btn${isSupported ? "" : " is-wip"}"
		  data-game-key="${g.key}"
		  data-gen-key="${genKey}"
		  ${isSupported ? "" : "disabled"}
		>
		  ${isSupported ? "Import" : "WIP"}
		</button>
	  `;

			const btn = card.querySelector(".account-import-btn");

			if (isSupported && btn) {
				btn.addEventListener("click", () => {
					const gameKey = g.key;

					const input = document.createElement("input");
					input.type = "file";
					input.accept = ".sav";
					input.style.display = "none";

					input.addEventListener("change", async () => {
						const file = input.files && input.files[0];
						if (!file) {
							input.remove();
							return;
						}

						if (!file.name.toLowerCase().endsWith(".sav")) {
							alert("Please select a .sav file for now (others coming later).");
							input.remove();
							return;
						}

						btn.disabled = true;
						const originalLabel = btn.textContent;
						btn.textContent = "Uploading…";

						try {
							const result = await window.PPGC.api.uploadSaveFileForImport(
								gameKey,
								file
							);
							console.log("[save-import] parsed:", result);

							const tasksFromSave = result.tasks || {};
							const taskIndex =
								(window.PPGC && window.PPGC._taskIndexGlobal) || new Map();

							const changes = [];

							for (const [taskId, newValueRaw] of Object.entries(
								tasksFromSave
							)) {
								const newValue = !!newValueRaw;

								let currentValue = false;
								let label = taskId;

								if (taskIndex && typeof taskIndex.get === "function") {
									const hit = taskIndex.get(taskId);
									if (hit && hit.task) {
										currentValue = !!hit.task.done;
										label = hit.task.text || label;
									}
								}

								if (currentValue !== newValue) {
									changes.push({
										id: taskId,
										label,
										from: currentValue,
										to: newValue,
									});
								}
							}

							if (!changes.length) {
								alert(
									[
										`Game: ${result.gameKey || gameKey}`,
										`File size: ${result.size || file.size} bytes`,
										"",
										"No changes needed — your current progress already matches this save (for the bits we know about).",
									].join("\n")
								);
								return;
							}

							const previewLines = [];

							previewLines.push(
								`Game: ${result.gameKey || gameKey}`,
								`File size: ${result.size || file.size} bytes`,
								""
							);
							previewLines.push("The following tasks will be updated:\n");

							for (const change of changes) {
								const fromLabel = change.from
									? "✓ complete"
									: "○ incomplete";
								const toLabel = change.to
									? "✓ complete"
									: "○ incomplete";
								previewLines.push(
									`• ${change.label}`,
									`    ${fromLabel}  →  ${toLabel}`,
									""
								);
							}

							const confirmed = window.confirm(previewLines.join("\n"));
							if (!confirmed) return;

							if (
								!window.PPGC ||
								typeof window.PPGC.setTaskCheckedById !== "function"
							) {
								alert(
									"Could not apply changes: task helper is not available yet. " +
									"Try visiting the game's page once so tasks are loaded, then re-run the import."
								);
								return;
							}

							for (const change of changes) {
								window.PPGC.setTaskCheckedById(change.id, change.to);
							}

							alert(
								"Save data imported for the known flags. Your tasks have been updated!"
							);
						} catch (err) {
							console.error("[save-import] failed:", err);
							alert(err.message || "Failed to upload or parse save file.");
						} finally {
							btn.disabled = false;
							btn.textContent = originalLabel;
							input.remove();
						}
					});

					document.body.appendChild(input);
					input.click();
				});
			} else if (btn) {
				btn.title =
					"Save data import for this game is still a work in progress.";
			}

			row.appendChild(card);
		});

		importGrid.appendChild(genSection);
	});
}

/* ======================== Mon Info renderer =========================== */
const MONINFO_GAME_ORDER = [
	"home",
	"legendsza",
	"legendszamd",
	"scarlet",
	"scarlettm",
	"scarletid",
	"violet",
	"violettm",
	"violetid",
	"legendsarceus",
	"brilliantdiamond-national",
	"brilliantdiamond",
	"shiningpearl-national",
	"shiningpearl",
	"sword",
	"swordioa",
	"swordct",
	"shield",
	"shieldioa",
	"shieldct",
	"letsgopikachu",
	"letsgoeevee",
	"ultrasun-alola",
	"ultrasun-melemele",
	"ultrasun-akala",
	"ultrasun-ulaula",
	"ultrasun-poni",
	"ultramoon-alola",
	"ultramoon-melemele",
	"ultramoon-akala",
	"ultramoon-ulaula",
	"ultramoon-poni",
	"sun-alola",
	"sun-melemele",
	"sun-akala",
	"sun-ulaula",
	"sun-poni",
	"moon-alola",
	"moon-melemele",
	"moon-akala",
	"moon-ulaula",
	"moon-poni",
	"omegaruby-national",
	"omegaruby",
	"alphasapphire-national",
	"alphasapphire",
	"x-national",
	"x-central",
	"x-coastal",
	"x-mountain",
	"y-national",
	"y-central",
	"y-coastal",
	"y-mountain",
	"black2-national",
	"black2",
	"white2-national",
	"white2",
	"black-national",
	"black",
	"white-national",
	"white",
	"heartgold-national",
	"heartgold",
	"soulsilver-national",
	"soulsilver",
	"platinum-national",
	"platinum",
	"diamond-national",
	"diamond",
	"pearl-national",
	"pearl",
	"firered-national",
	"firered",
	"leafgreen-national",
	"leafgreen",
	"emerald-national",
	"emerald",
	"ruby-national",
	"ruby",
	"sapphire-national",
	"sapphire",
	"crystal",
	"silver",
	"gold",
	"yellow",
	"red",
	"blue",
	"green",
];

function monInfoLabelForGameKey(gameKey) {
	const gk = String(gameKey || "").trim();

	if (gk.startsWith("home")) return "HOME";
	if (gk.startsWith("legendsza") || gk.startsWith("legendszamd")) return "Legends: Z-A";
	if (gk.startsWith("scarlet") || gk.startsWith("violet")) return "Scarlet / Violet";
	if (gk.startsWith("legendsarceus")) return "Legends: Arceus";
	if (gk.startsWith("brilliantdiamond") || gk.startsWith("shiningpearl")) return "Brilliant Diamond / Shining Pearl";
	if (gk.startsWith("sword") || gk.startsWith("shield")) return "Sword/Shield";
	if (gk.startsWith("letsgopikachu") || gk.startsWith("letsgoeevee")) return "Let's Go Pikachu / Eevee!";
	if (gk.startsWith("ultrasun") || gk.startsWith("ultramoon")) return "Ultra Sun / Ultra Moon";
	if (gk.startsWith("sun") || gk.startsWith("moon")) return "Sun / Moon";
	if (gk.startsWith("omegaruby") || gk.startsWith("alphasapphire")) return "Omega Ruby / Alpha Sapphire";
	if (gk.startsWith("x-") || gk.startsWith("y-")) return "X / Y";
	if (gk.startsWith("black2") || gk.startsWith("white2")) return "Black 2 / White 2";
	if (gk.startsWith("black") || gk.startsWith("white")) return "Black / White";
	if (gk.startsWith("heartgold") || gk.startsWith("soulsilver")) return "HeartGold / SoulSilver";
	if (gk.startsWith("platinum")) return "Platinum";
	if (gk.startsWith("diamond") || gk.startsWith("pearl")) return "Diamond / Pearl";
	if (gk.startsWith("firered") || gk.startsWith("leafgreen")) return "FireRed / LeafGreen";
	if (gk.startsWith("emerald")) return "Emerald";
	if (gk.startsWith("ruby") || gk.startsWith("sapphire")) return "Ruby / Sapphire";
	if (gk.startsWith("crystal")) return "Crystal";
	if (gk.startsWith("silver")) return "Silver";
	if (gk.startsWith("gold")) return "Gold";
	if (gk.startsWith("yellow")) return "Yellow";
	if (gk.startsWith("red") || gk.startsWith("blue")) return "Red / Blue";
	if (gk.startsWith("green")) return "Green";

	// Fallback: Title Case-ish
	return gk
		.split(/[-_]/g)
		.filter(Boolean)
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

function sortGameKeysForMonInfo(keys) {
	const pri = new Map(MONINFO_GAME_ORDER.map((k, i) => [k, i]));
	return [...keys].sort((a, b) => {
		const ai = pri.has(a) ? pri.get(a) : 9999;
		const bi = pri.has(b) ? pri.get(b) : 9999;
		if (ai !== bi) return ai - bi;
		return String(a).localeCompare(String(b));
	});
}

/**
 * Build dropdown options for Mon Info page:
 * - sort by MONINFO_GAME_ORDER
 * - map gameKey -> label
 * - dedupe by label (keep the FIRST key that produces a given label)
 *
 * Returns: [{ key, label }]
 */
function buildMonInfoGameOptions(gameKeys) {
	const ordered = sortGameKeysForMonInfo(gameKeys);

	const seenLabels = new Set();
	const opts = [];

	for (const gk of ordered) {
		const label = monInfoLabelForGameKey(gk);

		// If multiple keys collapse to same label (sun-alola + moon-alola), keep first
		if (seenLabels.has(label)) continue;

		seenLabels.add(label);
		opts.push({ key: gk, label });
	}

	return opts;
}

function normalizeMonInfoComboKeys() {
	const byGame = window.DATA?.monInfo;
	if (!byGame || typeof byGame !== "object") return;

	for (const rawKey of Object.keys(byGame)) {
		if (!rawKey || typeof rawKey !== "string" || !rawKey.includes(",")) continue;
		const bucket = byGame[rawKey];
		if (!bucket || typeof bucket !== "object") continue;

		const parts = rawKey.split(",").map((s) => s.trim()).filter(Boolean);
		for (const k of parts) {
			if (!byGame[k]) byGame[k] = bucket; // alias to the same bucket
		}

		// Remove the combined key so it never shows up in dropdowns, etc.
		delete byGame[rawKey];
	}
}

function findGameKeysForMonInfoNati(natiId) {
	const n = Number(natiId);
	normalizeMonInfoComboKeys();

	const byGame = window.DATA?.monInfo || {};
	const out = new Set();

	for (const gk of Object.keys(byGame)) {
		if (String(gk).startsWith("$")) continue;
		const bucket = byGame[gk];
		if (!bucket || typeof bucket !== "object") continue;
		if (bucket[n] != null || bucket[String(n)] != null) out.add(gk);
	}

	return out.size ? Array.from(out) : Object.keys(byGame);
}

function renderMonInfoIndexPage(store, els) {
	const el = els.elContent;

	// HOME dex is registered under window.DATA.dex.home (see home.js)
	const homeDex = window.DATA?.dex?.home || [];
	const mons = Array.isArray(homeDex) ? homeDex : [];

	el.innerHTML = `
		<div class="page">
			<h2 class="page-title">Mon Info</h2>
			<div id="moninfoGrid" class="moninfo-grid"></div>
		</div>
	`;

	const grid = document.getElementById("moninfoGrid");
	if (!grid) return;

	for (const mon of mons) {
		const natiId = Number(mon?.natiId ?? mon?.id ?? 0);
		if (!natiId) continue;

		const name = String(mon?.name || `#${natiId}`);
		const p4 = pad4(natiId);
		const img = `imgs/sprites/pokemon_home/base-front/${p4}.png`;

		const card = document.createElement("button");
		card.type = "button";
		card.className = "moninfo-card";
		card.innerHTML = `
			<div class="moninfo-card-id">#${pad4(natiId)}</div>
			<img class="moninfo-card-img" src="${img}" alt="#${natiId} — ${name}">
			<div class="moninfo-card-name">${name}</div>
		`;

		card.addEventListener("click", () => {
			window.PPGC.navigateToState({
				level: "moninfo",
				genKey: null,
				gameKey: null,
				sectionId: null,
				monInfoId: natiId,
				monInfoGameKey: null,
				monInfoForm: null,
			});
		});

		grid.appendChild(card);
	}
}

async function renderMonInfoPage(store, els) {
	const el = els.elContent;
	const s = store.state;

	const natiId = Number(s.monInfoId);
	if (!natiId) {
		el.innerHTML = `<div class="page"><h2 class="page-title">Mon Info</h2><p>No Pokémon selected.</p></div>`;
		return;
	}

	// 1) Ensure BASE mon info is available early (needed for page + “more info” consumers)
	// (Loader should tolerate null/undefined formKey; this loads the base file only.)
	await ensureMonInfoLoaded(natiId, null);

	// Try to get a decent display name from base monInfo data if possible
	// (Falls back to #id if not present)
	function _displayNameFromMonInfoBase() {
		try {
			const byGame = window.DATA?.monInfo || {};
			// Find any game bucket that has this mon
			for (const bucket of Object.values(byGame)) {
				if (!bucket || typeof bucket !== "object") continue;
				const rec = bucket[natiId] || bucket[String(natiId)];
				if (rec && rec.name) return String(rec.name);
			}
		} catch { }
		return `#${natiId}`;
	}

	const displayName = _displayNameFromMonInfoBase();

	el.innerHTML = `
		<div class="page">
			<div class="moninfo-header">
				<div class="moninfo-header-left">
					<img class="moninfo-hero-img" src="imgs/sprites/pokemon_home/base-front/${pad4(natiId)}.png" alt="#${natiId}">
					<div>
						<h2 class="page-title">#${pad4(natiId)} — ${displayName}</h2>
							<div class="moninfo-subtitle small" id="moninfoSubtitle"></div>
					</div>
				</div>

				<!-- ✅ NEW: Prev/Next goes between name and game select -->
				<div class="moninfo-header-mid">
					<button id="moninfoPrevBtn" class="moninfo-nav-btn" style="border-top-right-radius: 0px; border-bottom-right-radius: 0px;" type="button" aria-label="Previous Pokémon"></button>
					<button id="moninfoNextBtn" class="moninfo-nav-btn" style="border-top-left-radius: 0px; border-bottom-left-radius: 0px;" type="button" aria-label="Next Pokémon"></button>
				</div>

				<div class="moninfo-header-right">
					<label class="moninfo-field">
						<div class="moninfo-field-label">Game</div>
						<select id="moninfoGameSelect"></select>
					</label>
				</div>
			</div>

			<div id="moninfoBody" class="moninfo-body">Loading…</div>
		</div>
	`;

	// 2) Determine which games have monInfo data for this mon
	const gameKeysRaw = findGameKeysForMonInfoNati(natiId);
	const options = buildMonInfoGameOptions(gameKeysRaw);
	const optionKeys = options.map((o) => o.key);

	if (!optionKeys.length) {
		const body = document.getElementById("moninfoBody");
		if (body) body.innerHTML = `<div class="moninfo-debug">No Mon Info game data found for #${natiId}.</div>`;
		save();
		return;
	}

	// Canonical "selected" gameKey must match one of the option keys
	if (!s.monInfoGameKey || !optionKeys.includes(s.monInfoGameKey)) {
		store.state.monInfoGameKey = optionKeys[0] || null;
	}
	const gameKey = store.state.monInfoGameKey;

	// -------------------- Prev / Next wiring --------------------
	(function wirePrevNext() {
		const prevBtn = document.getElementById("moninfoPrevBtn");
		const nextBtn = document.getElementById("moninfoNextBtn");
		if (!prevBtn || !nextBtn) return;

		// HOME dex provides the canonical ordering for navigation
		const homeDexRaw = window.DATA?.dex?.home || [];
		const homeDex = Array.isArray(homeDexRaw) ? homeDexRaw : [];

		// Ensure sorted by natiId (just in case)
		const mons = homeDex
			.map((m) => ({
				natiId: Number(m?.natiId ?? m?.id ?? 0),
				name: String(m?.name || ""),
			}))
			.filter((m) => m.natiId > 0)
			.sort((a, b) => a.natiId - b.natiId);

		const idx = mons.findIndex((m) => m.natiId === Number(natiId));
		const prev = idx > 0 ? mons[idx - 1] : null;
		const next = idx >= 0 && idx < mons.length - 1 ? mons[idx + 1] : null;

		// Pick a game for target mon:
		// - keep current gameKey if target supports it
		// - otherwise use the most recent (options[0] after ordering)
		function pickGameForMon(targetNatiId) {
			const keysRaw = findGameKeysForMonInfoNati(targetNatiId);
			const opts = buildMonInfoGameOptions(keysRaw);
			const keys = opts.map((o) => o.key);

			if (keys.includes(gameKey)) return gameKey; // preserve current game if available
			return keys[0] || null; // most recent available for target
		}

		function setBtn(btn, entry, dir) {
			if (!entry) {
				btn.disabled = true;
				btn.innerHTML = dir === "prev" ? "◀ Prev" : "Next ▶";
				return;
			}

			const id = Number(entry.natiId);
			const name = entry.name || `#${id}`;
			const sprite = `imgs/sprites/pokemon_home/menu_sprites/${pad4(id)}.png`; // menu_sprites

			btn.disabled = false;
			btn.innerHTML = `
			<span class="moninfo-nav-inner">
				${dir === "prev" ? `<span class="moninfo-nav-arrow">◀</span>` : ""}
				<img class="moninfo-nav-sprite" src="${sprite}" alt="">
				<span class="moninfo-nav-text">#${pad4(id)} ${name}</span>
				${dir === "next" ? `<span class="moninfo-nav-arrow">▶</span>` : ""}
			</span>
			`;

			btn.onclick = () => {
				const targetGameKey = pickGameForMon(id);

				window.PPGC.navigateToState({
					level: "moninfo",
					toolsKey: "info",
					genKey: null,
					gameKey: null,
					sectionId: null,
					monInfoId: id,
					monInfoGameKey: targetGameKey,
					monInfoForm: null, // reset form on mon change (safe default)
				});
			};
		}

		setBtn(prevBtn, prev, "prev");
		setBtn(nextBtn, next, "next");
	})();


	// If we just defaulted the game, also "pretty-navigate" (REPLACE) so the URL becomes:
	//   #/moninfo/<natiId>/<prettyGame>
	try {
		const hashParts = (window.location.hash || "")
			.replace(/^#/, "")
			.split("/")
			.filter(Boolean);

		// We ONLY support tools/info now:
		//   #/tools/info/<id>/<gameSlug>/<form?>
		const isToolsInfoRoute = hashParts[0] === "tools" && hashParts[1] === "info";

		// "has game" means the 4th segment exists:
		// tools (0), info (1), id (2), game (3)
		const hasGameInUrl = isToolsInfoRoute && hashParts.length >= 4;

		if (!hasGameInUrl && window.PPGC?.navigateToState) {
			if (!isToolsInfoRoute) return;
			if (hashParts[3]) return;

			window.PPGC.navigateToState(
				{
					level: "moninfo",
					toolsKey: "info",
					genKey: null,
					gameKey: null,
					sectionId: null,
					monInfoId: natiId,
					monInfoGameKey: store.state.monInfoGameKey,
					monInfoForm: store.state.monInfoForm || null,
				},
				{ replace: true }
			);
			return; // prevent double-render work; router will re-render immediately
		}
	} catch { }

	// 3) Populate game dropdown
	const gameSel = document.getElementById("moninfoGameSelect");
	if (gameSel) {
		gameSel.innerHTML = "";

		for (const optRec of options) {
			const opt = document.createElement("option");
			opt.value = optRec.key;
			opt.textContent = optRec.label;
			if (optRec.key === store.state.monInfoGameKey) opt.selected = true;
			gameSel.appendChild(opt);
		}

		gameSel.onchange = () => {
			const nextGameKey = gameSel.value || null;

			// Reset form when changing game (prevents invalid form keys fighting the new game's data)
			const nextForm = null;

			window.PPGC.navigateToState({
				level: "moninfo",
				toolsKey: "info",
				genKey: null,
				gameKey: null,
				sectionId: null,
				monInfoId: natiId,
				monInfoGameKey: nextGameKey, // ✅ actually switch games
				monInfoForm: nextForm,
			});
		};
	}

	await ensureMonInfoLoaded(natiId, null);

	// 6) Render
	const body = document.getElementById("moninfoBody");
	if (!body) return;

	const monForRenderer = {
		id: natiId,
		natiId,
		name: displayName,
		img: `imgs/sprites/pokemon_home/base-front/${pad4(natiId)}.png`,
		types: [],
		baseStats: null,
	};

	const genKeyRaw = inferGenFromGameKey(gameKey);
	const genKey = normalizeGenKeyNoPrefix(genKeyRaw);
	await renderMonInfoInto({
		gameKey,
		genKey,
		mon: monForRenderer,
		formKey: null,
		titleEl: null,
		bodyEl: body,
		sourceCard: null,
	});

	save();
}

/* ======================== Main content renderer =========================== */

export function renderContent(store, els) {
	window.PPGC = window.PPGC || {};
	window.PPGC._storeRef = store;
	window.PPGC._tasksStoreRef = store.tasksStore;

	wireGlobalTaskSearch();
	wireSidebarToggle();

	const s = store.state;
	const elContent = els.elContent;
	elContent.innerHTML = "";

	// Wire Dex / Fashion modals (singletons)
	if (!dexApiSingleton.api) dexApiSingleton.api = wireDexModal(store, els);
	window.PPGC.dexApi = dexApiSingleton.api;

	if (!fashionApiSingleton.api) {
		fashionApiSingleton.api = wireFashionModal(store, els);
	}
	window.PPGC.fashionApi = fashionApiSingleton.api;

	if (!medalsApiSingleton.api) {
		medalsApiSingleton.api = wireMedalsModal(store, els);
	}
	window.PPGC.medalsApi = medalsApiSingleton.api;

	/* ---------- Level: ACCOUNT (Account overview) ---------- */
	if (s.level === "account") {
		renderAccountPage(store, els);
		return;
	}

	/* ---------- Level: TOOLS ---------- */
	if (s.level === "tools") {
		const tool = s.toolsKey || "info";

		// Default tool
		if (!s.toolsKey) store.state.toolsKey = "info";

		if (tool === "info") {
			return renderMonInfoIndexPage(store, els);
		}

		// Placeholder for future tools
		els.elContent.innerHTML = `
		<div class="page">
			<h2 class="page-title">Tools</h2>
			<p class="small">Unknown tool: <code>${tool}</code></p>
		</div>
	`;
		return;
	}

	/* ---------- Level: MONINFO (single mon page) ---------- */
	if (s.level === "moninfo") {
		renderMonInfoPage(store, els);
		return;
	}

	/* ---------- Level: GEN (All games overview) ---------- */

	if (s.level === "gen") {
		const allGames = allGamesList();
		const startedMap = s.startedGames || {};

		// Precompute per-game percentages once
		const gameStats = allGames.map(({ genKey, game: g }) => {
			const secs = ensureSections(g.key);
			const baseSecs = secs.filter((sec) => !_isExtraCreditSection(sec));
			const extraSecs = secs.filter(_isExtraCreditSection);

			const basePcts = baseSecs.map((sec) =>
				_computeSectionPct(sec, g.key, genKey, store)
			);
			const baseComplete =
				basePcts.length > 0 && basePcts.every((p) => p >= 100 - 1e-6);
			const baseAvg = basePcts.length
				? basePcts.reduce((a, b) => a + b, 0) / basePcts.length
				: 0;

			let pct;
			if (!baseComplete) {
				pct = Math.min(100, baseAvg);
			} else {
				const extraPcts = extraSecs.map((sec) =>
					_computeSectionPct(sec, g.key, genKey, store)
				);
				const extraAvg = extraPcts.length
					? extraPcts.reduce((a, b) => a + b, 0) / extraPcts.length
					: 0;
				pct = 100 + Math.min(100, extraAvg); // cap at 200%
			}

			const basePct = Math.min(100, pct);
			const extraPct = pct > 100 ? Math.min(pct - 100, 100) : 0;
			const isStarted = !!startedMap[g.key];

			return {
				genKey,
				game: g,
				pct,       // 0–200, used only when started
				basePct,   // 0–100
				extraPct,  // 0–100
				isStarted,
			};
		});

		// Aggregate bar: "Use all games" vs "Use started games only"
		const aggregateMode =
			s.gameSummaryAggregateMode === "started" ? "started" : "all";

		const startedStats = gameStats.filter((st) => st.isStarted);
		let aggregateStats;

		if (aggregateMode === "started") {
			// Only started games are considered at all
			aggregateStats = startedStats;
		} else {
			// "All" games: unstarted still exist, but their progress is treated as 0
			aggregateStats = gameStats;
		}

		const totalGames = aggregateStats.length;
		const totalKnownGames = allGames.length;
		const startedCount = startedStats.length;

		let aggBase = 0;
		let aggExtra = 0;

		if (totalGames > 0) {
			for (const st of aggregateStats) {
				// Progress only counts once the game is Started
				const base = st.isStarted ? st.basePct : 0;
				const extra = st.isStarted ? st.extraPct : 0;

				aggBase += base;
				aggExtra += extra;
			}
			aggBase /= totalGames;
			aggExtra /= totalGames;
		}

		// Extra credit overlay only after *all relevant games* are at 100% base.
		// - In "all" mode: every game must be started AND at 100%.
		// - In "started" mode: every started game must be at 100%.
		let effectiveExtra = 0;
		let allBaseComplete = false;

		if (totalGames > 0) {
			if (aggregateMode === "started") {
				allBaseComplete =
					startedCount > 0 &&
					startedStats.every((st) => st.basePct >= 100 - 1e-6);
			} else {
				allBaseComplete =
					aggregateStats.length > 0 &&
					aggregateStats.every(
						(st) => st.isStarted && st.basePct >= 100 - 1e-6
					);
			}

			if (allBaseComplete) {
				effectiveExtra = aggExtra;
			}
		}

		// Clamp and derive combined percentage (0..200)
		const overallBase = Math.max(0, Math.min(100, aggBase));
		const overallExtra = Math.max(0, Math.min(100, effectiveExtra));
		const overallPct = overallBase + overallExtra;

		const overallLabel = `${overallPct.toFixed(2)}%`;

		const wrap = document.createElement("section");
		wrap.className = "card";
		wrap.innerHTML = `
	  <div class="card-hd section-hd game-summary-hd ${overallExtra > 0.01 ? "has-extra" : ""
			}">
		<h3>Game Summary — All Games</h3>
		<div class="pct" id="gameSummaryPct">${overallLabel}</div>
		<div class="row">
		  <label class="small" style="display: flex; align-items: center; gap: 4px;">
			<input type="checkbox" id="gameSummaryStartedOnly" />
			Show started games only
		  </label>
		</div>
	  </div>
	  <div class="card-bd">
		<div class="rings" id="gameRings"></div>
	  </div>`;
		elContent.appendChild(wrap);

		const headerEl = wrap.querySelector(".game-summary-hd");
		if (headerEl) {
			// Gold progress bar
			headerEl.style.setProperty("--accent", "#d4af37");
			headerEl.style.setProperty("--progress", overallBase.toFixed(2));
			headerEl.style.setProperty("--extra-progress", overallExtra.toFixed(2));

			const pctEl = headerEl.querySelector("#gameSummaryPct");
			if (pctEl) {
				if (aggregateMode === "started") {
					pctEl.title = `Based on ${startedCount} started game(s) out of ${totalKnownGames} total.`;
				} else {
					pctEl.title = `Based on all ${totalKnownGames} game(s). Progress only counts once a game is marked Started.`;
				}
			}
		}

		const ringsWrap = wrap.querySelector("#gameRings");
		const scopeToggle = wrap.querySelector("#gameSummaryStartedOnly");

		// Per-ring visibility filter: "all rings" vs "started rings only"
		const scope = s.gameSummaryScope || "all";
		if (scopeToggle) {
			scopeToggle.checked = scope === "started";
			scopeToggle.addEventListener("change", () => {
				s.gameSummaryScope = scopeToggle.checked ? "started" : "all";
				save();
				if (window.PPGC && typeof window.PPGC.renderAll === "function") {
					window.PPGC.renderAll();
				}
			});
		}

		let ringsStats = gameStats;
		if (scope === "started") {
			ringsStats = gameStats.filter((st) => st.isStarted);
		}

		if (!ringsStats.length) {
			const empty = document.createElement("div");
			empty.className = "small";
			empty.style.opacity = "0.8";
			empty.textContent =
				scope === "started"
					? "No games marked as started yet."
					: "No games found.";
			ringsWrap.appendChild(empty);
			return;
		}

		const startedMapLocal = startedMap;

		ringsStats.forEach((st) => {
			const { genKey, game: g } = st;

			// Show progress only if Started; otherwise force 0%.
			const pctForRing = st.isStarted ? st.pct : 0;

			const imgPath = `../imgs/game-icons/${g.key}.png`;
			const r = ring(pctForRing, g.label, { img: imgPath });
			r.style.setProperty("--accent", g.color || "#7fd2ff");
			r.style.cursor = "pointer";

			const isStarted = !!startedMapLocal[g.key];
			if (isStarted) {
				r.classList.add("is-started");
			}

			// Click ring → drill into game
			r.addEventListener("click", async () => {
				try {
					// Ensure this game’s generation data is loaded BEFORE reading sections
					const ensure = window.PPGC?.ensureGenDataLoadedForGame;
					if (ensure) await ensure(g.key);

					const sections = ensureSections(g.key);
					const firstSectionId = sections?.[0]?.id || null;

					window.PPGC.navigateToState({
						level: "section",
						genKey,
						gameKey: g.key,
						sectionId: firstSectionId,
					});
				} catch (e) {
					console.debug("[nav] failed to enter game:", e);
					// Fallback: go to game list for that gen
					window.PPGC.navigateToState({
						level: "game",
						genKey,
						gameKey: null,
						sectionId: null,
					});
				}
			});

			// Start / Started button
			const startBtn = document.createElement("button");
			startBtn.type = "button";
			startBtn.className = "button game-start-toggle";
			startBtn.textContent = isStarted ? "Started" : "Not started";
			startBtn.setAttribute("aria-pressed", isStarted ? "true" : "false");

			startBtn.addEventListener("click", (evt) => {
				// Don't also trigger the ring navigation
				evt.stopPropagation();

				// Read from the real "started" state
				const current = typeof store.isGameStarted === "function"
					? store.isGameStarted(g.key)
					: !!(((store.state || {}).startedGames || {})[g.key]);

				const next = !current;

				// Update the canonical started flag (this writes to store.state.startedGames)
				if (typeof store.setGameStarted === "function") {
					store.setGameStarted(g.key, next);
				} else {
					const s = store.state || (store.state = {});
					if (!s.startedGames) s.startedGames = {};
					if (next) {
						s.startedGames[g.key] = true;
					} else {
						delete s.startedGames[g.key];
					}
					save();
				}

				// Apply the "start sync" to tasks / dex / fashion / etc
				applyGameStartSync(g.key, next, store);

				// Update label + styling on this ring
				startBtn.textContent = next ? "Started" : "Not started";
				startBtn.setAttribute("aria-pressed", next ? "true" : "false");
				r.classList.toggle("is-started", next);

				// Re-render so the overall bar + filters update
				if (window.PPGC && typeof window.PPGC.renderAll === "function") {
					window.PPGC.renderAll();
				}
			});

			r.appendChild(startBtn);
			ringsWrap.appendChild(r);
		});

		return;
	}

	/* ---------- Level: GAME (per-game, per-section rings) ---------- */

	if (s.level === "game") {
		const wrap = document.createElement("section");
		wrap.className = "card";
		wrap.innerHTML = `
			<div class="card-hd">
				<h3>Section Summary — ${(window.DATA.tabs || []).find((t) => t.key === s.genKey)?.label ||
			s.genKey
			}</h3>
			</div>
			<div class="card-bd" id="genSummary"></div>
		`;
		elContent.appendChild(wrap);

		const holder = wrap.querySelector("#genSummary");
		holder.classList.add("games-rows");

		const rows = getGameRowsForGen(s.genKey);
		rows.forEach((row) => {
			const rowEl = document.createElement("div");
			rowEl.className = "games-row";
			holder.appendChild(rowEl);

			row.forEach((g) => {
				const secs = ensureSections(g.key);
				const gameBox = document.createElement("div");
				gameBox.className = "game-summary";
				const accent = g.color || "#7fd2ff";
				gameBox.style.setProperty("--accent", accent);
				gameBox.innerHTML = `
		  <div class="title">${g.label}</div>
		  <div class="rings"></div>`;
				const ringsWrap = gameBox.querySelector(".rings");

				if (!secs.length) {
					const empty = document.createElement("div");
					empty.className = "small";
					empty.style.opacity = ".8";
					empty.textContent = "No sections defined.";
					gameBox.appendChild(empty);
				} else {
					// Use the same per-game image for all section rings in this game
					const imgPath = `../imgs/game-icons/${g.key}.png`;

					secs.forEach((sec) => {
						const pct = _computeSectionPct(sec, g.key, s.genKey, store);
						ringsWrap.appendChild(ring(pct, sec.title, { img: imgPath }));
					});
				}

				rowEl.appendChild(gameBox);
			});
		});

		return;
	}

	/* ---------- Level: SECTION (tasks + Dex/Fashion/etc) ---------- */

	if (s.level === "section") {
		const sec = ensureSections(s.gameKey).find((x) => x.id === s.sectionId);
		if (!sec) {
			s.level = "game";
			save();
			return renderContent(store, els);
		}

		// Make sure tasks exist for this section
		ensureSyncSetsExpandedForGame(s.gameKey);
		bootstrapTasksForGame(s.gameKey, store);

		const secPct = _computeSectionPct(sec, s.gameKey, s.genKey, store);

		const card = document.createElement("section");
		const gameInGen = (window.DATA.games?.[s.genKey] || []).find(
			(g) => g.key === s.gameKey
		);
		if (gameInGen?.color) {
			card.style.setProperty("--accent", gameInGen.color);
		}
		card.className = "card";
		card.innerHTML = `
	  <div class="card-hd section-hd">
		<h3>${sec.title}</h3>
		<div class="pct">${secPct.toFixed(2)}%</div>
		<div class="row">
		  <button class="button" id="openDexBtnInline">Open Dex</button>
		</div>
	  </div>
	  <div class="card-bd">
		<div id="injectedDex"></div>
		<div id="taskList"></div>
	  </div>`;
		elContent.appendChild(card);

		const injectedDex = card.querySelector("#injectedDex");
		const headerEl = card.querySelector(".card-hd.section-hd");
		if (headerEl) {
			headerEl.style.setProperty("--progress", secPct.toFixed(2));
		}

		// Inline Dex/Fashion/Curry/Sandwich sections --------------------

		const titleLower = (sec.title || "").trim().toLowerCase();
		const tags = Array.isArray(sec.tags) ? sec.tags : [];

		const isFashion =
			sec.id === "fashion" ||
			tags.includes("fashion") ||
			titleLower.includes("fashion");

		if (isFashion && injectedDex) {
			const cats = window.DATA.fashion?.[s.gameKey]?.categories || [];
			cats.forEach((cat) => {
				injectedDex.appendChild(
					fashionSummaryCardFor(s.gameKey, s.genKey, cat.id, store)
				);
			});
		}

		const isCurry =
			sec.id === "curry" ||
			tags.includes("curry") ||
			titleLower.includes("curry");

		if (isCurry && injectedDex) {
			const curryGrid = renderCurryCardsFor(s.gameKey, s.genKey, store);
			if (curryGrid) injectedDex.appendChild(curryGrid);
		}

		const isSandwich =
			sec.id === "sandwich" ||
			tags.includes("sandwich") ||
			titleLower.includes("sandwich");

		if (isSandwich && injectedDex) {
			const sandwichGrid = renderSandwichCardsFor(s.gameKey, s.genKey, store);
			if (sandwichGrid) injectedDex.appendChild(sandwichGrid);
		}

		const isSticker =
			sec.id === "sticker" ||
			tags.includes("sticker") ||
			titleLower.includes("sticker") ||
			titleLower.includes("ball sticker") ||
			titleLower.includes("ball stickers");

		if (isSticker && injectedDex) {
			const stickerGrid = renderStickerCardsFor(
				s.gameKey,
				s.genKey,
				store
			);
			if (stickerGrid) injectedDex.appendChild(stickerGrid);
		}

		const isMedals =
			sec.id === "medals" ||
			tags.includes("medals") ||
			titleLower.includes("medals") ||
			titleLower.includes("medal");

		if (isMedals && injectedDex) {
			const secs = window.DATA?.medals?.[s.gameKey]?.sections || [];
			for (const sec of secs) {
				injectedDex.appendChild(medalsSectionCardFor(s.gameKey, s.genKey, sec.id, store));
			}
		}

		// Dex and distributions summary cards ---------------------------

		card
			.querySelector("#openDexBtnInline")
			.addEventListener("click", () =>
				dexApiSingleton.api.openDexModal(s.gameKey, s.genKey)
			);

		const isGCEA = titleLower === "gotta catch 'em all";
		if (isGCEA && injectedDex) {
			injectedDex.appendChild(dexSummaryCardFor(s.gameKey, s.genKey, store));
		}

		const isDistributions = titleLower === "distributions";
		if (isDistributions && injectedDex) {
			// Build region list from the distributions data for this game
			const allDists =
				(window.DATA?.distributions?.[s.gameKey] || []).filter(Boolean);

			const regionMap = new Map(); // key -> label

			const addRegionValue = (raw) => {
				if (!raw) return;
				if (Array.isArray(raw)) {
					raw.forEach(addRegionValue);
					return;
				}
				String(raw)
					.split(/[,&/]/) // split "UK, Norway / Denmark" safely
					.map((t) => t.trim())
					.filter(Boolean)
					.forEach((token) => {
						const key = token.toLowerCase();
						if (!regionMap.has(key)) {
							regionMap.set(key, token); // simple label
						}
					});
			};

			allDists.forEach((d) => addRegionValue(d.region || d.regions));

			const distSection = document.createElement("div");
			distSection.className = "dist-section";

			// --- filter row (single select) ---

			const filterRow = document.createElement("div");
			filterRow.className = "dist-filters-row";

			const label = document.createElement("label");
			label.className = "dist-filter-label";
			label.textContent = "Region:";

			const select = document.createElement("select");
			select.className = "dist-filter-select";
			select.id = "distRegionSelect";

			// "All" option
			const optAll = document.createElement("option");
			optAll.value = "all";
			optAll.textContent = "All";
			select.appendChild(optAll);

			// Per-region options (sorted)
			const sortedRegions = Array.from(regionMap.entries()).sort(([ak], [bk]) =>
				ak.localeCompare(bk)
			);
			for (const [key, labelText] of sortedRegions) {
				const opt = document.createElement("option");
				opt.value = key;
				opt.textContent = labelText;
				select.appendChild(opt);
			}

			label.htmlFor = select.id;

			filterRow.appendChild(label);
			filterRow.appendChild(select);

			// --- grid holder ---

			const gridHolder = document.createElement("div");
			gridHolder.className = "dist-grid-holder";

			const renderGrid = (regionKey) => {
				gridHolder.innerHTML = "";
				const grid = renderDistributionCardsFor(s.gameKey, s.genKey, store, {
					region: regionKey || "all",
				});
				gridHolder.appendChild(grid);
			};

			select.addEventListener("change", () => {
				renderGrid(select.value);
			});

			// initial render: All
			select.value = "all";
			renderGrid("all");

			distSection.appendChild(filterRow);
			distSection.appendChild(gridHolder);

			injectedDex.appendChild(distSection);
		}

		// Tasks ----------------------------------------------------------

		const listEl = card.querySelector("#taskList");
		listEl.innerHTML = "";
		const layoutRows = window.DATA.layout?.taskRows?.[sec.id];
		const tasksArr = store.tasksStore.get(sec.id) || [];

		const setTasks = (id, arr) => {
			store.tasksStore.set(id, arr);
			save();
		};

		// Recompute header percent when tasks change (used by tiered sliders, etc.)
		window.PPGC.refreshSectionHeaderPct = function refreshSectionHeaderPct() {
			const localStore = window.PPGC._storeRef;
			if (!localStore) return;

			const st = localStore.state;
			const secArr = ensureSections(st.gameKey);
			const currentSec = secArr.find((x) => x.id === st.sectionId);
			if (!currentSec) return;

			const pct = _computeSectionPct(
				currentSec,
				st.gameKey,
				st.genKey,
				localStore
			);

			const hdr = document.querySelector(".card-hd.section-hd");
			if (hdr) {
				const pctEl = hdr.querySelector(".pct");
				if (pctEl) pctEl.textContent = pct.toFixed(2) + "%";
				hdr.style.setProperty("--progress", pct.toFixed(2));
			}
		};

		if (Array.isArray(layoutRows) && layoutRows.length) {
			listEl.appendChild(
				renderTaskLayout(tasksArr, sec.id, setTasks, layoutRows)
			);
		} else {
			listEl.appendChild(renderTaskList(tasksArr, sec.id, setTasks));
		}

		return;
	}
}
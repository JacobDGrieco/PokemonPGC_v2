import { save } from "../store.js";
import { ensureDataRoot, ensurePpgcRoot } from "../runtime/globals.js";
import { bootstrapTasks } from "../tasks.js";
import { ensureMonInfoLoaded } from "../../data/mon_info/_loader.js";
import {
	normalizeFlag,
	clampStatusForMon,
	getDexScrollContainer,
} from "./helpers.js";
import { openMonInfo } from "./dex-mon-info.js";
import { openResearchModal } from "./dex-research.js";
import {
	installDexVariants,
	baseOf,
	ensureNatDexIndex,
} from "./dex-config.js";
import {
	getDexList as _getDexList,
	getDexFormsNode as _getDexFormsNode,
	setDexFormsNode as _setDexFormsNode,
	setAllFormsForMon as _setAllFormsForMon,
	effectiveSpeciesStatus as _effectiveSpeciesStatus,
} from "./dex-store.js";
import {
	parseDexSearch,
	filterDexEntries,
} from "./dex-search.js";
import {
	applyDexLinksFromDexEntries,
	applyDexLinksFromForm,
} from "./dex-sync.js";
import {
	updateDexHelpDropdown,
	resolveInitialDexKey,
	populateBulkStatusSelect,
	refreshScopeControls,
	resetBulkStatusSelect,
} from "./dex-ui.js";
import { renderDexCards } from "./dex-grid.js";
import { initDexModalRuntime } from "./dex-runtime.js";
import { emitPpgcUiSync } from "../react-bridge/storeBridge.js";

ensurePpgcRoot();
ensureDataRoot();
installDexVariants();
try {
	ensureNatDexIndex();
} catch (e) {
	console.error("[dex] Failed to build natDex index:", e);
}

/**
 * Wire up the main dex modal: search, bulk controls, per-mon cards,
 * forms wheel modal, and research modal.
 */
export function wireDexModal(store, els) {
	let _closing = false;
	const {
		modal,
		modalClose,
		dexGrid,
		dexSearch,
		dexSelectAll,
		dexClearAll,
		modalTitle,
	} = els;
	const bulkStatusSelect = dexClearAll;
	let dexHelpDropdown = null;
	const bulkMenu = modal?.querySelector('#dexBulkActionMenu');
	const bulkToggle = modal?.querySelector('#dexBulkActionToggle');

	function closeBulkMenu() {
		if (!bulkMenu || !bulkToggle) return;
		bulkMenu.hidden = true;
		bulkToggle.setAttribute('aria-expanded', 'false');
	}

	function openBulkMenu() {
		if (!bulkMenu || !bulkToggle) return;
		bulkMenu.hidden = false;
		bulkToggle.setAttribute('aria-expanded', 'true');
	}

	function rebuildBulkMenu() {
		if (!bulkMenu || !bulkStatusSelect) return;
		bulkMenu.innerHTML = '';
		Array.from(bulkStatusSelect.options).forEach((option) => {
			const item = document.createElement('button');
			item.type = 'button';
			item.className = 'dex-bulk-menu-item';
			item.role = 'menuitemradio';
			item.setAttribute('aria-checked', option.value === bulkStatusSelect.value ? 'true' : 'false');
			item.dataset.value = option.value;
			item.textContent = option.textContent || option.value;
			item.addEventListener('click', () => {
				bulkStatusSelect.value = option.value;
				rebuildBulkMenu();
				closeBulkMenu();
			});
			bulkMenu.appendChild(item);
		});
	}

	if (bulkToggle && !bulkToggle.dataset.wired) {
		bulkToggle.dataset.wired = '1';
		bulkToggle.addEventListener('click', (event) => {
			event.stopPropagation();
			const isExpanded = bulkToggle.getAttribute('aria-expanded') === 'true';
			if (isExpanded) closeBulkMenu();
			else openBulkMenu();
		});
	}

	function _queueDexSync(gameKey, dexId, status) {
		window.PPGC._pendingDexSyncs.push({ gameKey, dexId, status });
	}
	window.PPGC = window.PPGC || {};
	if (!Array.isArray(window.PPGC._pendingDexSyncs)) {
		window.PPGC._pendingDexSyncs = [];
	}

	let scopeSelect = null;
	const { openDexForms, scopeMount } = initDexModalRuntime({
		store,
		modal,
		renderDexGrid: () => renderDexGrid(),
		getDexFormsNode: (gameKey, monId) => _getDexFormsNode(store, gameKey, monId),
		setDexFormsNode: (gameKey, monId, node) => _setDexFormsNode(store, gameKey, monId, node),
		applyDexLinksFromForm: (gameKey, monId, formName, status) =>
			applyDexLinksFromForm({ sourceGameKey: gameKey, sourceMonId: monId, sourceFormName: formName, status, store, getNatIndexForGame: (k) => getNatIndexForGame(window.PPGC, k) }),
	});

	// NEW: small helper to batch dex sync work (skip repeated save/render)
	function runInDexBatch(fn) {
		window.PPGC = window.PPGC || {};
		const prev = !!window.PPGC._batchDexSync;
		window.PPGC._batchDexSync = true;
		try {
			fn && fn();
		} finally {
			window.PPGC._batchDexSync = prev;
		}
	}

	function renderDexGrid() {
		const gameKey = store.state.dexModalFor;
		if (!gameKey) return;
		const genKey = (window.DATA.tabs || [])
			.map((t) => t.key)
			.find((gk) =>
				(window.DATA.games[gk] || []).some((g) => g.key === gameKey)
			);
		const game = (window.DATA.games?.[genKey] || []).find(
			(g) => g.key === gameKey
		);

		const dex = _getDexList(gameKey);
		populateBulkStatusSelect({ bulkStatusSelect, gameKey, game });
		rebuildBulkMenu();
		const rawQ = (dexSearch.value || "").trim();
		const options = game ? game.flags : ["shiny", "caught", "seen", "unknown"];
		const statusMap = store.dexStatus.get(gameKey) || {};

		dexHelpDropdown = updateDexHelpDropdown({ dexSearch, dexHelpDropdown, rawQ });

		const parsedSearch = parseDexSearch(rawQ);
		if (parsedSearch.isCommandTyping && !parsedSearch.cmdMode && !parsedSearch.q.includes(" ")) {
			dexHelpDropdown = updateDexHelpDropdown({ dexSearch, dexHelpDropdown, rawQ });
			return;
		}

		const monInfoForGame = (window.DATA.monInfo && window.DATA.monInfo[gameKey]) || null;
		const filtered = filterDexEntries({
			dex,
			parsed: parsedSearch,
			rawQ,
			store,
			gameKey,
			monInfoForGame,
			effectiveSpeciesStatus: _effectiveSpeciesStatus,
		});
		if (parsedSearch.isCommandTyping && !parsedSearch.cmdMode) {
			if (!parsedSearch.q || parsedSearch.q === "/help") {
				// show all
			} else {
				// incomplete commands with spaces keep full list
			}
		}
	
		renderDexCards({
			store,
			dexGrid,
			filtered,
			gameKey,
			genKey,
			game,
			statusMap,
			options,
			getDexFormsNode: (key, monId) => _getDexFormsNode(store, key, monId),
			openMonInfo,
			openDexForms,
			openResearchModal,
			queueDexSync: _queueDexSync,
			applyDexLinksFromDexEntries,
			applyDexLinksFromForm,
			save,
		});
	}

	function renderDexGridIfOpen() {
		const forKey = store?.state?.dexModalFor;
		if (!forKey) return;

		// Only rerender if the modal is actually in the DOM
		const modalEl =
			document.querySelector(".dex-modal") ||
			document.querySelector("#dex-modal") ||
			document.querySelector("[data-modal='dex']");

		if (!modalEl) return;

		renderDexGrid();
	}
	window.PPGC.renderDexGridIfOpen = renderDexGridIfOpen;

	function openDexModal(gameKey, genKey) {
		window.PPGC.disableTaskTooltips();
		// Resolve base "x" / "sun" into first real dex (x-central, sun-melemele, etc.)
		const resolvedKey = resolveInitialDexKey(gameKey);
		store.state.dexModalFor = resolvedKey;
		scopeSelect = refreshScopeControls({
			scopeMount,
			scopeSelect,
			currentGameKey: resolvedKey,
			onChange: (newKey) => {
				if (!newKey) return;
				const newBase = baseOf(newKey);
				const genKey =
					(window.DATA.tabs || [])
						.map((t) => t.key)
						.find((gk) =>
							(window.DATA.games[gk] || []).some((g) => g.key === newBase)
						) || null;
				openDexModal(newKey, genKey);
			},
		});

		const baseKey = baseOf(resolvedKey);
		const gameBase = (window.DATA.games?.[genKey] || []).find(
			(g) => g.key === baseKey
		);

		const tasksStore = window.PPGC?._tasksStoreRef;
		if (tasksStore) {
			// Sections are still keyed by the base game (e.g. "x", "sun"), not x-central.
			const sections = window.DATA?.sections?.[baseKey] || [];
			for (const s of sections) {
				if (!s?.id) continue;
				bootstrapTasks(s.id, tasksStore);
			}
		}

		const curr = store.dexStatus.get(resolvedKey) || {};
		modal.__dexSnapshot = { ...curr };

		// Build title: "X (Central Dex)", "X (National Dex)", etc.
		const baseLabel = gameBase ? gameBase.label : baseKey;
		modalTitle.textContent = baseLabel;
		const scrollEl = getDexScrollContainer();
		if (scrollEl) scrollEl.scrollTop = 0;
		dexGrid.scrollTop = 0;
		dexSearch.value = "";
		closeBulkMenu();
		if (dexHelpDropdown) {
			dexHelpDropdown.style.display = "none";
		}
		// Ensure mon-info is loaded so Dex thumbs can be sourced from it (and animated if enabled).
		try {
			const _baseKey = baseOf(resolvedKey || "");
			ensureMonInfoLoaded?.(_baseKey, store.state.monInfoForm)?.then?.(() => {
				try {
					if (modal && modal.classList.contains("open") && store.state.dexModalFor === resolvedKey) {
						renderDexGrid();
					}
				} catch { }
			});
		} catch { }

		renderDexGrid();
		modal.__returnFocusEl = document.activeElement;
		modal.classList.add("open");
		modal.setAttribute("aria-hidden", "false");
		emitPpgcUiSync({ state: store.state, loading: false });
	}
	function closeModal() {
		if (_closing) return;
		_closing = true;

		// Hide the modal first (keep DOM stable while we work)
		const returnEl = modal.__returnFocusEl;
		try {
			// If the close button is focused, blur it first
			if (document.activeElement && modal.contains(document.activeElement)) {
				document.activeElement.blur?.();
			}

			// Restore focus to the opener (or fall back)
			if (returnEl && typeof returnEl.focus === "function") {
				returnEl.focus({ preventScroll: true });
			} else {
				// fallback focus target (pick something stable in your UI)
				document.querySelector("#app, #content, body")?.focus?.({ preventScroll: true });
			}
		} catch { }

		// Now hide the modal
		modal.classList.remove("open");
		modal.setAttribute("aria-hidden", "true");
		const scrollEl = getDexScrollContainer();
		if (scrollEl) scrollEl.scrollTop = 0;
		dexGrid.scrollTop = 0;
		dexSearch.value = "";
		closeBulkMenu();

		// Hide /help dropdown if it's showing
		if (dexHelpDropdown) {
			dexHelpDropdown.style.display = "none";
		}

		resetBulkStatusSelect(bulkStatusSelect);

		// Kill any tooltips so nothing “sticks” at top-left
		try {
			window.PPGC?.hideTooltips?.();
		} catch { }

		// Mute inner renders while we sync
		window.PPGC = window.PPGC || {};
		window.PPGC._suppressRenders = true;

		// --- NEW: figure out which game we’re editing and what actually changed
		const gameKey = store.state.dexModalFor; // still set right now
		const before = modal.__dexSnapshot || {}; // snapshot taken on open
		const after = store.dexStatus.get(gameKey) || {}; // current status map
		const changed = {};
		const keys = new Set([
			...Object.keys(before),
			...Object.keys(after),
		]);
		for (const k of keys) {
			const b = before[k] || "unknown";
			const a = after[k] || "unknown";
			if (a !== b) changed[k] = a; // only apply diffs
		}

		// Apply Dex -> Task using Dex entries’ taskSync (no rendering here)
		try {
			applyDexLinksFromDexEntries(gameKey, changed);
		} catch (e) {
			console.error("applyDexLinksFromDexEntries error:", e);
		}
		// Then apply Dex -> Task using Dex entries’ taskSync
		try {
			window.PPGC.applyDexSyncsFromDexEntries?.(gameKey, changed);
		} catch (e) {
			console.error("applyDexSyncsFromDexEntries error:", e);
		}

		// Now mark modal closed and persist
		store.state.dexModalFor = null;
		save();
		emitPpgcUiSync({ state: store.state, loading: false });

		// Unmute and render exactly once on next frame
		window.PPGC._suppressRenders = false;
		requestAnimationFrame(() => {
			try {
				window.PPGC?.renderAll?.();
			} catch (e) {
				console.error(e);
			}
			_closing = false;
		});

		window.PPGC.enableTaskTooltips();
	}

	const api = { openDexModal: openDexModal, closeModal, renderDexGrid };
	modal.addEventListener("click", (e) => {
		if (!bulkMenu?.hidden && !e.target.closest('#dexBulkSplit')) {
			closeBulkMenu();
		}
		if (e.target === modal) closeModal();
	});
	modalClose.addEventListener("click", closeModal);
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && !bulkMenu?.hidden) {
			closeBulkMenu();
			return;
		}
		if (e.key === "Escape") closeModal();
	});
	let dexSearchRAF = null;
	dexSearch.addEventListener("input", () => {
		if (dexSearchRAF) cancelAnimationFrame(dexSearchRAF);
		dexSearchRAF = requestAnimationFrame(() => {
			renderDexGrid();
		});
	});
	dexSelectAll.addEventListener("click", () => {
		const gameKey = store.state.dexModalFor;
		if (!gameKey) return;

		// Take the bulk status from the dropdown (default to "caught")
		let chosen = "caught";
		if (bulkStatusSelect && bulkStatusSelect.tagName === "SELECT") {
			const raw = bulkStatusSelect.value;
			if (raw) chosen = normalizeFlag(raw);
		}

		const dex = _getDexList(gameKey);
		const curr = store.dexStatus.get(gameKey) || {};

		// Track which species we’re changing so we can run Dex↔Dex + Dex→Task
		const changed = {};

		// Run all the heavy work in batch mode (no repeated save/render)
		runInDexBatch(() => {
			for (const m of dex) {
				if (m.mythical) continue; // keep your existing rule: skip mythicals

				const applied = clampStatusForMon(m, chosen);
				curr[m.id] = applied;
				_queueDexSync(gameKey, m.id, applied);
				changed[m.id] = applied;

				// Forms: apply the same chosen status to every form
				if (Array.isArray(m.forms) && m.forms.length) {
					const node = _setAllFormsForMon(
						store,
						gameKey,
						m.id,
						m.forms,
						applied
					);

					for (const [fname, val] of Object.entries(node.forms || {})) {
						if (!fname) continue;

						// Dex ↔ Dex form sync (regional <-> national)
						try {
							applyDexLinksFromForm({ sourceGameKey: gameKey, sourceMonId: m.id, sourceFormName: fname, status: val, store, getNatIndexForGame: (k) => getNatIndexForGame(window.PPGC, k) });
						} catch (e) {
							console.error("applyDexLinksFromForm (bulk) error:", e);
						}

						// Dex -> Task form sync (existing behavior)
						try {
							window.PPGC?.applyTaskSyncsFromForm?.(
								gameKey,
								m.id,
								fname,
								val
							);
						} catch {
							// ignore
						}
					}
				}
			}

			// Persist the current dex we just edited (in-memory only, save() happens after batch)
			store.dexStatus.set(gameKey, curr);

			// Immediately mirror these changes to linked dexes + tasks (still in batch mode)
			if (Object.keys(changed).length) {
				try {
					applyDexLinksFromDexEntries(gameKey, changed);
				} catch (e) {
					console.error("applyDexLinksFromDexEntries (bulk) error:", e);
				}

				try {
					window.PPGC?.applyDexSyncsFromDexEntries?.(gameKey, changed);
				} catch (e) {
					console.error("applyDexSyncsFromDexEntries (bulk) error:", e);
				}
			}
		});

		// 🔹 NEW: tell the modal “this is now the baseline”
		if (modal) {
			modal.__dexSnapshot = { ...curr };
		}

		// NOW do a single save + re-render once
		save();
		renderDexGrid();
	});

	return api;
}

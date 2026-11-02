import { save } from "../store.js";
import { ensureDataRoot, ensurePpgcRoot } from "../runtime/globals.js";
import { bootstrapTasks } from "../tasks.js";
import {
	normalizeFlag,
	clampStatusForMon,
	getDexScrollContainer,
	isCompletedForGame,
} from "./helpers.js";
import { openMonInfo } from "./dex-mon-info.js";
import { openResearchModal } from "./dex-research.js";
import { hideModalElement, showModalElement } from "./modal-state.js";
import {
	installDexVariants,
	baseOf,
	ensureNatDexIndex,
	getNatIndexForGame as resolveNatIndexForGame,
} from "./dex-config.js";
import {
	getDexList as _getDexList,
	getDexFormsNode as _getDexFormsNode,
	setDexFormsNode as _setDexFormsNode,
	setAllFormsForMon as _setAllFormsForMon,
	effectiveSpeciesStatus as _effectiveSpeciesStatus,
} from "./dex-store.js";
import { filterDexEntriesByCriteria } from "./dex-search.js";
import {
	applyDexLinksFromDexEntries,
	applyDexLinksFromForm,
} from "./dex-sync.js";
import {
	resolveInitialDexKey,
	populateDexFilterControls,
	populateBulkStatusSelect,
	refreshScopeControls,
	resetBulkStatusSelect,
} from "./dex-ui.js";
import { disposeDexCards, renderDexCards } from "./dex-grid.js";
import { initDexModalRuntime } from "./dex-runtime.js";
import { emitPpgcUiSync } from "../react-bridge/storeBridge.js";
import { resetScrollWithin } from "../utils/scrolling.js";
import {
	isDexToTaskSyncEnabled,
	isTaskToDexSyncEnabled,
	setDexToTaskSyncEnabled,
	setTaskToDexSyncEnabled,
} from "../dex-task-sync-settings.js";
import "../../styles/modal-dex-filter.css";

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
	const { modal, modalClose, dexGrid, dexSearch, dexClearAll, modalTitle } =
		els;
	const bulkStatusSelect = dexClearAll;
	const dexFilterSettings = modal?.querySelector("#dexFilterSettings");
	const dexFilterCount = modal?.querySelector("#dexFilterCount");
	const dexFilterClear = modal?.querySelector("#dexFilterClear");
	const dexFilterControls = {
		status: modal?.querySelector("#dexFilterStatus"),
		form: modal?.querySelector("#dexFilterForm"),
		species: modal?.querySelector("#dexFilterSpecies"),
		type: modal?.querySelector("#dexFilterType"),
		evolution: modal?.querySelector("#dexFilterEvolution"),
		location: modal?.querySelector("#dexFilterLocation"),
		stage: modal?.querySelector("#dexFilterStage"),
	};
	const dexViewToggle = modal?.querySelector("#dexViewToggle");
	const taskDexSyncToggle = modal?.querySelector("#taskDexSyncToggle");
	const dexTaskSyncToggle = modal?.querySelector("#dexTaskSyncToggle");
	const dexTaskSyncReconcile = modal?.querySelector("#dexTaskSyncReconcile");
	const dexStatusMessage = modal?.querySelector("#dexStatusMessage");
	const dexSyncSettings = modal?.querySelector(".dex-sync-settings");
	populateDexFilterControls(dexFilterControls);

	function announceDexStatus(message) {
		if (dexStatusMessage) dexStatusMessage.textContent = "";
		window.requestAnimationFrame(() => {
			if (dexStatusMessage) dexStatusMessage.textContent = message;
			window.PPGC?.announceStatus?.(message);
		});
	}

	function resolveDexViewMode() {
		if (
			store.state.dexViewMode === "cards" ||
			store.state.dexViewMode === "compact"
		)
			return store.state.dexViewMode;
		return window.matchMedia("(max-width: 520px)").matches
			? "compact"
			: "cards";
	}

	function syncDexToolbar(gameKey) {
		const viewMode = resolveDexViewMode();
		modal.dataset.dexViewMode = viewMode;
		if (dexViewToggle) {
			const isCompact = viewMode === "compact";
			dexViewToggle.setAttribute("aria-pressed", String(isCompact));
			dexViewToggle.textContent = isCompact
				? "Card view"
				: "Compact view";
		}

		const isReverseSyncEnabled = isDexToTaskSyncEnabled(
			store.state,
			gameKey,
		);
		if (dexTaskSyncToggle) dexTaskSyncToggle.checked = isReverseSyncEnabled;
		if (taskDexSyncToggle) {
			taskDexSyncToggle.checked = isTaskToDexSyncEnabled(
				store.state,
				gameKey,
			);
		}
		if (dexTaskSyncReconcile)
			dexTaskSyncReconcile.disabled = !isReverseSyncEnabled;
	}

	function getDexFilterValues() {
		return Object.fromEntries(
			Object.entries(dexFilterControls).map(([key, control]) => [
				key,
				control?.value || (key === "location" ? "" : "all"),
			]),
		);
	}

	function resetDexFilters() {
		for (const [key, control] of Object.entries(dexFilterControls)) {
			if (!control) continue;
			control.value = key === "location" ? "" : "all";
		}
		updateDexFilterCount();
	}

	function updateDexFilterCount() {
		if (!dexFilterCount) return;
		const activeCount = Object.entries(getDexFilterValues()).filter(
			([key, value]) =>
				key === "location" ? String(value).trim() : value !== "all",
		).length;
		dexFilterCount.hidden = activeCount === 0;
		dexFilterCount.textContent = activeCount ? String(activeCount) : "";
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
		getDexFormsNode: (gameKey, monId) =>
			_getDexFormsNode(store, gameKey, monId),
		setDexFormsNode: (gameKey, monId, node) =>
			_setDexFormsNode(store, gameKey, monId, node),
		applyDexLinksFromForm: (gameKey, monId, formName, status) =>
			applyDexLinksFromForm({
				sourceGameKey: gameKey,
				sourceMonId: monId,
				sourceFormName: formName,
				status,
				store,
				getNatIndexForGame: resolveNatIndexForGame,
			}),
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
				(window.DATA.games[gk] || []).some((g) => g.key === gameKey),
			);
		const game = (window.DATA.games?.[genKey] || []).find(
			(g) => g.key === gameKey,
		);

		const dex = _getDexList(gameKey);
		populateBulkStatusSelect({ bulkStatusSelect, gameKey, game });
		const rawQ = (dexSearch.value || "").trim();
		const options = game
			? game.flags
			: ["shiny", "caught", "seen", "unknown"];
		const statusMap = store.dexStatus.get(gameKey) || {};

		const monInfoForGame =
			(window.DATA.monInfo && window.DATA.monInfo[gameKey]) || null;
		const filtered = filterDexEntriesByCriteria({
			dex,
			query: rawQ,
			filters: getDexFilterValues(),
			store,
			gameKey,
			game,
			monInfoForGame,
			effectiveSpeciesStatus: _effectiveSpeciesStatus,
			isCompletedForGame,
		});
		updateDexFilterCount();

		renderDexCards({
			store,
			dexGrid,
			filtered,
			gameKey,
			genKey,
			game,
			statusMap,
			options,
			getDexFormsNode: (key, monId) =>
				_getDexFormsNode(store, key, monId),
			openMonInfo,
			openDexForms,
			openResearchModal,
			queueDexSync: _queueDexSync,
			applyDexLinksFromDexEntries,
			applyDexLinksFromForm,
			getNatIndexForGame: resolveNatIndexForGame,
			renderDexGrid,
			save,
		});
	}

	function renderDexGridIfOpen() {
		const forKey = store?.state?.dexModalFor;
		if (!forKey) return;
		if (!modal || !modal.classList.contains("open")) return;

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
							(window.DATA.games[gk] || []).some(
								(g) => g.key === newBase,
							),
						) || null;
				openDexModal(newKey, genKey);
			},
		});

		const baseKey = baseOf(resolvedKey);
		const gameBase = (window.DATA.games?.[genKey] || []).find(
			(g) => g.key === baseKey,
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
		resetDexFilters();
		if (dexFilterSettings) dexFilterSettings.open = false;
		if (dexSyncSettings) dexSyncSettings.open = false;
		syncDexToolbar(resolvedKey);
		renderDexGrid();
		modal.__returnFocusEl = document.activeElement;
		showModalElement(modal);
		resetScrollWithin(modal);
		emitPpgcUiSync({ state: store.state, loading: false });
	}
	function closeModalInternal({ restoreFocus = true, render = true } = {}) {
		if (_closing) return;
		if (!modal || !modal.classList.contains("open")) return;
		_closing = true;

		// Hide the modal first (keep DOM stable while we work)
		const returnEl = modal.__returnFocusEl;
		try {
			// If the close button is focused, blur it first
			if (
				document.activeElement &&
				modal.contains(document.activeElement)
			) {
				document.activeElement.blur?.();
			}

			// Restore focus to the opener (or fall back)
			if (
				restoreFocus &&
				returnEl &&
				typeof returnEl.focus === "function"
			) {
				returnEl.focus({ preventScroll: true });
			} else if (restoreFocus) {
				// fallback focus target (pick something stable in your UI)
				document
					.querySelector("#app, #content, body")
					?.focus?.({ preventScroll: true });
			}
		} catch {}

		// Now hide the modal
		hideModalElement(modal);
		disposeDexCards(dexGrid, { clear: true });
		if (dexSyncSettings) dexSyncSettings.open = false;
		const scrollEl = getDexScrollContainer();
		if (scrollEl) scrollEl.scrollTop = 0;
		dexGrid.scrollTop = 0;
		dexSearch.value = "";
		if (dexFilterSettings) dexFilterSettings.open = false;

		resetBulkStatusSelect(bulkStatusSelect);

		// Kill any tooltips so nothing “sticks” at top-left
		try {
			window.PPGC?.hideTooltips?.();
		} catch {}

		// Mute inner renders while we sync
		window.PPGC = window.PPGC || {};
		window.PPGC._suppressRenders = true;

		// --- NEW: figure out which game we’re editing and what actually changed
		const gameKey = store.state.dexModalFor; // still set right now
		const before = modal.__dexSnapshot || {}; // snapshot taken on open
		const after = store.dexStatus.get(gameKey) || {}; // current status map
		const changed = {};
		const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
		for (const k of keys) {
			const b = before[k] || "unknown";
			const a = after[k] || "unknown";
			if (a !== b) changed[k] = a; // only apply diffs
		}

		// Apply Dex -> Task using Dex entries’ taskSync (no rendering here)
		try {
			applyDexLinksFromDexEntries({
				gameKey,
				changedMap: changed,
				store,
				getNatIndexForGame: resolveNatIndexForGame,
				renderDexGrid,
				batchDexSync: true,
			});
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
			if (render) {
				try {
					window.PPGC?.renderAll?.();
				} catch (e) {
					console.error(e);
				}
			}
			_closing = false;
		});

		window.PPGC.enableTaskTooltips();
	}

	function closeModal() {
		closeModalInternal();
	}

	function closeForNavigation() {
		closeModalInternal({ restoreFocus: false, render: false });
	}

	const api = {
		openDexModal: openDexModal,
		closeModal,
		closeForNavigation,
		renderDexGrid,
	};
	modal.addEventListener("click", (e) => {
		if (e.target === modal) closeModal();
	});
	modalClose.addEventListener("click", closeModal);
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && dexFilterSettings?.open) {
			dexFilterSettings.open = false;
			return;
		}
		if (e.key === "Escape" && dexSyncSettings?.open) {
			dexSyncSettings.open = false;
			return;
		}
		if (e.key === "Escape") closeModal();
	});
	let dexSearchRAF = null;
	const scheduleDexRender = () => {
		if (dexSearchRAF) cancelAnimationFrame(dexSearchRAF);
		dexSearchRAF = requestAnimationFrame(() => {
			renderDexGrid();
		});
	};
	dexSearch.addEventListener("input", scheduleDexRender);
	for (const [key, control] of Object.entries(dexFilterControls)) {
		if (!control) continue;
		const eventName = key === "location" ? "input" : "change";
		control.addEventListener(eventName, () => {
			updateDexFilterCount();
			scheduleDexRender();
		});
	}
	dexFilterSettings?.addEventListener("toggle", () => {
		if (dexFilterSettings.open && dexSyncSettings) {
			dexSyncSettings.open = false;
		}
	});
	dexSyncSettings?.addEventListener("toggle", () => {
		if (dexSyncSettings.open && dexFilterSettings) {
			dexFilterSettings.open = false;
		}
	});
	dexFilterClear?.addEventListener("click", () => {
		resetDexFilters();
		renderDexGrid();
		dexFilterControls.status?.focus();
	});
	dexViewToggle?.addEventListener("click", () => {
		store.state.dexViewMode =
			resolveDexViewMode() === "compact" ? "cards" : "compact";
		save();
		syncDexToolbar(store.state.dexModalFor);
	});
	taskDexSyncToggle?.addEventListener("change", () => {
		const gameKey = store.state.dexModalFor;
		if (!gameKey) return;
		setTaskToDexSyncEnabled(
			store.state,
			gameKey,
			taskDexSyncToggle.checked,
		);
		save();
		syncDexToolbar(gameKey);
		announceDexStatus(
			taskDexSyncToggle.checked
				? "Checklist to Dex sync enabled for this game."
				: "Checklist to Dex sync disabled for this game.",
		);
	});
	dexTaskSyncToggle?.addEventListener("change", () => {
		const gameKey = store.state.dexModalFor;
		if (!gameKey) return;
		setDexToTaskSyncEnabled(
			store.state,
			gameKey,
			dexTaskSyncToggle.checked,
		);
		save();
		syncDexToolbar(gameKey);
		announceDexStatus(
			dexTaskSyncToggle.checked
				? "Dex to checklist sync enabled for this game."
				: "Dex to checklist sync disabled for this game.",
		);
	});
	dexTaskSyncReconcile?.addEventListener("click", () => {
		const gameKey = store.state.dexModalFor;
		if (!gameKey || !isDexToTaskSyncEnabled(store.state, gameKey)) return;
		const confirmed = window.confirm(
			"Complete linked checklist tasks for every currently Caught entry in this game's connected Pokédexes? Existing task progress will not be removed.",
		);
		if (!confirmed) return;

		const baseKey = baseOf(gameKey);
		const variantKeys = window.DATA?.dexVariants?.[baseKey] || [gameKey];
		let caughtCount = 0;
		for (const variantKey of variantKeys) {
			const variantGame = (
				window.DATA.games?.[store.state.genKey] || []
			).find((entry) => entry.key === baseOf(variantKey));
			const statusMap = store.dexStatus.get(variantKey) || {};
			const changedMap = {};
			for (const [entryId, status] of Object.entries(statusMap)) {
				if (!isCompletedForGame(variantGame, status)) continue;
				changedMap[entryId] = status;
				caughtCount += 1;
			}
			window.PPGC?.applyDexSyncsFromDexEntries?.(variantKey, changedMap, {
				forceOptIn: true,
			});
		}
		save();
		window.PPGC?.renderAll?.();
		announceDexStatus(
			`Applied ${caughtCount} Caught Dex entries to linked checklist tasks.`,
		);
	});
	bulkStatusSelect?.addEventListener("change", () => {
		const gameKey = store.state.dexModalFor;
		if (!gameKey) return;

		const rawChosen = bulkStatusSelect.value;
		if (!rawChosen) return;
		const chosen = normalizeFlag(rawChosen);

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
						applied,
					);

					for (const [fname, val] of Object.entries(
						node.forms || {},
					)) {
						if (!fname) continue;

						// Dex ↔ Dex form sync (regional <-> national)
						try {
							applyDexLinksFromForm({
								sourceGameKey: gameKey,
								sourceMonId: m.id,
								sourceFormName: fname,
								status: val,
								store,
								getNatIndexForGame: resolveNatIndexForGame,
							});
						} catch (e) {
							console.error(
								"applyDexLinksFromForm (bulk) error:",
								e,
							);
						}

						// Dex -> Task form sync (existing behavior)
						try {
							window.PPGC?.applyTaskSyncsFromForm?.(
								gameKey,
								m.id,
								fname,
								val,
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
					applyDexLinksFromDexEntries({
						gameKey,
						changedMap: changed,
						store,
						getNatIndexForGame: resolveNatIndexForGame,
						renderDexGrid,
						batchDexSync: true,
					});
				} catch (e) {
					console.error(
						"applyDexLinksFromDexEntries (bulk) error:",
						e,
					);
				}

				try {
					window.PPGC?.applyDexSyncsFromDexEntries?.(
						gameKey,
						changed,
					);
				} catch (e) {
					console.error(
						"applyDexSyncsFromDexEntries (bulk) error:",
						e,
					);
				}
			}
		});

		// 🔹 NEW: tell the modal “this is now the baseline”
		if (modal) {
			modal.__dexSnapshot = { ...curr };
		}

		// NOW do a single save + re-render once
		save();
		bulkStatusSelect.value = "";
		renderDexGrid();
		announceDexStatus(
			`Set all eligible entries to ${chosen.replace(/_/g, " ")}.`,
		);
	});

	return api;
}

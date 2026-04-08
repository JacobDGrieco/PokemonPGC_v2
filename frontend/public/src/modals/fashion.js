import { save } from "../store.js";
import { registerKeywordSectionMeter } from "./helpers.js";
import { setupFashionForms } from "./fashion-forms.js";

/** Get the fashion categories for a game. */
function _getGameFashion(gameKey) {
	return window.DATA.fashion?.[gameKey]?.categories || [];
}
function _getSelectedGenderForGame(store, gameKey) {
	const map = store.state.fashionGenderByGame || {};
	const val = map?.[gameKey];
	// Default to male if missing/invalid
	return val === "female" ? "female" : "male";
}
function _setSelectedGenderForGame(store, gameKey, gender) {
	if (!gameKey) return;
	const g = gender === "female" ? "female" : "male";
	const state = store.state;
	if (!state.fashionGenderByGame) state.fashionGenderByGame = {};
	state.fashionGenderByGame[gameKey] = g;
	save();
}

function _gameHasGenderedFashion(gameKey) {
	const categories = _getGameFashion(gameKey);
	if (!Array.isArray(categories) || !categories.length) return false;

	return categories.some((category) =>
		(category?.items || []).some((item) => {
			const gender = String(item?.gender || "").toLowerCase();
			return gender === "male" || gender === "female";
		})
	);
}

/**
 * Should this fashion item be visible / counted for the current gender?
 * Items can optionally have item.gender: "male" | "female" | "both"
 * If missing, treated as "both".
 */
function _itemVisibleForGender(store, gameKey, item) {
	const selected = _getSelectedGenderForGame(store, gameKey);
	const flag = String(item.gender || "both").toLowerCase();
	if (flag === "male" || flag === "female") {
		return flag === selected;
	}
	// "both" or unknown ⇒ visible regardless
	return true;
}

/**
 * Get (and lazily create) the forms node record for a specific fashion item.
 * Structure:
 *   Map<gameKey, Map<categoryId, { [itemId]: { all, forms } }>>
 */
function _getFormsNode(store, gameKey, categoryId, itemId) {
	const catMap = store.fashionFormsStatus.get(gameKey) || new Map();
	const obj = (catMap.get(categoryId) || {})[itemId] || {
		all: false,
		forms: {},
	};
	return { catMap, obj };
}

/** Persist a fashion item forms node back into the store. */
function _setFormsNode(store, gameKey, categoryId, itemId, node) {
	let catMap = store.fashionFormsStatus.get(gameKey);
	if (!catMap) {
		catMap = new Map();
		store.fashionFormsStatus.set(gameKey, catMap);
	}
	const rec = catMap.get(categoryId) || {};
	rec[itemId] = node;
	catMap.set(categoryId, rec);
}

/**
 * Compute per-item progress:
 * - with forms: (#on / total forms)
 * - without forms: simple boolean from fashionStatus.
 */
function _itemProgressSplit(store, gameKey, categoryId, item) {
	// Skip items that don't match the current gender for this game
	if (!_itemVisibleForGender(store, gameKey, item)) {
		return {
			baseDone: 0, baseTotal: 0,
			extraDone: 0, extraTotal: 0,
			done: 0, total: 0,
		};
	}

	const itemIsExtra = !!item?.extraCredit;
	const hasForms = Array.isArray(item.forms) && item.forms.length > 0;

	// Helper: whether a given form is extra credit
	const formIsExtra = (f) => {
		if (itemIsExtra) return true; // whole item is extra → all forms are extra
		if (typeof f === "string") return false;
		return !!f?.extraCredit;
	};

	if (hasForms) {
		const { obj } = _getFormsNode(store, gameKey, categoryId, item.id);
		let baseTotal = 0, extraTotal = 0;
		let baseDone = 0, extraDone = 0;

		for (const f of item.forms) {
			const name = typeof f === "string" ? f : f?.name;
			if (!name) continue;

			const isExtra = formIsExtra(f);
			if (isExtra) extraTotal++;
			else baseTotal++;

			const checked = !!obj.forms?.[name];
			if (checked) {
				if (isExtra) extraDone++;
				else baseDone++;
			}
		}

		return {
			baseDone, baseTotal,
			extraDone, extraTotal,
			done: baseDone + extraDone,
			total: baseTotal + extraTotal,
		};
	}

	// No forms: just a single boolean
	const catMap = store.fashionStatus.get(gameKey);
	const raw = catMap?.get(categoryId) || {};
	const checked = !!raw[item.id];

	if (itemIsExtra) {
		return {
			baseDone: 0, baseTotal: 0,
			extraDone: checked ? 1 : 0, extraTotal: 1,
			done: checked ? 1 : 0, total: 1,
		};
	}

	return {
		baseDone: checked ? 1 : 0, baseTotal: 1,
		extraDone: 0, extraTotal: 0,
		done: checked ? 1 : 0, total: 1,
	};
}

/** Completion percentage for a single fashion category in a game. */
export function fashionPctFor(gameKey, categoryId, store) {
	const cat = _getGameFashion(gameKey).find((c) => c.id === categoryId);
	if (!cat) return 0;

	let baseDone = 0;
	let baseTotal = 0;

	for (const it of cat.items) {
		const p = _itemProgressSplit(store, gameKey, categoryId, it);
		baseDone += p.baseDone;
		baseTotal += p.baseTotal;
	}

	return baseTotal ? (baseDone / baseTotal) * 100 : 0;
}

function fashionPctForGame(gameKey, store) {
	const cats = _getGameFashion(gameKey);
	if (!Array.isArray(cats) || !cats.length) return 0;

	let baseDone = 0;
	let baseTotal = 0;

	for (const cat of cats) {
		for (const it of cat.items || []) {
			const p = _itemProgressSplit(store, gameKey, cat.id, it);
			baseDone += p.baseDone;
			baseTotal += p.baseTotal;
		}
	}

	return baseTotal ? (baseDone / baseTotal) * 100 : 0;
}

function _meterMath(baseDone, baseTotal, extraDone, extraTotal) {
	const pctBase = baseTotal ? (baseDone / baseTotal) * 100 : 0;
	const pctExtended = baseTotal ? ((baseDone + extraDone) / baseTotal) * 100 : 0;

	// label mirrors dex: show extended only once base is complete
	const labelPct = baseDone === baseTotal ? pctExtended : pctBase;

	// bar mirrors dex: rounded base bar (0–100)
	const pctBar = Math.min(
		100,
		Math.max(0, Math.round((baseDone / Math.max(1, baseTotal)) * 100))
	);

	// overlay mirrors dex: only after base is complete
	const pctExtraOverlay =
		baseTotal > 0 && baseDone === baseTotal && extraTotal > 0
			? (extraDone / extraTotal) * 100
			: 0;

	// count mirrors dex: show base+extra only after base is complete
	const shownDone = baseDone === baseTotal ? (baseDone + extraDone) : baseDone;

	return { labelPct, pctBar, pctExtraOverlay, shownDone };
}


// Register a section meter so "Fashion" sections get a progress ring.
registerKeywordSectionMeter({
	keyword: "fashion",
	pctFn(gameKey, store) {
		return fashionPctForGame(gameKey, store);
	},
	flagProp: "__ppgcFashionMeter",
	exposeName: "fashionPctForGame",
});

/**
 * Summary card for a fashion category.
 * Shows completion and a button to open the fashion modal.
 */
export function fashionSummaryCardFor(gameKey, genKey, categoryId, store) {
	const game = (window.DATA.games?.[genKey] || []).find(
		(g) => g.key === gameKey
	);
	const cat = _getGameFashion(gameKey).find((c) => c.id === categoryId);
	if (!cat) return document.createTextNode("");

	let baseDone = 0, baseTotal = 0, extraDone = 0, extraTotal = 0;

	for (const it of cat.items) {
		const p = _itemProgressSplit(store, gameKey, categoryId, it);
		baseDone += p.baseDone;
		baseTotal += p.baseTotal;
		extraDone += p.extraDone;
		extraTotal += p.extraTotal;
	}

	const { labelPct, pctBar, pctExtraOverlay, shownDone } =
		_meterMath(baseDone, baseTotal, extraDone, extraTotal);

	const card = document.createElement("article");
	card.className = "card";
	card.dataset.fashionSummary = `${gameKey}:${categoryId}`;

	card.innerHTML = `
		<div class="card-hd">
			<h3>${cat.label} — <span class="small">${game?.label || gameKey}</span></h3>
			<div>
				<button class="button" data-open-fashion>Open ${cat.label}</button>
			</div>
		</div>
		<div class="card-bd">
			<div class="small" data-fashion-summary-text>
				${shownDone} / ${baseTotal || 0} (${labelPct.toFixed(2)}%)
			</div>
			<div class="progress ${pctExtraOverlay > 0 ? "has-extra" : ""}">
				<span class="base" data-fashion-summary-bar-base style="width:${pctBar}%"></span>
				<span class="extra" data-fashion-summary-bar-extra style="width:${pctExtraOverlay}%"></span>
				${pctExtraOverlay > 0
			? `<div class="extra-badge" title="Extra credit progress">+${pctExtraOverlay.toFixed(0)}%</div>`
			: ``}
			</div>
		</div>
	`;

	card.querySelector("[data-open-fashion]")?.addEventListener("click", () => {
		window.PPGC?.fashionApi?.openFashionModal(gameKey, genKey, categoryId);
	});

	return card;
}

/**
 * Wire up the Fashion modal and its "forms" usage of the shared forms modal.
 */
export function wireFashionModal(store, els) {
	const {
		fashionModal,
		fashionModalClose,
		fashionSelectAll,
		fashionClearAll,
		fashionGrid,
		fashionModalTitle,
	} = els;

	const formsModal = document.getElementById("formsModal");
	const formsModalClose = document.getElementById("formsModalClose");
	const formsWheel = document.getElementById("formsWheel");
	const fashionSearch = document.getElementById("fashionSearch");
	const fashionGenderToggle = document.getElementById("fashionGenderToggle");

	const { openForms, closeForms } = setupFashionForms(store, {
		formsModal,
		formsModalClose,
		formsWheel,
		getFormsNode: (gameKey, categoryId, itemId) =>
			_getFormsNode(store, gameKey, categoryId, itemId),
		setFormsNode: (gameKey, categoryId, itemId, node) =>
			_setFormsNode(store, gameKey, categoryId, itemId, node),
		updateFashionSummary: updateFashionSummaryCard,
		refreshSectionHeader,
		applyFashionSyncForItem, // NEW
	});

	// --- Helpers to sync summary cards / section header ----------------------
	function updateFashionSummaryCard(gameKey, categoryId) {
		const cats = _getGameFashion(gameKey);
		const cat = cats.find((c) => c.id === categoryId);
		if (!cat) return;

		let baseDone = 0, baseTotal = 0, extraDone = 0, extraTotal = 0;
		for (const it of cat.items || []) {
			const p = _itemProgressSplit(store, gameKey, categoryId, it);
			baseDone += p.baseDone;
			baseTotal += p.baseTotal;
			extraDone += p.extraDone;
			extraTotal += p.extraTotal;
		}

		const { labelPct, pctBar, pctExtraOverlay, shownDone } =
			_meterMath(baseDone, baseTotal, extraDone, extraTotal);

		const key = `${gameKey}:${categoryId}`;

		document
			.querySelectorAll(`[data-fashion-summary="${key}"]`)
			.forEach((card) => {
				const textEl = card.querySelector("[data-fashion-summary-text]");
				if (textEl) {
					textEl.textContent = `${shownDone} / ${baseTotal || 0} (${labelPct.toFixed(2)}%)`;
				}

				const baseEl = card.querySelector("[data-fashion-summary-bar-base]");
				if (baseEl) baseEl.style.width = `${pctBar}%`;

				const extraEl = card.querySelector("[data-fashion-summary-bar-extra]");
				if (extraEl) extraEl.style.width = `${pctExtraOverlay}%`;

				const prog = card.querySelector(".progress");
				if (prog) prog.classList.toggle("has-extra", pctExtraOverlay > 0);

				// Optional: keep badge in sync
				const badge = card.querySelector(".extra-badge");
				if (pctExtraOverlay > 0) {
					if (badge) {
						badge.textContent = `+${pctExtraOverlay.toFixed(0)}%`;
					} else {
						prog?.insertAdjacentHTML(
							"beforeend",
							`<div class="extra-badge" title="Extra credit progress">+${pctExtraOverlay.toFixed(0)}%</div>`
						);
					}
				} else {
					badge?.remove();
				}
			});
	}
	function refreshSectionHeader() {
		if (window.PPGC && typeof window.PPGC.refreshSectionHeaderPct === "function") {
			window.PPGC.refreshSectionHeaderPct();
		}
	}
	/**
 * Sync the Fashion gender pill with current state, similar to syncGen1SpriteToggle.
 * - Only show for X/Y for now.
 * - Unchecked = male, checked = female.
 */
	function syncFashionGenderToggle() {
		if (!fashionGenderToggle) return;
		const input = fashionGenderToggle.querySelector("input");
		const { fashionForGame } = store.state;

		// Only show in games that actually have gender-split fashion
		const showToggle = !!fashionForGame && _gameHasGenderedFashion(fashionForGame);

		fashionGenderToggle.classList.toggle("hidden", !showToggle);
		if (!showToggle || !input) return;

		// Default per game: male
		if (!store.state.fashionGenderByGame) {
			store.state.fashionGenderByGame = {};
		}
		if (!store.state.fashionGenderByGame[fashionForGame]) {
			store.state.fashionGenderByGame[fashionForGame] = "male";
		}

		const gender = _getSelectedGenderForGame(store, fashionForGame);
		// slider checked = female
		input.checked = gender === "female";
	}

	function applyFashionSyncForItem(gameKey, categoryId, item, checked) {
		try {
			// Normalize links off the item
			const links = Array.isArray(item.fashionSync)
				? item.fashionSync
				: typeof item.fashionSync === "string" || typeof item.fashionSync === "number"
					? [item.fashionSync]
					: [];

			if (!links.length) return;

			const cats = _getGameFashion(gameKey);
			if (!cats.length) return;

			const touchedCats = new Set();

			const setSimpleItem = (catId, targetItem) => {
				let gameMap = store.fashionStatus.get(gameKey);
				if (!gameMap) {
					gameMap = new Map();
					store.fashionStatus.set(gameKey, gameMap);
				}
				const rec = gameMap.get(catId) || {};
				rec[targetItem.id] = !!checked;
				gameMap.set(catId, rec);
				touchedCats.add(catId);

				// Update its main checkbox if present in DOM
				const mainChk = document.querySelector(
					`[data-fashion-main="${gameKey}:${catId}:${targetItem.id}"]`
				);
				if (mainChk instanceof HTMLInputElement) {
					mainChk.checked = !!checked;
				}
			};

			const setFormsItem = (catId, targetItem) => {
				const { obj } = _getFormsNode(store, gameKey, catId, targetItem.id);
				const forms = targetItem.forms || [];
				obj.forms = obj.forms || {};
				for (const f of forms) {
					const name = typeof f === "string" ? f : f?.name;
					if (!name) continue;
					obj.forms[name] = !!checked;
				}
				obj.all = !!checked;
				_setFormsNode(store, gameKey, catId, targetItem.id, obj);
				touchedCats.add(catId);

				// Sync main checkbox
				const mainChk = document.querySelector(
					`[data-fashion-main="${gameKey}:${catId}:${targetItem.id}"]`
				);
				if (mainChk instanceof HTMLInputElement) {
					mainChk.checked = !!obj.all;
				}
			};

			// Helper: find target items for a given link
			const visitTarget = (link) => {
				if (!link) return;

				let targetCatId = null;
				let targetId = null;

				if (typeof link === "object") {
					targetCatId = link.categoryId || link.category || link.dexType;
					targetId = link.id;
				} else {
					targetId = link;
				}
				if (!targetId) return;
				const targetIdStr = String(targetId);

				const candidates = [];

				if (targetCatId) {
					const cat = cats.find((c) => c.id === targetCatId);
					if (!cat) return;
					for (const it2 of cat.items || []) {
						if (String(it2.id) === targetIdStr) {
							candidates.push({ catId: cat.id, item: it2 });
						}
					}
				} else {
					// Search all categories in this game
					for (const cat of cats) {
						for (const it2 of cat.items || []) {
							if (String(it2.id) === targetIdStr) {
								candidates.push({ catId: cat.id, item: it2 });
							}
						}
					}
				}

				for (const { catId, item: hit } of candidates) {
					const hasForms = Array.isArray(hit.forms) && hit.forms.length > 0;
					if (hasForms) {
						setFormsItem(catId, hit);
					} else {
						setSimpleItem(catId, hit);
					}
				}
			};

			// Apply sync to all linked items (one level only, no chain reaction)
			for (const link of links) {
				// oneWay targets are set-only: unchecking source does not unset them
				if (!checked && (link?.oneWay === true || link?.sink === true || link?.sinkOnly === true)) continue;
				visitTarget(link);
			}

			// Persist + refresh summaries for touched categories
			save();
			for (const catId of touchedCats) {
				updateFashionSummaryCard(gameKey, catId);
			}
			refreshSectionHeader();
		} catch (e) {
			console.error("applyFashionSyncForItem error:", e);
		}
	}

	// --- Core grid rendering --------------------------------------------------
	function renderGrid() {
		const { fashionForGame, fashionCategory } = store.state;
		if (!fashionForGame || !fashionCategory) return;

		const cat = _getGameFashion(fashionForGame).find(
			(c) => c.id === fashionCategory
		);
		if (!cat) return;

		const rawQ = (fashionSearch?.value || "").trim();
		const q = rawQ.toLowerCase();

		// Start from full list
		let items = (cat.items || []).slice();
		const gender = _getSelectedGenderForGame(store, fashionForGame);
		if (gender) {
			items = items.filter((it) =>
				_itemVisibleForGender(store, fashionForGame, it)
			);
		}

		if (q) {
			if (q.startsWith("/")) {
				// --- Command mode: /true /false -----------------------------
				if (q === "/true") {
					items = items.filter((it) => {
						const p = _itemProgressSplit(store, fashionForGame, fashionCategory, it);
						return p.done > 0; // at least one form / main item true
					});
				} else if (q === "/false") {
					items = items.filter((it) => {
						const p = _itemProgressSplit(store, fashionForGame, fashionCategory, it);
						return p.done === 0; // nothing is true (including all forms)
					});
				}
				// any other /command → ignore and fall back to full list
			} else {
				// --- Plain text search -------------------------------------
				items = items.filter((it) => {
					let haystack = (it.name || "").toLowerCase();

					// Also search in form names if present
					if (Array.isArray(it.forms)) {
						for (const f of it.forms) {
							const fname = typeof f === "string" ? f : f?.name;
							if (fname) {
								haystack += " " + fname.toLowerCase();
							}
						}
					}

					return haystack.includes(q);
				});
			}
		}

		fashionGrid.innerHTML = "";

		items.forEach((it) => {
			const hasForms = Array.isArray(it.forms) && it.forms.length > 0;
			const card = document.createElement("article");
			card.className = "card";
			card.innerHTML = `
        <div class="thumb">
          ${(() => {
					const url = _resolveFashionImg(it.img, fashionForGame);
					return url
						? `<img class="sprite" alt="${it.name}" src="${url}" loading="lazy"/>`
						: `<div style="opacity:.5;">No image</div>`;
				})()}
        </div>
        <div class="card-bd">
          <div class="name" title="${it.name}" data-id="${it.id}">${it.name}</div>
          <div class="row" style="gap:8px;align-items:center;">
            ${hasForms
					? `<button class="forms-launch" title="Choose forms (colors)">
                     <span class="dot"></span><span>Forms</span>
                     <span class="pill count" data-fashion-count="${fashionForGame}:${fashionCategory}:${it.id}"></span>
                   </button>`
					: `<label class="small" style="display:inline-flex;gap:8px;align-items:center;">
                     <input type="checkbox" data-fashion-main="${fashionForGame}:${fashionCategory}:${it.id}"/>
                     <span>Collected</span>
                   </label>`
				}
          </div>
        </div>
      `;

			const key = `${fashionForGame}:${fashionCategory}:${it.id}`;
			const countEl = card.querySelector(`[data-fashion-count="${key}"]`);
			if (countEl) {
				const p = _itemProgressSplit(store, fashionForGame, fashionCategory, it);
				countEl.textContent = `${p.done}/${p.total}`;
			}

			// Parent checkbox behavior (no forms)
			if (!hasForms) {
				const mainChk = card.querySelector(
					`[data-fashion-main="${fashionForGame}:${fashionCategory}:${it.id}"]`
				);
				if (mainChk instanceof HTMLInputElement) {
					// initial checked state based on current progress
					const p0 = _itemProgressSplit(store, fashionForGame, fashionCategory, it);
					mainChk.checked = p0.done > 0;

					mainChk.addEventListener("change", () => {
						const checked = mainChk.checked;
						const catMap =
							store.fashionStatus.get(fashionForGame) || new Map();
						const rec = catMap.get(fashionCategory) || {};
						rec[it.id] = checked;
						catMap.set(fashionCategory, rec);
						store.fashionStatus.set(fashionForGame, catMap);
						save();

						const p = _itemProgressSplit(
							store,
							fashionForGame,
							fashionCategory,
							it
						);
						const countElInner = card.querySelector(
							`[data-fashion-count="${key}"]`
						);
						if (countElInner) {
							countElInner.textContent = `${p.done}/${p.total}`;
						}

						updateFashionSummaryCard(fashionForGame, fashionCategory);
						refreshSectionHeader();
						window.PPGC?.applyTaskSyncsFromFashion?.(fashionForGame, fashionCategory, it.id);
						applyFashionSyncForItem(fashionForGame, fashionCategory, it, checked);
					});
				}
			}

			// Forms launcher
			if (hasForms) {
				card.querySelector(".forms-launch")?.addEventListener("click", (e) => {
					e.stopPropagation();
					openForms(fashionForGame, fashionCategory, it);
				});
			}

			fashionGrid.appendChild(card);
		});
	}

	// --- Fashion modal open/close --------------------------------------------
	function openFashionModal(gameKey, genKey, categoryId) {
		window.PPGC.disableTaskTooltips();

		store.state.fashionForGame = gameKey;
		store.state.fashionCategory = categoryId;

		// Ensure a default gender and sync the pill
		if (!store.state.fashionGenderByGame) {
			store.state.fashionGenderByGame = {};
		}
		if (!store.state.fashionGenderByGame[gameKey]) {
			store.state.fashionGenderByGame[gameKey] = "male";
		}
		syncFashionGenderToggle();

		const game = (window.DATA.games?.[genKey] || []).find(
			(g) => g.key === gameKey
		);
		const cat = _getGameFashion(gameKey).find((c) => c.id === categoryId);

		fashionModal.style.setProperty("--accent", game?.color || "#7fd2ff");
		fashionModalTitle.textContent = `Fashion — ${game ? game.label : gameKey
			} · ${cat?.label || categoryId}`;

		const sheet = fashionModal.querySelector(".sheet");
		const sheetHeader = sheet?.querySelector("header");
		if (sheet && sheetHeader) {
			sheet.style.setProperty("--hdr", `${sheetHeader.offsetHeight}px`);
		}

		fashionModal.querySelector("#fashionGrid")?.classList.add("grid");
		renderGrid();

		fashionModal.removeAttribute("inert");
		fashionModal.setAttribute("aria-hidden", "false");
		fashionModal.classList.add("open");
		document.getElementById("fashionModalClose")?.focus();
	}
	function closeFashionModal() {
		const modal = document.getElementById("fashionModal");
		const active = document.activeElement;
		if (active && modal.contains(active)) {
			try {
				active.blur();
			} catch {
				// ignore
			}
		}
		modal.classList.remove("open");
		modal.setAttribute("aria-hidden", "true");
		modal.setAttribute("inert", "");
		window.PPGC.enableTaskTooltips();
	}

	// --- Bulk select/clear for a category ------------------------------------
	function _bulkSetCategory(checked) {
		const { fashionForGame, fashionCategory } = store.state;
		if (!fashionForGame || !fashionCategory) return;

		const cat = _getGameFashion(fashionForGame).find(
			(c) => c.id === fashionCategory
		);
		if (!cat) return;

		const catMap = store.fashionStatus.get(fashionForGame) || new Map();
		const rec = catMap.get(fashionCategory) || {};

		const isExtraForm = (item, f) => {
			// whole item is extra => all its forms are extra
			if (item?.extraCredit) return true;
			// string form can't carry flags
			if (typeof f === "string") return false;
			return !!f?.extraCredit;
		};

		for (const it of cat.items) {
			if (!_itemVisibleForGender(store, fashionForGame, it)) continue;

			// 🔒 Skip whole-item extra credit (like dex skips mythical species)
			if (it?.extraCredit) continue;

			const hasForms = Array.isArray(it.forms) && it.forms.length > 0;

			if (hasForms) {
				const { obj } = _getFormsNode(store, fashionForGame, fashionCategory, it.id);
				obj.forms = obj.forms || {};

				// Only touch BASE forms; leave extraCredit forms alone
				for (const f of (it.forms || [])) {
					if (isExtraForm(it, f)) continue;

					const name = typeof f === "string" ? f : f?.name;
					if (!name) continue;
					obj.forms[name] = !!checked;
				}

				// Recompute obj.all based on BASE forms only (matches “base completion” rules)
				let baseTotal = 0;
				let baseDone = 0;
				for (const f of (it.forms || [])) {
					if (isExtraForm(it, f)) continue;
					const name = typeof f === "string" ? f : f?.name;
					if (!name) continue;
					baseTotal++;
					if (!!obj.forms[name]) baseDone++;
				}
				obj.all = baseTotal > 0 && baseDone === baseTotal;

				_setFormsNode(store, fashionForGame, fashionCategory, it.id, obj);
			} else {
				// Simple item: safe to set because we already skipped item.extraCredit above
				rec[it.id] = !!checked;
			}

			// Only sync based on BASE toggles (extra credit untouched)
			applyFashionSyncForItem(fashionForGame, fashionCategory, it, checked);
		}

		catMap.set(fashionCategory, rec);
		store.fashionStatus.set(fashionForGame, catMap);
		save();
		renderGrid();
		updateFashionSummaryCard(fashionForGame, fashionCategory);
		refreshSectionHeader();

		for (const it of cat.items) {
			window.PPGC?.applyTaskSyncsFromFashion?.(fashionForGame, fashionCategory, it.id);
		}
	}

	function _resolveFashionImg(imgLike, gameKey) {
		// supports: string URL, ({gameKey}) => string URL, null/undefined
		if (!imgLike) return "";
		if (typeof imgLike === "function") {
			try {
				return imgLike({ gameKey }) || "";
			} catch (e) {
				console.warn("Fashion img resolver failed:", e);
				return "";
			}
		}
		return String(imgLike);
	}

	// --- Event wiring --------------------------------------------------------
	fashionModal.addEventListener("click", (e) => {
		if (e.target === fashionModal) closeFashionModal();
	});
	fashionModalClose.addEventListener("click", closeFashionModal);
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") closeFashionModal();
	});
	if (fashionSearch && !fashionSearch._bound) {
		fashionSearch.addEventListener("input", () => {
			renderGrid();
		});
		fashionSearch._bound = true;
	}
	if (fashionSelectAll && !fashionSelectAll._bound) {
		fashionSelectAll.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			_bulkSetCategory(true);
		});
		fashionSelectAll._bound = true;
	}
	if (fashionClearAll && !fashionClearAll._bound) {
		fashionClearAll.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			_bulkSetCategory(false);
		});
		fashionClearAll._bound = true;
	}
	if (fashionGenderToggle && !fashionGenderToggle._bound) {
		const input = fashionGenderToggle.querySelector("input");
		if (input) {
			input.addEventListener("change", () => {
				const { fashionForGame } = store.state;
				if (!fashionForGame) return;

				// unchecked → male, checked → female
				const gender = input.checked ? "female" : "male";
				_setSelectedGenderForGame(store, fashionForGame, gender);

				// Keep pill visual in sync
				syncFashionGenderToggle();

				// Re-render grid + all fashion summaries + section header
				renderGrid();
				const cats = _getGameFashion(fashionForGame);
				cats.forEach((c) =>
					updateFashionSummaryCard(fashionForGame, c.id)
				);
				refreshSectionHeader();
			});
		}
		fashionGenderToggle._bound = true;
	}

	return { openFashionModal, renderGrid };
}

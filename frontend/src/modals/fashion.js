import { save } from "../store.js";
import { registerKeywordSectionMeter } from "./helpers.js";
import { setupFashionForms } from "./fashion-forms.js";
import { fashionPctFor, fashionSummaryCardFor, createFashionSummaryUpdater, refreshFashionSectionHeader } from "./fashion-summary.js";
import { createApplyFashionSyncForItem, resolveFashionImg } from "./fashion-sync.js";
import {
	getGameFashion as _getGameFashion,
	getSelectedGenderForGame as _getSelectedGenderForGame,
	setSelectedGenderForGame as _setSelectedGenderForGame,
	itemVisibleForGender as _itemVisibleForGender,
	getFormsNode as _getFormsNode,
	setFormsNode as _setFormsNode,
	fashionPctForGame,
} from "./fashion-core.js";

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

	// --- Helpers to sync summary cards / section header ----------------------
	const updateFashionSummaryCard = createFashionSummaryUpdater(store);
	const refreshSectionHeader = refreshFashionSectionHeader;
	const applyFashionSyncForItem = createApplyFashionSyncForItem(store, {
		updateFashionSummaryCard,
		refreshSectionHeader,
	});

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
	/**
 * Sync the Fashion gender pill with current state, similar to syncGen1SpriteToggle.
 * - Only show for X/Y for now.
 * - Unchecked = male, checked = female.
 */
	function syncFashionGenderToggle() {
		if (!fashionGenderToggle) return;
		const input = fashionGenderToggle.querySelector("input");
		const { fashionForGame } = store.state;

		// Only show in games that actually have gender-split fashion (X/Y for now)
		const showToggle = !!fashionForGame && GAMES_WITH_GENDERS.includes(fashionForGame);

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
					const url = resolveFashionImg(it.img, fashionForGame);
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

	function resolveFashionImg(imgLike, gameKey) {
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

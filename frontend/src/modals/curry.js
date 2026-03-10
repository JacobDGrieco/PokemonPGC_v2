import { save } from "../store.js";
import {
	layoutWheel,
	getGameColor,
	computeChipScale,
	prepFormsModal,
	createWheelResizeHandler,
} from "./modal.js";
import {
	getGameCollection,
	registerKeywordSectionMeter,
} from "./helpers.js";

/** Ensure there is a status map for a given game and return it. */
function _getCurryStatusMap(store, gameKey) {
	const map = store.curryStatus.get(gameKey) || {};
	if (!store.curryStatus.has(gameKey)) store.curryStatus.set(gameKey, map);
	return map;
}

/**
 * Get (and lazily create) the forms node record for a specific curry.
 * Structure:
 *   Map<gameKey, {
 *     [curryId]: { all: boolean, forms: { [formName]: boolean } }
 *   }>
 */
function _getCurryFormsNode(store, gameKey, curryId) {
	const gameMap = store.curryFormsStatus.get(gameKey) || {};
	if (!store.curryFormsStatus.has(gameKey)) {
		store.curryFormsStatus.set(gameKey, gameMap);
	}
	const node =
		gameMap[curryId] || {
			all: false,
			forms: {},
		};
	return { gameMap, node };
}

/** Persist a forms node back into the store and save. */
function _setCurryFormsNode(store, gameKey, curryId, node) {
	const gameMap = store.curryFormsStatus.get(gameKey) || {};
	gameMap[curryId] = node;
	store.curryFormsStatus.set(gameKey, gameMap);
	save();
}

/**
 * Compute per-item progress:
 * - with forms: (#checked forms / total forms)
 * - without forms: (0 or 1 / 1) based on the cooked checkbox.
 */
function _itemProgress(store, gameKey, item) {
	const hasForms = Array.isArray(item.forms) && item.forms.length > 0;

	if (hasForms) {
		const curryKey = String(item.id);
		const { node } = _getCurryFormsNode(store, gameKey, curryKey);
		const total = item.forms.length;
		const done = Object.values(node.forms || {}).filter(Boolean).length;
		return { done, total };
	}

	const statusMap = _getCurryStatusMap(store, gameKey);
	const checked = !!statusMap[String(item.id)];
	return { done: checked ? 1 : 0, total: 1 };
}

/**
 * Overall curry completion percentage for a game.
 * Uses all items in window.DATA.curry[gameKey].
 */
export function curryPctFor(gameKey, store) {
	const items = getGameCollection("curry", gameKey);
	if (!items.length) return 0;

	let done = 0;
	let total = 0;
	for (const it of items) {
		const p = _itemProgress(store, gameKey, it);
		done += p.done;
		total += p.total;
	}
	return total ? (done / total) * 100 : 0;
}

/**
 * Register a section meter that attaches to sections tagged/id’d/titled "curry".
 * Exposed globally as window.PPGC.curryPctFor.
 */
(function registerCurrySectionMeter() {
	registerKeywordSectionMeter({
		keyword: "curry",
		flagProp: "__ppgcCurryMeter",
		exposeName: "curryPctFor",
		pctFn: curryPctFor,
	});
})();

/**
 * Update the main section header progress bar + text for curry sections.
 * Relies on .card-hd.section-hd containing a .pct span.
 */
function _updateCurrySectionHeader(gameKey) {
	try {
		const store = window.PPGC?._storeRef;
		if (!store) return;

		const pct = curryPctFor(gameKey, store);
		const header = document.querySelector(".card-hd.section-hd");
		if (!header) return;

		const pctEl = header.querySelector(".pct");
		if (pctEl) pctEl.textContent = `${pct.toFixed(2)}%`;
		header.style.setProperty("--progress", pct.toFixed(2));
	} catch {
		// swallow any DOM issues
	}
}

/**
 * Open the shared forms modal in "curry" mode and show a radial wheel
 * of form chips for a single curry entry.
 */
function openCurryForms(store, gameKey, genKey, item) {
	window.PPGC.disableTaskTooltips();

	const forms = Array.isArray(item.forms) ? item.forms : [];
	if (!forms.length) return;

	const formsModal = document.getElementById("formsModal");
	const formsWheel = document.getElementById("formsWheel");
	if (!formsModal || !formsWheel) return;

	const gameColor = getGameColor(gameKey, genKey);
	const dialog = prepFormsModal(formsModal, formsWheel, {
		accent: gameColor,
		clearWheelGridStyles: true,
	});
	if (!dialog) return;

	// Base wheel sizing + chip scaling
	const layout0 = layoutWheel(dialog, { sizeCap: 1000, shrinkMaxR: true });
	formsWheel.style.setProperty("--size", `${layout0.size}px`);

	const N = forms.length;
	const scale = computeChipScale("curry", N, dialog);
	formsWheel.style.setProperty("--form-img", `${scale.img}px`);
	formsWheel.style.setProperty("--chip-font", `${scale.font}px`);
	formsWheel.style.setProperty("--chip-pad", scale.pad);

	const curryKey = String(item.id);
	const { node } = _getCurryFormsNode(store, gameKey, curryKey);
	const mainKey = curryKey;

	/** Recompute "all" flag and sync counters + parent checkbox. */
	function recomputeAndPersist() {
		const { node } = _getCurryFormsNode(store, gameKey, curryKey);
		const total = forms.length;
		const done = Object.values(node.forms || {}).filter(Boolean).length;
		const all = total > 0 && done === total;

		node.all = all;
		_setCurryFormsNode(store, gameKey, curryKey, node);

		// Update counters on cards
		document
			.querySelectorAll(`[data-curry-count="${mainKey}"]`)
			.forEach((el) => {
				el.textContent = `${done}/${total}`;
			});

		// Sync parent checkbox if present
		document
			.querySelectorAll(`[data-curry-main="${mainKey}"]`)
			.forEach((chk) => {
				if (chk instanceof HTMLInputElement) {
					chk.checked = all;
				}
			});
	}

	// Build chips (buttons) so we can measure widths for layout
	const chips = [];
	for (const f of forms) {
		const name = typeof f === "string" ? f : f?.name;
		if (!name) continue;
		const img = typeof f === "object" ? f.img : null;

		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "form-chip";
		btn.setAttribute("role", "checkbox");
		btn.style = "display: flex; flex-direction: column;";
		btn.title = name;

		const checked = !!(node.forms || {})[name];
		btn.setAttribute("aria-checked", checked ? "true" : "false");

		// Optional image
		if (img) {
			const im = document.createElement("img");
			im.src = img;
			im.alt = name;
			im.loading = "lazy";
			im.style = "width: 100px";
			btn.appendChild(im);
		}

		// Label
		const labelSpan = document.createElement("span");
		labelSpan.className = "chip-text";
		labelSpan.textContent = name;
		labelSpan.dataset.id = f.id;
		btn.appendChild(labelSpan);

		btn.addEventListener("click", () => {
			const nowChecked = btn.getAttribute("aria-checked") !== "true";
			btn.setAttribute("aria-checked", nowChecked ? "true" : "false");

			const { node } = _getCurryFormsNode(store, gameKey, curryKey);
			node.forms = node.forms || {};
			node.forms[name] = nowChecked;
			_setCurryFormsNode(store, gameKey, curryKey, node);

			recomputeAndPersist();
			_updateCurrySectionHeader(gameKey);
		});

		formsWheel.appendChild(btn);
		chips.push(btn);
	}

	// Initial radial layout + resize wiring (shared helper)
	const onResize = createWheelResizeHandler("curry", dialog, formsWheel, chips, {
		sizeCap: 1000,
		shrinkMaxR: true,
		innerRadiusStrategy(minR, outerR) {
			return Math.max(minR * 0.6, outerR * 0.45);
		},
	});

	if (formsModal._curryOnResize) {
		window.removeEventListener("resize", formsModal._curryOnResize);
	}
	formsModal._curryOnResize = onResize;
	window.addEventListener("resize", onResize, { passive: true });

	// Focus close button for a11y
	const closeBtn = document.getElementById("formsModalClose");
	closeBtn?.addEventListener("click", () => {
		window.PPGC.enableTaskTooltips();
	});
	closeBtn?.focus();
}

/**
 * Render the curry grid for a given game into a detached <div.grid>.
 * The caller is responsible for inserting this into the DOM.
 */
export function renderCurryCardsFor(gameKey, genKey, store) {
	const items = getGameCollection("curry", gameKey);
	if (!items.length) return null;

	const grid = document.createElement("div");
	grid.id = "curryGrid";
	grid.className = "grid";

	const accent = getGameColor(gameKey, genKey);

	for (const it of items) {
		if (!it) continue;
		const hasForms = Array.isArray(it.forms) && it.forms.length > 0;
		const key = String(it.id);
		const { done, total } = _itemProgress(store, gameKey, it);

		const card = document.createElement("article");
		card.className = "card card--forms-footer";
		card.style.setProperty("--accent", accent);
		card.dataset.curryId = String(it.id);

		const label = it.label || it.name || `Curry #${it.id}`;
		const img = it.img;

		card.innerHTML = `
      ${img
				? `<div class="thumb">
             <img loading="lazy" alt="${label}" src="${img}" style="width: 100%">
           </div>`
				: ""
			}
      <div class="card-bd">
        <div class="name" title="${label}" data-id="${it.id}">${label}</div>
        <div class="row forms-row" style="gap:8px;align-items:center;justify-content:center;">
          ${hasForms
				? `<button
             class="forms-launch"
             type="button"
             data-open-curry-forms="${key}"
           >
             <span class="dot"></span>
             <span>Forms</span>
             <span class="pill count" data-curry-count="${key}">
               ${done}/${total}
             </span>
           </button>`
				: `<label class="small" style="display:inline-flex;gap:8px;align-items:center;justify-content:center;">
             <input
               type="checkbox"
               data-curry-main="${key}"
               ${done > 0 ? "checked" : ""}
             />
             <span>Cooked</span>
           </label>`
			}
        </div>
      </div>
    `;

		if (!hasForms) {
			const chk = card.querySelector(`[data-curry-main="${key}"]`);
			if (chk instanceof HTMLInputElement) {
				chk.addEventListener("change", () => {
					const statusMap = _getCurryStatusMap(store, gameKey);
					statusMap[String(it.id)] = !!chk.checked;
					store.curryStatus.set(gameKey, statusMap);
					save();

					const { done, total } = _itemProgress(store, gameKey, it);
					const countEl = card.querySelector(`[data-curry-count="${key}"]`);
					if (countEl) countEl.textContent = `${done}/${total}`;

					_updateCurrySectionHeader(gameKey);
				});
			}
		} else {
			const btn = card.querySelector(
				`[data-open-curry-forms="${key}"]`
			);
			if (btn) {
				btn.addEventListener("click", (e) => {
					e.stopPropagation();
					e.preventDefault();
					openCurryForms(store, gameKey, genKey, it);
				});
			}
		}

		grid.appendChild(card);
	}

	return grid;
}

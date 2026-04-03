import { getGameColor } from "./modal.js";
import { getGameCollection, registerKeywordSectionMeter } from "./helpers.js";
import {
	collectibleItemProgress,
	collectiblePctFor,
	ensureStatusMap,
	getCollectibleFormsNode,
	setCollectibleFormsNode,
	updateCollectibleSectionHeader,
} from "./collectibles-core.js";
import { openCollectibleForms } from "./collectibles-forms.js";

const getStatusMap = (store, gameKey) => ensureStatusMap(store, "curryStatus", gameKey);
const getFormsNode = (store, gameKey, itemId) =>
	getCollectibleFormsNode(store, "curryFormsStatus", gameKey, itemId);
const setFormsNode = (store, gameKey, itemId, node) =>
	setCollectibleFormsNode(store, "curryFormsStatus", gameKey, itemId, node);

const itemProgress = (store, gameKey, item) =>
	collectibleItemProgress(store, {
		statusMapName: "curryStatus",
		formsMapName: "curryFormsStatus",
		gameKey,
		item,
	});

export function curryPctFor(gameKey, store) {
	const items = getGameCollection("curry", gameKey);
	return collectiblePctFor(gameKey, store, items, {
		statusMapName: "curryStatus",
		formsMapName: "curryFormsStatus",
	});
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
	updateCollectibleSectionHeader(gameKey, curryPctFor);
}

/**
 * Open the shared forms modal in "curry" mode and show a radial wheel
 * of form chips for a single curry entry.
 */
function openCurryForms(store, gameKey, genKey, item) {
	return openCollectibleForms({
		store,
		gameKey,
		genKey,
		item,
		kind: "curry",
		scaleMode: "curry",
		imgWidth: "100px",
		getFormsNode,
		setFormsNode,
		onHeaderUpdate: _updateCurrySectionHeader,
	});
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
		const { done, total } = itemProgress(store, gameKey, it);

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
					const statusMap = getStatusMap(store, gameKey);
					statusMap[String(it.id)] = !!chk.checked;
					store.curryStatus.set(gameKey, statusMap);
					save();

					const { done, total } = itemProgress(store, gameKey, it);
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

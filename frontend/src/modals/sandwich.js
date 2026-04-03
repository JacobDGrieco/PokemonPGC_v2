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

const getStatusMap = (store, gameKey) => ensureStatusMap(store, "sandwichStatus", gameKey);
const getFormsNode = (store, gameKey, itemId) =>
	getCollectibleFormsNode(store, "sandwichFormsStatus", gameKey, itemId);
const setFormsNode = (store, gameKey, itemId, node) =>
	setCollectibleFormsNode(store, "sandwichFormsStatus", gameKey, itemId, node);

const itemProgress = (store, gameKey, item) =>
	collectibleItemProgress(store, {
		statusMapName: "sandwichStatus",
		formsMapName: "sandwichFormsStatus",
		gameKey,
		item,
	});

export function sandwichPctFor(gameKey, store) {
	const items = getGameCollection("sandwich", gameKey);
	return collectiblePctFor(gameKey, store, items, {
		statusMapName: "sandwichStatus",
		formsMapName: "sandwichFormsStatus",
	});
}

/**
 * Register a section meter that attaches to sections tagged/id’d/titled "sandwich".
 * Exposed globally as window.PPGC.sandwichPctFor.
 */
(function registerSandwichSectionMeter() {
	registerKeywordSectionMeter({
		keyword: "sandwich",
		flagProp: "__ppgcSandwichMeter",
		exposeName: "sandwichPctFor",
		pctFn: sandwichPctFor,
	});
})();

/**
 * Update the main section header progress bar + text for sandwich sections.
 */
function _updateSandwichSectionHeader(gameKey) {
	updateCollectibleSectionHeader(gameKey, sandwichPctFor);
}

/**
 * Open the shared forms modal in "sandwich" mode and show a radial wheel
 * of sandwich-forms for a single item (e.g. different flavors).
 */
function openSandwichForms(store, gameKey, genKey, item) {
	return openCollectibleForms({
		store,
		gameKey,
		genKey,
		item,
		kind: "sandwich",
		scaleMode: "sandwich",
		imgWidth: "100%",
		getFormsNode,
		setFormsNode,
		onHeaderUpdate: _updateSandwichSectionHeader,
	});
}

/**
 * Render the sandwich grid for a given game into a detached <div.grid>.
 */
export function renderSandwichCardsFor(gameKey, genKey, store) {
	const items = getGameCollection("sandwich", gameKey);
	if (!items.length) return null;

	const grid = document.createElement("div");
	grid.id = "sandwichGrid";
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
		card.dataset.sandwichId = String(it.id);

		const label = it.label || it.name || `Sandwich #${it.id}`;
		const img = it.img;

		card.innerHTML = `
      ${img
				? `<div class="thumb">
             <img loading="lazy" alt="${label}" src="${img}" style="width: 100%;">
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
             data-open-sandwich-forms="${key}"
           >
             <span class="dot"></span>
             <span>Forms</span>
             <span class="pill count" data-sandwich-count="${key}">
               ${done}/${total}
             </span>
           </button>`
				: `<label class="small" style="display:inline-flex;gap:8px;align-items:center;justify-content:center;">
             <input
               type="checkbox"
               data-sandwich-main="${key}"
               ${done > 0 ? "checked" : ""}
             />
             <span>Made</span>
           </label>`
			}
        </div>
      </div>
    `;

		if (!hasForms) {
			const chk = card.querySelector(`[data-sandwich-main="${key}"]`);
			if (chk instanceof HTMLInputElement) {
				chk.addEventListener("change", () => {
					const statusMap = getStatusMap(store, gameKey);
					statusMap[String(it.id)] = !!chk.checked;
					store.sandwichStatus.set(gameKey, statusMap);
					save();

					const { done, total } = itemProgress(store, gameKey, it);
					const countEl = card.querySelector(`[data-sandwich-count="${key}"]`);
					if (countEl) countEl.textContent = `${done}/${total}`;

					_updateSandwichSectionHeader(gameKey);
				});
			}
		} else {
			const btn = card.querySelector(
				`[data-open-sandwich-forms="${key}"]`
			);
			if (btn) {
				btn.addEventListener("click", (e) => {
					e.stopPropagation();
					e.preventDefault();
					openSandwichForms(store, gameKey, genKey, it);
				});
			}
		}

		grid.appendChild(card);
	}

	return grid;
}

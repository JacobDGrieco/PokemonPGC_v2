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

const getStatusMap = (store, gameKey) => ensureStatusMap(store, "stickerStatus", gameKey);
const getFormsNode = (store, gameKey, itemId) =>
	getCollectibleFormsNode(store, "stickerFormsStatus", gameKey, itemId);
const setFormsNode = (store, gameKey, itemId, node) =>
	setCollectibleFormsNode(store, "stickerFormsStatus", gameKey, itemId, node);

const itemProgress = (store, gameKey, item) =>
	collectibleItemProgress(store, {
		statusMapName: "stickerStatus",
		formsMapName: "stickerFormsStatus",
		gameKey,
		item,
	});

export function stickerPctFor(gameKey, store) {
	const items = getGameCollection("sticker", gameKey);
	return collectiblePctFor(gameKey, store, items, {
		statusMapName: "stickerStatus",
		formsMapName: "stickerFormsStatus",
	});
}

/**
 * Register a section meter that attaches to sections tagged/id’d/titled "sticker".
 * Exposed globally as window.PPGC.stickerPctFor.
 */
(function registerStickerSectionMeter() {
	registerKeywordSectionMeter({
		keyword: "sticker",
		flagProp: "__ppgcStickerMeter",
		exposeName: "stickerPctFor",
		pctFn: stickerPctFor,
	});
})();

/**
 * Update the main section header progress bar + text for sticker sections.
 */
function _updateStickerSectionHeader(gameKey) {
	updateCollectibleSectionHeader(gameKey, stickerPctFor);
}

/**
 * Open the shared forms modal in "sticker" mode and show a radial wheel
 * of sticker-forms for a single item (e.g. different sticker variants).
 */
function openStickerForms(store, gameKey, genKey, item) {
	return openCollectibleForms({
		store,
		gameKey,
		genKey,
		item,
		kind: "sticker",
		scaleMode: "sandwich",
		imgWidth: "100%",
		getFormsNode,
		setFormsNode,
		onHeaderUpdate: _updateStickerSectionHeader,
	});
}

/**
 * Render the sticker grid for a given game into a detached <div.grid>.
 * Data source: window.DATA.sticker[gameKey]
 */
export function renderStickerCardsFor(gameKey, genKey, store) {
	const items = getGameCollection("sticker", gameKey);
	if (!items.length) return null;

	const grid = document.createElement("div");
	grid.id = "stickerGrid";
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
		card.dataset.stickerId = String(it.id);

		const label = it.label || it.name || `Sticker #${it.id}`;
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
             data-open-sticker-forms="${key}"
           >
             <span class="dot"></span>
             <span>Forms</span>
             <span class="pill count" data-sticker-count="${key}">
               ${done}/${total}
             </span>
           </button>`
				: `<label class="small" style="display:inline-flex;gap:8px;align-items:center;justify-content:center;">
             <input
               type="checkbox"
               data-sticker-main="${key}"
               ${done > 0 ? "checked" : ""}
             />
             <span>Collected</span>
           </label>`
			}
        </div>
      </div>
    `;

		if (!hasForms) {
			const chk = card.querySelector(`[data-sticker-main="${key}"]`);
			if (chk instanceof HTMLInputElement) {
				chk.addEventListener("change", () => {
					const statusMap = getStatusMap(store, gameKey);
					statusMap[String(it.id)] = !!chk.checked;
					store.stickerStatus.set(gameKey, statusMap);
					save();

					const { done, total } = itemProgress(store, gameKey, it);
					const countEl = card.querySelector(`[data-sticker-count="${key}"]`);
					if (countEl) countEl.textContent = `${done}/${total}`;

					_updateStickerSectionHeader(gameKey);
				});
			}
		} else {
			const btn = card.querySelector(
				`[data-open-sticker-forms="${key}"]`
			);
			if (btn) {
				btn.addEventListener("click", (e) => {
					e.stopPropagation();
					e.preventDefault();
					openStickerForms(store, gameKey, genKey, it);
				});
			}
		}

		grid.appendChild(card);
	}

	return grid;
}

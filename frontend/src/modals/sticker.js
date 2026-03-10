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

/** Ensure there is a status map for stickers in a given game and return it. */
function _getStickerStatusMap(store, gameKey) {
	const map = store.stickerStatus.get(gameKey) || {};
	if (!store.stickerStatus.has(gameKey)) store.stickerStatus.set(gameKey, map);
	return map;
}

/**
 * Get (and lazily create) the forms node record for a specific sticker.
 * Structure:
 *   Map<gameKey, {
 *     [stickerId]: { all: boolean, forms: { [formName]: boolean } }
 *   }>
 */
function _getStickerFormsNode(store, gameKey, stickerId) {
	const gameMap = store.stickerFormsStatus.get(gameKey) || {};
	if (!store.stickerFormsStatus.has(gameKey)) {
		store.stickerFormsStatus.set(gameKey, gameMap);
	}
	const node =
		gameMap[stickerId] || {
			all: false,
			forms: {},
		};
	return { gameMap, node };
}

/** Persist a sticker forms node and save. */
function _setStickerFormsNode(store, gameKey, stickerId, node) {
	const gameMap = store.stickerFormsStatus.get(gameKey) || {};
	gameMap[stickerId] = node;
	store.stickerFormsStatus.set(gameKey, gameMap);
	save();
}

/**
 * Compute per-item progress:
 * - with forms: (#checked / total)
 * - without forms: (0|1 / 1) using the main checkbox.
 */
function _itemProgress(store, gameKey, item) {
	const hasForms = Array.isArray(item.forms) && item.forms.length > 0;

	if (hasForms) {
		const { node } = _getStickerFormsNode(store, gameKey, String(item.id));
		const total = item.forms.length;
		const done = Object.values(node.forms || {}).filter(Boolean).length;
		return { done, total };
	}

	const statusMap = _getStickerStatusMap(store, gameKey);
	const checked = !!statusMap[String(item.id)];
	return { done: checked ? 1 : 0, total: 1 };
}

/** Overall sticker completion percentage for a game. */
export function stickerPctFor(gameKey, store) {
	const items = getGameCollection("sticker", gameKey);
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
	try {
		const store = window.PPGC?._storeRef;
		if (!store) return;

		const pct = stickerPctFor(gameKey, store);
		const header = document.querySelector(".card-hd.section-hd");
		if (!header) return;

		const pctEl = header.querySelector(".pct");
		if (pctEl) pctEl.textContent = `${pct.toFixed(2)}%`;
		header.style.setProperty("--progress", pct.toFixed(2));
	} catch {
		// ignore DOM issues
	}
}

/**
 * Open the shared forms modal in "sticker" mode and show a radial wheel
 * of sticker-forms for a single item (e.g. different sticker variants).
 */
function openStickerForms(store, gameKey, genKey, item) {
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

	const layout0 = layoutWheel(dialog, { sizeCap: 1000, shrinkMaxR: true });
	formsWheel.style.setProperty("--size", `${layout0.size}px`);

	const N = forms.length;
	// Treat like sandwich/curry for sizing
	const scale = computeChipScale("sandwich", N, dialog);
	formsWheel.style.setProperty("--form-img", `${scale.img}px`);
	formsWheel.style.setProperty("--chip-font", `${scale.font}px`);
	formsWheel.style.setProperty("--chip-pad", scale.pad);

	const stickerKey = String(item.id);
	const { node } = _getStickerFormsNode(store, gameKey, stickerKey);
	const mainKey = stickerKey;

	/** Recompute "all" flag and sync counters + parent checkbox. */
	function recomputeAndPersist() {
		const { node } = _getStickerFormsNode(store, gameKey, stickerKey);
		const total = forms.length;
		const done = Object.values(node.forms || {}).filter(Boolean).length;
		const all = total > 0 && done === total;

		node.all = all;
		_setStickerFormsNode(store, gameKey, stickerKey, node);

		document
			.querySelectorAll(`[data-sticker-count="${mainKey}"]`)
			.forEach((el) => {
				el.textContent = `${done}/${total}`;
			});

		document
			.querySelectorAll(`[data-sticker-main="${mainKey}"]`)
			.forEach((chk) => {
				if (chk instanceof HTMLInputElement) {
					chk.checked = all;
				}
			});
	}

	// Build chips (buttons) so we can flexibly measure them for layout
	const chips = [];
	for (const f of forms) {
		const name = typeof f === "string" ? f : f?.name;
		if (!name) continue;
		const img = typeof f === "object" ? f.img : null;

		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "form-chip";
		btn.setAttribute("role", "checkbox");
		btn.title = name;
		btn.style = "display: flex; flex-direction: column;";

		const checked = !!(node.forms || {})[name];
		btn.setAttribute("aria-checked", checked ? "true" : "false");

		if (img) {
			const im = document.createElement("img");
			im.src = img;
			im.alt = name;
			im.loading = "lazy";
			im.style = "width: 100%;";
			btn.appendChild(im);
		}

		const labelSpan = document.createElement("span");
		labelSpan.className = "chip-text";
		labelSpan.dataset.id = f.id;
		labelSpan.textContent = name;
		btn.appendChild(labelSpan);

		btn.addEventListener("click", () => {
			const nowChecked = btn.getAttribute("aria-checked") !== "true";
			btn.setAttribute("aria-checked", nowChecked ? "true" : "false");

			const { node } = _getStickerFormsNode(store, gameKey, stickerKey);
			node.forms = node.forms || {};
			node.forms[name] = nowChecked;
			_setStickerFormsNode(store, gameKey, stickerKey, node);

			recomputeAndPersist();
			_updateStickerSectionHeader(gameKey);
		});

		formsWheel.appendChild(btn);
		chips.push(btn);
	}

	// Initial radial layout + resize wiring (shared helper)
	const onResize = createWheelResizeHandler("sandwich", dialog, formsWheel, chips, {
		sizeCap: 1000,
		shrinkMaxR: true,
		innerRadiusStrategy(minR, outerR) {
			return Math.max(minR * 0.6, outerR * 0.45);
		},
	});

	if (formsModal._stickerOnResize) {
		window.removeEventListener("resize", formsModal._stickerOnResize);
	}
	formsModal._stickerOnResize = onResize;
	window.addEventListener("resize", onResize, { passive: true });

	const closeBtn = document.getElementById("formsModalClose");
	closeBtn?.addEventListener("click", () => {
		window.PPGC.enableTaskTooltips();
	});
	closeBtn?.focus();
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
		const { done, total } = _itemProgress(store, gameKey, it);

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
					const statusMap = _getStickerStatusMap(store, gameKey);
					statusMap[String(it.id)] = !!chk.checked;
					store.stickerStatus.set(gameKey, statusMap);
					save();

					const { done, total } = _itemProgress(store, gameKey, it);
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

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

/** Ensure there is a status map for sandwiches in a given game and return it. */
function _getSandwichStatusMap(store, gameKey) {
	const map = store.sandwichStatus.get(gameKey) || {};
	if (!store.sandwichStatus.has(gameKey)) store.sandwichStatus.set(gameKey, map);
	return map;
}

/**
 * Get (and lazily create) the forms node record for a specific sandwich.
 * Structure:
 *   Map<gameKey, {
 *     [sandwichId]: { all: boolean, forms: { [formName]: boolean } }
 *   }>
 */
function _getSandwichFormsNode(store, gameKey, sandwichId) {
	const gameMap = store.sandwichFormsStatus.get(gameKey) || {};
	if (!store.sandwichFormsStatus.has(gameKey)) {
		store.sandwichFormsStatus.set(gameKey, gameMap);
	}
	const node =
		gameMap[sandwichId] || {
			all: false,
			forms: {},
		};
	return { gameMap, node };
}

/** Persist a sandwich forms node and save. */
function _setSandwichFormsNode(store, gameKey, sandwichId, node) {
	const gameMap = store.sandwichFormsStatus.get(gameKey) || {};
	gameMap[sandwichId] = node;
	store.sandwichFormsStatus.set(gameKey, gameMap);
	save();
}

/**
 * Compute per-item progress:
 * - with forms: (#checked / total)
 * - without forms: (0|1 / 1) using the "Made" checkbox.
 */
function _itemProgress(store, gameKey, item) {
	const hasForms = Array.isArray(item.forms) && item.forms.length > 0;

	if (hasForms) {
		const { node } = _getSandwichFormsNode(store, gameKey, String(item.id));
		const total = item.forms.length;
		const done = Object.values(node.forms || {}).filter(Boolean).length;
		return { done, total };
	}

	const statusMap = _getSandwichStatusMap(store, gameKey);
	const checked = !!statusMap[String(item.id)];
	return { done: checked ? 1 : 0, total: 1 };
}

/** Overall sandwich completion percentage for a game. */
export function sandwichPctFor(gameKey, store) {
	const items = getGameCollection("sandwich", gameKey);
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
	try {
		const store = window.PPGC?._storeRef;
		if (!store) return;

		const pct = sandwichPctFor(gameKey, store);
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
 * Open the shared forms modal in "sandwich" mode and show a radial wheel
 * of sandwich-forms for a single item (e.g. different flavors).
 */
function openSandwichForms(store, gameKey, genKey, item) {
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
	const scale = computeChipScale("sandwich", N, dialog);
	formsWheel.style.setProperty("--form-img", `${scale.img}px`);
	formsWheel.style.setProperty("--chip-font", `${scale.font}px`);
	formsWheel.style.setProperty("--chip-pad", scale.pad);

	const sandwichKey = String(item.id);
	const { node } = _getSandwichFormsNode(store, gameKey, sandwichKey);
	const mainKey = sandwichKey;

	/** Recompute "all" flag and sync counters + parent checkbox. */
	function recomputeAndPersist() {
		const { node } = _getSandwichFormsNode(store, gameKey, sandwichKey);
		const total = forms.length;
		const done = Object.values(node.forms || {}).filter(Boolean).length;
		const all = total > 0 && done === total;

		node.all = all;
		_setSandwichFormsNode(store, gameKey, sandwichKey, node);

		document
			.querySelectorAll(`[data-sandwich-count="${mainKey}"]`)
			.forEach((el) => {
				el.textContent = `${done}/${total}`;
			});

		document
			.querySelectorAll(`[data-sandwich-main="${mainKey}"]`)
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

			const { node } = _getSandwichFormsNode(store, gameKey, sandwichKey);
			node.forms = node.forms || {};
			node.forms[name] = nowChecked;
			_setSandwichFormsNode(store, gameKey, sandwichKey, node);

			recomputeAndPersist();
			_updateSandwichSectionHeader(gameKey);
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

	if (formsModal._sandwichOnResize) {
		window.removeEventListener("resize", formsModal._sandwichOnResize);
	}
	formsModal._sandwichOnResize = onResize;
	window.addEventListener("resize", onResize, { passive: true });

	const closeBtn = document.getElementById("formsModalClose");
	closeBtn?.addEventListener("click", () => {
		window.PPGC.enableTaskTooltips();
	});
	closeBtn?.focus();
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
		const { done, total } = _itemProgress(store, gameKey, it);

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
					const statusMap = _getSandwichStatusMap(store, gameKey);
					statusMap[String(it.id)] = !!chk.checked;
					store.sandwichStatus.set(gameKey, statusMap);
					save();

					const { done, total } = _itemProgress(store, gameKey, it);
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

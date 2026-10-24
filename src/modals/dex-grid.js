import {
	normalizeFlag,
	pickHighestStatus,
	clampStatusForMon,
	isOptionAllowedForMon,
	getFilterClassForStatus,
	renderBadges,
} from "./helpers.js";
import { getImageForStatus } from "./dex-search.js";
import { assetPath } from "../utils/assetPath.js";
import { _dexIdNumber } from "../../data/helpers/dex-ids.js";
import { PATH_OF_SOLITUDE_KEY } from "./dex-progress.js";
import { emitPpgcUiSync } from "../react-bridge/storeBridge.js";

const PATH_OF_SOLITUDE_ICON = assetPath(
	"tasks/gen8/legendsarceus/path-of-solitude.png",
);

function renderThumbBadges({ status, gameKey, pathOfSolitudeEnabled = false }) {
	const statusBadges = renderBadges(status, gameKey);
	const solitudeBadge =
		gameKey === "legendsarceus"
			? `<div class="badges badges-left">
        <button
          class="thumb-badge-button path-of-solitude-toggle ${pathOfSolitudeEnabled ? "is-active" : ""}"
          type="button"
          data-role="path-of-solitude-toggle"
          aria-pressed="${pathOfSolitudeEnabled ? "true" : "false"}"
          title="Path of Solitude completion"
        >
          <img src="${PATH_OF_SOLITUDE_ICON}" alt="Path of Solitude completion"/>
        </button>
      </div>`
			: "";

	const rightBadges = statusBadges
		? statusBadges.replace(
				'<div class="badges">',
				'<div class="badges badges-right">',
			)
		: "";

	return `${solitudeBadge}${rightBadges}`;
}

function buildSpriteMarkup({ src, name }) {
	if (!src) return `<div style="opacity:.5;">No image</div>`;
	if (String(src).toLowerCase().endsWith(".webm")) {
		return `<video
      class="sprite dex-webm"
      src="${src}"
      autoplay
      loop
      muted
      playsinline
      preload="metadata"
      disablepictureinpicture
      style="width:100%;height:100%;max-width:132px;max-height:132px;object-fit:contain;"
    ></video>`;
	}
	return `<img
    class="sprite"
    alt="${name}"
    src="${src}"
    loading="lazy"
    decoding="async"
    style="width:100%;height:100%;max-width:132px;max-height:132px;object-fit:contain;"
    onerror="if(this.src!==window.__PPGC_NO_IMG__){this.src=window.__PPGC_NO_IMG__||'/no-image.svg';}"
  />`;
}

export function updateDexThumb({
	thumb,
	mon,
	status,
	gameKey,
	pathOfSolitudeEnabled = false,
}) {
	const newSrc = getImageForStatus(
		mon,
		status,
		gameKey,
		window.PPGC?.gen1SpriteColor,
	);
	const newCls = getFilterClassForStatus(status);

	thumb.classList.remove("status-unknown", "status-seen", "status-normal");
	thumb.classList.add(newCls);

	const oldSprite = thumb.querySelector(".sprite");
	const newIsWebm =
		typeof newSrc === "string" && newSrc.toLowerCase().endsWith(".webm");
	let newSprite;

	if (newIsWebm) {
		newSprite = document.createElement("video");
		newSprite.src = newSrc;
		newSprite.autoplay = true;
		newSprite.loop = true;
		newSprite.muted = true;
		newSprite.playsInline = true;
		newSprite.preload = "metadata";
		newSprite.setAttribute("disablepictureinpicture", "");
	} else {
		newSprite = document.createElement("img");
		newSprite.src = newSrc;
		newSprite.alt = mon.name;
		newSprite.loading = "lazy";
		newSprite.decoding = "async";
	}

	newSprite.className = "sprite" + (newIsWebm ? " dex-webm" : "");
	newSprite.style.width = "100%";
	newSprite.style.height = "100%";
	newSprite.style.maxWidth = "132px";
	newSprite.style.maxHeight = "132px";
	newSprite.style.objectFit = "contain";

	if (oldSprite) oldSprite.replaceWith(newSprite);
	else thumb.appendChild(newSprite);

	thumb.querySelectorAll(".badges").forEach((node) => node.remove());
	const newBadgesHTML = renderThumbBadges({
		status,
		gameKey,
		pathOfSolitudeEnabled,
	});
	if (newBadgesHTML) thumb.insertAdjacentHTML("beforeend", newBadgesHTML);
}

export function renderDexCards({
	store,
	dexGrid,
	filtered,
	gameKey,
	genKey,
	game,
	statusMap,
	options,
	getDexFormsNode,
	openMonInfo,
	openDexForms,
	openResearchModal,
	queueDexSync,
	applyDexLinksFromDexEntries,
	applyDexLinksFromForm,
	renderDexGrid,
	save,
}) {
	void openMonInfo;
	void applyDexLinksFromForm;

	dexGrid.innerHTML = "";
	const renderToken = Number(dexGrid.__renderToken || 0) + 1;
	dexGrid.__renderToken = renderToken;
	const researchState =
		store.dexResearchStatus instanceof Map
			? store.dexResearchStatus.get(gameKey) || {}
			: {};
	const items = Array.isArray(filtered) ? filtered.slice() : [];
	const defer =
		typeof window.requestIdleCallback === "function"
			? (cb) => window.requestIdleCallback(cb, { timeout: 250 })
			: (cb) => setTimeout(cb, 0);

	const fillResearchCount = (it, countEl) => {
		if (!countEl) return;
		const tasks = Array.isArray(it.research) ? it.research : [];
		const recAll =
			store.dexResearchStatus instanceof Map
				? store.dexResearchStatus.get(gameKey) || {}
				: {};
		const rec = recAll[it.id] || {};
		let totalTiers = 0;
		let doneTiers = 0;
		let levelPoints = 0;

		for (let idx = 0; idx < tasks.length; idx += 1) {
			const task = tasks[idx];
			const steps = Array.isArray(task?.tiers) ? task.tiers.length : 0;
			totalTiers += steps;
			const raw = rec[idx];
			const level = typeof raw === "number" ? raw : raw ? steps : 0;
			const clamped = Math.max(0, Math.min(steps, level));
			doneTiers += clamped;
			levelPoints += clamped * (task?.boost ? 2 : 1);
		}

		countEl.textContent = `${doneTiers}/${totalTiers}`;
		countEl.title = `Tiers completed: ${doneTiers}/${totalTiers} • Level: ${Math.min(10, levelPoints)}/10`;
	};

	const buildCard = (it) => {
		let current = statusMap[it.id] || "unknown";
		const hasForms = Array.isArray(it.forms) && it.forms.length > 0;
		const hasResearch =
			Array.isArray(it.research) && it.research.length > 0;
		const pathOfSolitudeEnabled =
			gameKey === "legendsarceus" &&
			!!researchState?.[it.id]?.[PATH_OF_SOLITUDE_KEY];

		if (hasForms) {
			const { node } = getDexFormsNode(gameKey, it.id);
			const formVals = (it.forms || []).map((f) => {
				const name = typeof f === "string" ? f : f?.name;
				return node.forms?.[name] || "unknown";
			});
			current = pickHighestStatus(formVals);
		}

		current = clampStatusForMon(it, current);
		const src = getImageForStatus(
			it,
			current,
			gameKey,
			window.PPGC?.gen1SpriteColor,
		);
		const cls = getFilterClassForStatus(current);
		const card = document.createElement("article");
		card.className = "card";
		card.setAttribute("role", "listitem");
		card.dataset.status = current;
		card.style.setProperty("--accent", game?.color || "#6aa6ff");

		const keyForCount = `${gameKey}:${it.id}`;
		card.dataset.dexCardKey = keyForCount;
		const formsCountHTML = hasForms
			? `<span class="pill count" data-dex-forms-count="${keyForCount}"></span>`
			: "";
		const researchCountHTML = hasResearch
			? `<span class="pill count" data-dex-research-count="${keyForCount}">...</span>`
			: "";

		card.innerHTML = `
      <div class="thumb ${cls}">
        <div class="name" title="${it.id}">#${String(_dexIdNumber(it.id, it.localId) ?? "").padStart(3, "0")}
          ${renderThumbBadges({ status: current, gameKey, pathOfSolitudeEnabled })}
        </div>
        ${buildSpriteMarkup({ src, name: it.name })}
      </div>
      <div class="card-bd">
        <div class="name" title="${it.name}" data-id="${it.id}">${it.name}</div>
        <div class="row">
          ${
				hasForms
					? `<button class="forms-launch" title="Choose forms"><span class="dot"></span><span>Forms</span>${formsCountHTML}</button>`
					: `<select class="flag-select" aria-label="Status for ${it.name}">
                ${options
					.map((opt) => {
						const val = normalizeFlag(opt);
						if (!isOptionAllowedForMon(it, val)) return "";
						const label = val
							.replace(/_/g, " ")
							.replace(/\b\w/g, (s) => s.toUpperCase());
						const currentVal = clampStatusForMon(
							it,
							statusMap[it.id] || "unknown",
						);
						return `<option value="${val}" ${val === currentVal ? "selected" : ""}>${label}</option>`;
					})
					.join("")}
              </select>`
			}
          ${
				hasResearch
					? `<button class="research-launch" title="Research tasks" data-game="${gameKey}" data-id="${it.id}"><span class="dot"></span><span>Research</span>${researchCountHTML}</button>`
					: ""
			}
        </div>
      </div>`;

		const bindPathOfSolitudeToggle = () => {
			if (gameKey !== "legendsarceus") return;
			const solitudeBtn = card.querySelector(
				'[data-role="path-of-solitude-toggle"]',
			);
			solitudeBtn?.addEventListener("click", (e) => {
				e.stopPropagation();

				const recAll =
					store.dexResearchStatus instanceof Map
						? store.dexResearchStatus.get(gameKey) || {}
						: {};
				const nextAll = { ...recAll };
				const prevRec = recAll[it.id] || {};
				const nextEnabled = !prevRec[PATH_OF_SOLITUDE_KEY];
				nextAll[it.id] = {
					...prevRec,
					[PATH_OF_SOLITUDE_KEY]: nextEnabled,
				};
				store.dexResearchStatus.set(gameKey, nextAll);
				save();

				updateDexThumb({
					thumb: card.querySelector(".thumb"),
					mon: it,
					status: card.dataset.status || current,
					gameKey,
					pathOfSolitudeEnabled: nextEnabled,
				});
				bindPathOfSolitudeToggle();

				try {
					window.dispatchEvent(
						new CustomEvent("ppgc:researchSaved", {
							detail: { gameKey, monId: it.id },
						}),
					);
					emitPpgcUiSync({ state: store.state, loading: false });
				} catch (err) {
					console.warn("[PPGC] solitude refresh failed", err);
				}
			});
		};

		bindPathOfSolitudeToggle();

		if (hasForms) {
			card.querySelector(".forms-launch")?.addEventListener(
				"click",
				(e) => {
					e.stopPropagation();
					openDexForms(gameKey, genKey, it);
				},
			);

			const countEl = card.querySelector(
				`[data-dex-forms-count="${keyForCount}"]`,
			);
			if (countEl) {
				const total = (it.forms || []).length;
				const { node } = getDexFormsNode(gameKey, it.id);
				const filled = (it.forms || []).reduce((acc, f) => {
					const name = typeof f === "string" ? f : f?.name;
					return (
						acc +
						((node.forms?.[name] || "unknown") !== "unknown"
							? 1
							: 0)
					);
				}, 0);
				countEl.textContent = `${filled}/${total}`;
			}
		}

		if (hasResearch) {
			card.querySelector(".research-launch")?.addEventListener(
				"click",
				(e) => {
					e.stopPropagation();
					openResearchModal(gameKey, genKey, it, store);
				},
			);

			const researchCountEl = card.querySelector(
				`[data-dex-research-count="${keyForCount}"]`,
			);
			if (researchCountEl) {
				defer(() => {
					if (
						dexGrid.__renderToken !== renderToken ||
						!researchCountEl.isConnected
					)
						return;
					fillResearchCount(it, researchCountEl);
				});
			}
		}

		const select = card.querySelector("select.flag-select");
		if (select) {
			select.addEventListener("change", () => {
				let newVal = normalizeFlag(select.value);
				newVal = clampStatusForMon(it, newVal);
				select.value = newVal;

				const curr = store.dexStatus.get(gameKey) || {};
				curr[it.id] = newVal;
				store.dexStatus.set(gameKey, curr);
				save();
				queueDexSync(gameKey, it.id, newVal);

				const changed = { [it.id]: newVal };
				try {
					applyDexLinksFromDexEntries({
						gameKey,
						changedMap: changed,
						store,
						getNatIndexForGame: (k) =>
							window.PPGC?.getNatIndexForGame?.(k),
						renderDexGrid,
					});
				} catch (e) {
					console.error(
						"applyDexLinksFromDexEntries (single) error:",
						e,
					);
				}
				try {
					window.PPGC.applyDexSyncsFromDexEntries?.(gameKey, changed);
				} catch (e) {
					console.error(
						"applyDexSyncsFromDexEntries (single) error:",
						e,
					);
				}

				card.dataset.status = newVal;
				updateDexThumb({
					thumb: card.querySelector(".thumb"),
					mon: it,
					status: newVal,
					gameKey,
					pathOfSolitudeEnabled:
						!!store.dexResearchStatus.get(gameKey)?.[it.id]?.[
							PATH_OF_SOLITUDE_KEY
						],
				});
				bindPathOfSolitudeToggle();
			});
		}

		return card;
	};

	const BATCH_SIZE = 12;
	const flushBatch = () => {
		if (dexGrid.__renderToken !== renderToken) return;
		const fragment = document.createDocumentFragment();
		for (let i = 0; i < BATCH_SIZE && items.length; i += 1) {
			fragment.appendChild(buildCard(items.shift()));
		}
		dexGrid.appendChild(fragment);
		if (items.length) {
			requestAnimationFrame(flushBatch);
		}
	};

	flushBatch();
}

// dex-forms-modal.js
//
// Handles opening/closing the Forms modal and laying out form chips.
// All the data helpers (get/set forms node, clamping, sync, etc.) are
// passed in as dependencies from dex.js so we avoid circular imports.

import { emitPpgcUiSync } from "../react-bridge/storeBridge.js";
import { baseOf } from "./dex-config.js";
import { updateDexThumb } from "./dex-grid.js";
import { getDexScrollContainer } from "./helpers.js";
import { clampStatusForMon, pickHighestStatus } from "./helpers.js";
import { refreshDexSummaryMetrics } from "./dex-summary.js";

export function setupDexFormsModal(store, deps) {
	const {
		formsModal,
		formsModalClose,
		formsWheel,
		getGameColor,
		computeChipScale,
		prepFormsModal,
		createWheelResizeHandler,
		normalizeFlag,
		clampStatusForForm,
		isOptionAllowedForForm,
		getFilterClassForStatus,
		renderBadges,
		shouldUseColorSprite,
		getDexFormsNode,     // (gameKey, monId) => { node, map }
		setDexFormsNode,     // (gameKey, monId, node) => void
		applyDexLinksFromForm, // (gameKey, monId, formName, status) => void
		renderDexGrid,       // function from dex.js
	} = deps;

	if (!formsModal || !formsWheel) {
		// Graceful no-op if DOM isn’t there
		return {
			openDexForms: () => { },
			closeDexForms: () => { },
		};
	}

	let formsNonce = 0;

	// Ensure the modal is at body level (same behavior as before)
	if (formsModal && formsModal.parentElement !== document.body) {
		document.body.appendChild(formsModal);
	}

	const valWithGame = (v, gameKey) =>
		typeof v === "function" ? v({ gameKey }) : v;

	function refreshActiveDexCard(gameKey, mon) {
		if (!mon) { console.warn('[DEX-FORMS] refreshActiveDexCard: mon is null, skipping'); return; }
		const cardKey = `${gameKey}:${mon.id}`;
		const card = document.querySelector(`[data-dex-card-key="${cardKey}"]`);
		console.log(`[DEX-FORMS] refreshActiveDexCard: looking for card key="${cardKey}", found=`, !!card);
		if (!card) {
			// Show all card keys in DOM to diagnose mismatch
			const allCardKeys = [...document.querySelectorAll('[data-dex-card-key]')].map(el => el.dataset.dexCardKey);
			console.warn('[DEX-FORMS] refreshActiveDexCard: card NOT found. All card keys in DOM:', allCardKeys.slice(0, 10));
			return;
		}

		const { node } = getDexFormsNode(gameKey, mon.id);
		const formVals = (mon.forms || []).map((f) => {
			const formName = typeof f === "string" ? f : f?.name;
			return node.forms?.[formName] || "unknown";
		});
		const highestStatus = clampStatusForMon(mon, pickHighestStatus(formVals));
		console.log(`[DEX-FORMS] refreshActiveDexCard: formVals=`, formVals, `→ highestStatus="${highestStatus}"`);
		card.dataset.status = highestStatus;

		const thumb = card.querySelector(".thumb");
		if (thumb) {
			updateDexThumb({
				thumb,
				mon,
				status: highestStatus,
				gameKey,
				pathOfSolitudeEnabled: !!(store.dexResearchStatus.get(gameKey)?.[mon.id]?.__pathOfSolitude),
			});
		}

		const countEl = card.querySelector(`[data-dex-forms-count="${cardKey}"]`);
		if (countEl) {
			const total = (mon.forms || []).length;
			const filled = (mon.forms || []).reduce((acc, f) => {
				const formName = typeof f === "string" ? f : f?.name;
				return acc + ((node.forms?.[formName] || "unknown") !== "unknown" ? 1 : 0);
			}, 0);
			countEl.textContent = `${filled}/${total}`;
		}
	}

	function openDexForms(gameKey, genKey, mon) {
		if (!formsModal || !formsWheel) return;

		formsNonce += 1;
		const nonce = formsNonce;
		formsModal.__returnFocusEl = document.activeElement;
		formsModal.__dexScrollTop = getDexScrollContainer()?.scrollTop ?? 0;
		formsModal.dataset.formsNonce = String(nonce);
		formsModal.dataset.gameKey = gameKey;
		formsModal.dataset.genKey = genKey;
		formsModal.dataset.monId = String(mon.id);

		const accent = getGameColor(gameKey, genKey);
		// clearWheelGridStyles = true so we reset any previous grid overrides
		const dialog = prepFormsModal(formsModal, formsWheel, {
			accent,
			clearWheelGridStyles: true,
		});
		if (!dialog) return;

		const forms = mon.forms || [];
		const N = forms.length;
		const isMobileViewport = window.matchMedia?.('(max-width: 900px)')?.matches;
		const useRadial = !isMobileViewport && N <= 7; // phones use grid to avoid radial overflow

		// Body scroll behavior (same as before)
		const body = dialog.querySelector(".modal-bd");
		if (body) {
			if (N > 12) {
				body.classList.add("forms-wheel-scroll");
			} else {
				body.classList.remove("forms-wheel-scroll");
			}
		}

		const games = window.DATA.games?.[genKey] || [];
		const game = games.find((g) => g.key === gameKey);
		const options = game
			? game.flags || ["shiny", "caught", "seen", "unknown"]
			: ["shiny", "caught", "seen", "unknown"];

		// Base scaling for chips (works for both radial + grid)
		const _scale = computeChipScale("dex", N, dialog);
		formsWheel.style.setProperty("--form-img", `${_scale.img}px`);
		formsWheel.style.setProperty("--chip-font", `${_scale.font}px`);
		formsWheel.style.setProperty("--chip-pad", _scale.pad);

		const { node } = getDexFormsNode(gameKey, mon.id);

		// Clear any previous chips before rebuilding
		formsWheel.innerHTML = "";

		// Build chips (same logic as before)
		const chips = forms.map((form) => {
			const name = typeof form === "string" ? form : form?.name ?? "";

			const chip = document.createElement("div");
			chip.className = "form-chip";
			chip.title = name;
			chip.setAttribute("role", "group");

			const row = document.createElement("div");
			row.className = "chip-row";

			const label = document.createElement("span");
			label.className = "chip-text";
			label.textContent = name || "?";
			row.appendChild(label);

			function updateChipState() {
				const val = sel.value;
				if (val && val !== "unknown") {
					chip.classList.add("is-set");
				} else {
					chip.classList.remove("is-set");
				}
			}

			const sel = document.createElement("select");
			sel.className = "flag-select";
			const rawCur = node.forms?.[name] || "unknown";
			const curVal = clampStatusForForm(mon, form, rawCur);
			const fObj = typeof form === "object" ? form : null;

			const useColorForGame = shouldUseColorSprite(gameKey);
			let startSrc = null;

			if (useColorForGame !== null) {
				// Gen 1: toggle between B/W and color, ignore “shiny”
				const baseImgFn = fObj?.img || null;
				const colorImgFn = fObj?.imgS || baseImgFn;

				const baseImg = valWithGame(baseImgFn, gameKey);
				const colorImg = valWithGame(colorImgFn, gameKey);

				startSrc = useColorForGame ? colorImg : baseImg;
			} else {
				// Other gens: keep shiny behavior
				const shinyish = curVal === "shiny" || curVal === "shiny_alpha";
				const pick = shinyish ? (fObj?.imgS || fObj?.img) : fObj?.img;

				startSrc = valWithGame(pick || null, gameKey);
			}

			let im = null;
			if (startSrc) {
				im = document.createElement("img");
				im.src = startSrc;
				im.alt = name;
				im.loading = "lazy";
				row.appendChild(im);
			}

			const badges = document.createElement("div");
			badges.className = "badges";
			badges.innerHTML = renderBadges(curVal, gameKey);
			chip.appendChild(badges);

			sel.innerHTML = options
				.map((opt) => {
					const val = normalizeFlag(opt);
					if (!isOptionAllowedForForm(mon, form, val)) return "";
					const label = val
						.replace(/_/g, " ")
						.replace(/\b\w/g, (s) => s.toUpperCase());
					return `<option value="${val}" ${val === curVal ? "selected" : ""}>${label}</option>`;
				})
				.join("");

			function applyChipStatusClass(val) {
				const cls = getFilterClassForStatus(val);
				chip.classList.remove(
					"status-unknown",
					"status-seen",
					"status-normal"
				);
				chip.classList.add(cls);
			}
			applyChipStatusClass(curVal);
			updateChipState();

			sel.addEventListener("change", () => {
				console.log(`[DEX-FORMS] change fired for form="${name}", value="${sel.value}", nonce check: dataset="${formsModal.dataset.formsNonce}" vs expected="${nonce}"`);
				if (formsModal.dataset.formsNonce !== String(nonce)) {
					console.warn('[DEX-FORMS] change: NONCE MISMATCH, ignoring. Modal may have been reopened.');
					return;
				}

				const activeGameKey = formsModal.dataset.gameKey || gameKey;
				const rawMonId = formsModal.dataset.monId || String(mon.id);
				const activeMonId = /^\d+$/.test(rawMonId) ? Number(rawMonId) : rawMonId;
				console.log(`[DEX-FORMS] change: activeGameKey="${activeGameKey}", activeMonId=${activeMonId}, newVal="${sel.value}"`);

				let newVal = normalizeFlag(sel.value);
				newVal = clampStatusForForm(mon, form, newVal);
				sel.value = newVal;

				const { node } = getDexFormsNode(activeGameKey, activeMonId);
				node.forms = node.forms || {};
				node.forms[name] = newVal;

				const total = forms.length;
				const filled = forms.reduce((a, f) => {
					const nm = typeof f === "string" ? f : f?.name;
					return a +
						(normalizeFlag(node.forms?.[nm]) !== "unknown" ? 1 : 0);
				}, 0);
				node.all = filled === total;
				setDexFormsNode(activeGameKey, activeMonId, node);
				console.log(`[DEX-FORMS] stored node for ${activeGameKey}:${activeMonId}, forms=`, { ...node.forms });

				try {
					applyDexLinksFromForm(
						activeGameKey,
						activeMonId,
						name,
						newVal
					);
				} catch (e) {
					console.error("applyDexLinksFromForm error:", e);
				}

				updateChipState();
				applyChipStatusClass(newVal);
				badges.innerHTML = renderBadges(newVal, activeGameKey);

				if (im) {
					const activeGameKey = formsModal.dataset.gameKey || gameKey;
					const useColorForGame = shouldUseColorSprite(activeGameKey);
					const fObj = typeof form === "object" ? form : null;

					let nextSrc;

					if (useColorForGame !== null) {
						const baseImgFn = fObj?.img || null;
						const colorImgFn = fObj?.imgS || baseImgFn;

						const baseImg = valWithGame(baseImgFn, activeGameKey) || im.src;
						const colorImg = valWithGame(colorImgFn, activeGameKey) || baseImg;

						nextSrc = useColorForGame ? colorImg : baseImg;
					} else {
						const shinyish = newVal === "shiny" || newVal === "shiny_alpha";
						const pick = shinyish ? (fObj?.imgS || fObj?.img) : fObj?.img;

						nextSrc = valWithGame(pick || null, activeGameKey) || im.src;
					}

					im.src = nextSrc;
				}

				console.log('[DEX-FORMS] calling refreshActiveDexCard...');
				refreshActiveDexCard(activeGameKey, mon);
				const summaryGameKey = baseOf(activeGameKey);
				const summaryGenKey = formsModal.dataset.genKey || genKey;
				console.log(`[DEX-FORMS] calling refreshDexSummaryMetrics(gameKey="${summaryGameKey}", genKey="${summaryGenKey}")`);
				const summaryLabelEls = document.querySelectorAll(`[data-dex-summary-label="${summaryGameKey}:forms"]`);
				const summaryMeterEls = document.querySelectorAll(`[data-dex-summary-meter="${summaryGameKey}:forms"]`);
				console.log(`[DEX-FORMS] summary DOM elements found: labels=${summaryLabelEls.length}, meters=${summaryMeterEls.length}`);
				refreshDexSummaryMetrics(summaryGameKey, summaryGenKey, store);
				console.log('[DEX-FORMS] calling emitPpgcUiSync...');
				emitPpgcUiSync({ state: store?.state || window.store?.state || window.PPGC?._storeRef?.state || {}, loading: false });
				console.log('[DEX-FORMS] emitPpgcUiSync done.');

				try {
					window.PPGC?.applyTaskSyncsFromForm?.(
						activeGameKey,
						activeMonId,
						name,
						newVal
					);
				} catch {
					/* ignore */
				}
			});

			row.appendChild(sel);
			chip.appendChild(row);
			formsWheel.appendChild(chip);
			return chip;
		});

		// ----- Layout mode: radial vs 4-col grid -----
		// Clean up any previous resize handler (if we had a radial one before)
		if (formsModal._dexOnResize) {
			window.removeEventListener("resize", formsModal._dexOnResize);
			formsModal._dexOnResize = null;
		}

		if (useRadial) {
			// Reset any grid overrides from a previous open
			formsWheel.style.width = "";
			formsWheel.style.height = "";
			formsWheel.style.display = "";
			formsWheel.style.gridTemplateColumns = "";
			formsWheel.style.gap = "";
			formsWheel.style.padding = "";

			const onResize = createWheelResizeHandler(
				"dex",
				dialog,
				formsWheel,
				chips,
				{
					preferWidth: false,
					sizeCap: 1000,
					flattenSyForRingsGte: 3,
				}
			);
			formsModal._dexOnResize = onResize;
			window.addEventListener("resize", onResize, { passive: true });
		} else {
			// 8+ forms → grid layout with 4 columns
			formsWheel.style.width = "100%";
			formsWheel.style.height = "auto";
			formsWheel.style.display = "grid";
			formsWheel.style.maxWidth = "100%";
			formsWheel.style.gridTemplateColumns =
				isMobileViewport ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))";
			formsWheel.style.gap = "8px";
			formsWheel.style.padding = "4px 2px 10px";

			chips.forEach((chip) => {
				chip.style.position = "relative";
				chip.style.transform = "none";
				chip.style.width = "100%";
				chip.style.height = "auto";
			});
		}

		formsModal.classList.add("open");
		formsModal.setAttribute("aria-hidden", "false");
		formsModal.removeAttribute("inert");
	}

	function closeDexForms() {
		const returnEl = formsModal?.__returnFocusEl;
		const dexScrollTop = formsModal?.__dexScrollTop ?? 0;

		// Remove ANY resize handler that may have been attached by other modules
		const resizeKeys = [
			"_dexOnResize",
			"_curryOnResize",
			"_sandwichOnResize",
			"_capsuleOnResize",
			"_fashionOnResize",
		];

		for (const k of resizeKeys) {
			const fn = formsModal?.[k];
			if (typeof fn === "function") {
				window.removeEventListener("resize", fn);
			}
			if (formsModal) formsModal[k] = null;
		}

		// Drop wheel DOM so chip buttons + decoded images can GC
		if (formsWheel) formsWheel.innerHTML = "";

		formsModal.classList.remove("open");
		formsModal.setAttribute("aria-hidden", "true");
		formsModal.setAttribute("inert", "");

		// clear active-target metadata
		delete formsModal.dataset.formsNonce;
		delete formsModal.dataset.gameKey;
		delete formsModal.dataset.genKey;
		delete formsModal.dataset.monId;
		formsModal.__returnFocusEl = null;
		formsModal.__dexScrollTop = 0;

		try {
			if (document.activeElement && formsModal.contains(document.activeElement)) {
				document.activeElement.blur?.();
			}
			if (returnEl && typeof returnEl.focus === "function") {
				returnEl.focus({ preventScroll: true });
			}
		} catch {
			/* ignore */
		}

		requestAnimationFrame(() => {
			const dexScrollEl = getDexScrollContainer();
			if (dexScrollEl) dexScrollEl.scrollTop = dexScrollTop;
		});
	}

	formsModal.addEventListener("click", (e) => {
		if (e.target === formsModal) closeDexForms();
	});
	formsModalClose?.addEventListener("click", closeDexForms);
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && formsModal.classList.contains("open"))
			closeDexForms();
	});

	return { openDexForms, closeDexForms };
}

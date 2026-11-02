// dex-forms-modal.js
//
// Handles opening/closing the Forms modal and laying out form chips.
// All the data helpers (get/set forms node, clamping, sync, etc.) are
// passed in as dependencies from dex.js so we avoid circular imports.

import { emitPpgcUiSync } from "../react-bridge/storeBridge.js";
import { debugLog } from "../utils/debug.js";
import { _dexIdNumber } from "../../data/helpers/dex-ids.js";
import { baseOf } from "./dex-config.js";
import { updateDexThumb } from "./dex-grid.js";
import { getDexScrollContainer } from "./helpers.js";
import { clampStatusForMon, pickHighestStatus } from "./helpers.js";
import { refreshDexSummaryMetrics } from "./dex-summary.js";
import { hideModalElement, showModalElement } from "./modal-state.js";

export function setupDexFormsModal(store, deps) {
	const {
		formsModal,
		formsModalClose,
		formsWheel,
		getGameColor,
		prepFormsModal,
		normalizeFlag,
		clampStatusForForm,
		isOptionAllowedForForm,
		getFilterClassForStatus,
		renderBadges,
		shouldUseColorSprite,
		getDexFormsNode, // (gameKey, monId) => { node, map }
		setDexFormsNode, // (gameKey, monId, node) => void
		applyDexLinksFromForm, // (gameKey, monId, formName, status) => void
		renderDexGrid, // function from dex.js
	} = deps;

	if (!formsModal || !formsWheel) {
		// Graceful no-op if DOM isn’t there
		return {
			openDexForms: () => {},
			closeDexForms: () => {},
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
		if (!mon) {
			console.warn(
				"[DEX-FORMS] refreshActiveDexCard: mon is null, skipping",
			);
			return;
		}
		const cardKey = `${gameKey}:${mon.id}`;
		const card = document.querySelector(`[data-dex-card-key="${cardKey}"]`);
		debugLog(
			`[DEX-FORMS] refreshActiveDexCard: looking for card key="${cardKey}", found=`,
			!!card,
		);
		if (!card) {
			// Show all card keys in DOM to diagnose mismatch
			const allCardKeys = [
				...document.querySelectorAll("[data-dex-card-key]"),
			].map((el) => el.dataset.dexCardKey);
			console.warn(
				"[DEX-FORMS] refreshActiveDexCard: card NOT found. All card keys in DOM:",
				allCardKeys.slice(0, 10),
			);
			return;
		}

		const { node } = getDexFormsNode(gameKey, mon.id);
		const formVals = (mon.forms || []).map((f) => {
			const formName = typeof f === "string" ? f : f?.name;
			return node.forms?.[formName] || "unknown";
		});
		const highestStatus = clampStatusForMon(
			mon,
			pickHighestStatus(formVals),
		);
		debugLog(
			`[DEX-FORMS] refreshActiveDexCard: formVals=`,
			formVals,
			`→ highestStatus="${highestStatus}"`,
		);
		card.dataset.status = highestStatus;

		const thumb = card.querySelector(".thumb");
		if (thumb) {
			updateDexThumb({
				thumb,
				mon,
				status: highestStatus,
				gameKey,
				pathOfSolitudeEnabled:
					!!store.dexResearchStatus.get(gameKey)?.[mon.id]
						?.__pathOfSolitude,
			});
		}

		const countEl = card.querySelector(
			`[data-dex-forms-count="${cardKey}"]`,
		);
		if (countEl) {
			const total = (mon.forms || []).length;
			const filled = (mon.forms || []).reduce((acc, f) => {
				const formName = typeof f === "string" ? f : f?.name;
				return (
					acc +
					((node.forms?.[formName] || "unknown") !== "unknown"
						? 1
						: 0)
				);
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
		const dexNumber = String(
			_dexIdNumber(mon.id, mon.localId) ?? "",
		).padStart(3, "0");
		formsModal.classList.add("dex-forms-modal");
		formsWheel.classList.add("is-grid", "dex-forms-grid");
		const title = formsModal.querySelector("#formsModalTitle");
		if (title) title.textContent = `${mon.name || "Pokémon"} Forms`;

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

		const { node } = getDexFormsNode(gameKey, mon.id);

		// Clear any previous chips before rebuilding
		formsWheel.innerHTML = "";

		// Dex forms intentionally use the same card hierarchy as the main Dex.
		// Other collectors retain the shared radial/grid presentation.
		const chips = forms.map((form) => {
			const name = typeof form === "string" ? form : (form?.name ?? "");

			const chip = document.createElement("div");
			chip.className = "form-chip dex-form-card";
			chip.title = name;
			chip.setAttribute("role", "group");
			chip.setAttribute(
				"aria-label",
				`${name || "Pokémon form"}, Dex number ${dexNumber}`,
			);

			const row = document.createElement("div");
			row.className = "chip-row";

			const code = document.createElement("span");
			code.className = "dex-form-code";
			code.textContent = `#${dexNumber}`;
			row.appendChild(code);
			const thumb = document.createElement("div");
			thumb.className = "dex-form-thumb";
			row.appendChild(thumb);

			const label = document.createElement("span");
			label.className = "chip-text dex-form-name";
			label.textContent = name || "?";

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
			sel.setAttribute(
				"aria-label",
				`Status for ${name || "Pokémon form"}`,
			);
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
				const pick = shinyish ? fObj?.imgS || fObj?.img : fObj?.img;

				startSrc = valWithGame(pick || null, gameKey);
			}

			let im = null;
			if (startSrc) {
				im = document.createElement("img");
				im.src = startSrc;
				im.alt = name;
				im.loading = "lazy";
				thumb.appendChild(im);
			}
			row.appendChild(label);

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
					"status-normal",
				);
				chip.classList.add(cls);
			}
			applyChipStatusClass(curVal);
			updateChipState();

			sel.addEventListener("change", () => {
				debugLog(
					`[DEX-FORMS] change fired for form="${name}", value="${sel.value}", nonce check: dataset="${formsModal.dataset.formsNonce}" vs expected="${nonce}"`,
				);
				if (formsModal.dataset.formsNonce !== String(nonce)) {
					console.warn(
						"[DEX-FORMS] change: NONCE MISMATCH, ignoring. Modal may have been reopened.",
					);
					return;
				}

				const activeGameKey = formsModal.dataset.gameKey || gameKey;
				const rawMonId = formsModal.dataset.monId || String(mon.id);
				const activeMonId = /^\d+$/.test(rawMonId)
					? Number(rawMonId)
					: rawMonId;
				debugLog(
					`[DEX-FORMS] change: activeGameKey="${activeGameKey}", activeMonId=${activeMonId}, newVal="${sel.value}"`,
				);

				let newVal = normalizeFlag(sel.value);
				newVal = clampStatusForForm(mon, form, newVal);
				sel.value = newVal;

				const { node } = getDexFormsNode(activeGameKey, activeMonId);
				node.forms = node.forms || {};
				node.forms[name] = newVal;

				const total = forms.length;
				const filled = forms.reduce((a, f) => {
					const nm = typeof f === "string" ? f : f?.name;
					return (
						a +
						(normalizeFlag(node.forms?.[nm]) !== "unknown" ? 1 : 0)
					);
				}, 0);
				node.all = filled === total;
				setDexFormsNode(activeGameKey, activeMonId, node);
				debugLog(
					`[DEX-FORMS] stored node for ${activeGameKey}:${activeMonId}, forms=`,
					{ ...node.forms },
				);

				try {
					applyDexLinksFromForm(
						activeGameKey,
						activeMonId,
						name,
						newVal,
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

						const baseImg =
							valWithGame(baseImgFn, activeGameKey) || im.src;
						const colorImg =
							valWithGame(colorImgFn, activeGameKey) || baseImg;

						nextSrc = useColorForGame ? colorImg : baseImg;
					} else {
						const shinyish =
							newVal === "shiny" || newVal === "shiny_alpha";
						const pick = shinyish
							? fObj?.imgS || fObj?.img
							: fObj?.img;

						nextSrc =
							valWithGame(pick || null, activeGameKey) || im.src;
					}

					im.src = nextSrc;
				}

				debugLog("[DEX-FORMS] calling refreshActiveDexCard...");
				refreshActiveDexCard(activeGameKey, mon);
				const summaryGameKey = baseOf(activeGameKey);
				const summaryGenKey = formsModal.dataset.genKey || genKey;
				debugLog(
					`[DEX-FORMS] calling refreshDexSummaryMetrics(gameKey="${summaryGameKey}", genKey="${summaryGenKey}")`,
				);
				const summaryLabelEls = document.querySelectorAll(
					`[data-dex-summary-label="${summaryGameKey}:forms"]`,
				);
				const summaryMeterEls = document.querySelectorAll(
					`[data-dex-summary-meter="${summaryGameKey}:forms"]`,
				);
				debugLog(
					`[DEX-FORMS] summary DOM elements found: labels=${summaryLabelEls.length}, meters=${summaryMeterEls.length}`,
				);
				refreshDexSummaryMetrics(summaryGameKey, summaryGenKey, store);
				debugLog("[DEX-FORMS] calling emitPpgcUiSync...");
				emitPpgcUiSync({
					state:
						store?.state ||
						window.store?.state ||
						window.PPGC?._storeRef?.state ||
						{},
					loading: false,
				});
				debugLog("[DEX-FORMS] emitPpgcUiSync done.");

				try {
					window.PPGC?.applyTaskSyncsFromForm?.(
						activeGameKey,
						activeMonId,
						name,
						newVal,
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

		// Dex form cards always use an intrinsic grid. This avoids radial card
		// collisions and keeps the same scan pattern at every form count.
		if (formsModal._dexOnResize) {
			window.removeEventListener("resize", formsModal._dexOnResize);
			formsModal._dexOnResize = null;
		}
		formsWheel.style.width = "100%";
		formsWheel.style.height = "auto";
		formsWheel.style.display = "grid";
		formsWheel.style.maxWidth = "100%";
		formsWheel.style.gridTemplateColumns = "";
		formsWheel.style.gap = "";
		formsWheel.style.padding = "";
		chips.forEach((chip) => {
			chip.style.position = "relative";
			chip.style.transform = "none";
			chip.style.width = "100%";
			chip.style.height = "auto";
		});

		showModalElement(formsModal);
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
		formsWheel?.classList.remove("is-grid", "dex-forms-grid");
		formsModal?.classList.remove("dex-forms-modal");
		const title = formsModal?.querySelector("#formsModalTitle");
		if (title) title.textContent = "Select Forms";

		hideModalElement(formsModal);
		formsModal.setAttribute("inert", "");

		// clear active-target metadata
		delete formsModal.dataset.formsNonce;
		delete formsModal.dataset.gameKey;
		delete formsModal.dataset.genKey;
		delete formsModal.dataset.monId;
		formsModal.__returnFocusEl = null;
		formsModal.__dexScrollTop = 0;

		try {
			if (
				document.activeElement &&
				formsModal.contains(document.activeElement)
			) {
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

// fashion-forms.js
//
// Handles the shared forms modal when used from the Fashion section.
// This is a lighter boolean-toggling wheel compared to the Dex forms wheel.

import { save } from "../store.js";
import {
	layoutWheel,
	getGameColor,
	computeChipScale,
	prepFormsModal,
	createWheelResizeHandler,
} from "./modal.js";
import { cleanupFormsModal } from "./helpers.js";

export function setupFashionForms(store, deps) {
	const {
		formsModal,
		formsModalClose,
		formsWheel,
		getFormsNode,          // (gameKey, categoryId, itemId) => { obj }
		setFormsNode,          // (gameKey, categoryId, itemId, node) => void
		updateFashionSummary,  // (gameKey, categoryId) => void
		refreshSectionHeader,  // () => void
		applyFashionSyncForItem, // NEW
	} = deps;

	if (!formsModal || !formsWheel) {
		// Graceful no-op if DOM isn’t there
		return {
			openDexForms: () => { },
			closeDexForms: () => { },
		};
	}

	function _resolveFashionImg(imgLike, gameKey) {
		if (!imgLike) return "";
		if (typeof imgLike === "function") {
			try {
				return imgLike({ gameKey }) || "";
			} catch (e) {
				console.warn("Fashion form img resolver failed:", e);
				return "";
			}
		}
		return String(imgLike);
	}

	let closeForms = function closeFormsDefault() {
		const active = document.activeElement;
		if (active && formsModal.contains(active)) {
			try {
				active.blur();
			} catch {
				// ignore
			}
		}
		cleanupFormsModal();
		formsModal.classList.remove("open");
		formsModal.setAttribute("aria-hidden", "true");
		formsModal.setAttribute("inert", "");
	};

	function openForms(gameKey, categoryId, item) {
		const accent = getGameColor(gameKey);
		const dialog = prepFormsModal(formsModal, formsWheel, {
			accent,
			clearWheelGridStyles: true, // reset any grid overrides from Dex/Fashion
		});
		if (!dialog) return;

		const forms = item.forms || [];
		const N = forms.length;
		const useRadial = N <= 7;    // ≤7 → radial shapes, ≥8 → grid
		const preferWidth = N >= 11; // same heuristic as before for dense wheels

		const body = dialog.querySelector(".modal-bd");
		if (body) {
			if (N > 12) {
				body.classList.add("forms-wheel-scroll");
			} else {
				body.classList.remove("forms-wheel-scroll");
			}
		}

		const { obj } = getFormsNode(gameKey, categoryId, item.id);
		const firstLayout = layoutWheel(dialog, { preferWidth, sizeCap: 1000 });
		formsWheel.style.setProperty("--size", `${firstLayout.size}px`);

		const scale = computeChipScale("fashion", N, dialog);
		formsWheel.style.setProperty("--form-img", `${scale.img}px`);
		formsWheel.style.setProperty("--chip-font", `${scale.font}px`);
		formsWheel.style.setProperty("--chip-pad", scale.pad);

		// Build chips so we can measure widths for layout
		const chips = forms.map((form) => {
			const name = typeof form === "string" ? form : form?.name ?? "";
			const id = typeof form === "string" ? form : form?.id ?? "";
			const imgLike = typeof form === "object" ? form?.img : null;
			const imgUrl = _resolveFashionImg(imgLike, gameKey);

			const btn = document.createElement("button");
			btn.className = "form-chip";
			btn.title = name;

			const row = document.createElement("div");
			row.className = "chip-row";

			const labelSpan = document.createElement("span");
			labelSpan.className = "chip-text";
			labelSpan.textContent = name || "?";
			labelSpan.dataset.id = id || "?";
			row.appendChild(labelSpan);

			if (imgUrl) {
				const im = document.createElement("img");
				im.src = imgUrl;
				im.alt = name;
				im.loading = "lazy";
				row.appendChild(im);
			}

			const checked = !!obj.forms?.[name];
			btn.setAttribute("aria-checked", checked ? "true" : "false");

			btn.addEventListener("click", () => {
				const now = btn.getAttribute("aria-checked") !== "true";
				btn.setAttribute("aria-checked", now ? "true" : "false");

				const { obj } = getFormsNode(gameKey, categoryId, item.id);
				obj.forms = obj.forms || {};
				obj.forms[name] = now;

				const total = forms.length;
				const onCount = Object.values(obj.forms).filter(Boolean).length;
				obj.all = onCount === total;

				setFormsNode(gameKey, categoryId, item.id, obj);
				save();

				const mainChk = document.querySelector(
					`[data-fashion-main="${gameKey}:${categoryId}:${item.id}"]`
				);
				if (mainChk instanceof HTMLInputElement) {
					mainChk.checked = !!obj.all;
				}

				const key = `${gameKey}:${categoryId}:${item.id}`;
				document
					.querySelectorAll(`[data-fashion-count="${key}"]`)
					.forEach((el) => {
						el.textContent = `${onCount}/${total}`;
					});

				updateFashionSummary(gameKey, categoryId);
				refreshSectionHeader();
				window.PPGC?.applyTaskSyncsFromFashion?.(gameKey, categoryId, item.id);
				if (typeof applyFashionSyncForItem === "function") applyFashionSyncForItem(gameKey, categoryId, item, !!obj.all);
			});

			btn.appendChild(row);
			formsWheel.appendChild(btn);
			return btn;
		});

		// ----- Layout mode: radial vs 4-col grid -----
		let onResize = null;

		if (useRadial) {
			// Reset any grid overrides from a previous open
			formsWheel.style.width = "";
			formsWheel.style.height = "";
			formsWheel.style.display = "";
			formsWheel.style.gridTemplateColumns = "";
			formsWheel.style.gap = "";
			formsWheel.style.padding = "";

			// Radial wheel with shared layout and special shapes (2–7 forms)
			onResize = createWheelResizeHandler("fashion", dialog, formsWheel, chips, {
				preferWidth,
				sizeCap: 1000,
				flattenSyForRingsGte: 3,
				innerRadiusStrategy(minR, outerR) {
					return Math.max(40, outerR * 0.25);
				},
				extraRingYOffset: { from: 3, factor: 1.08 },
			});
			window.addEventListener("resize", onResize, { passive: true });
		} else {
			// 8+ forms → grid layout with 4 columns
			formsWheel.style.width = "100%";
			formsWheel.style.height = "auto";
			formsWheel.style.display = "grid";
			formsWheel.style.gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
			formsWheel.style.gap = "12px";
			formsWheel.style.padding = "8px 16px 16px";

			chips.forEach((chip) => {
				chip.style.position = "static";
				chip.style.transform = "none";
				chip.style.width = "100%";
				chip.style.height = "auto";
			});
		}

		// Overwrite closeForms to also remove the resize listener (if any)
		closeForms = function () {
			if (onResize) {
				window.removeEventListener("resize", onResize);
			}
			formsWheel.innerHTML = "";
			const active = document.activeElement;
			if (active && formsModal.contains(active)) {
				try {
					active.blur();
				} catch {
					// ignore
				}
			}
			cleanupFormsModal();
			formsModal.classList.remove("open");
			formsModal.setAttribute("aria-hidden", "true");
			formsModal.setAttribute("inert", "");
		};

		formsModal.classList.add("open");
		formsModal.setAttribute("aria-hidden", "false");
	}

	// Wire events for the shared forms modal
	formsModal.addEventListener("click", (e) => {
		if (e.target === formsModal) closeForms();
	});
	formsModalClose?.addEventListener("click", closeForms);
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && formsModal.classList.contains("open")) {
			closeForms();
		}
	});

	return { openForms, closeForms };
}

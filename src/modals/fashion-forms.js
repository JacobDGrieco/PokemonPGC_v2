import { save } from "../store.js";
import {
	layoutWheel,
	getGameColor,
	computeChipScale,
	prepFormsModal,
	createWheelResizeHandler,
	resetFormsWheelLayout,
	applyFormsGridLayout,
} from "./modal.js";
import { cleanupFormsModal } from "./helpers.js";

export function setupFashionForms(store, deps) {
	const {
		formsModal,
		formsModalClose,
		formsWheel,
		getFormsNode,
		setFormsNode,
		updateFashionSummary,
		refreshSectionHeader,
		applyFashionSyncForItem,
	} = deps;

	if (!formsModal || !formsWheel) {
		return {
			openDexForms: () => {},
			closeDexForms: () => {},
		};
	}

	function resolveFashionImg(imgLike, gameKey) {
		if (!imgLike) return "";
		if (typeof imgLike === "function") {
			try {
				return imgLike({ gameKey }) || "";
			} catch (error) {
				console.warn("Fashion form img resolver failed:", error);
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
			clearWheelGridStyles: true,
		});
		if (!dialog) return;

		const forms = item.forms || [];
		const count = forms.length;
		const useRadial = count <= 4;
		const preferWidth = count >= 9;

		const body = dialog.querySelector(".modal-bd");
		if (body) {
			body.classList.toggle("forms-wheel-scroll", count > 12);
		}

		const { obj } = getFormsNode(gameKey, categoryId, item.id);
		const firstLayout = layoutWheel(dialog, { preferWidth, sizeCap: 1000 });
		formsWheel.style.setProperty("--size", `${firstLayout.size}px`);

		const scale = computeChipScale("fashion", count, dialog);
		formsWheel.style.setProperty("--form-img", `${scale.img}px`);
		formsWheel.style.setProperty("--chip-font", `${scale.font}px`);
		formsWheel.style.setProperty("--chip-pad", scale.pad);
		resetFormsWheelLayout(formsWheel);

		const chips = forms.map((form) => {
			const name = typeof form === "string" ? form : form?.name ?? "";
			const id = typeof form === "string" ? form : form?.id ?? "";
			const imgLike = typeof form === "object" ? form?.img : null;
			const imgUrl = resolveFashionImg(imgLike, gameKey);

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
				const img = document.createElement("img");
				img.src = imgUrl;
				img.alt = name;
				img.loading = "lazy";
				row.appendChild(img);
			}

			const checked = !!obj.forms?.[name];
			btn.setAttribute("aria-checked", checked ? "true" : "false");

			btn.addEventListener("click", () => {
				const now = btn.getAttribute("aria-checked") !== "true";
				btn.setAttribute("aria-checked", now ? "true" : "false");

				const { obj: nextNode } = getFormsNode(gameKey, categoryId, item.id);
				nextNode.forms = nextNode.forms || {};
				nextNode.forms[name] = now;

				const total = forms.length;
				const onCount = Object.values(nextNode.forms).filter(Boolean).length;
				nextNode.all = onCount === total;

				setFormsNode(gameKey, categoryId, item.id, nextNode);
				save();

				const mainChk = document.querySelector(
					`[data-fashion-main="${gameKey}:${categoryId}:${item.id}"]`
				);
				if (mainChk instanceof HTMLInputElement) {
					mainChk.checked = !!nextNode.all;
				}

				const key = `${gameKey}:${categoryId}:${item.id}`;
				document.querySelectorAll(`[data-fashion-count="${key}"]`).forEach((el) => {
					el.textContent = `${onCount}/${total}`;
				});

				updateFashionSummary(gameKey, categoryId);
				refreshSectionHeader();
				window.PPGC?.applyTaskSyncsFromFashion?.(gameKey, categoryId, item.id);
				if (typeof applyFashionSyncForItem === "function") {
					applyFashionSyncForItem(gameKey, categoryId, item, !!nextNode.all);
				}
			});

			btn.appendChild(row);
			formsWheel.appendChild(btn);
			return btn;
		});

		let onResize = null;

		if (useRadial) {
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
			applyFormsGridLayout(formsWheel, chips, {
				columns: "repeat(6, minmax(0, 1fr))",
				gap: "8px",
				padding: "4px 2px 10px",
				maxWidth: "100%",
			});
		}

		closeForms = function closeFashionForms() {
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

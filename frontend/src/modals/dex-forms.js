// dex-forms-modal.js
//
// Handles opening/closing the Forms modal and laying out form chips.
// All the data helpers (get/set forms node, clamping, sync, etc.) are
// passed in as dependencies from dex.js so we avoid circular imports.

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

	function openDexForms(gameKey, genKey, mon) {
		if (!formsModal || !formsWheel) return;

		formsNonce += 1;
		const nonce = formsNonce;
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
		const useRadial = N <= 7; // <=7 → radial single ring; >=8 → grid

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
				if (formsModal.dataset.formsNonce !== String(nonce)) return;

				const activeGameKey = formsModal.dataset.gameKey || gameKey;
				const activeMonId = Number(formsModal.dataset.monId || mon.id);

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

				const key = `${activeGameKey}:${activeMonId}`;
				document
					.querySelectorAll(`[data-dex-forms-count="${key}"]`)
					.forEach((el) => {
						el.textContent = `${filled}/${total}`;
					});

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

				// Re-render the main dex grid so the card reflects new forms
				renderDexGrid();

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
			formsWheel.style.gridTemplateColumns =
				"repeat(4, minmax(0, 1fr))";
			formsWheel.style.gap = "12px";
			formsWheel.style.padding = "8px 16px 16px";

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

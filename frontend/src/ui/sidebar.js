import { save } from "../store.js";
import { ensureSections } from "../tasks.js";

/* ===================== Helpers ===================== */

/**
 * Create a sidebar "directory item" row.
 */
function makeDirItem(label, onClick, active = false, imgPath = null, opts = {}) {
	const li = document.createElement("div");
	li.className = "dir-item" + (active ? " active" : "");

	const iconHtml = imgPath
		? `<span class="icon game-icon" style="background-image: url('${imgPath}')"></span>`
		: `<span class="icon"></span>`;

	const badgeHtml = opts.badgeHtml || "";

	li.innerHTML = `
    <div class="label">
      ${iconHtml}
      <span class="text">${label}</span>
      ${badgeHtml}
    </div>
    <div>›</div>
  `;
	li.addEventListener("click", onClick);
	return li;
}

/* ===================== Sidebar renderer ===================== */

/**
 * Render the left sidebar:
 * - Level "gen": list of generations
 * - Level "game": list of games for current gen
 * - Level "section": list of sections for current game
 * - Level "moninfoIndex" / "moninfo": tools menu (Info/Tools)
 *
 * Also injects and manages the Gen 1 sprite color toggle in the header.
 */
export function renderSidebar(store, els, renderAll) {
	const { elSidebarList, elSidebarTitle } = els;
	const s = store.state;

	elSidebarList.innerHTML = "";

	// ----- Gen 1 sprite color toggle in sidebar header -----
	(function syncGen1SpriteToggle() {
		const headerEl = document.querySelector(".sidebar-header");
		if (!headerEl) return;

		let toggle = headerEl.querySelector("#gen1SpriteToggle");

		// Create toggle once
		if (!toggle) {
			toggle = document.createElement("label");
			toggle.id = "gen1SpriteToggle";
			toggle.className = "sprite-toggle hidden";
			toggle.innerHTML = `
        <span class="lbl">Colors</span>
        <input type="checkbox" />
        <span class="switch"><span class="knob"></span></span>
      `;
			headerEl.appendChild(toggle);

			const input = toggle.querySelector("input");
			input.addEventListener("change", () => {
				const isColor = input.checked;

				// Store state
				s.gen1SpriteMode = isColor ? "color" : "bw";
				save();

				// Global flag so tasks/dex can read it
				window.PPGC = window.PPGC || {};
				window.PPGC.gen1SpriteColor = isColor;

				renderAll();
			});
		}

		const input = toggle.querySelector("input");

		// Show only when we’re inside a Gen 1 context
		const showToggle = s.level !== "gen" && s.genKey === "gen1";
		toggle.classList.toggle("hidden", !showToggle);

		// Default mode if missing
		if (!s.gen1SpriteMode) s.gen1SpriteMode = "bw";

		const isColor = s.gen1SpriteMode === "color";
		if (input) input.checked = isColor;

		// Keep global flag in sync every render
		window.PPGC = window.PPGC || {};
		window.PPGC.gen1SpriteColor = isColor;
	})();

	/* ============================================================
	 *  TOOLS MENU (Info/Tools)
	 *  Treat this like a "section-level" directory:
	 *  - Sidebar shows tool pages
	 *  - Main panel swaps based on selected tool
	 * ============================================================ */
	if (s.level === "tools" || s.level === "moninfo") {
		if (elSidebarTitle) elSidebarTitle.textContent = "Info/Tools";

		const activeTool = (s.toolsKey || "info");

		elSidebarList.appendChild(
			makeDirItem(
				"Pokémon Info Index",
				() => {
					window.PPGC.navigateToState({
						level: "tools",
						toolsKey: "info",
						genKey: null,
						gameKey: null,
						sectionId: null,
						monInfoId: null,
						monInfoGameKey: null,
						monInfoForm: null,
					});
				},
				activeTool === "info"
			)
		);

		return;
	}

	/* ---------- Level: GEN (list generations) ---------- */

	if (s.level === "gen") {
		if (elSidebarTitle) elSidebarTitle.textContent = "Generations";
		(window.DATA.tabs || []).forEach((t) => {
			elSidebarList.appendChild(
				makeDirItem(t.label, () => {
					window.PPGC.navigateToState({
						level: "game",
						genKey: t.key,
						gameKey: null,
						sectionId: null,
					});
				})
			);
		});

		return;
	}

	/* ---------- Level: GAME (list games for gen) ---------- */

	if (s.level === "game") {
		const genLabel =
			(window.DATA.tabs || []).find((x) => x.key === s.genKey)?.label || s.genKey;
		if (elSidebarTitle) elSidebarTitle.textContent = genLabel;

		(window.DATA.games?.[s.genKey] || []).forEach((g) => {
			const imgPath = `imgs/game-icons/${g.key}.png`;

			// Check started status from store
			const isStarted =
				typeof store.isGameStarted === "function"
					? store.isGameStarted(g.key)
					: !!(store.state.startedGames || {})[g.key];

			const badgeHtml = isStarted
				? `<span class="chip chip-started" title="This game is marked as started">Started</span>`
				: "";

			elSidebarList.appendChild(
				makeDirItem(
					g.label,
					async () => {
						try {
							const ensure = window.PPGC?.ensureGenDataLoadedForGame;
							if (ensure) await ensure(g.key);

							const arr = ensureSections(g.key);
							const firstSectionId = arr?.[0]?.id || null;

							window.PPGC.navigateToState({
								level: "section",
								genKey: s.genKey,
								gameKey: g.key,
								sectionId: firstSectionId,
							});
						} catch (e) {
							console.debug("[sidebar nav] failed:", e);
							window.PPGC.navigateToState({
								level: "game",
								genKey: s.genKey,
								gameKey: null,
								sectionId: null,
							});
						}
					},
					s.gameKey === g.key,
					imgPath,
					{ badgeHtml }
				)
			);
		});

		return;
	}

	/* ---------- Level: SECTION (list sections for game) ---------- */

	if (s.level === "section") {
		const gameLabel =
			(window.DATA.games?.[s.genKey] || []).find((x) => x.key === s.gameKey)?.label ||
			s.gameKey;
		if (elSidebarTitle) elSidebarTitle.textContent = gameLabel;

		const arr = ensureSections(s.gameKey);
		arr.forEach((sec) => {
			elSidebarList.appendChild(
				makeDirItem(
					sec.title,
					() => {
						window.PPGC.navigateToState({
							level: "section",
							genKey: s.genKey,
							gameKey: s.gameKey,
							sectionId: sec.id,
						});
					},
					s.sectionId === sec.id
				)
			);
		});

		return;
	}
}

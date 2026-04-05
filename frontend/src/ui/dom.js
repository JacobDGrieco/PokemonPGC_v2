/**
 * Central DOM references used across the app.
 *
 * Uses lazy getters so that getElementById runs when a property is accessed
 * (inside a function), not at module import time — which would be before
 * React has rendered the DOM.
 */
export const elements = {
	get ppgcHomeBtn() { return document.getElementById("ppgcHomeBtn"); },
	get ppgcMonInfoBtn() { return document.getElementById("ppgcMonInfoBtn"); },

	// Shell / layout
	get elSidebarTitle() { return document.getElementById("navTitle"); },
	get elSidebarList() { return document.getElementById("sideList"); },
	get elBack() { return document.getElementById("navBack"); },
	get elContent() { return document.getElementById("legacy-content-root"); },
	get contentShell() { return document.getElementById("content"); },
	get elCrumbs() { return document.getElementById("crumbs"); },

	// Dex modal
	get modal() { return document.getElementById("modal"); },
	get modalClose() { return document.getElementById("modalClose"); },
	get dexGrid() { return document.getElementById("dexGrid"); },
	get dexSearch() { return document.getElementById("dexSearch"); },
	get dexSelectAll() { return document.getElementById("dexSelectAll"); },
	get dexClearAll() { return document.getElementById("dexClearAll"); },
	get modalTitle() { return document.getElementById("modalTitle"); },

	// Fashion modal
	get fashionModal() { return document.getElementById("fashionModal"); },
	get fashionModalClose() { return document.getElementById("fashionModalClose"); },
	get fashionGrid() { return document.getElementById("fashionGrid"); },
	get fashionSearch() { return document.getElementById("fashionSearch"); },
	get fashionSelectAll() { return document.getElementById("fashionSelectAll"); },
	get fashionClearAll() { return document.getElementById("fashionClearAll"); },
	get fashionModalTitle() { return document.getElementById("fashionModalTitle"); },

	// Medal modal
	get medalsModal() { return document.getElementById("medalsModal"); },
	get medalsModalClose() { return document.getElementById("medalsModalClose"); },
	get medalsSelectAll() { return document.getElementById("medalsSelectAll"); },
	get medalsClearAll() { return document.getElementById("medalsClearAll"); },
	get medalsGrid() { return document.getElementById("medalsGrid"); },
	get medalsModalTitle() { return document.getElementById("medalsModalTitle"); },
	get medalsSearch() { return document.getElementById("medalsSearch"); },
};

export function wireGlobalNav(store, els, renderAll) {
	const { ppgcHomeBtn, ppgcMonInfoBtn, elBack } = els;
	const s = store.state;

	// Home button: app logo
	if (ppgcHomeBtn) {
		ppgcHomeBtn.addEventListener("click", () => {
			window.PPGC.navigateToState({
				level: "gen",
				genKey: null,
				gameKey: null,
				sectionId: null,
			});
		});
	}

	if (ppgcMonInfoBtn) {
		ppgcMonInfoBtn.addEventListener("click", () => {
			window.PPGC.navigateToState({
				level: "moninfoIndex",
				genKey: null,
				gameKey: null,
				sectionId: null,
			});
		});
	}

	// Back button: section -> game(gen), game -> gen
	if (elBack) {
		elBack.style.cursor = "pointer";
		elBack.addEventListener("click", () => {

			if (s.level === "section" && s.genKey) {
				// Example: #/section/gen1/red/red-catching
				// Go up to that gen's game list: #/game/gen1
				window.PPGC.navigateToState({
					level: "game",
					genKey: s.genKey,
					gameKey: null,
					sectionId: null,
				});
			} else if (s.level === "game") {
				// Example: #/game/gen1
				// Go up to top-level "all gens": base URL
				window.PPGC.navigateToState({
					level: "gen",
					genKey: null,
					gameKey: null,
					sectionId: null,
				});
			}
		});
	}
}
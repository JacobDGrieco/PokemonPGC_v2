/**
 * Central DOM references used across the app.
 *
 * Uses lazy getters so that getElementById runs when a property is accessed
 * (inside a function), not at module import time — which would be before
 * React has rendered the DOM.
 */
export const elements = {
	get ppgcHomeBtn() {
		return document.getElementById("ppgcHomeBtn");
	},
	get ppgcMonInfoBtn() {
		return document.getElementById("ppgcMonInfoBtn");
	},

	// Shell / layout
	get elSidebarTitle() {
		return document.getElementById("navTitle");
	},
	get elSidebarList() {
		return document.getElementById("sideList");
	},
	get elBack() {
		return document.getElementById("navBack");
	},
	get elContent() {
		return document.getElementById("legacy-content-root");
	},
	get contentShell() {
		return document.getElementById("content");
	},
	get elCrumbs() {
		return document.getElementById("crumbs");
	},

	// Dex modal
	get modal() {
		return document.getElementById("modal");
	},
	get modalClose() {
		return document.getElementById("modalClose");
	},
	get dexGrid() {
		return document.getElementById("dexGrid");
	},
	get dexSearch() {
		return document.getElementById("dexSearch");
	},
	get dexSelectAll() {
		return document.getElementById("dexSelectAll");
	},
	get dexClearAll() {
		return document.getElementById("dexClearAll");
	},
	get modalTitle() {
		return document.getElementById("modalTitle");
	},

	// Fashion modal
	get collectionModal() {
		return document.getElementById("collectionModal");
	},
	get collectionModalClose() {
		return document.getElementById("collectionModalClose");
	},
	get collectionGrid() {
		return document.getElementById("collectionGrid");
	},
	get collectionSearch() {
		return document.getElementById("collectionSearch");
	},
	get collectionSelectAll() {
		return document.getElementById("collectionSelectAll");
	},
	get collectionClearAll() {
		return document.getElementById("collectionClearAll");
	},
	get collectionModalTitle() {
		return document.getElementById("collectionModalTitle");
	},
	get collectionGenderToggle() {
		return document.getElementById("collectionGenderToggle");
	},
	get fashionModal() {
		return document.getElementById("collectionModal");
	},
	get fashionModalClose() {
		return document.getElementById("collectionModalClose");
	},
	get fashionGrid() {
		return document.getElementById("collectionGrid");
	},
	get fashionSearch() {
		return document.getElementById("collectionSearch");
	},
	get fashionSelectAll() {
		return document.getElementById("collectionSelectAll");
	},
	get fashionClearAll() {
		return document.getElementById("collectionClearAll");
	},
	get fashionModalTitle() {
		return document.getElementById("collectionModalTitle");
	},

	// Poke-Amie decorations modal
	get amieDecorModal() {
		return document.getElementById("collectionModal");
	},
	get amieDecorModalClose() {
		return document.getElementById("collectionModalClose");
	},
	get amieDecorGrid() {
		return document.getElementById("collectionGrid");
	},
	get amieDecorSearch() {
		return document.getElementById("collectionSearch");
	},
	get amieDecorSelectAll() {
		return document.getElementById("collectionSelectAll");
	},
	get amieDecorClearAll() {
		return document.getElementById("collectionClearAll");
	},
	get amieDecorModalTitle() {
		return document.getElementById("collectionModalTitle");
	},

	// Medal modal
	get medalsModal() {
		return document.getElementById("collectionModal");
	},
	get medalsModalClose() {
		return document.getElementById("collectionModalClose");
	},
	get medalsSelectAll() {
		return document.getElementById("collectionSelectAll");
	},
	get medalsClearAll() {
		return document.getElementById("collectionClearAll");
	},
	get medalsGrid() {
		return document.getElementById("collectionGrid");
	},
	get medalsModalTitle() {
		return document.getElementById("collectionModalTitle");
	},
	get medalsSearch() {
		return document.getElementById("collectionSearch");
	},
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

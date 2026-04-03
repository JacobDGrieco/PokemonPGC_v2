/**
 * Central DOM references used across the app.
 *
 * All lookups happen once at load time; if you ever render this app into
 * a different container, you may want to re-run these queries.
 */
export const elements = {
	ppgcHomeBtn: document.getElementById("ppgcHomeBtn"),
	ppgcMonInfoBtn: document.getElementById("ppgcMonInfoBtn"),

	// Shell / layout
	elSidebarTitle: document.getElementById("navTitle"),
	elSidebarList: document.getElementById("sideList"),
	elBack: document.getElementById("navBack"),
	elContent: document.getElementById("content"),
	elCrumbs: document.getElementById("crumbs"),

	// Dex modal
	modal: document.getElementById("modal"),
	modalClose: document.getElementById("modalClose"),
	dexGrid: document.getElementById("dexGrid"),
	dexSearch: document.getElementById("dexSearch"),
	dexSelectAll: document.getElementById("dexSelectAll"),
	dexClearAll: document.getElementById("dexClearAll"),
	modalTitle: document.getElementById("modalTitle"),

	// Fashion modal
	fashionModal: document.getElementById("fashionModal"),
	fashionModalClose: document.getElementById("fashionModalClose"),
	fashionGrid: document.getElementById("fashionGrid"),
	fashionSearch: document.getElementById("fashionSearch"),
	fashionSelectAll: document.getElementById("fashionSelectAll"),
	fashionClearAll: document.getElementById("fashionClearAll"),
	fashionModalTitle: document.getElementById("fashionModalTitle"),

	// Medal modal
	medalsModal: document.getElementById("medalsModal"),
	medalsModalClose: document.getElementById("medalsModalClose"),
	medalsSelectAll: document.getElementById("medalsSelectAll"),
	medalsClearAll: document.getElementById("medalsClearAll"),
	medalsGrid: document.getElementById("medalsGrid"),
	medalsModalTitle: document.getElementById("medalsModalTitle"),
	medalsSearch: document.getElementById("medalsSearch"),
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
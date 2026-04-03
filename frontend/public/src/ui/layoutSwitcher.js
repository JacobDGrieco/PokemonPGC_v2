// ui/layoutSwitcher.js

// IMPORTANT: keep these ordered from largest to smallest minWidth
const LAYOUT_BREAKPOINTS = [
	{ name: "desktop", minWidth: 200 },
	{ name: "compact", minWidth: 100 },
	{ name: "phone", minWidth: 0 },
];

let _currentVariant = null;

/**
 * Returns { variants, defaultLayout }
 * - variants: all named layout variants from DATA.layoutVariants
 * - defaultLayout: original DATA.layout (used as last-resort fallback)
 */
function getVariantState() {
	const variants = { ...(window.DATA?.layoutVariants || {}) };
	const defaultLayout = window.DATA?.layout || null;
	return { variants, defaultLayout };
}

/**
 * Choose which variant name to use for a given width,
 * based *only* on the variants that actually exist.
 *
 * Fallback rules:
 * 1. Among defined variants, pick the one with the largest minWidth <= width.
 * 2. If none are <= width, pick the one with the smallest minWidth (global fallback).
 *
 * This effectively means:
 * - If a breakpoint’s variant is missing, it will fall back to the next "lower"
 *   defined variant (smaller minWidth).
 * - If there is no lower one, it will use the smallest one overall.
 */
function pickVariantNameForWidth(width, variants) {
	const definedBps = LAYOUT_BREAKPOINTS.filter(bp => variants[bp.name]);
	if (!definedBps.length) return null;

	// 1) Best candidate: largest minWidth <= width
	let best = null;
	for (const bp of definedBps) {
		if (bp.minWidth <= width) {
			if (!best || bp.minWidth > best.minWidth) {
				best = bp;
			}
		}
	}
	if (best) return best.name;

	// 2) No defined variant is <= width:
	//    use the one with the smallest minWidth overall.
	let lowest = definedBps[0];
	for (const bp of definedBps) {
		if (bp.minWidth < lowest.minWidth) {
			lowest = bp;
		}
	}
	return lowest.name;
}

/**
 * Apply the correct layout for the current window width.
 * Only re-renders when the variant actually changes.
 */
function applyLayoutForWidth(width, renderAll) {
	const { variants, defaultLayout } = getVariantState();

	// If we don't have any variants or default, do nothing.
	if (!Object.keys(variants).length && !defaultLayout) return;

	const wantedName = pickVariantNameForWidth(width, variants);
	let nextLayout = null;
	let chosenName = null;

	if (wantedName && variants[wantedName]) {
		// Ideal match (or its fallback) exists
		nextLayout = variants[wantedName];
		chosenName = wantedName;
	} else if (defaultLayout) {
		// Fall back to the original DATA.layout
		nextLayout = defaultLayout;
		chosenName = "default";
	} else {
		// No usable layout at all
		return;
	}

	if (chosenName === _currentVariant) return; // no change

	_currentVariant = chosenName;

	window.PPGC = window.PPGC || {};
	window.PPGC.currentLayoutVariant = chosenName;

	// CRITICAL: this keeps the rest of your code the same.
	window.DATA.layout = nextLayout;

	if (typeof renderAll === "function") {
		renderAll();
	}
}

/**
 * Small debounce helper so we don't spam re-renders while resizing.
 */
function debounce(fn, delay) {
	let t = null;
	return (...args) => {
		clearTimeout(t);
		t = setTimeout(() => fn(...args), delay);
	};
}

/**
 * Initialize responsive layouts:
 * - Choose initial variant
 * - Re-apply on resize when crossing breakpoints
 */
export function initLayoutSwitcher(renderAll) {
	if (!window || !window.DATA) return;

	const update = () => {
		const w =
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth ||
			0;
		applyLayoutForWidth(w, renderAll);
	};

	// Initial run
	update();

	// Re-run on resize (debounced)
	const onResize = debounce(update, 150);
	window.addEventListener("resize", onResize);
}

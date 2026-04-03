/* Resolve a game's accent color from window.DATA.games. */
export function getGameColor(gameKey, genKey) {
	const gamesByGen = window.DATA?.games || {};

	// Prefer the provided genKey if we have it
	if (genKey && gamesByGen[genKey]) {
		const g = gamesByGen[genKey].find((gg) => gg.key === gameKey);
		if (g?.color) return g.color;
	}

	// Fallback: scan all gens
	for (const [, list] of Object.entries(gamesByGen)) {
		const g = (list || []).find((gg) => gg.key === gameKey);
		if (g?.color) return g.color;
	}

	// Final fallback
	return "#7fd2ff";
}

/**
 * Compute base wheel geometry for a modal dialog.
 * Returned values are intentionally generic so each caller can
 * apply its own radius scaling / oval scaling.
 */
export function layoutWheel(dialogEl, opts = {}) {
	const {
		preferWidth = false, // e.g. dense wheels: priority on width, height can scroll
		sizeCap = 1000,
		shrinkMaxR = false,  // curry / sandwich keep a bit more padding
	} = opts;

	const header = dialogEl.querySelector(".modal-hd");
	const pad = 24;
	const usableW = dialogEl.clientWidth - pad * 2;
	const usableH =
		dialogEl.clientHeight - (header?.offsetHeight || 0) - pad * 2;

	const baseSize = preferWidth ? usableW : Math.min(usableW, usableH);
	const size = Math.max(320, Math.min(sizeCap, baseSize));
	const center = size / 2;

	const maxRBase = shrinkMaxR ? center - 32 : center;
	const maxR = Math.max(80, maxRBase);
	const minR = Math.max(56, size * 0.28);
	const gap = 12;
	const R_BOOST = 1.4;

	return {
		size,
		center,
		maxR,
		minR,
		gap,
		R_BOOST,
		headerH: header?.offsetHeight || 0,
	};
}

/**
 * Shared “electron shell” ring distribution used by every wheel.
 *
 * N <= 8 → 1 ring.
 * N  >  8 → `centerCap` on inner ring, then `ringCap` per additional ring.
 */
export function computeRingCounts(N, centerCap = 2, ringCap = 8) {
	if (N <= 8) return [N];

	const result = [];
	let remaining = N;

	const innerCount = Math.min(centerCap, remaining);
	result.push(innerCount);
	remaining -= innerCount;

	while (remaining > 0) {
		const take = Math.min(ringCap, remaining);
		result.push(take);
		remaining -= take;
	}

	return result;
}

/* Shared radius multiplier based on viewport height & modal type */
export function getRadiusScale(kind) {
	const h =
		window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body?.clientHeight ||
		0;

	if (h && h <= 720) return 1.9;
	if (h && h <= 1080) return 1.5;
	return 1.75;
}

/* Shared card scale */
export function getCardScale(kind) {
	const h =
		window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body?.clientHeight ||
		0;

	if (h && h <= 720) return 0.4;
	if (h && h <= 1080) return 0.65;
	return 1.0;
}

/* Oval scale per modal kind */
export function getOvalScale(kind) {
	const w =
		window.innerWidth ||
		document.documentElement.clientWidth ||
		document.body?.clientWidth ||
		0;
	const h =
		window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body?.clientHeight ||
		0;

	if (!w || !h) return { sx: 1, sy: 1 };

	const aspect = w / h;

	if (h <= 720) {
		if (aspect < 1.2) return { sx: 1, sy: 1 };
		const base = aspect >= 1.6 ? 1.3 : 1.15;
		return { sx: base, sy: 1 / base };
	}
	if (aspect < 1.2) return { sx: 1, sy: 1 };
	const base = aspect >= 1.6 ? 1.15 : 1.05;
	return { sx: base, sy: 1 / base };
}

/**
 * Shared chip scale for all wheels.
 *
 * The base pattern is the same:
 *   - more forms → smaller images
 *   - small dialogs → shrink a bit more
 *
 * Each kind tweaks the behavior a little:
 *   - dex/fashion: use cardScale, mild extra shrink for 4+ rings
 *   - curry/sandwich: simple shrink, no cardScale
 */
export function computeChipScale(kind, n, dialogEl) {
	// Base formula: more forms → smaller img, but less aggressive
	let img = Math.round(118 - Math.max(0, n - 6) * 3);
	img = Math.max(64, Math.min(118, img));

	const box = dialogEl.getBoundingClientRect();
	const minSide = Math.min(box.width, box.height);

	if (kind === "dex" || kind === "fashion") {
		const cardScale = getCardScale(kind);
		img = Math.round(img * cardScale);

		// Estimate rings from same distribution as computeRingCounts
		const ringCounts = computeRingCounts(n);
		const approxRings = ringCounts.length;

		// 4+ rings: only a small extra shrink so they stay readable
		if (approxRings >= 4) {
			img = Math.round(img * 0.95);
		}
	} else if (kind === "curry" || kind === "sandwich") {
		// Simple curry/sandwich chip rule
		if (minSide < 820) {
			img = Math.max(52, img - 6);
		}
	}

	if (minSide < 820) {
		img = Math.max(44, img - 4);
	}

	// Final floor so Alcremie-style sets still fit
	img = Math.max(36, img);

	const font = Math.max(10, Math.round(img * 0.16));
	const pad =
		img >= 90 ? "12px 16px" : img >= 70 ? "10px 12px" : "8px 10px";

	return { img, font, pad };
}

/**
 * Shared setup for the single global forms modal.
 *
 * - Ensures the modal is under <body>
 * - Clears the wheel
 * - Optionally clears any grid overrides
 * - Sets accent color
 * - Sets the header height CSS var
 * - Opens the modal (class + aria + inert)
 *
 * Returns the dialog element (or null if missing).
 */
export function prepFormsModal(formsModal, formsWheel, opts = {}) {
	if (!formsModal || !formsWheel) return null;

	const {
		accent = null,
		clearWheelGridStyles = false,
	} = opts;

	// Move under <body> if it was nested elsewhere
	if (formsModal.parentElement && formsModal.parentElement !== document.body) {
		document.body.appendChild(formsModal);
	}

	if (accent) {
		// Set on both; some CSS reads from the modal, some from inner wheel
		formsModal.style.setProperty("--accent", accent);
		formsWheel.style.setProperty("--accent", accent);
	}

	// Reset wheel content
	formsWheel.innerHTML = "";

	if (clearWheelGridStyles) {
		formsWheel.style.display = "";
		formsWheel.style.gridTemplateColumns = "";
		formsWheel.style.gap = "";
	}

	const dialog = formsModal.querySelector(".modal-dialog");
	const header = dialog?.querySelector(".modal-hd");
	if (dialog && header) {
		dialog.style.setProperty("--hd", `${header.offsetHeight}px`);
	}

	formsModal.removeAttribute("inert");
	formsModal.setAttribute("aria-hidden", "false");
	formsModal.classList.add("open");

	return dialog || null;
}

/**
 * Shared radial wheel positioning for forms chips.
 *
 * This centralizes the math for:
 *  - computing the wheel layout (size / center / radii)
 *  - distributing chips into 1+ rings
 *  - applying oval scaling + alternating ring offset
 *
 * Callers can customize behavior with opts:
 *   - preferWidth / sizeCap / shrinkMaxR → forwarded to layoutWheel
 *   - innerRadiusStrategy(minR, outerR) → computes inner ring radius for multi-ring layouts
 *   - flattenSyForRingsGte (number)     → when ringCount >= N, use sy = 1 (taller ovals)
 *   - extraRingYOffset { from, factor } → from ring index N onward, stretch Y by factor
 */
export function applyRadialLayout(kind, dialogEl, formsWheel, chips, opts = {}) {
	const {
		preferWidth = false,
		sizeCap = 1000,
		shrinkMaxR = false,
		innerRadiusStrategy = null,
		flattenSyForRingsGte = 0,
		extraRingYOffset = null,
	} = opts || {};

	if (!dialogEl || !formsWheel || !Array.isArray(chips) || !chips.length) {
		return;
	}

	const layout = layoutWheel(dialogEl, { preferWidth, sizeCap, shrinkMaxR });
	const { center, maxR, minR, gap, R_BOOST, size } = layout;
	formsWheel.style.setProperty("--size", `${size}px`);

	const N = chips.length;
	const maxChip = Math.max(...chips.map((c) => c.offsetWidth || 80), 80);

	// How much radius we’d “like” based on circumference
	const neededR = (N * (maxChip + gap)) / (2 * Math.PI);
	const rawRadius = neededR * R_BOOST * getRadiusScale(kind);

	const ringCounts = computeRingCounts(N);
	const numRings = ringCounts.length;

	const { sx, sy: syBase } = getOvalScale(kind);
	let sy = syBase;
	if (flattenSyForRingsGte && numRings >= flattenSyForRingsGte) {
		sy = 1;
	}

	// Safe max radius so chips can’t extend past the wheel width
	const usableMaxR = Math.max(minR, maxR - maxChip / 2 - 6);
	const baseRadius = Math.max(minR, Math.min(usableMaxR, rawRadius));

	// --- Special small-shape layouts for Dex/Fashion: 2–7 chips -------------
	// These override the generic single-ring layout to give nice "named"
	// shapes and specific starting positions.
	if ((kind === "dex" || kind === "fashion") && N >= 2 && N <= 7) {
		const radius = baseRadius;
		const rx = radius * sx;
		let ry = radius * sy * (N >= 5 ? 0.8 : 1);

		let angles = [];

		switch (N) {
			case 2:
				// 2 forms: side-by-side horizontally (left, right)
				angles = [Math.PI, 0];
				break;
			case 3:
				// 3 forms: triangle
				// 1st: top, 2nd: lower-left, 3rd: lower-right
				angles = [
					-Math.PI / 2,        // top
					(5 * Math.PI) / 6,   // lower-left
					Math.PI / 6,         // lower-right
				];
				break;
			case 4:
				// 4 forms: square
				// 1st: north, then clockwise (top, right, bottom, left)
				angles = [
					-Math.PI / 2,  // top
					0,             // right
					Math.PI / 2,   // bottom
					Math.PI,       // left
				];
				break;
			case 5:
				// 5 forms: "star" style
				// 1st top, 2nd & 3rd wings, 4th & 5th feet
				angles = [
					-Math.PI / 2,       // top
					-(3 * Math.PI) / 4, // upper-left wing
					-Math.PI / 4,       // upper-right wing
					(3 * Math.PI) / 4,  // lower-left foot
					Math.PI / 4,        // lower-right foot
				];
				break;
			case 6:
				// 6 forms: hexagon
				// 1st: top-left, then roughly clockwise around the ring
				angles = [
					-(3 * Math.PI) / 4, // top-left
					-Math.PI / 2,       // top
					-Math.PI / 4,       // top-right
					Math.PI / 4,        // bottom-right
					Math.PI / 2,        // bottom
					(3 * Math.PI) / 4,  // bottom-left
				];
				break;
			case 7: {
				// 7 forms: octagon with one "spacer"
				// We treat it like an 8-slot ring:
				// slots: 0..7, starting at top-left and going clockwise.
				// We place forms in slots 0..6; slot 7 (left) is the spacer
				const slotAngles = [
					-(3 * Math.PI) / 4, // 0: top-left (1st form)
					-Math.PI / 2,       // 1: top
					-Math.PI / 4,       // 2: top-right
					0,                  // 3: right
					Math.PI / 4,        // 4: bottom-right
					Math.PI / 2,        // 5: bottom
					(3 * Math.PI) / 4,  // 6: bottom-left (7th form)
					Math.PI,            // 7: left (spacer, no form)
				];
				angles = slotAngles.slice(0, 7);
				break;
			}
		}

		// Fallback if something goes weird: generic evenly-spaced ring
		if (!angles.length) {
			angles = chips.map((_, i) => (i / N) * Math.PI * 2 - Math.PI / 2);
		}

		chips.forEach((chip, i) => {
			const a = angles[i] ?? ((i / N) * Math.PI * 2 - Math.PI / 2);
			chip.style.left = `${Math.round(center + rx * Math.cos(a))}px`;
			// <|diff_marker|> ADD A1000
			chip.style.top = `${Math.round(center + ry * Math.sin(a))}px`;
			chip.style.transform = "translate(-50%, -50%)";
			chip.style.position = "absolute";
		});

		return;
	}

	if (numRings === 1) {
		const radius = baseRadius;
		const rx = radius * sx;
		const ry = radius * sy;

		// For Dex / Fashion with small sets, pretend there are 8 “slots”
		// around the ring so we get 7 forms + 1 visual spacer.
		const useEightSlots =
			(kind === "dex" || kind === "fashion") && N <= 7;
		const ringSlots = useEightSlots ? 8 : N;

		chips.forEach((chip, i) => {
			const a = (i / ringSlots) * Math.PI * 2 + Math.PI;
			chip.style.left = `${Math.round(center + rx * Math.cos(a))}px`;
			chip.style.top = `${Math.round(center + ry * Math.sin(a))}px`;
			chip.style.transform = "translate(-50%, -50%)";
			chip.style.position = "absolute";
		});
	} else {
		const outerR = baseRadius;
		const baseInnerR =
			typeof innerRadiusStrategy === "function"
				? innerRadiusStrategy(minR, outerR)
				: Math.max(40, outerR * 0.25);

		const step = numRings > 1 ? (outerR - baseInnerR) / (numRings - 1) : 0;
		const baseRadii = ringCounts.map((_, idx) => baseInnerR + idx * step);

		let idxGlobal = 0;
		ringCounts.forEach((count, ringIdx) => {
			let r = baseRadii[ringIdx];

			// Only puff specific rings for dex/fashion:
			//  - 3 rings: puff the 2nd ring (index 1) a bit
			//  - 4 rings: puff rings 3 and 4 (indexes 2 and 3) a bit
			if (kind === "dex" || kind === "fashion") {
				if (numRings === 3 && ringIdx === 1) {
					r *= 1.06; // 2nd ring slightly outward
				} else if (numRings === 4) {
					if (ringIdx === 0) r *= 0.5; // 1st ring
					if (ringIdx === 1) r *= 0.92; // 2nd ring
					if (ringIdx === 2) r *= 1; // 3rd ring
					if (ringIdx === 3) r *= 1.05; // 4th ring
				}
			}

			// Never exceed safe radius
			r = Math.min(r, usableMaxR);

			const rx = r * sx;

			let ringSy = sy;
			if (
				extraRingYOffset &&
				typeof extraRingYOffset.from === "number" &&
				ringIdx >= extraRingYOffset.from
			) {
				const factor = extraRingYOffset.factor || 1;
				ringSy = sy * factor;
			}
			const ry = r * ringSy;

			for (let j = 0; j < count; j += 1, idxGlobal += 1) {
				const chip = chips[idxGlobal];
				if (!chip) continue;

				const baseAngle = (j / count) * Math.PI * 2 + Math.PI;
				const offset =
					ringIdx % 2 === 1 ? (Math.PI * 2) / (2 * count) : 0;
				const a = baseAngle + offset;

				chip.style.left = `${Math.round(center + rx * Math.cos(a))}px`;
				chip.style.top = `${Math.round(center + ry * Math.sin(a))}px`;
				chip.style.transform = "translate(-50%, -50%)";
				chip.style.position = "absolute";
			}
		});
	}
}

/**
 * Helper to set initial chip scale + schedule a radial layout on next frame,
 * and to create a resize handler that keeps scale + layout in sync.
 *
 * Returns a function suitable to use as a window.resize handler.
 */
export function createWheelResizeHandler(kind, dialogEl, formsWheel, chips, opts = {}) {
	if (!dialogEl || !formsWheel || !Array.isArray(chips) || !chips.length) {
		return () => { };
	}

	// Initial scale + layout
	const initialScale = computeChipScale(kind, chips.length, dialogEl);
	formsWheel.style.setProperty("--form-img", `${initialScale.img}px`);
	formsWheel.style.setProperty("--chip-font", `${initialScale.font}px`);
	formsWheel.style.setProperty("--chip-pad", initialScale.pad);

	requestAnimationFrame(() => {
		applyRadialLayout(kind, dialogEl, formsWheel, chips, opts);
	});

	// Resize handler
	const handler = () => {
		const scale = computeChipScale(kind, chips.length, dialogEl);
		formsWheel.style.setProperty("--form-img", `${scale.img}px`);
		formsWheel.style.setProperty("--chip-font", `${scale.font}px`);
		formsWheel.style.setProperty("--chip-pad", scale.pad);

		applyRadialLayout(kind, dialogEl, formsWheel, chips, opts);
	};

	return handler;
}
import { computeChipScale, computeRingCounts, getOvalScale, getRadiusScale, layoutWheel } from "./modal-geometry.js";

export function prepFormsModal(formsModal, formsWheel, opts = {}) {
	if (!formsModal || !formsWheel) return null;
	const { accent = null, clearWheelGridStyles = false } = opts;
	if (formsModal.parentElement && formsModal.parentElement !== document.body) {
		document.body.appendChild(formsModal);
	}
	if (accent) {
		formsModal.style.setProperty("--accent", accent);
		formsWheel.style.setProperty("--accent", accent);
	}
	formsWheel.innerHTML = "";
	if (clearWheelGridStyles) {
		formsWheel.style.display = "";
		formsWheel.style.gridTemplateColumns = "";
		formsWheel.style.gap = "";
	}
	const dialog = formsModal.querySelector(".modal-dialog");
	const header = dialog?.querySelector(".modal-hd");
	if (dialog && header) dialog.style.setProperty("--hd", `${header.offsetHeight}px`);
	formsModal.removeAttribute("inert");
	formsModal.setAttribute("aria-hidden", "false");
	formsModal.classList.add("open");
	return dialog || null;
}

export function applyRadialLayout(kind, dialogEl, formsWheel, chips, opts = {}) {
	const { preferWidth = false, sizeCap = 1000, shrinkMaxR = false, innerRadiusStrategy = null, flattenSyForRingsGte = 0, extraRingYOffset = null } = opts || {};
	if (!dialogEl || !formsWheel || !Array.isArray(chips) || !chips.length) return;
	const layout = layoutWheel(dialogEl, { preferWidth, sizeCap, shrinkMaxR });
	const { center, maxR, minR, gap, R_BOOST, size } = layout;
	formsWheel.style.setProperty("--size", `${size}px`);
	const N = chips.length;
	const maxChip = Math.max(...chips.map((c) => c.offsetWidth || 80), 80);
	const neededR = (N * (maxChip + gap)) / (2 * Math.PI);
	const rawRadius = neededR * R_BOOST * getRadiusScale(kind);
	const ringCounts = computeRingCounts(N);
	const numRings = ringCounts.length;
	const { sx, sy: syBase } = getOvalScale(kind);
	let sy = syBase;
	if (flattenSyForRingsGte && numRings >= flattenSyForRingsGte) sy = 1;
	const usableMaxR = Math.max(minR, maxR - maxChip / 2 - 6);
	const baseRadius = Math.max(minR, Math.min(usableMaxR, rawRadius));

	if ((kind === "dex" || kind === "fashion") && N >= 2 && N <= 7) {
		const radius = baseRadius;
		const rx = radius * sx;
		let ry = radius * sy * (N >= 5 ? 0.8 : 1);
		let angles = [];
		switch (N) {
			case 2: angles = [Math.PI, 0]; break;
			case 3: angles = [-Math.PI / 2, (5 * Math.PI) / 6, Math.PI / 6]; break;
			case 4: angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI]; break;
			case 5: angles = [-Math.PI / 2, -(3 * Math.PI) / 4, -Math.PI / 4, (3 * Math.PI) / 4, Math.PI / 4]; break;
			case 6: angles = [-(3 * Math.PI) / 4, -Math.PI / 2, -Math.PI / 4, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4]; break;
			case 7: angles = [-(3 * Math.PI) / 4, -Math.PI / 2, -Math.PI / 4, 0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4]; break;
		}
		if (!angles.length) angles = chips.map((_, i) => (i / N) * Math.PI * 2 - Math.PI / 2);
		chips.forEach((chip, i) => {
			const a = angles[i] ?? ((i / N) * Math.PI * 2 - Math.PI / 2);
			chip.style.left = `${Math.round(center + rx * Math.cos(a))}px`;
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
		const useEightSlots = (kind === "dex" || kind === "fashion") && N <= 7;
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
		const baseInnerR = typeof innerRadiusStrategy === "function" ? innerRadiusStrategy(minR, outerR) : Math.max(40, outerR * 0.25);
		const step = numRings > 1 ? (outerR - baseInnerR) / (numRings - 1) : 0;
		const baseRadii = ringCounts.map((_, idx) => baseInnerR + idx * step);
		let idxGlobal = 0;
		ringCounts.forEach((count, ringIdx) => {
			let r = baseRadii[ringIdx];
			if (kind === "dex" || kind === "fashion") {
				if (numRings === 3 && ringIdx === 1) r *= 1.06;
				else if (numRings === 4) {
					if (ringIdx === 0) r *= 0.5;
					if (ringIdx === 1) r *= 0.92;
					if (ringIdx === 3) r *= 1.05;
				}
			}
			r = Math.min(r, usableMaxR);
			const rx = r * sx;
			let ringSy = sy;
			if (extraRingYOffset && typeof extraRingYOffset.from === "number" && ringIdx >= extraRingYOffset.from) {
				ringSy = sy * (extraRingYOffset.factor || 1);
			}
			const ry = r * ringSy;
			for (let j = 0; j < count; j += 1, idxGlobal += 1) {
				const chip = chips[idxGlobal];
				if (!chip) continue;
				const baseAngle = (j / count) * Math.PI * 2 + Math.PI;
				const offset = ringIdx % 2 === 1 ? (Math.PI * 2) / (2 * count) : 0;
				const a = baseAngle + offset;
				chip.style.left = `${Math.round(center + rx * Math.cos(a))}px`;
				chip.style.top = `${Math.round(center + ry * Math.sin(a))}px`;
				chip.style.transform = "translate(-50%, -50%)";
				chip.style.position = "absolute";
			}
		});
	}
}

export function createWheelResizeHandler(kind, dialogEl, formsWheel, chips, opts = {}) {
	if (!dialogEl || !formsWheel || !Array.isArray(chips) || !chips.length) return () => {};
	const initialScale = computeChipScale(kind, chips.length, dialogEl);
	formsWheel.style.setProperty("--form-img", `${initialScale.img}px`);
	formsWheel.style.setProperty("--chip-font", `${initialScale.font}px`);
	formsWheel.style.setProperty("--chip-pad", initialScale.pad);
	requestAnimationFrame(() => applyRadialLayout(kind, dialogEl, formsWheel, chips, opts));
	return () => {
		const scale = computeChipScale(kind, chips.length, dialogEl);
		formsWheel.style.setProperty("--form-img", `${scale.img}px`);
		formsWheel.style.setProperty("--chip-font", `${scale.font}px`);
		formsWheel.style.setProperty("--chip-pad", scale.pad);
		applyRadialLayout(kind, dialogEl, formsWheel, chips, opts);
	};
}

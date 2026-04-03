/* Shared wheel geometry / sizing helpers. */
export function getGameColor(gameKey, genKey) {
	const gamesByGen = window.DATA?.games || {};
	if (genKey && gamesByGen[genKey]) {
		const g = gamesByGen[genKey].find((gg) => gg.key === gameKey);
		if (g?.color) return g.color;
	}
	for (const [, list] of Object.entries(gamesByGen)) {
		const g = (list || []).find((gg) => gg.key === gameKey);
		if (g?.color) return g.color;
	}
	return "#7fd2ff";
}

export function layoutWheel(dialogEl, opts = {}) {
	const { preferWidth = false, sizeCap = 1000, shrinkMaxR = false } = opts;
	const header = dialogEl.querySelector(".modal-hd");
	const pad = 24;
	const usableW = dialogEl.clientWidth - pad * 2;
	const usableH = dialogEl.clientHeight - (header?.offsetHeight || 0) - pad * 2;
	const baseSize = preferWidth ? usableW : Math.min(usableW, usableH);
	const size = Math.max(320, Math.min(sizeCap, baseSize));
	const center = size / 2;
	const maxRBase = shrinkMaxR ? center - 32 : center;
	const maxR = Math.max(80, maxRBase);
	const minR = Math.max(56, size * 0.28);
	const gap = 12;
	const R_BOOST = 1.4;
	return { size, center, maxR, minR, gap, R_BOOST, headerH: header?.offsetHeight || 0 };
}

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

export function getRadiusScale(kind) {
	const h = window.innerHeight || document.documentElement.clientHeight || document.body?.clientHeight || 0;
	if (h && h <= 720) return 1.9;
	if (h && h <= 1080) return 1.5;
	return 1.75;
}

export function getCardScale(kind) {
	const h = window.innerHeight || document.documentElement.clientHeight || document.body?.clientHeight || 0;
	if (h && h <= 720) return 0.4;
	if (h && h <= 1080) return 0.65;
	return 1.0;
}

export function getOvalScale(kind) {
	const w = window.innerWidth || document.documentElement.clientWidth || document.body?.clientWidth || 0;
	const h = window.innerHeight || document.documentElement.clientHeight || document.body?.clientHeight || 0;
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

export function computeChipScale(kind, n, dialogEl) {
	let img = Math.round(118 - Math.max(0, n - 6) * 3);
	img = Math.max(64, Math.min(118, img));
	const box = dialogEl.getBoundingClientRect();
	const minSide = Math.min(box.width, box.height);
	if (kind === "dex" || kind === "fashion") {
		const cardScale = getCardScale(kind);
		img = Math.round(img * cardScale);
		const ringCounts = computeRingCounts(n);
		if (ringCounts.length >= 4) img = Math.round(img * 0.95);
	} else if (kind === "curry" || kind === "sandwich") {
		if (minSide < 820) img = Math.max(52, img - 6);
	}
	if (minSide < 820) img = Math.max(44, img - 4);
	img = Math.max(36, img);
	const font = Math.max(10, Math.round(img * 0.16));
	const pad = img >= 90 ? "12px 16px" : img >= 70 ? "10px 12px" : "8px 10px";
	return { img, font, pad };
}

import { getGameFashion, itemProgressSplit, meterMath } from "./fashion-core.js";

export function fashionPctFor(gameKey, categoryId, store) {
	const cat = getGameFashion(gameKey).find((c) => c.id === categoryId);
	if (!cat) return 0;
	let baseDone = 0, baseTotal = 0;
	for (const it of cat.items) {
		const p = itemProgressSplit(store, gameKey, categoryId, it);
		baseDone += p.baseDone;
		baseTotal += p.baseTotal;
	}
	return baseTotal ? (baseDone / baseTotal) * 100 : 0;
}

export function fashionSummaryCardFor(gameKey, genKey, categoryId, store) {
	const game = (window.DATA.games?.[genKey] || []).find((g) => g.key === gameKey);
	const cat = getGameFashion(gameKey).find((c) => c.id === categoryId);
	if (!cat) return document.createTextNode("");
	let baseDone = 0, baseTotal = 0, extraDone = 0, extraTotal = 0;
	for (const it of cat.items) {
		const p = itemProgressSplit(store, gameKey, categoryId, it);
		baseDone += p.baseDone; baseTotal += p.baseTotal; extraDone += p.extraDone; extraTotal += p.extraTotal;
	}
	const { labelPct, pctBar, pctExtraOverlay, shownDone } = meterMath(baseDone, baseTotal, extraDone, extraTotal);
	const card = document.createElement("article");
	card.className = "card";
	card.dataset.fashionSummary = `${gameKey}:${categoryId}`;
	card.innerHTML = `
		<div class="card-hd">
			<h3>${cat.label} — <span class="small">${game?.label || gameKey}</span></h3>
			<div><button class="button" data-open-fashion>Open ${cat.label}</button></div>
		</div>
		<div class="card-bd">
			<div class="small" data-fashion-summary-text>${shownDone} / ${baseTotal || 0} (${labelPct.toFixed(2)}%)</div>
			<div class="progress ${pctExtraOverlay > 0 ? "has-extra" : ""}">
				<span class="base" data-fashion-summary-bar-base style="width:${pctBar}%"></span>
				<span class="extra" data-fashion-summary-bar-extra style="width:${pctExtraOverlay}%"></span>
				${pctExtraOverlay > 0 ? `<div class="extra-badge" title="Extra credit progress">+${pctExtraOverlay.toFixed(0)}%</div>` : ``}
			</div>
		</div>`;
	card.querySelector("[data-open-fashion]")?.addEventListener("click", () => {
		window.PPGC?.fashionApi?.openFashionModal(gameKey, genKey, categoryId);
	});
	return card;
}

export function createFashionSummaryUpdater(store) {
	return function updateFashionSummaryCard(gameKey, categoryId) {
		const cats = getGameFashion(gameKey);
		const cat = cats.find((c) => c.id === categoryId);
		if (!cat) return;
		let baseDone = 0, baseTotal = 0, extraDone = 0, extraTotal = 0;
		for (const it of cat.items || []) {
			const p = itemProgressSplit(store, gameKey, categoryId, it);
			baseDone += p.baseDone; baseTotal += p.baseTotal; extraDone += p.extraDone; extraTotal += p.extraTotal;
		}
		const { labelPct, pctBar, pctExtraOverlay, shownDone } = meterMath(baseDone, baseTotal, extraDone, extraTotal);
		const key = `${gameKey}:${categoryId}`;
		document.querySelectorAll(`[data-fashion-summary="${key}"]`).forEach((card) => {
			const textEl = card.querySelector("[data-fashion-summary-text]");
			if (textEl) textEl.textContent = `${shownDone} / ${baseTotal || 0} (${labelPct.toFixed(2)}%)`;
			const baseEl = card.querySelector("[data-fashion-summary-bar-base]");
			if (baseEl) baseEl.style.width = `${pctBar}%`;
			const extraEl = card.querySelector("[data-fashion-summary-bar-extra]");
			if (extraEl) extraEl.style.width = `${pctExtraOverlay}%`;
			const prog = card.querySelector(".progress");
			if (prog) prog.classList.toggle("has-extra", pctExtraOverlay > 0);
			const badge = card.querySelector(".extra-badge");
			if (pctExtraOverlay > 0) {
				if (badge) badge.textContent = `+${pctExtraOverlay.toFixed(0)}%`;
				else prog?.insertAdjacentHTML("beforeend", `<div class="extra-badge" title="Extra credit progress">+${pctExtraOverlay.toFixed(0)}%</div>`);
			} else {
				badge?.remove();
			}
		});
	};
}

export function refreshFashionSectionHeader() {
	if (window.PPGC && typeof window.PPGC.refreshSectionHeaderPct === "function") {
		window.PPGC.refreshSectionHeaderPct();
	}
}

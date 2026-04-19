import { _baseModel, _shinyModel } from '../../data/helpers/sprite-models.js';

function inferGenNumber(genKey, gameKey) {
	if (genKey != null) {
		const m = String(genKey).match(/(\d+)/);
		if (m) return Number(m[1]);
	}
	const meta = window.DATA?.games?.[gameKey] || window.DATA?.gameMeta?.[gameKey] || window.DATA?.gameInfo?.[gameKey] || null;
	if (meta?.gen != null) return Number(meta.gen);
	if (meta?.generation != null) return Number(meta.generation);
	return null;
}

function resolveSpriteSources(resolvedInfo = {}) {
	const sprites = resolvedInfo?.sprites || {};
	const has = (k) => Object.prototype.hasOwnProperty.call(sprites, k);
	return {
		front: has("front") ? sprites.front : null,
		back: has("back") ? sprites.back : null,
		icon: has("icon") ? sprites.icon : null,
		menu: has("menu") ? sprites.menu : null,
		frontAnimated: has("frontAnimated") ? sprites.frontAnimated : null,
		backAnimated: has("backAnimated") ? sprites.backAnimated : null,
		frontShiny: has("frontShiny") ? sprites.frontShiny : null,
		backShiny: has("backShiny") ? sprites.backShiny : null,
		iconShiny: has("iconShiny") ? sprites.iconShiny : null,
		frontShinyAnimated: has("frontShinyAnimated") ? sprites.frontShinyAnimated : null,
		backShinyAnimated: has("backShinyAnimated") ? sprites.backShinyAnimated : null,
	};
}

function resolveModelSources({ genKey, gameKey, mon, resolvedInfo } = {}) {
	const genNum = inferGenNumber(genKey, gameKey);
	const allowModels = genNum != null && genNum >= 6;
	if (!allowModels) return { base: null, shiny: null, thumbBase: null, thumbShiny: null };

	const sprites = resolvedInfo?.sprites || resolvedInfo?.spriteSet || {};
	const models = resolvedInfo?.models;
	if (!models || (typeof models === "object" && !Array.isArray(models) && Object.keys(models).length === 0)) {
		return { base: null, shiny: null, thumbBase: null, thumbShiny: null };
	}

	const base = models.base ?? models.model ?? _baseModel(genKey, gameKey, mon.id);
	const shiny = models.shiny ?? models.modelShiny ?? _shinyModel(genKey, gameKey, mon.id);
	const thumbBase = sprites.front ?? models.thumbnail ?? null;
	const thumbShiny = sprites.frontShiny ?? null;
	return { base, shiny, thumbBase, thumbShiny };
}

function renderAssetTile({ label, src, modelUrl, variant }) {
	if (!src) return "";
	const s = String(src);
	const m = modelUrl ? String(modelUrl) : null;
	const isModelFile = /\.(glb|gltf)$/i.test(s);
	const hasViewer = !!m;

	if (isModelFile) {
		return `<div class="asset-tile asset-tile--file"><div class="asset-label">${label}</div><div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center;"><button type="button" class="asset-file" data-open-modelviewer="1" data-model-url="${s.replace(/"/g, "&quot;")}" data-model-variant="${variant || "base"}" data-model-label="${label.replace(/"/g, "&quot;")}">Open Viewer</button><a class="asset-file" href="${s}" target="_blank" rel="noopener">Open model file</a></div><div class="asset-filepath">${s}</div></div>`;
	}

	return `<div class="asset-tile ${hasViewer ? "asset-tile--hasviewer" : ""}">${hasViewer ? `<button type="button" class="asset-openviewer" data-open-modelviewer="1" data-model-url="${m.replace(/"/g, "&quot;")}" data-model-variant="${variant || "base"}" data-model-label="${label.replace(/"/g, "&quot;")}">Open Viewer</button>` : ""}<img src="${s}" alt="${label}" loading="lazy" onerror="window.PPGC?.reportMissingAsset?.('sprites', this.currentSrc || this.src); this.closest('.asset-tile')?.classList?.add('is-missing'); this.remove();" /><div class="asset-label">${label}</div></div>`;
}

export function renderSpritesModels({ genKey, gameKey, mon, resolvedInfo } = {}) {
	const spr = resolveSpriteSources(resolvedInfo);
	const mdl = resolveModelSources({ genKey, gameKey, mon, resolvedInfo });
	const baseTiles = [
		renderAssetTile({ label: "Model", src: mdl.thumbBase || mdl.base, modelUrl: mdl.base, variant: "base" }),
		renderAssetTile({ label: "Front", src: spr.front }),
		renderAssetTile({ label: "Back", src: spr.back }),
		renderAssetTile({ label: "Icon", src: spr.icon }),
		renderAssetTile({ label: "Menu Sprite", src: spr.menu }),
		renderAssetTile({ label: "Front (Animated)", src: spr.frontAnimated }),
		renderAssetTile({ label: "Back (Animated)", src: spr.backAnimated }),
	].filter(Boolean).join("");
	const shinyTiles = [
		renderAssetTile({ label: "Model", src: mdl.thumbShiny || mdl.shiny, modelUrl: mdl.shiny, variant: "shiny" }),
		renderAssetTile({ label: "Front", src: spr.frontShiny }),
		renderAssetTile({ label: "Back", src: spr.backShiny }),
		renderAssetTile({ label: "Icon", src: spr.iconShiny }),
		renderAssetTile({ label: "Menu Sprite", src: spr.menu }),
		renderAssetTile({ label: "Front (Animated)", src: spr.frontShinyAnimated }),
		renderAssetTile({ label: "Back (Animated)", src: spr.backShinyAnimated }),
	].filter(Boolean).join("");
	if (!baseTiles && !shinyTiles) return "";
	return `<div class="mon-info-block mon-info-assets"><h3>Sprites &amp; Models</h3><div class="asset-tabs" role="tablist" aria-label="Sprites and models variants"><button class="asset-tab is-active" type="button" data-assets-tab="base">Base</button><button class="asset-tab" type="button" data-assets-tab="shiny">Shiny</button></div><div class="asset-panels"><div class="asset-panel is-active" data-assets-panel="base"><div class="asset-grid">${baseTiles || `<div class="asset-empty">No base assets configured.</div>`}</div></div><div class="asset-panel" data-assets-panel="shiny"><div class="asset-grid">${shinyTiles || `<div class="asset-empty">No shiny assets configured.</div>`}</div></div></div></div>`;
}

export function wireAssetsTabs(monInfoBody) {
	const root = monInfoBody.querySelector(".mon-info-assets");
	if (!root || root.dataset.wired === "1") return;
	root.dataset.wired = "1";
	const setTab = (key) => {
		root.querySelectorAll(".asset-tab").forEach((b) => b.classList.toggle("is-active", b.dataset.assetsTab === key));
		root.querySelectorAll(".asset-panel").forEach((p) => p.classList.toggle("is-active", p.dataset.assetsPanel === key));
	};
	root.addEventListener("click", (e) => {
		const btn = e.target?.closest?.(".asset-tab");
		if (!btn) return;
		setTab(btn.dataset.assetsTab);
	});
}

export function wireResearchClick({ monInfoBody, canOpenResearch, researchData, researchProg, sourceCard, gameKey, mon } = {}) {
	const researchBtn = monInfoBody.querySelector('[data-pill="research"]');
	if (!researchBtn || researchBtn.dataset.wired) return;
	researchBtn.dataset.wired = "1";
	researchBtn.addEventListener("click", () => {
		if (!canOpenResearch) return;
		const key = typeof researchFromDex === "string" || typeof researchFromDex === "number" ? researchFromDex : researchData?.modalKey || researchData?.researchId || mon.id;
		const opts = { mon, tasks: researchProg?.tasks };
		if (typeof window?.PPGC?.openResearchModal === "function") { window.PPGC.openResearchModal(gameKey, key, opts); return; }
		if (typeof window?.PPGC?.openDexResearchModal === "function") { window.PPGC.openDexResearchModal(gameKey, key, opts); return; }
		if (typeof window?.PPGC?.openResearchTasksModal === "function") { window.PPGC.openResearchTasksModal(gameKey, key, opts); return; }
		const cardBtn = sourceCard?.querySelector?.(".research-launch");
		if (cardBtn) { cardBtn.click(); return; }
		window.dispatchEvent(new CustomEvent("ppgc:openResearchModal", { detail: { gameKey, key, ...opts } }));
		console.warn("[PPGC] Research pill clicked but no modal opener found. Tried PPGC openers, then card .research-launch, then event fallback.", { gameKey, key });
	});
}

export function wireModelViewerClick({ monInfoBody, mon } = {}) {
	if (monInfoBody._modelViewerHandler) {
		monInfoBody.removeEventListener("click", monInfoBody._modelViewerHandler);
	}
	monInfoBody._modelViewerHandler = async (e) => {
		const btn = e.target?.closest?.("[data-open-modelviewer]");
		if (!btn) return;
		const glbUrl = btn.getAttribute("data-model-url");
		const variant = btn.getAttribute("data-model-variant") || "base";
		const label = btn.getAttribute("data-model-label") || "Model";
		if (!glbUrl) return;
		try {
			if (typeof window?.PPGC?.ensureModelViewerLoaded === "function") await window.PPGC.ensureModelViewerLoaded();
		} catch (err) {
			console.debug("[modelViewer] lazy-load failed:", err);
		}
		if (typeof window?.PPGC?.openModelViewerModal === "function") {
			window.PPGC.openModelViewerModal({ title: `${mon.name} — ${label}`, glbUrl, variant });
		} else {
			console.warn("PPGC.openModelViewerModal not found (even after load)");
		}
	};
	monInfoBody.addEventListener("click", monInfoBody._modelViewerHandler);
}

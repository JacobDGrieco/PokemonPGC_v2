import { _assetPath } from '../utils/assetPath.js';
import { _dexIdNumber } from '../../data/helpers/dex-ids.js';
import { resolveMonInfoData } from "./dex-mon-info-data.js";
import { renderCompletionTopHtml, renderEvolutionHtml, renderEvRadar, renderLocationsHtml, renderMovesHtml, renderNotesHtml, renderProfileHtml, renderStatsRadar, renderTypeChart, renderVariantsHtml } from "./dex-mon-info-render.js";
import { renderSpritesModels, wireAssetsTabs, wireModelViewerClick, wireResearchClick } from "./dex-mon-info-assets.js";

export async function renderMonInfoInto({
	gameKey,
	genKey,
	mon,
	formKey = null,
	titleEl = null,
	bodyEl = null,
	sourceCard = null,
} = {}) {
	// Allow page rendering: if caller didn't pass elements, fall back to modal elements.
	const targetTitleEl = titleEl || document.getElementById("monInfoTitle");
	const targetBodyEl = bodyEl || document.getElementById("monInfoBody");

	// If we still don't have a body target, nothing to do.
	if (!targetBodyEl) return;

	// If sourceCard wasn't provided, try to infer it from the invoker.
	const invokerEl = document.activeElement;
	const resolvedSourceCard =
		sourceCard ||
		invokerEl?.closest?.(".card") ||
		document.querySelector(`.card [data-open="monInfo"]`)?.closest?.(".card") ||
		null;

	// Keep legacy variable names so the existing template/wiring code can stay the same.
	const monInfoTitle = targetTitleEl;
	const monInfoBody = targetBodyEl;
	sourceCard = resolvedSourceCard;

	const {
		natId,
		formOpts,
		hasForms,
		effectiveFormKey,
		effectiveInfo,
		fallbackInfo,
		resolvedInfo,
	} = await resolveMonInfoData({ gameKey, mon, formKey });

	const baseStats = resolvedInfo?.baseStats || mon.baseStats || null;
	const expGroup = effectiveInfo?.expGroup || mon.expGroup || null;
	const baseEggSteps = effectiveInfo?.baseEggSteps || mon.baseEggSteps || null;
	if (monInfoTitle) {
		const homeDex = window.DATA?.dex?.home || [];
		const homeEntry =
			(natId != null && homeDex.find((d) => Number(d?.natiId) === Number(natId))) ||
			homeDex.find((d) => Number(d?.natiId) === Number(mon?.natiId)) ||
			homeDex.find((d) => Number(d?.natiId) === Number(mon?.id)) ||
			null;

		monInfoTitle.textContent =
			resolvedInfo?.displayName ||
			mon?.name ||
			homeEntry?.name ||
			(natId != null ? `#${natId}` : `#${mon?.id ?? "??"}`);
	}

	const types = resolvedInfo?.types || mon.types || [];
	const abilities = resolvedInfo?.abilities || [];
	const eggGroups = resolvedInfo?.eggGroups || [];
	const evo = resolvedInfo?.evolution || null;
	const moves = resolvedInfo?.moves || {};
	const locations = resolvedInfo?.locations || [];
	const dexList = window.DATA?.dex?.[gameKey] || [];
	const homeSprite = natId != null ? _assetPath(`sprites/pokemon_home/base-front/${pad4(natId)}.png`) : null;
	const spriteSrc = resolvedInfo?.sprites?.front || homeSprite || mon.img || null;

const statusFromCard = (() => {
		const c = sourceCard;
		if (!c) return null;
		const ds = c.dataset?.status || c.dataset?.dexStatus || c.getAttribute?.("data-status") || c.getAttribute?.("data-dex-status");
		if (ds) return String(ds).toLowerCase();
		const cls = c.classList;
		if (cls.contains("shiny-alpha") || (cls.contains("shiny") && cls.contains("alpha"))) return "shinyalpha";
		if (cls.contains("alpha")) return "alpha";
		if (cls.contains("shiny")) return "shiny";
		if (cls.contains("caught")) return "caught";
		if (cls.contains("seen")) return "seen";
		return null;
	})();

	let statsHtml = "";
	if (baseStats) {
		statsHtml = renderStatsRadar(baseStats);
	}

	const evObj = resolvedInfo?.evYield || null;
	if (evObj) {
		statsHtml += renderEvRadar(evObj);
	}

	const chartHtml = renderTypeChart(types);
	const evoHtml = renderEvolutionHtml(evo, dexList);
	const locationsHtml = renderLocationsHtml({ locations, resolvedInfo });
	const movesHtml = renderMovesHtml({ moves, gameKey });
	const hasInfo = !!resolvedInfo;

		// --- Dex status pill -------------------------------------------------------
	// Prefer real progress if available, but keep this resilient for testing.
	const detectDexStatus = () => {
		const normalize = (raw) => {
			if (!raw) return "unknown";
			const s = String(raw).trim().toLowerCase();

			// allow either "shiny alpha" or "shiny_alpha"
			if ((s.includes("shiny") && s.includes("alpha")) || s === "shiny_alpha")
				return "shinyalpha";
			if (s.includes("alpha")) return "alpha";
			if (s.includes("shiny")) return "shiny";
			if (s.includes("caught")) return "caught";
			if (s.includes("seen")) return "seen";
			if (s.includes("unknown")) return "unknown";
			return "unknown";
		};

		const storeStatusObj = window.store?.getDexStatus?.(gameKey, mon.id);
		if (storeStatusObj?.status != null) {
			return normalize(storeStatusObj.status);
		}

		return "unknown";
	};

	const dexStatus = statusFromCard || detectDexStatus();

	const dexStatusLabel = (() => {
		// show the current status instead of "Dex Entry"
		if (dexStatus === "unknown") return "Unknown";
		if (dexStatus === "seen") return "Seen";
		if (dexStatus === "caught") return "Caught";
		if (dexStatus === "shiny") return "Shiny";
		if (dexStatus === "alpha") return "Alpha";
		if (dexStatus === "shinyalpha") return "Shiny Alpha";
		return "Unknown";
	})();

	const dexStatusClass = `is-status-${dexStatus}`;

	// --- Research pill ---------------------------------------------------------
	// "Pull from the dex and pull any research task for that id number"
	// For now, we treat "research tasks exist" as:
	// - dex entry has researchTasks / research / researchId / researchKey / etc.
	// - or you have a window.DATA.research bucket (optional)
	const researchData = window.DATA?.research?.[gameKey]?.[mon.id] || null;
	const isLegendsArceus = gameKey === "legendsarceus";

	const getResearchProgress = () => {
		const tasks = Array.isArray(researchData?.tasks) ? researchData.tasks : null;
		const byGame =
			window.store?.dexResearchStatus instanceof Map
				? window.store.dexResearchStatus.get(gameKey)
				: null;

		const byPLA =
			window.store?.dexResearchStatus instanceof Map
				? window.store.dexResearchStatus.get("legendsarceus")
				: null;

		// This is the actual saved per-task slider level map: rec[taskIdx] = level
		const rec =
			(byGame && byGame[String(mon.id)]) ||
			(byPLA && byPLA[String(mon.id)]) ||
			{};

		// Tier-based stats
		let totalTiers = 0;
		let doneTiers = 0;
		let levelPoints = 0;

		if (Array.isArray(tasks) && tasks.length) {
			tasks.forEach((t, idx) => {
				const tiers = Array.isArray(t?.tiers) ? t.tiers : [];
				const steps = tiers.length || 0;

				totalTiers += steps;

				const raw = rec[idx];
				const lvl = typeof raw === "number" ? raw : raw ? steps : 0; // legacy true => full
				const clamped = Math.max(0, Math.min(steps, lvl));

				doneTiers += clamped;
				levelPoints += clamped * (t?.boost ? 2 : 1);
			});
		}

		const researchLevel = Math.min(10, levelPoints);
		const allComplete = totalTiers > 0 && doneTiers >= totalTiers;

		return {
			tasks,
			rec,
			totalTiers,
			doneTiers,
			levelPoints,
			researchLevel,
			allComplete,
		};
	};

	const researchProg = getResearchProgress();

	// clickable if we actually have tasks (even if opener isn’t wired yet)
	const canOpenResearch = isLegendsArceus && (!!researchProg?.tasks || researchData != null);

	// Determine research state colors:
	// - red if not completed
	// - green if >= 10 slider positions completed
	// - gold if all completed
	const getResearchState = () => {
		if (!isLegendsArceus) return "off";
		if (!researchProg.tasks) return "off";

		if (researchProg.allComplete) return "gold";
		if (Number(researchProg.researchLevel || 0) >= 10) return "green";
		return "red";
	};

	const researchState = getResearchState();
	const completionTopHtml = renderCompletionTopHtml({
		gameKey,
		mon,
		resolvedInfo,
		dexStatusClass,
		dexStatusLabel,
		researchProg,
		researchState,
		canOpenResearch,
		isLegendsArceus,
	});

	const variantsHtml = renderVariantsHtml(resolvedInfo);
	const notesHtml = renderNotesHtml(resolvedInfo);
	const assetsHtml = resolvedInfo
		? renderSpritesModels({ genKey, gameKey, mon, resolvedInfo })
		: "";
	const profileHtml = renderProfileHtml({
		resolvedInfo,
		fallbackInfo,
		abilities,
		eggGroups,
		expGroup,
		baseEggSteps,
	});

	const quickStatsHtml = completionTopHtml;

		monInfoBody.innerHTML = `
	<div class="mon-info-header">
	  ${spriteSrc
			? `<div class="mon-info-sprite">
		  <img src="${spriteSrc}" alt="${mon.name}" loading="lazy" />
		</div>`
			: ""
		}
	  <div class="mon-info-main">
		<div class="mon-info-topline">
		  <div class="mon-info-basic">
			<div class="mon-info-name">
			  #${String(natId != null ? natId : (_dexIdNumber(mon.id, mon.localId) ?? '')).padStart(4, "0")} — ${mon.name}
			</div>
			<div class="mon-info-types">
			  ${(types || [])
			.map(
				(t) =>
					`<span class="type-pill type-${String(
						t
					).toLowerCase()}">${t}</span>`
			)
			.join("")}
			</div>
			${hasForms ? `
			<div class="mon-info-form">
			  <select id="monInfoFormSelect" class="mon-info-form-select">
				<option value="" ${!formKey ? "selected" : ""}></option>
				${formOpts.map(o =>
				`<option value="${o.key}" ${formKey === o.key ? "selected" : ""}>${o.label}</option>`
			).join("")}
			  </select>
			</div>
			` : ""
		}
		  </div>
		  ${quickStatsHtml
			? `<div class="mon-info-quickstats">${quickStatsHtml}</div>`
			: ""
		}
		</div>
	  </div>
	</div>

	${resolvedInfo?.flavor
			? `<div class="mon-info-block mon-info-flavor">${resolvedInfo.flavor}</div>`
			: ""
		}

	<div class="mon-info-layout">
	  <aside class="mon-info-col mon-info-col--summary">
		${chartHtml}
		${statsHtml}
		${notesHtml}
	  </aside>

	  <section class="mon-info-col mon-info-col--details">
		${profileHtml}
		${variantsHtml}
		${evoHtml}
		${locationsHtml}
		${movesHtml ||
		(hasInfo
			? ""
			: `<div class="mon-info-empty">No move data defined yet for this game.</div>`)
		}
		</section>
	</div>

	${assetsHtml}

	${!hasInfo
			? `<div class="mon-info-empty">
		  No local <code>monInfo</code> entry is configured yet for this Pokémon in <strong>${gameKey}</strong>. Showing PokéAPI fallback data when available.
		</div>`
			: ""
		}
  `;

	// Wire form select (works for modal + page render targets)
	const formSel = monInfoBody.querySelector("#monInfoFormSelect");
	if (formSel) {
		formSel.onchange = async () => {
			const chosen = formSel.value || null;

			// preserve scroll position (nice for long info cards)
			const prevScroll = monInfoBody.scrollTop;

			await renderMonInfoInto({
				gameKey,
				genKey,
				mon,
				formKey: chosen, // null => blank UI, but will load first form silently
				titleEl,
				bodyEl,
				sourceCard,
			});

			monInfoBody.scrollTop = prevScroll;
		};
	}

	wireAssetsTabs(monInfoBody);
	wireResearchClick({ monInfoBody, canOpenResearch, researchData, researchProg, sourceCard, gameKey, mon });
	wireModelViewerClick({ monInfoBody, mon });
}

export async function openMonInfo(gameKey, genKey, mon) {
	const monInfoModal = document.getElementById("monInfoModal");
	const monInfoTitle = document.getElementById("monInfoTitle");
	const monInfoBody = document.getElementById("monInfoBody");

	if (!monInfoModal || !monInfoBody) return;

	// Capture the element that opened the modal (usually inside the dex card)
	const invokerEl = document.activeElement;

	// Try to find the dex card we came from
	const sourceCard =
		invokerEl?.closest?.(".card") ||
		document.querySelector(`.card [data-open="monInfo"]`)?.closest?.(".card") ||
		null;

	await renderMonInfoInto({
		gameKey,
		genKey,
		mon,
		titleEl: monInfoTitle,
		bodyEl: monInfoBody,
		sourceCard,
	});

	monInfoModal.classList.add("open");
	monInfoModal.setAttribute("aria-hidden", "false");
	monInfoModal.dataset.gameKey = gameKey;
	monInfoModal.dataset.monId = String(mon.id);
}

export function setupMonInfoModal() {
	const monInfoModal = document.getElementById("monInfoModal");
	const monInfoClose = document.getElementById("monInfoClose");
	if (!monInfoModal) return;

	const close = () => {
		monInfoModal.classList.remove("open");
		monInfoModal.setAttribute("aria-hidden", "true");
	};

	// Wire close handlers once per page load (prevents duplicate listeners on repeated opens)
	if (monInfoModal.dataset.wired !== "1") {
		monInfoModal.dataset.wired = "1";

		// ✅ click outside (backdrop) closes modal
		monInfoModal.addEventListener("click", (e) => {
			if (e.target === monInfoModal) close();
		});

		monInfoClose?.addEventListener("click", close);

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && monInfoModal.classList.contains("open")) {
				close();
			}
		});
	}

	if (!window.__PPGC_MONINFO_RESEARCH_WIRED) {
		window.__PPGC_MONINFO_RESEARCH_WIRED = true;

		window.addEventListener("ppgc:researchSaved", (e) => {
			const detail = e?.detail || {};
			const monInfoModal = document.getElementById("monInfoModal");
			const monInfoBody = document.getElementById("monInfoBody");
			if (!monInfoModal || !monInfoBody) return;
			if (!monInfoModal.classList.contains("open")) return;

			// Only update if the current mon matches
			const currentGame = monInfoModal.dataset.gameKey;
			const currentMonId = monInfoModal.dataset.monId;

			if (String(detail.gameKey) !== String(currentGame)) return;
			if (String(detail.monId) !== String(currentMonId)) return;

			const btn = monInfoBody.querySelector('[data-pill="research"]');
			const sub = btn?.querySelector(".pill-sub");
			if (!btn || !sub) return;

			const stats = detail.stats || {};
			const lvl = Number(stats.researchLevel || 0);

			sub.textContent = `${lvl}`;

			btn.classList.remove("is-red", "is-green", "is-gold", "is-off");
			if (stats.allComplete) btn.classList.add("is-gold");
			else if (lvl >= 10) btn.classList.add("is-green");
			else btn.classList.add("is-red");
		});
	}
}

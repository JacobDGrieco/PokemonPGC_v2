import { save } from "../store.js";
import {
	asList,
	formatDateRange,
	normalizeBall,
	normalizeIdList,
	normalizeMoves,
	normalizeNameImgList,
	normalizeRegions,
	normalizeRibbons,
	parseToISOParts,
	renderDistBadges,
	renderGenderSymbols,
	resolveMaybeFn,
	splitRegionsForDisplay,
} from "./distributions-normalize.js";

function sortedDistributionsFor(gameKey) {
	return (window.DATA?.distributions?.[gameKey] || [])
		.filter(Boolean)
		.slice()
		.sort((a, b) => {
			// start-date can be in "start-date" or "start"
			const ad = parseToISOParts(a?.["start-date"] ?? a?.start ?? null);
			const bd = parseToISOParts(b?.["start-date"] ?? b?.start ?? null);

			// 1) newest -> oldest when start-date exists
			if (ad && bd) return (+bd) - (+ad);

			// 2) items WITH a start-date come before items WITHOUT one
			if (ad && !bd) return -1;
			if (!ad && bd) return 1;

			// 3) fallback: id highest -> lowest
			const ai = Number(a?.id);
			const bi = Number(b?.id);
			const aOk = Number.isFinite(ai);
			const bOk = Number.isFinite(bi);
			if (aOk && bOk) return bi - ai;
			if (aOk && !bOk) return -1;
			if (!aOk && bOk) return 1;

			return 0;
		});
}

/* ===================== Section meter ===================== */

/**
 * Compute completion percent for the Distributions section in a game:
 * (#checked / #total) * 100.
 */
export function distributionsPctFor(gameKey) {
	const list = sortedDistributionsFor(gameKey);
	const total = list.length;
	if (!total) return 0;

	// status record: { [distId]: true }
	const statusMap =
		(window.store?.distributionsStatus instanceof Map
			? window.store.distributionsStatus.get(gameKey)
			: null) || {};

	let done = 0;
	for (const it of list) {
		const id = String(it.id);
		if (statusMap[id]) done++;
	}
	return (done / total) * 100;
}

/* ===================== Card renderer ===================== */

/**
 * Render the Distribution cards grid for a given game.
 *
 * - gameKey: current game (e.g. "legendsza")
 * - genKey : currently unused, reserved for future filtering/grouping
 * - store  : main store (for distributionsStatus + saving)
 * - opts   : { region?: string } optional region filter ("all" or specific)
 */
export function renderDistributionCardsFor(gameKey, genKey, store, opts = {}) {
	const wrap = document.createElement("div");
	wrap.className = "dist-grid";
	const rawList = sortedDistributionsFor(gameKey);

	const selected = opts.region;

	const hasFilterArray =
		Array.isArray(selected) &&
		selected.length &&
		!selected.includes("all");

	const hasFilterString =
		typeof selected === "string" &&
		selected.trim().toLowerCase() !== "all";

	let list = rawList;
	if (hasFilterArray || hasFilterString) {
		const wanted = hasFilterArray
			? selected
				.map((x) => x.toString().trim().toLowerCase())
				.filter(Boolean)
			: [selected.toString().trim().toLowerCase()];

		list = rawList.filter((d) => {
			const regions = normalizeRegions(d.region || d.regions);
			if (!regions.length) return false;

			// If Region Free is one of the tags, always include this event
			if (regions.includes("region free")) return true;

			// Otherwise, match if any region on the event is in the selected set
			return regions.some((r) => wanted.includes(r));
		});
	}

	// read current status bucket for this game
	const bucket =
		(store.distributionsStatus instanceof Map
			? store.distributionsStatus.get(gameKey)
			: null) || {};

	const setChecked = (distId, val) => {
		const rec =
			(store.distributionsStatus instanceof Map
				? store.distributionsStatus.get(gameKey)
				: null) || {};
		rec[String(distId)] = !!val;
		if (store.distributionsStatus instanceof Map) {
			store.distributionsStatus.set(gameKey, rec);
		}
		save();
		// keep header progress fresh
		window.PPGC?.refreshSectionHeaderPct?.();
	};

	const fmt = (v) => (v == null || v === "" ? "—" : String(v));
	const imgOnErr = (img) =>
		img && img.addEventListener("error", () => img.remove());

	for (const d of list) {
		const ctx = { gameKey, genKey };

		const checked = !!bucket[String(d.id)];
		const card = document.createElement("article");
		card.className = "dist-card" + (checked ? " is-done" : "");
		card.setAttribute("role", "group");
		card.setAttribute(
			"aria-label",
			d?.name || d?.pokemon || "Distribution"
		);

		// Pull fields up front
		const evtTitle = d.eventTitle || "";
		const rawRegions = d.region || d.regions || null;
		const regionTokens = splitRegionsForDisplay(rawRegions);
		let imgSrc = d?.img ?? "";
		imgSrc = resolveMaybeFn(imgSrc, ctx);
		const gender = d.gender ?? d.sex;
		const startRaw = d["start-date"] ?? d.start ?? null;
		const endRaw = d["end-date"] ?? d.end ?? null;
		const dateLine =
			formatDateRange({ start: startRaw, end: endRaw }) ||
			formatDateRange(d.dates || d.date);

		const ballNorm = normalizeBall(d.ball || null, ctx);
		const ribbonsNorm = normalizeRibbons(d.ribbons || null, ctx);
		const otList = asList(d.ot);
		const idList = normalizeIdList(d.tid ?? d.idno ?? d.id);
		const abilityList = asList(d.ability);
		const natureList = asList(d.nature);
		const heldList = normalizeNameImgList(d.heldItem || null, ctx);
		const movesNorm = normalizeMoves(d.moves, ctx);
		const extraLines = Array.isArray(d.extra)
			? d.extra
			: d.extra
				? [d.extra]
				: [];

		card.innerHTML = `
		<div class="dist-event-row">
        <div class="dist-event-title" title="${evtTitle}">${evtTitle}</div>
        ${regionTokens.length
				? `<div class="dist-region-list">
              ${regionTokens
					.map(
						(r) =>
							`<span class="dist-region-pill">${fmt(r)}</span>`
					)
					.join("")}
            </div>`
				: ""
			}
      </div>

      <div class="dist-hd">
        <div class="dist-hd-left">
          <div class="dist-name">
            ${fmt(d.name || d.pokemon)}
            <span class="dist-gender">${renderGenderSymbols(gender)}</span>
          </div>
        </div>

        <div class="dist-hd-center">
          ${dateLine ? `<div class="dist-dates">${dateLine}</div>` : ``}
        </div>

        <div class="dist-hd-right dist-badges">
          ${ballNorm.img
				? `<img class="badge ball" alt="${fmt(
					ballNorm.name
				)}" title="${fmt(ballNorm.name)}" src="${ballNorm.img}">`
				: ballNorm.name
					? `<span class="badge ball-label">${fmt(ballNorm.name)}</span>`
					: ""
			}
          ${ribbonsNorm
				.map((r) =>
					r.img
						? `<img class="badge ribbon" alt="${fmt(
							r.name
						)}" title="${fmt(r.name)}" src="${r.img}">`
						: `<span class="badge ribbon-label">${fmt(r.name)}</span>`
				)
				.join("")}
        </div>
      </div>

      <div class="dist-body">
        <div class="dist-img">
          ${imgSrc
				? `<img alt="${fmt(d.name || d.pokemon)}" src="${imgSrc}">`
				: ""
			}
          ${renderDistBadges(d)}
        </div>

        <div class="dist-specs-wrap">
          <dl class="dist-specs">
            <div><dt>Level</dt><dd>${fmt(d.level)}</dd></div>
            <div>
			<dt>Ability</dt>
			<dd>${abilityList.length
				? abilityList
					.map(
						(o) =>
							`<span class="tag ot">${fmt(o)}</span>`
					)
					.join("")
				: "—"
			}</dd>
			</div>

            <div>
              <dt>OT</dt>
              <dd>${otList.length
				? otList
					.map(
						(o) =>
							`<span class="tag ot">${fmt(o)}</span>`
					)
					.join("")
				: "—"
			}</dd>
            </div>

            <div>
              <dt>Nature</dt>
              <dd>${natureList.length
				? natureList
					.map(
						(o) =>
							`<span class="tag ot">${fmt(o)}</span>`
					)
					.join("")
				: "—"
			}</dd>
            </div>

            <div>
              <dt>ID</dt>
              <dd>${idList.length
				? idList
					.map(
						(id) =>
							`<span class="tag tid">${fmt(id)}</span>`
					)
					.join("")
				: "—"
			}</dd>
            </div>

            <div>
              <dt>Held Item</dt>
              <dd class="held-items" style="flex-direction: row;">
                ${heldList.length
				? heldList
					.map((h) =>
						h.img
							? `<img class="held-item-img" alt="${fmt(
								h.name
							)}" title="${fmt(
								h.name
							)}" src="${h.img}">`
							: `<span class="tag item">${fmt(
								h.name
							)}</span>`
					)
					.join("")
				: "—"
			}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      ${movesNorm.length
				? `
        <div class="dist-moves diamond" style="margin: 20px 0px;">
          ${[0, 1, 2, 3]
					.map((i) => {
						const mv = movesNorm[i];
						if (!mv) return `<div class="mv"></div>`;
						const typeClass = mv.type
							? ` type-${String(mv.type).toLowerCase()}`
							: "";
						return `
      <div class="mv${typeClass}" ${mv.type ? `data-type="${mv.type}"` : ""}>
        ${mv.img
								? `<img alt="${fmt(mv.name || "Move")}" title="${fmt(
									mv.name
								)}" src="${mv.img}">`
								: `<span class="mv-label">${fmt(mv.name)}</span>`
							}
      </div>`;
					})
					.join("")}
        </div>`
				: ""
			}

      <div class="dist-details" style="margin: 10px 0px;">
        ${d.details
				? `<div class="line" style="margin-bottom: 20px;">${fmt(
					d.details
				)}</div>`
				: ""
			}
        ${extraLines
				.map((t) => `<div class="line small">${fmt(t)}</div>`)
				.join("")}
      </div>

      <button class="dist-toggle" aria-pressed="${checked ? "true" : "false"
			}">
        ${checked ? "Uncheck" : "Check"}
      </button>
    `;

		// image error handling + toggle behavior
		const img = card.querySelector(".dist-img img");
		imgOnErr(img);

		const btn = card.querySelector(".dist-toggle");
		btn.addEventListener("click", () => {
			const next = !(btn.getAttribute("aria-pressed") === "true");
			btn.setAttribute("aria-pressed", String(next));
			btn.textContent = next ? "Uncheck" : "Check";
			card.classList.toggle("is-done", next);
			setChecked(d.id, next);
		});

		wrap.appendChild(card);
	}

	// Empty state
	if (!list.length) {
		const empty = document.createElement("div");
		empty.className = "small";
		empty.style.opacity = ".8";
		empty.textContent = "No distributions defined for this game.";
		wrap.appendChild(empty);
	}

	return wrap;
}

/* ===================== Section meter hook ===================== */

/**
 * Attach a meter so Distributions can contribute to section progress rings.
 */
(function attachSectionMeter() {
	window.PPGC = window.PPGC || {};
	const meter = (sectionObj, gameKey) => {
		const title = (sectionObj?.title || "").trim().toLowerCase();
		if (title !== "distributions") return null;
		return distributionsPctFor(gameKey);
	};
	(window.PPGC.sectionMeters = window.PPGC.sectionMeters || []).push(meter);
})();

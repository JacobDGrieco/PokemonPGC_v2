// src/distributions.js
import { save } from "../store.js";

/* ===================== Normalization helpers ===================== */

function resolveMaybeFn(v, ctx) {
	if (typeof v !== "function") return v;

	// Try common patterns:
	// 1) () => "path"
	try {
		const a = v();
		if (typeof a === "string") return a;
	} catch { }

	// 2) ({ gameKey, genKey }) => "path"
	try {
		const b = v(ctx);
		if (typeof b === "string") return b;
	} catch { }

	// 3) (gameKey, genKey) => "path"
	try {
		const c = v(ctx?.gameKey, ctx?.genKey);
		if (typeof c === "string") return c;
	} catch { }

	return "";
}

// Normalize region field into a list of lowercase keys
const normalizeRegions = (val) => {
	if (!val) return [];
	if (Array.isArray(val)) {
		return val
			.map((x) => x && x.toString().trim().toLowerCase())
			.filter(Boolean);
	}
	// allow comma/ampersand/slash separated strings
	return val
		.toString()
		.split(/[,&/]/)
		.map((x) => x.trim().toLowerCase())
		.filter(Boolean);
};

const splitRegionsForDisplay = (val) => {
	if (!val) return [];
	if (Array.isArray(val)) {
		return val.map((x) => String(x).trim()).filter(Boolean);
	}
	return String(val)
		.split(/[,&/]/) // supports "UK, Norway / Denmark"
		.map((x) => x.trim())
		.filter(Boolean);
};

const GENDER = {
	male: "♂",
	female: "♀",
};
/**
 * Normalize a raw gender value into a display symbol string.
 * Accepts things like "male"/"m"/"♂", "female"/"f"/"♀", "mf"/"both".
 */
function renderGenderSymbols(raw) {
	const v = (raw ?? "").toString().trim().toLowerCase();
	if (!v) return "";
	if (v === "male" || v === "m" || v === "♂") return GENDER.male;
	if (v === "female" || v === "f" || v === "♀") return GENDER.female;
	if (v === "mf" || v === "fm" || v === "both" || v === "m/f" || v === "f/m") {
		return `${GENDER.male}${GENDER.female}`;
	}
	return ""; // unknown/none
}

/**
 * Render shiny/alpha badges for a distribution record.
 * Uses the same global marks as the Dex (window.DATA.marks).
 *
 * Data flags:
 *   - shiny: true/false
 *   - alpha: true/false
 */
function renderDistBadges(record) {
	const marks = window.DATA?.marks || {};
	const bits = [];

	if (record?.shiny && marks.shiny) {
		bits.push(
			`<img src="${marks.shiny}" alt="Shiny Badge" class="dist-mark" />`
		);
	}
	if (record?.alpha && marks.alpha) {
		bits.push(
			`<img src="${marks.alpha}" alt="Alpha Badge" class="dist-mark" />`
		);
	}

	if (!bits.length) return "";
	// reuse global .badges shell so Dex CSS still applies
	return `<div class="badges dist-marks">${bits.join("")}</div>`;
}


/**
 * Normalize moves: accepts ["Psychic", ...] or [{name, img, type}, ...].
 */
function normalizeMoves(moves, ctx) {
	return (Array.isArray(moves) ? moves : [])
		.filter(Boolean)
		.map((m) => {
			if (typeof m === "string") return { name: m, img: null, type: null };
			return {
				name: m.name,
				img: resolveMaybeFn(m.img || null, ctx) || null,
				type: m.type || null,
			};
		});
}

/**
 * Normalize ball: string OR { name, img } → { name, img }.
 */
function normalizeBall(ball, ctx) {
	if (!ball) return { name: "", img: null };
	if (typeof ball === "string") return { name: ball, img: null };
	const img = resolveMaybeFn(ball.img || null, ctx);
	return { name: ball.name || "", img: img || null };
}

/**
 * Normalize ribbons: array of string OR array of {name,img}.
 */
function normalizeRibbons(ribbons, ctx) {
	return (Array.isArray(ribbons) ? ribbons : [])
		.filter(Boolean)
		.map((r) =>
			typeof r === "string"
				? { name: r, img: null }
				: { name: r.name, img: resolveMaybeFn(r.img || null, ctx) || null }
		);
}

/**
 * Small helper: flatten value → array.
 * - null/undefined → []
 * - array → filtered array
 * - other → [value]
 */
function asList(v) {
	if (v == null) return [];
	return Array.isArray(v) ? v.filter(Boolean) : [v];
}

/**
 * Normalize values to { name, img } records:
 * - strings → {name, img:null}
 * - objects → {name, img}
 */
function normalizeNameImgList(v, ctx) {
	return asList(v).map((x) =>
		typeof x === "string"
			? { name: x, img: null }
			: {
				name: x.name || "",
				img: resolveMaybeFn(x.img || null, ctx) || null,
			}
	);
}

/**
 * Normalize ID/TID list:
 * - "240101", ["240101", "777777"], or {value:"240101"} → ["240101", ...]
 */
function normalizeIdList(v) {
	return asList(v)
		.map((x) => {
			if (typeof x === "string" || typeof x === "number") return String(x);
			if (x && typeof x === "object" && ("value" in x || "id" in x)) {
				return String(x.value ?? x.id);
			}
			return String(x ?? "");
		})
		.filter(Boolean);
}

/* ===================== Date parsing / formatting ===================== */

/**
 * Parse a "YYYY-MM-DD" (or other parseable) date string into a Date in UTC.
 */
function parseToISOParts(s) {
	if (!s) return null;
	const str = String(s).trim();

	// If it's YYYY-MM-DD, build a UTC date to avoid TZ shifts
	const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (m) {
		const y = +m[1],
			mo = +m[2] - 1,
			d = +m[3];
		return new Date(Date.UTC(y, mo, d));
	}

	// Fallback to native parsing
	const dt = new Date(str);
	return isNaN(+dt) ? null : dt;
}

/**
 * Format a Date as "MMM DD, YYYY" in UTC.
 */
function fmtMMMDDYYYY(dt) {
	return dt.toLocaleDateString(undefined, {
		month: "short",
		day: "2-digit",
		year: "numeric",
		timeZone: "UTC", // avoid TZ shifts
	});
}

/**
 * Accept either:
 *   - {start:"YYYY-MM-DD", end:"YYYY-MM-DD"|"onwards"}
 *   - legacy strings like "2025-01-01 → 2025-02-29"
 * and return a prettified "MMM DD, YYYY → MMM DD, YYYY" (or similar) string.
 */
function formatDateRange(raw) {
	if (!raw) return "";

	// New object shape (preferred)
	if (raw && typeof raw === "object" && ("start" in raw || "end" in raw)) {
		const a = raw.start ? parseToISOParts(raw.start) : null;
		const endVal = raw.end;
		const isOnwards =
			typeof endVal === "string" && endVal.trim().toLowerCase() === "onwards";
		const b = !isOnwards && endVal ? parseToISOParts(endVal) : null;

		if (a && isOnwards) return `${fmtMMMDDYYYY(a)} → onwards`;
		if (a && b) return `${fmtMMMDDYYYY(a)} → ${fmtMMMDDYYYY(b)}`;
		if (a) return `${fmtMMMDDYYYY(a)}`;
		if (b) return `${fmtMMMDDYYYY(b)}`;
		return "";
	}

	// Legacy string like "2025-01-01 → 2025-02-29"
	const m = String(raw).match(/(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})/);
	if (m) {
		const a = parseToISOParts(m[1]);
		const b = parseToISOParts(m[2]);
		if (a && b) return `${fmtMMMDDYYYY(a)} → ${fmtMMMDDYYYY(b)}`;
	} else {
		const d = parseToISOParts(String(raw).trim());
		if (d) return fmtMMMDDYYYY(d);
	}
	return String(raw);
}

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

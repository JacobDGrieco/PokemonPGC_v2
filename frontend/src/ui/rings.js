/**
 * Ensure the golden "extra credit" ring CSS is injected once.
 */
let _ringCssInjected = false;

function ensureRingCssInjected() {
	if (_ringCssInjected) return;
	_ringCssInjected = true;

	if (document.getElementById("ppgc-ring-gold-css")) return;

	const style = document.createElement("style");
	style.id = "ppgc-ring-gold-css";
	document.head.appendChild(style);
}

/**
 * Create a circular progress element using an image:
 *
 * - progressPct: numeric value; 0–100 controls the radial color wipe.
 * - Values >100 enable a golden halo and +XX% badge (capped at +100%).
 * - labelText: text shown under the circle.
 * - opts.img: optional image path for the game (e.g. "../imgs/games/ruby.png").
 */
export function ring(progressPct, labelText, opts = {}) {
	const { img } = opts || {};

	const num = Number(progressPct);
	const pctRaw = Math.max(0, Number.isFinite(num) ? num : 0); // may exceed 100
	const pctForArc = Math.min(100, pctRaw);

	const hasExtra = pctRaw > 100;
	const extraPct = hasExtra ? Math.min(100, pctRaw - 100) : 0;

	// Angle for the conic-gradient mask (0–360deg)
	const angle = ((pctForArc / 100) * 360);

	ensureRingCssInjected();

	const el = document.createElement("div");
	el.className = "ring" + (hasExtra ? " has-extra" : "");

	// Used by CSS mask to determine how much color to show
	el.style.setProperty("--ring-angle", angle.toFixed(2) + "deg");

	// If we have an image, set it on the ring box via --ring-img
	const boxStyle = img ? ` style="--ring-img: url('${img}')" ` : "";

	const imgLayersHtml = img
		? `
        <div class="ring-img ring-img-base"></div>
        <div class="ring-img ring-img-color"></div>
      `
		: "";

	el.innerHTML = `
    <div class="ring-box"${boxStyle}>
      ${imgLayersHtml}
      <div class="ring-center">
        <div class="pct">${pctRaw.toFixed(2)}%</div>
      </div>
      ${hasExtra
			? `<div class="extra-badge">+${extraPct.toFixed(0)}%</div>`
			: ``}
    </div>
    <div class="label">${labelText}</div>
  `;

	return el;
}

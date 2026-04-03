export function parseAnimLabel(raw) {
	const r = (raw || "").trim();
	const lower = r.toLowerCase();

	let phase = "";
	if (/(^|_)(start|st)(_|$)/i.test(r)) phase = "Start";
	else if (/(^|_)(end|ed)(_|$)/i.test(r)) phase = "End";
	else if (/(^|_)(loop|lp)(_|$)/i.test(r)) phase = "Loop";

	const baseKey = lower
		.replace(/(^|_)(start|st)(_|$)/g, "_")
		.replace(/(^|_)(end|ed)(_|$)/g, "_")
		.replace(/(^|_)(loop|lp)(_|$)/g, "_")
		.replace(/__+/g, "_");

	let base = "";

	if (/defaultwait/.test(baseKey)) base = "Wait";
	else if (/battlewait/.test(baseKey)) base = "Battle Wait";
	else if (/defaultidle/.test(baseKey)) base = "Idle";
	else if (/battleidle/.test(baseKey)) base = "Battle Idle";
	else if (/turn_r000|turnmove_r000|turnmove01_r000/.test(baseKey)) base = "Turn";
	else if (/turn_l090|turnmove_l090|turnmove01_l090/.test(baseKey)) base = "Turn Left";
	else if (/turn_r090|turnmove_r090|turnmove01_r090/.test(baseKey)) base = "Turn Right";
	else if (/walk/.test(baseKey)) base = "Walk";
	else if (/run/.test(baseKey)) base = "Run";
	else if (/stepin/.test(baseKey)) base = "Step In";
	else if (/stepout/.test(baseKey)) base = "Step Out";
	else if (/jumpup/.test(baseKey)) base = "Jump Up";
	else if (/jumpdown/.test(baseKey)) base = "Jump Down";
	else if (/land/.test(baseKey)) base = "Land";
	else if (/wildbool/.test(baseKey)) base = "Wild Bool";
	else if (/rest/.test(baseKey)) base = "Rest";
	else if (/sleep/.test(baseKey)) base = "Sleep";
	else if (/roar/.test(baseKey)) base = "Roar";
	else if (/appeal/.test(baseKey)) base = "Appeal";
	else if (/refresh/.test(baseKey)) base = "Refresh";
	else if (/search/.test(baseKey)) base = "Search";
	else if (/rangeattack/.test(baseKey)) base = "Ranged Attack";
	else if (/eat/.test(baseKey)) base = "Eat";
	else if (/attack/.test(baseKey)) base = "Attack";
	else if (/charge/.test(baseKey)) base = "Charge";
	else if (/damage/.test(baseKey)) base = "Damage";
	else if (/stun/.test(baseKey)) base = "Stun";
	else if (/down/.test(baseKey)) base = "Downed";
	else if (/glad/.test(baseKey)) base = "Glad";
	else if (/notice/.test(baseKey)) base = "Notice";
	else if (/hate/.test(baseKey)) base = "Hate";
	else if (/ev_once/.test(baseKey)) base = "EV Once";
	else if (/eye/.test(baseKey)) base = "Blink";
	else if (/mouth/.test(baseKey)) base = "Mouth";
	else base = r || "Animation";

	return { base, phase, raw: r };
}

export function buildAnimDisplayNames(clips) {
	const parsed = clips.map((c) => ({ clip: c, ...parseAnimLabel(c.name) }));
	const counts = {};
	for (const p of parsed) counts[p.base] = (counts[p.base] || 0) + 1;
	const seen = {};
	return parsed.map((p) => {
		const needsNumber = (counts[p.base] || 0) > 1;
		const n = (seen[p.base] = (seen[p.base] || 0) + 1);
		const num = needsNumber ? String(n).padStart(2, "0") : "";
		const phase = p.phase ? ` (${p.phase})` : "";
		const label = needsNumber ? `${p.base} ${num}${phase}` : `${p.base}${phase}`;
		return { label, title: p.raw };
	});
}

export function findPreferredAnimIndex(clips, pipeline) {
	if (!Array.isArray(clips) || clips.length === 0) return 0;
	const p = String(pipeline || "").toLowerCase();
	const patternsByPipeline = {
		"3ds": [/\bmovement_idle\b/i],
		"lgpe": [/\bwaita01\b/i],
		"swsh": [/\bwaita01\b/i],
		"la": [/\bdefaultwait01_loop\b/i],
		"scvi": [/\bdefaultwait01_loop\b/i],
		"lza": [/\bdefaultwait01_loop\b/i],
	};
	const fallback = [/\bwaita01\b/i, /\bmovement_idle\b/i, /\bdefaultwait01_loop\b/i, /\bdefaultwait\b/i, /\bidle\b/i, /\bwait\b/i];
	const patterns = patternsByPipeline[p] || fallback;
	for (const re of patterns) {
		const idx = clips.findIndex((c) => re.test(String(c?.name || "")));
		if (idx !== -1) return idx;
	}
	let bestIdx = 0;
	let bestScore = -Infinity;
	for (let i = 0; i < clips.length; i++) {
		const name = String(clips[i]?.name || "");
		const low = name.toLowerCase();
		let score = 0;
		if (/(^|[_\-|])defaultwait01_loop([_\-|]|$)/.test(low)) score += 5000;
		if (/(^|[_\-|])movement_idle([_\-|]|$)/.test(low)) score += 4500;
		if (/(^|[_\-|])waita01([_\-|]|$)/.test(low)) score += 4000;
		if (/(^|[_\-|])(loop|lp)([_\-|]|$)/.test(low)) score += 50;
		if (low.includes("idle")) score += 20;
		if (low.includes("wait")) score += 10;
		if (score > bestScore) {
			bestScore = score;
			bestIdx = i;
		}
	}
	return bestIdx;
}

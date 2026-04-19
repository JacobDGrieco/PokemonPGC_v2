export function resolveMaybeFn(v, ctx) {
  if (typeof v !== 'function') return v;
  try {
    const a = v();
    if (typeof a === 'string') return a;
  } catch {}
  try {
    const b = v(ctx);
    if (typeof b === 'string') return b;
  } catch {}
  try {
    const c = v(ctx?.gameKey, ctx?.genKey);
    if (typeof c === 'string') return c;
  } catch {}
  return '';
}

export function normalizeRegions(val) {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map((x) => x && x.toString().trim().toLowerCase()).filter(Boolean);
  }
  return val.toString().split(/[,&/]/).map((x) => x.trim().toLowerCase()).filter(Boolean);
}

export function splitRegionsForDisplay(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((x) => String(x).trim()).filter(Boolean);
  return String(val).split(/[,&/]/).map((x) => x.trim()).filter(Boolean);
}

const GENDER = { male: '♂', female: '♀' };
export function renderGenderSymbols(raw) {
  const v = (raw ?? '').toString().trim().toLowerCase();
  if (!v) return '';
  if (v === 'male' || v === 'm' || v === '♂') return GENDER.male;
  if (v === 'female' || v === 'f' || v === '♀') return GENDER.female;
  if (v === 'mf' || v === 'fm' || v === 'both' || v === 'm/f' || v === 'f/m') return `${GENDER.male}${GENDER.female}`;
  return '';
}

export function renderDistBadges(record) {
  const marks = window.DATA?.marks || {};
  const bits = [];
  if (record?.shiny && marks.shiny) bits.push(`<img src="${marks.shiny}" alt="Shiny Badge" class="dist-mark" />`);
  if (record?.alpha && marks.alpha) bits.push(`<img src="${marks.alpha}" alt="Alpha Badge" class="dist-mark" />`);
  if (!bits.length) return '';
  return `<div class="badges dist-marks">${bits.join('')}</div>`;
}

export function normalizeMoves(moves, ctx) {
  return (Array.isArray(moves) ? moves : []).filter(Boolean).map((m) => {
    if (typeof m === 'string') return { name: m, img: null, type: null };
    return { name: m.name, img: resolveMaybeFn(m.img || null, ctx) || null, type: m.type || null };
  });
}

export function normalizeBall(ball, ctx) {
  if (!ball) return { name: '', img: null };
  if (typeof ball === 'string') return { name: ball, img: null };
  const img = resolveMaybeFn(ball.img || null, ctx);
  return { name: ball.name || '', img: img || null };
}

export function normalizeRibbons(ribbons, ctx) {
  return (Array.isArray(ribbons) ? ribbons : []).filter(Boolean).map((r) =>
    typeof r === 'string' ? { name: r, img: null } : { name: r.name, img: resolveMaybeFn(r.img || null, ctx) || null }
  );
}

export function asList(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v.filter(Boolean) : [v];
}

export function normalizeNameImgList(v, ctx) {
  return asList(v).map((x) =>
    typeof x === 'string' ? { name: x, img: null } : { name: x.name || '', img: resolveMaybeFn(x.img || null, ctx) || null }
  );
}

export function normalizeIdList(v) {
  return asList(v).map((x) => {
    if (typeof x === 'string' || typeof x === 'number') return String(x);
    if (x && typeof x === 'object' && ('value' in x || 'id' in x)) return String(x.value ?? x.id);
    return String(x ?? '');
  }).filter(Boolean);
}

export function parseToISOParts(s) {
  if (!s) return null;
  const str = String(s).trim();
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const y = +m[1], mo = +m[2] - 1, d = +m[3];
    return new Date(Date.UTC(y, mo, d));
  }
  const dt = new Date(str);
  return isNaN(+dt) ? null : dt;
}

export function fmtMMMDDYYYY(dt) {
  return dt.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' });
}

export function formatDateRange(raw) {
  if (!raw) return '';
  if (typeof raw === 'string') {
    const dt = parseToISOParts(raw);
    return dt ? fmtMMMDDYYYY(dt) : String(raw);
  }
  if (typeof raw === 'object') {
    const start = parseToISOParts(raw.start || raw.from || raw.date || raw.begin);
    const end = parseToISOParts(raw.end || raw.to || raw.until);
    if (start && end) return `${fmtMMMDDYYYY(start)} – ${fmtMMMDDYYYY(end)}`;
    if (start) return fmtMMMDDYYYY(start);
    if (end) return fmtMMMDDYYYY(end);
  }
  return String(raw);
}

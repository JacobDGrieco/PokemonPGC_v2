function _pad(v, zeroes) {
  const s = String(v ?? '');
  const parts = s.split('-');
  const head = parts[0];

  if (!/^\d+$/.test(head)) return s;

  const padded = head.padStart(zeroes, '0');
  return parts.length > 1 ? `${padded}-${parts.slice(1).join('-')}` : padded;
}

export function pad3(v) {
  return _pad(v, 3);
}

export function pad4(v) {
  return _pad(v, 4);
}

function normFormKey(form) {
  if (!form) return '';
  return String(form)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

export const spacer = 'spacer';

export function _slugify(s, opts) {
  const o = opts || {};
  const keepPlus = !!o.keepPlus;
  const allowed = keepPlus ? 'a-z0-9\\+' : 'a-z0-9';
  const reNonAllowed = new RegExp(`[^${allowed}]+`, 'g');

  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['â€™]/g, '')
    .replace(reNonAllowed, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function _fullId(gameKey, bucket, type, form) {
  const gk = String(gameKey || '').trim();
  const b = String(bucket || '').trim();
  const t = String(type || '').trim();
  if (!gk || !b || !t) return '';

  if (form == null || form === '') return `${gk}:${b}:${t}`;
  return `${gk}:${b}:${t}:${normFormKey(form)}`;
}

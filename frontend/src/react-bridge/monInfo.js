import { ensureMonInfoLoaded } from '../../data/mon_info/_loader.js';

export const MONINFO_GAME_PRIORITY = [
  'legendsza','scarlet','violet','legendsarceus','brilliantdiamond-national','shiningpearl-national',
  'sword','shield','letsgopikachu','letsgoeevee','ultrasun-alola','ultramoon-alola','sun-alola','moon-alola',
  'omegaruby','alphasapphire','x-national','y-national','black2-national','white2-national','black-national','white-national',
  'heartgold-national','soulsilver-national','platinum-national','diamond-national','pearl-national','firered-national','leafgreen-national',
  'emerald-national','ruby-national','sapphire-national','crystal','gold','silver','yellow','red','blue','green'
];

export function pad4(value) {
  return String(Number(value) || 0).padStart(4, '0');
}

export function normalizeMonInfoComboKeys() {
  const byGame = window.DATA?.monInfo;
  if (!byGame || typeof byGame !== 'object') return;

  for (const rawKey of Object.keys(byGame)) {
    if (!rawKey || typeof rawKey !== 'string' || !rawKey.includes(',')) continue;
    const bucket = byGame[rawKey];
    if (!bucket || typeof bucket !== 'object') continue;

    const parts = rawKey.split(',').map((s) => s.trim()).filter(Boolean);
    for (const key of parts) {
      if (!byGame[key]) byGame[key] = bucket;
    }
    delete byGame[rawKey];
  }
}

export function monInfoLabelForGameKey(gameKey) {
  const gk = String(gameKey || '').toLowerCase();
  if (!gk) return 'Unknown';
  if (gk.startsWith('legendsza')) return 'Legends: Z-A';
  if (gk.startsWith('scarlet') || gk.startsWith('violet')) return 'Scarlet / Violet';
  if (gk.startsWith('legendsarceus')) return 'Legends: Arceus';
  if (gk.startsWith('brilliantdiamond') || gk.startsWith('shiningpearl')) return 'Brilliant Diamond / Shining Pearl';
  if (gk.startsWith('sword') || gk.startsWith('shield')) return 'Sword / Shield';
  if (gk.startsWith('letsgopikachu') || gk.startsWith('letsgoeevee')) return `Let's Go Pikachu / Eevee`;
  if (gk.startsWith('ultrasun') || gk.startsWith('ultramoon')) return 'Ultra Sun / Ultra Moon';
  if (gk.startsWith('sun') || gk.startsWith('moon')) return 'Sun / Moon';
  if (gk.startsWith('omegaruby') || gk.startsWith('alphasapphire')) return 'Omega Ruby / Alpha Sapphire';
  if (gk.startsWith('x-') || gk.startsWith('y-')) return 'X / Y';
  if (gk.startsWith('black2') || gk.startsWith('white2')) return 'Black 2 / White 2';
  if (gk.startsWith('black') || gk.startsWith('white')) return 'Black / White';
  if (gk.startsWith('heartgold') || gk.startsWith('soulsilver')) return 'HeartGold / SoulSilver';
  if (gk.startsWith('platinum')) return 'Platinum';
  if (gk.startsWith('diamond') || gk.startsWith('pearl')) return 'Diamond / Pearl';
  if (gk.startsWith('firered') || gk.startsWith('leafgreen')) return 'FireRed / LeafGreen';
  if (gk.startsWith('emerald')) return 'Emerald';
  if (gk.startsWith('ruby') || gk.startsWith('sapphire')) return 'Ruby / Sapphire';
  if (gk.startsWith('crystal')) return 'Crystal';
  if (gk.startsWith('silver')) return 'Silver';
  if (gk.startsWith('gold')) return 'Gold';
  if (gk.startsWith('yellow')) return 'Yellow';
  if (gk.startsWith('red') || gk.startsWith('blue')) return 'Red / Blue';
  if (gk.startsWith('green')) return 'Green';
  return gk.split(/[-_]/g).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function sortGameKeysForMonInfo(keys) {
  const pri = new Map(MONINFO_GAME_PRIORITY.map((key, index) => [key, index]));
  return [...keys].sort((a, b) => {
    const ai = pri.has(a) ? pri.get(a) : 9999;
    const bi = pri.has(b) ? pri.get(b) : 9999;
    if (ai !== bi) return ai - bi;
    return String(a).localeCompare(String(b));
  });
}

export function buildMonInfoGameOptions(gameKeys) {
  const ordered = sortGameKeysForMonInfo(gameKeys);
  const seenLabels = new Set();
  const options = [];

  for (const key of ordered) {
    const label = monInfoLabelForGameKey(key);
    if (seenLabels.has(label)) continue;
    seenLabels.add(label);
    options.push({ key, label });
  }

  return options;
}

export function findGameKeysForMonInfoNati(natiId) {
  const natId = Number(natiId);
  normalizeMonInfoComboKeys();

  const byGame = window.DATA?.monInfo || {};
  const found = new Set();

  for (const gameKey of Object.keys(byGame)) {
    if (String(gameKey).startsWith('$')) continue;
    const bucket = byGame[gameKey];
    if (!bucket || typeof bucket !== 'object') continue;
    if (bucket[natId] != null || bucket[String(natId)] != null) found.add(gameKey);
  }

  return found.size ? Array.from(found) : Object.keys(byGame);
}

export function getHomeDexMons() {
  const homeDex = window.DATA?.dex?.home || [];
  return (Array.isArray(homeDex) ? homeDex : [])
    .map((mon) => ({
      natiId: Number(mon?.natiId ?? mon?.id ?? 0),
      name: String(mon?.name || ''),
    }))
    .filter((mon) => mon.natiId > 0)
    .sort((a, b) => a.natiId - b.natiId);
}

export async function getMonInfoDisplayName(natiId) {
  const natId = Number(natiId);
  if (!natId) return '';

  await ensureMonInfoLoaded(natId, null);

  try {
    const byGame = window.DATA?.monInfo || {};
    for (const bucket of Object.values(byGame)) {
      if (!bucket || typeof bucket !== 'object') continue;
      const record = bucket[natId] || bucket[String(natId)];
      if (record?.name) return String(record.name);
    }
  } catch {}

  const homeDexMatch = getHomeDexMons().find((mon) => mon.natiId === natId);
  return homeDexMatch?.name || `#${natId}`;
}

export function pickPreferredGameForMon(natiId, currentGameKey = null) {
  const options = buildMonInfoGameOptions(findGameKeysForMonInfoNati(natiId));
  const keys = options.map((option) => option.key);
  if (currentGameKey && keys.includes(currentGameKey)) return currentGameKey;
  return keys[0] || null;
}

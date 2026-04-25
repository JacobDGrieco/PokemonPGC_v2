import { _assetPath } from '../utils/assetPath.js';

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

export function asList(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v.filter((x) => x != null && x !== '') : [v];
}

export function prettyToken(v) {
  const raw = String(v ?? '').trim();
  if (!raw) return '';

  const upperMap = {
    global: 'Region Free',
    region_free: 'Region Free',
    regionfree: 'Region Free',
    usa: 'USA',
    us: 'USA',
    jpn: 'JPN',
    jp: 'JPN',
    eur: 'EUR',
    eu: 'EUR',
    kor: 'KOR',
    chn: 'CHN',
    twn: 'TWN',
    hkg: 'HKG',
    sgp: 'SGP',
    aus: 'AUS',
    uk: 'UK',
    nld: 'NLD',
    en: 'EN',
    ja: 'JA',
    fr: 'FR',
    de: 'DE',
    es: 'ES',
    it: 'IT',
    ko: 'KO',
    'zh-hans': 'ZH-Hans',
    'zh-hant': 'ZH-Hant',
  };

  const key = raw.toLowerCase().replace(/[\s-]+/g, '_');
  if (upperMap[key]) return upperMap[key];

  return raw
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function normalizeRegions(val) {
  const raw = asList(val).flatMap((item) =>
    String(item)
      .split(/[,&/]/)
      .map((x) => x.trim())
      .filter(Boolean)
  );

  return raw.map((x) => {
    const key = String(x).trim().toLowerCase();
    if (key === 'global' || key === 'region free' || key === 'region_free') return 'region free';
    return key;
  });
}

export function splitRegionsForDisplay(val) {
  const seen = new Set();
  const out = [];

  for (const item of asList(val)) {
    const parts = String(item)
      .split(/[,&/]/)
      .map((x) => x.trim())
      .filter(Boolean);

    for (const part of parts) {
      const display = prettyToken(part);
      const key = display.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(display);
      }
    }
  }

  return out;
}

const GENDER = { male: '♂', female: '♀' };
export function renderGenderSymbols(raw) {
  const v = (raw ?? '').toString().trim().toLowerCase();
  if (!v) return '';
  if (v === 'male' || v === 'm' || v === '♂') return GENDER.male;
  if (v === 'female' || v === 'f' || v === '♀') return GENDER.female;
  if (v === 'mf' || v === 'fm' || v === 'both' || v === 'm/f' || v === 'f/m') return `${GENDER.male}${GENDER.female}`;
  if (v === 'none' || v === 'genderless' || v === 'unknown') return '';
  return '';
}

export function renderDistBadges(record) {
  const marks = window.DATA?.marks || {};
  const reward = record?.reward || {};
  const bits = [];
  if ((record?.shiny || reward?.shiny) && marks.shiny) bits.push(`<img src="${marks.shiny}" alt="Shiny Badge" class="dist-mark" />`);
  if ((record?.alpha || reward?.alpha) && marks.alpha) bits.push(`<img src="${marks.alpha}" alt="Alpha Badge" class="dist-mark" />`);
  if (!bits.length) return '';
  return `<div class="badges dist-marks">${bits.join('')}</div>`;
}

export function normalizeMoves(moves, ctx) {
  return asList(moves).map((m) => {
    if (typeof m === 'string') return { name: prettyToken(m), img: null, type: null };
    return {
      name: m.name || prettyToken(m.id || m.value || ''),
      img: resolveMaybeFn(m.img || m.image || null, ctx) || null,
      type: m.type || null,
    };
  }).filter((m) => m.name || m.img);
}

export function normalizeBall(ball, ctx, { fallback = true } = {}) {
  const fallbackImg = _assetPath('items/balls/gen8_2/legendsarceus/strange-ball.png');
  if (!ball) return fallback ? { name: 'Strange Ball', img: fallbackImg } : { name: '', img: null };
  if (typeof ball === 'string') {
    const name = prettyToken(ball);
    return { name: name || (fallback ? 'Strange Ball' : ''), img: fallback ? fallbackImg : null };
  }
  const img = resolveMaybeFn(ball.img || ball.image || null, ctx);
  return {
    name: ball.name || prettyToken(ball.id || ball.value || '') || (fallback ? 'Strange Ball' : ''),
    img: img || (fallback ? fallbackImg : null),
  };
}

export function normalizeRibbons(ribbons, ctx) {
  return asList(ribbons).map((r) =>
    typeof r === 'string'
      ? { name: prettyToken(r), img: null }
      : { name: r.name || prettyToken(r.id || r.value || ''), img: resolveMaybeFn(r.img || r.image || null, ctx) || null }
  ).filter((r) => r.name || r.img);
}

export function normalizeNameImgList(v, ctx) {
  return asList(v).map((x) =>
    typeof x === 'string'
      ? { name: prettyToken(x), img: null }
      : { name: x.name || prettyToken(x.id || x.value || ''), img: resolveMaybeFn(x.img || x.image || null, ctx) || null }
  ).filter((x) => x.name || x.img);
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

export function isLikelyEventYear(year) {
  const y = Number(year);
  const max = new Date().getUTCFullYear() + 3;
  return Number.isInteger(y) && y >= 1996 && y <= max;
}

export function isLikelyEventDate(value) {
  if (!value) return false;
  if (typeof value === 'object') return false;
  const m = String(value).trim().match(/^(\d{4})(?:-|$)/);
  if (!m) return true;
  return isLikelyEventYear(Number(m[1]));
}

export function fmtMMMDDYYYY(dt) {
  return dt.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' });
}

export function formatDateRange(raw) {
  if (!raw) return '';
  if (typeof raw === 'string') {
    if (!isLikelyEventDate(raw)) return '';
    const dt = parseToISOParts(raw);
    return dt ? fmtMMMDDYYYY(dt) : String(raw);
  }
  if (typeof raw === 'object') {
    const startDisplay = raw.startDisplay || raw.fromDisplay || raw.dateDisplay;
    const endDisplay = raw.endDisplay || raw.toDisplay || raw.untilDisplay;
    const startRaw = raw.start || raw.from || raw.date || raw.begin;
    const endRaw = raw.end || raw.to || raw.until;
    const start = isLikelyEventDate(startRaw) ? parseToISOParts(startRaw) : null;
    const end = isLikelyEventDate(endRaw) ? parseToISOParts(endRaw) : null;

    const startText = isLikelyEventDate(startDisplay || startRaw) ? (startDisplay || (start ? fmtMMMDDYYYY(start) : '')) : '';
    const endText = isLikelyEventDate(endDisplay || endRaw) ? (endDisplay || (end ? fmtMMMDDYYYY(end) : '')) : '';

    if (startText && endText) return `${startText} – ${endText}`;
    if (startText) return startText;
    if (endText) return endText;
    return '';
  }
  return '';
}

// National Dex 1-386. Used only as a renderer fallback when generated Project Pokémon
// entries only contain a filename/title and did not parse the actual .pk3/.wc3 payload.
const SPECIES = [
  'Bulbasaur','Ivysaur','Venusaur','Charmander','Charmeleon','Charizard','Squirtle','Wartortle','Blastoise','Caterpie','Metapod','Butterfree','Weedle','Kakuna','Beedrill','Pidgey','Pidgeotto','Pidgeot','Rattata','Raticate','Spearow','Fearow','Ekans','Arbok','Pikachu','Raichu','Sandshrew','Sandslash','Nidoran♀','Nidorina','Nidoqueen','Nidoran♂','Nidorino','Nidoking','Clefairy','Clefable','Vulpix','Ninetales','Jigglypuff','Wigglytuff','Zubat','Golbat','Oddish','Gloom','Vileplume','Paras','Parasect','Venonat','Venomoth','Diglett','Dugtrio','Meowth','Persian','Psyduck','Golduck','Mankey','Primeape','Growlithe','Arcanine','Poliwag','Poliwhirl','Poliwrath','Abra','Kadabra','Alakazam','Machop','Machoke','Machamp','Bellsprout','Weepinbell','Victreebel','Tentacool','Tentacruel','Geodude','Graveler','Golem','Ponyta','Rapidash','Slowpoke','Slowbro','Magnemite','Magneton','Farfetch’d','Doduo','Dodrio','Seel','Dewgong','Grimer','Muk','Shellder','Cloyster','Gastly','Haunter','Gengar','Onix','Drowzee','Hypno','Krabby','Kingler','Voltorb','Electrode','Exeggcute','Exeggutor','Cubone','Marowak','Hitmonlee','Hitmonchan','Lickitung','Koffing','Weezing','Rhyhorn','Rhydon','Chansey','Tangela','Kangaskhan','Horsea','Seadra','Goldeen','Seaking','Staryu','Starmie','Mr. Mime','Scyther','Jynx','Electabuzz','Magmar','Pinsir','Tauros','Magikarp','Gyarados','Lapras','Ditto','Eevee','Vaporeon','Jolteon','Flareon','Porygon','Omanyte','Omastar','Kabuto','Kabutops','Aerodactyl','Snorlax','Articuno','Zapdos','Moltres','Dratini','Dragonair','Dragonite','Mewtwo','Mew',
  'Chikorita','Bayleef','Meganium','Cyndaquil','Quilava','Typhlosion','Totodile','Croconaw','Feraligatr','Sentret','Furret','Hoothoot','Noctowl','Ledyba','Ledian','Spinarak','Ariados','Crobat','Chinchou','Lanturn','Pichu','Cleffa','Igglybuff','Togepi','Togetic','Natu','Xatu','Mareep','Flaaffy','Ampharos','Bellossom','Marill','Azumarill','Sudowoodo','Politoed','Hoppip','Skiploom','Jumpluff','Aipom','Sunkern','Sunflora','Yanma','Wooper','Quagsire','Espeon','Umbreon','Murkrow','Slowking','Misdreavus','Unown','Wobbuffet','Girafarig','Pineco','Forretress','Dunsparce','Gligar','Steelix','Snubbull','Granbull','Qwilfish','Scizor','Shuckle','Heracross','Sneasel','Teddiursa','Ursaring','Slugma','Magcargo','Swinub','Piloswine','Corsola','Remoraid','Octillery','Delibird','Mantine','Skarmory','Houndour','Houndoom','Kingdra','Phanpy','Donphan','Porygon2','Stantler','Smeargle','Tyrogue','Hitmontop','Smoochum','Elekid','Magby','Miltank','Blissey','Raikou','Entei','Suicune','Larvitar','Pupitar','Tyranitar','Lugia','Ho-Oh','Celebi',
  'Treecko','Grovyle','Sceptile','Torchic','Combusken','Blaziken','Mudkip','Marshtomp','Swampert','Poochyena','Mightyena','Zigzagoon','Linoone','Wurmple','Silcoon','Beautifly','Cascoon','Dustox','Lotad','Lombre','Ludicolo','Seedot','Nuzleaf','Shiftry','Taillow','Swellow','Wingull','Pelipper','Ralts','Kirlia','Gardevoir','Surskit','Masquerain','Shroomish','Breloom','Slakoth','Vigoroth','Slaking','Nincada','Ninjask','Shedinja','Whismur','Loudred','Exploud','Makuhita','Hariyama','Azurill','Nosepass','Skitty','Delcatty','Sableye','Mawile','Aron','Lairon','Aggron','Meditite','Medicham','Electrike','Manectric','Plusle','Minun','Volbeat','Illumise','Roselia','Gulpin','Swalot','Carvanha','Sharpedo','Wailmer','Wailord','Numel','Camerupt','Torkoal','Spoink','Grumpig','Spinda','Trapinch','Vibrava','Flygon','Cacnea','Cacturne','Swablu','Altaria','Zangoose','Seviper','Lunatone','Solrock','Barboach','Whiscash','Corphish','Crawdaunt','Baltoy','Claydol','Lileep','Cradily','Anorith','Armaldo','Feebas','Milotic','Castform','Kecleon','Shuppet','Banette','Duskull','Dusclops','Tropius','Chimecho','Absol','Wynaut','Snorunt','Glalie','Spheal','Sealeo','Walrein','Clamperl','Huntail','Gorebyss','Relicanth','Luvdisc','Bagon','Shelgon','Salamence','Beldum','Metang','Metagross','Regirock','Regice','Registeel','Latias','Latios','Kyogre','Groudon','Rayquaza','Jirachi','Deoxys'
];

const SPECIES_BY_KEY = new Map();
SPECIES.forEach((name, idx) => {
  const id = idx + 1;
  const keys = new Set([
    name,
    name.replace(/[.’']/g, ''),
    name.replace(/[♀]/g, 'f').replace(/[♂]/g, 'm'),
    name.replace(/[^A-Za-z0-9]+/g, ''),
  ]);
  for (const key of keys) SPECIES_BY_KEY.set(String(key).toLowerCase(), { species: name, nationalDex: id });
});

function cleanTitleForSpeciesSearch(text) {
  return String(text || '')
    .replace(/\b[0-9A-F]{8}\b/gi, ' ')
    .replace(/\b\d{5}\b/g, ' ')
    .replace(/\b(RS|RSE|FRLG|FL|E|DPPt|HGSS|BW|B2W2|XY|ORAS|SM|USUM|SWSH|SV)\b/gi, ' ')
    .replace(/[()\[\]{}_.-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function inferPokemonFromText(...parts) {
  const haystack = cleanTitleForSpeciesSearch(parts.filter(Boolean).join(' '));
  if (!haystack) return null;

  // Prefer longest names first so "Mr Mime" wins before "Mime" style fragments.
  const sorted = [...SPECIES_BY_KEY.entries()].sort((a, b) => b[0].length - a[0].length);
  const lower = ` ${haystack.toLowerCase()} `;
  for (const [key, info] of sorted) {
    if (!key || key.length < 3) continue;
    const re = new RegExp(`(^|[^a-z0-9])${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
    if (re.test(lower)) return info;
  }
  return null;
}

function pad4(id) {
  return String(Number(id) || 0).padStart(4, '0');
}

function localSpriteGamePrefix(gameKey) {
  switch (String(gameKey || '').toLowerCase()) {
    case 'ruby':
    case 'sapphire':
      return 'gen3/ruby-sapphire/';
    case 'emerald':
      return 'gen3/emerald/';
    case 'firered':
    case 'leafgreen':
      return 'gen3/firered-leafgreen/';
    case 'diamond':
    case 'pearl':
      return 'gen4/diamond-pearl/';
    case 'platinum':
      return 'gen4/platinum/';
    case 'heartgold':
    case 'soulsilver':
      return 'gen4/heartgold-soulsilver/';
    case 'black':
    case 'white':
    case 'black2':
    case 'white2':
      return 'gen5/';
    case 'x':
    case 'y':
    case 'omegaruby':
    case 'alphasapphire':
    case 'sun':
    case 'moon':
    case 'ultrasun':
    case 'ultramoon':
      return 'gen6-7/x-ultra/';
    case 'letsgopikachu':
    case 'letsgoeevee':
      return 'gen6-7/lgpe/';
    case 'sword':
    case 'shield':
    case 'swordioa':
    case 'shieldioa':
    case 'swordct':
    case 'shieldct':
      return 'gen8/sword-shield/';
    case 'brilliantdiamond':
    case 'shiningpearl':
      return 'gen8/brilliantdiamond-shiningpearl/';
    case 'legendsarceus':
      return 'gen8/legendsarceus/';
    case 'scarlet':
    case 'violet':
    case 'scarlettm':
    case 'violettm':
    case 'scarletid':
    case 'violetid':
      return 'gen9/scarlet-violet/';
    case 'legendsza':
    case 'legendszamd':
      return 'gen9/legendsza/';
    default:
      return 'pokemon_home/';
  }
}

export function getPokemonSpriteUrl(nationalDex, shiny = false, ctx = {}) {
  const id = Number(nationalDex);
  if (!Number.isFinite(id) || id <= 0) return '';

  const gameKey = ctx?.gameKey || ctx?.game || '';
  const genKey = Number(ctx?.genKey ?? ctx?.gen ?? 0);
  if (gameKey) {
    const baseFolder = genKey === 1
      ? (shiny ? 'colored' : 'bw')
      : (shiny ? 'shiny-front' : 'base-front');
    return _assetPath(`sprites/${localSpriteGamePrefix(gameKey)}${baseFolder}/${pad4(id)}.png`);
  }

  return _assetPath(`sprites/pokemon_home/${shiny ? 'shiny-front' : 'base-front'}/${pad4(id)}.png`);
}

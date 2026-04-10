import { _assetPath } from './assets.js';

const ITEM = ['apricorns', 'balls', 'berries', 'decorations', 'form-items', 'fossils', 'held-items', 'key-items', 'mails', 'medicines', 'mega-stones', 'partner-gifts', 'stat-items', 'hms', 'tms', 'trs', 'treasures', 'usable-items', 'zcrystals'];

function buildAssetSubpath(...parts) {
	return parts
		.map((part) => String(part || '').replace(/^\/+|\/+$/g, ''))
		.filter(Boolean)
		.join('/');
}

function resolveGen1GameVariant(gameKey) {
	const raw = String(gameKey || '').toLowerCase();
	if (raw !== 'red' && raw !== 'blue') return raw;

	const regionMode =
		globalThis?.window?.PPGC?._storeRef?.state?.gen1RegionMode ||
		globalThis?.window?.store?.state?.gen1RegionMode ||
		'rf';

	return regionMode === 'jp' ? 'green' : raw;
}

function normalizeNpcType(type) {
	switch (String(type || 'battle').toLowerCase()) {
		case 'art':
		case 'arts':
			return 'arts';
		case 'overworld':
		case 'overworlds':
			return 'overworlds';
		case 'battle':
		case 'battles':
		default:
			return 'battles';
	}
}

function inferNpcGeneration(gameKey) {
	switch (String(gameKey || '').toLowerCase()) {
		case 'red':
		case 'blue':
		case 'yellow':
			return 1;
		case 'gold':
		case 'silver':
		case 'crystal':
			return 2;
		case 'ruby':
		case 'sapphire':
		case 'emerald':
		case 'firered':
		case 'leafgreen':
			return 3;
		case 'diamond':
		case 'pearl':
		case 'platinum':
		case 'heartgold':
		case 'soulsilver':
			return 4;
		case 'black':
		case 'white':
		case 'black2':
		case 'white2':
			return 5;
		case 'x':
		case 'y':
		case 'omegaruby':
		case 'alphasapphire':
			return 6;
		case 'sun':
		case 'moon':
		case 'ultrasun':
		case 'ultramoon':
		case 'letsgopikachu':
		case 'letsgoeevee':
			return 7;
		case 'sword':
		case 'shield':
		case 'swordioa':
		case 'shieldioa':
		case 'swordct':
		case 'shieldct':
		case 'brilliantdiamond':
		case 'shiningpearl':
		case 'legendsarceus':
			return 8;
		case 'scarlet':
		case 'violet':
		case 'scarlettm':
		case 'violettm':
		case 'scarletid':
		case 'violetid':
		case 'legendsza':
		case 'legendszamd':
			return 9;
		default:
			return null;
	}
}

function resolveNpcGameGroup(gameKey, gen) {
	const game = resolveGen1GameVariant(gameKey);

	switch (String(game || '').toLowerCase()) {
		case 'red':
		case 'blue':
		case 'green':
		case 'yellow':
			return game;
		case 'gold':
		case 'silver':
			return 'gold-silver';
		case 'crystal':
			return 'crystal';
		case 'ruby':
		case 'sapphire':
			return 'ruby-sapphire';
		case 'emerald':
			return 'emerald';
		case 'firered':
		case 'leafgreen':
			return 'firered-leafgreen';
		case 'diamond':
		case 'pearl':
			return 'diamond-pearl';
		case 'platinum':
			return 'platinum';
		case 'heartgold':
		case 'soulsilver':
			return 'heartgold-soulsilver';
		case 'black':
		case 'white':
			return 'black-white';
		case 'black2':
		case 'white2':
			return 'black2-white2';
		case 'x':
		case 'y':
			return 'x-y';
		case 'omegaruby':
		case 'alphasapphire':
			return 'omegaruby-alphasapphire';
		case 'sun':
		case 'moon':
			return 'sun-moon';
		case 'ultrasun':
		case 'ultramoon':
			return 'ultrasun-ultramoon';
		case 'letsgopikachu':
		case 'letsgoeevee':
			return 'letsgopikachu-letsgoeevee';
		case 'sword':
		case 'shield':
		case 'swordioa':
		case 'shieldioa':
		case 'swordct':
		case 'shieldct':
			return 'sword-shield';
		case 'brilliantdiamond':
		case 'shiningpearl':
			return 'brilliantdiamond-shiningpearl';
		case 'legendsarceus':
			return 'legendsarceus';
		case 'scarlet':
		case 'violet':
		case 'scarlettm':
		case 'violettm':
		case 'scarletid':
		case 'violetid':
			return 'scarlet-violet';
		case 'legendsza':
		case 'legendszamd':
			return 'legendsza';
		default:
			if (gen != null) return String(game || '');
			return '';
	}
}

function normalizeNpcOptions(gameOrOptions, maybeOptions) {
	if (gameOrOptions && typeof gameOrOptions === 'object' && !Array.isArray(gameOrOptions)) {
		return {
			type: normalizeNpcType(gameOrOptions.type),
			game: String(gameOrOptions.game || gameOrOptions.gameKey || '').toLowerCase(),
			generation: gameOrOptions.generation ?? gameOrOptions.gen ?? inferNpcGeneration(gameOrOptions.game || gameOrOptions.gameKey),
			animated: Boolean(gameOrOptions.animated),
			region: String(gameOrOptions.region || gameOrOptions.version || '').toLowerCase(),
		};
	}

	const options = maybeOptions || {};
	const game = String(gameOrOptions || options.game || options.gameKey || '').toLowerCase();
	return {
		type: normalizeNpcType(options.type),
		game,
		generation: options.generation ?? options.gen ?? inferNpcGeneration(game),
		animated: Boolean(options.animated),
		region: String(options.region || options.version || '').toLowerCase(),
	};
}

export function _npcImage(name, gameOrOptions, maybeOptions) {
	const options = normalizeNpcOptions(gameOrOptions, maybeOptions);
	const type = options.type;
	const gen = options.generation;
	const gameGroup = resolveNpcGameGroup(options.game, gen);
	const genFolder = gen == null ? '' : `gen${gen}`;
	const fileName = `${name}.png`;

	if (type === 'arts') {
		return _assetPath(buildAssetSubpath('npcs', 'arts', genFolder, resolveNpcGameGroup(options.game, gen), fileName));
	}

	if (type === 'overworlds') {
		return _assetPath(buildAssetSubpath('npcs', 'overworlds', genFolder, resolveNpcGameGroup(options.game, gen), fileName));
	}

	if (gen === 1) {
		return _assetPath(buildAssetSubpath('npcs', 'battles', genFolder, gameGroup, fileName));
	}

	if (gen === 2 || gen === 3) {
		const region = options.region === 'jp' ? 'jp' : 'rf';
		return _assetPath(buildAssetSubpath('npcs', 'battles', genFolder, gameGroup, region, fileName));
	}

	if (gen === 4 || gen === 5) {
		const motion = options.animated ? 'animated' : 'static';
		const region = options.region === 'jp' ? 'jp' : 'rf';
		return _assetPath(buildAssetSubpath('npcs', 'battles', genFolder, gameGroup, motion, region, fileName));
	}

	return _assetPath(buildAssetSubpath('npcs', 'battles', genFolder, gameGroup, fileName));
}

export function _imageByGen(type, genKey, name) {
	const prefix = ITEM.includes(type) ? 'items' : '';
	if (type === 'hms' || type === 'tms' || type === 'trs') type = `thms/${type}`;

	let gen = '';
	switch (genKey) {
		case 1:
		case 2:
		case 3:
			if (type !== 'thms/tms' && type !== 'thms/hms') { gen = 'gen1-3'; break; }
		case 4:
			if (type === 'key-items' || type === 'mails') { gen = 'gen4'; break; }
		case 5:
			if (type === 'key-items' || type === 'mails') { gen = 'gen5'; break; }
			if (type === 'thms/tms' || type === 'thms/hms') { gen = 'gen1-5'; break; }
		case 6:
			if (type === 'key-items') { gen = 'gen6'; break; }
		case 7:
			if (type === 'key-items') { gen = 'gen7'; break; }
		case 8:
			if (type === 'key-items') { gen = 'gen8'; break; }
			if (type === 'thms/tms' || type === 'thms/hms') { gen = 'gen6-8'; break; }
			else gen = 'gen4-8'; break;
		case 7.5:
		case '7_2':
			if (type === 'berries' || type === 'key-items') { gen = 'gen7_2'; break; }
			else gen = 'gen4-8'; break;
		case 8.5:
		case '8_2': gen = 'gen8_2'; break;
		case 9: gen = 'gen9'; break;
		case 9.5:
		case '9_2': gen = 'gen9_2'; break;
		case 'home': gen = 'home'; break;
		case 0:
		default: gen = '';
	}

	return _assetPath(buildAssetSubpath(prefix, type, gen, `${name}.png`));
}

export function _imageByGame(type, gameKey, name, bwORc) {
	if (type && type[type.length - 1] !== 's') type = `${type}s`;
	gameKey = resolveGen1GameVariant(gameKey);

	let game = '';
	switch (gameKey) {
		case 'red':
		case 'blue':
			game = `gen1/red-blue/${!bwORc ? 'bw' : 'colored'}`; break;
		case 'yellow':
			game = `gen1/yellow/${!bwORc ? 'bw' : 'colored'}`; break;
		case 'gold': game = 'gen2/gold'; break;
		case 'silver': game = 'gen2/silver'; break;
		case 'crystal': game = 'gen2/crystal'; break;
		case 'ruby':
		case 'sapphire':
		case 'emerald':
			game = 'gen3/ruby-sapphire-emerald'; break;
		case 'firered':
		case 'leafgreen':
			game = 'gen3/firered-leafgreen'; break;
		case 'diamond':
		case 'pearl':
		case 'platinum':
			game = 'gen4/diamond-pearl-platinum'; break;
		case 'heartgold':
		case 'soulsilver':
			game = 'gen4/heartgold-soulsilver'; break;
		case 'black':
		case 'white':
		case 'black2':
		case 'white2':
			game = 'gen5'; break;
		case 'x':
		case 'y':
			game = 'gen6/xy'; break;
		case 'omegaruby':
		case 'alphasapphire':
			game = 'gen6/omegaruby-alphasapphire'; break;
		case 'sun':
		case 'moon':
		case 'ultrasun':
		case 'ultramoon':
			game = 'gen7/sun-moon-ultra'; break;
		case 'letsgopikachu':
		case 'letsgoeevee':
			game = 'gen7_2'; break;
		case 'sword':
		case 'swordioa':
		case 'swordct':
		case 'shield':
		case 'shieldioa':
		case 'shieldct':
			game = 'gen8/sword-shield'; break;
		case 'brilliantdiamond':
		case 'shiningpearl':
			game = 'gen8_2/brilliantdiamond-shiningpearl'; break;
		case 'legendsarceus':
			game = 'gen8_2/legendsarceus'; break;
		case 'scarlet':
		case 'scarlettm':
		case 'scarletid':
		case 'violet':
		case 'violettm':
		case 'violetid':
			game = 'gen9/scarlet-violet'; break;
		case 'legendsza':
		case 'legendszamd':
			game = 'gen9_2'; break;
		case 'home':
			game = 'home'; break;
		default:
			game = '';
	}

	return _assetPath(`${type}/${game}/${name}.png`);
}

export function _ribbonByGen(genKey, name) {
	let gen = '';
	switch (genKey) {
		case 1:
		case 2:
		case 3: gen = 'gen3'; break;
		case 4:
		case 5: gen = 'gen4-5'; break;
		case 6:
		case 7:
		case 7.5:
		case '7_2': gen = 'gen6-7'; break;
		case 8:
		case 8.5:
		case '8_2':
		case 9:
		case 9.5:
		case '9_2':
		case 'home': gen = 'gen8-9'; break;
		case 0:
		default: gen = '';
	}

	return _assetPath(`ribbons/${gen}/${name}.png`);
}

export const _ball = (gen, name) => _imageByGen('balls', gen, name);
export const _berry = (gen, name) => _imageByGen('berries', gen, name);
export const _decoration = (gen, name) => _imageByGen('decorations', gen, name);
export const _formItem = (gen, name) => _imageByGen('form-items', gen, name);
export const _fossil = (gen, name) => _imageByGen('fossils', gen, name);
export const _heldItem = (gen, name) => _imageByGen('held-items', gen, name);
export const _hm = (gen, name) => _imageByGen('hms', gen, name);
export const _keyItem = (gen, name) => _imageByGen('key-items', gen, name);
export const _mail = (name) => _imageByGen('mails', 0, name);
export const _medicine = (name) => _imageByGen('medicines', 0, name);
export const _megaStone = (gen, name) => _imageByGen('mega-stones', gen, name);
export const _partnerItem = (name) => _imageByGen('partner-items', 0, name);
export const _ribbon = (gen, name) => _ribbonByGen(gen, name);
export const _statItems = (gen, name) => _imageByGen('stat-items', gen, name);
export const _tm = (gen, name) => _imageByGen('tms', gen, name);
export const _tr = (gen, name) => _imageByGen('trs', 0, name);
export const _treasure = (gen, name) => _imageByGen('treasures', gen, name);
export const _zCrystal = (name) => _imageByGen('zcrystals', 0, name);
export const _location = (game, name) => _imageByGame('locations', game, name);
export const _npc = (gameOrOptions, name, maybeOptions) => _npcImage(name, gameOrOptions, maybeOptions);
export const _sticker = (name) => _imageByGame('stickers', '', name);
export const _task = (game, name, ...args) => _imageByGame('tasks', game, name, ...args);

export function _badges(imgs) {
	if (!Array.isArray(imgs)) imgs = [imgs];
	return imgs.map((name) => _assetPath(`badges/${name}.png`));
}

export function _medal(type, name) {
	return _assetPath(`medals/${type}/${name}.png`);
}

export function _typing(type) {
	return _assetPath(`typings/${type}.png`);
}

export function _trainerCard(gameKey, type, name) {
	let game = '';
	switch (gameKey) {
		case 'sword':
		case 'shield': game = 'swsh'; break;
		case 'swordioa':
		case 'shieldioat': game = 'ioa'; break;
		case 'swordct':
		case 'shieldct': game = 'ct'; break;
	}

	return _assetPath(`trainer-cards/${game}/${type}/${name}.png`);
}

export function _fashionItem(gameKey, genderKey, categoryId, name) {
	let game = '';
	switch (gameKey) {
		case 'x':
		case 'y':
			game = 'gen6/xy'; break;
		case 'sun':
		case 'moon':
		case 'ultrasun':
		case 'ultramoon':
			game = 'gen7/sun-moon-ultra'; break;
		case 'letsgopikachu':
		case 'letsgoeevee':
			game = 'gen7_2'; break;
		case 'sword':
		case 'swordioa':
		case 'swordct':
		case 'shield':
		case 'shieldioa':
		case 'shieldct':
			game = 'gen8/sword-shield'; break;
		case 'brilliantdiamond':
		case 'shiningpearl':
			game = 'gen8_2/brilliantdiamond-shiningpearl'; break;
		case 'legendsarceus':
			game = 'gen8_2/legendsarceus'; break;
		case 'scarlet':
		case 'scarlettm':
		case 'scarletid':
		case 'violet':
		case 'violettm':
		case 'violetid':
			game = 'gen9/scarlet-violet'; break;
		case 'legendsza':
		case 'legendszamd':
			game = 'gen9_2'; break;
	}

	const gender = (genderKey || 'unisex').toLowerCase();
	return _assetPath(`fashion/${game}/${gender}/${categoryId}/${name}.png`);
}

export function _curryItem(folder, name) {
	return _assetPath(`curry/${folder}/${name}.png`);
}

export function _sandwichItem(tier, name) {
	return _assetPath(`sandwiches/${tier}/${name}.png`);
}

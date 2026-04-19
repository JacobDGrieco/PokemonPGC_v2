import { _assetPath } from './assets.js';

const DEX_BUTTON_ICON_BY_GAME = {
	red: 'kanto1',
	blue: 'kanto1',
	yellow: 'kanto1',
	gold: 'johto',
	silver: 'johto',
	crystal: 'johto',
	heartgold: 'johto',
	soulsilver: 'johto',
	ruby: 'hoenn',
	sapphire: 'hoenn',
	emerald: 'hoenn',
	omegaruby: 'hoenn',
	alphasapphire: 'hoenn',
	firered: 'kanto2',
	leafgreen: 'kanto2',
	letsgopikachu: 'kanto2',
	letsgoeevee: 'kanto2',
	diamond: 'sinnoh',
	pearl: 'sinnoh',
	platinum: 'sinnoh',
	brilliantdiamond: 'sinnoh',
	shiningpearl: 'sinnoh',
	black: 'unova',
	white: 'unova',
	black2: 'unova',
	white2: 'unova',
	x: 'kalos',
	y: 'kalos',
	sun: 'alola',
	moon: 'alola',
	ultrasun: 'alola',
	ultramoon: 'alola',
	sword: 'phone',
	shield: 'phone',
	scarlet: 'phone',
	violet: 'phone',
	legendsza: 'phone',
	legendsarceus: 'hisui',
};

export function getDexButtonIconName(gameKey) {
	const normalized = String(gameKey || '').toLowerCase().replace(/[^a-z0-9]/g, '');
	return DEX_BUTTON_ICON_BY_GAME[normalized] || 'phone';
}

export function getDexButtonIconSrc(gameKey, state = 'close') {
	const variant = state === 'open' ? 'open' : 'close';
	const iconName = getDexButtonIconName(gameKey);
	return _assetPath(`dexs/${variant}/${iconName}.png`);
}

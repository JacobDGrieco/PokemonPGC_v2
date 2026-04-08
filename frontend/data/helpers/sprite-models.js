import { _assetPath } from './assets.js';
import { pad4 } from './core.js';
import { formKeyToSuffix } from './dex-register.js';

function resolveGameSpritePathPrefix(gameKey) {
  if (gameKey.indexOf('-') > 0) gameKey = gameKey.split('-')[0];

  switch (String(gameKey || '').toLowerCase()) {
    case 'red':
    case 'blue':
      return 'gen1/red-blue/';
    case 'green':
      return 'gen1/green/';
    case 'yellow':
      return 'gen1/yellow/';
    case 'gold':
      return 'gen2/gold/';
    case 'silver':
      return 'gen2/silver/';
    case 'crystal':
      return 'gen2/crystal/';
    case 'ruby':
    case 'sapphire':
      return 'gen3/ruby-sapphire/';
    case 'firered':
    case 'leafgreen':
      return 'gen3/firered-leafgreen/';
    case 'emerald':
      return 'gen3/emerald/';
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
    case 'swordioa':
    case 'swordct':
    case 'shield':
    case 'shieldioa':
    case 'shieldct':
      return 'gen8/sword-shield/';
    case 'brilliantdiamond':
    case 'shiningpearl':
      return 'gen8/brilliantdiamond-shiningpearl/';
    case 'legendsarceus':
      return 'gen8/legendsarceus/';
    case 'scarlet':
    case 'scarlettm':
    case 'scarletid':
    case 'violet':
    case 'violettm':
    case 'violetid':
      return 'gen9/scarlet-violet/';
    case 'legendsza':
    case 'legendszamd':
      return 'gen9/legendsza/';
    case 'home':
    default:
      return 'pokemon_home/';
  }
}

export function _sprite(gen, game, id, form, shiny, frontBack, thumbIcon, animated) {
  let path = _assetPath(`sprites/${resolveGameSpritePathPrefix(game)}`);

  let folder = '';
  if (gen === 1) folder += !shiny ? 'bw' : 'colored';
  else folder += !shiny ? 'base' : 'shiny';
  folder += !thumbIcon ? (!frontBack ? '-front' : '-back') : '';
  if (!(gen < 6) || gen === 'home') folder += !thumbIcon ? '-thumb' : '-icon';
  folder += !animated ? '' : '-animated';
  path += `${folder}/`;

  path += pad4(id);
  path += form ? `-${formKeyToSuffix(Number(id), form)}` : '';
  path += gen === 5 && animated ? '.gif' : animated ? '.webm' : '.png';

  return path;
}

export function _menuSprite(gen, game, id, formKey, type) {
  const form = formKey ? `-${formKeyToSuffix(Number(id), formKey)}` : '';

  if (gen < 2) return _assetPath(`sprites/gen${gen}/menu-sprites/${type}.png`);
  if (gen < 6) return _assetPath(`sprites/gen${gen}/menu-sprites/${pad4(id)}${form}.png`);
  return _assetPath(`sprites/${resolveGameSpritePathPrefix(game)}menu-sprites/${pad4(id)}${form}.png`);
}

export function wantAnimatedDexSprites(gen) {
  const mode = window.PPGC?._storeRef?.state?.dexSpriteMode
    ?? window.PPGC?.store?.state?.dexSpriteMode
    ?? 'static';

  return mode === 'animated' && Number(gen) >= 5;
}

export function dexSprite(gen, gameKey, opts) {
  const shiny = !!(opts && opts.shiny);

  return (natiId, formKey) => {
    const animated = wantAnimatedDexSprites(gen);

    if (!shiny) {
      return animated
        ? _frontSpriteAnimated(gen, gameKey, natiId, formKey)
        : _frontSprite(gen, gameKey, natiId, formKey);
    }

    return animated
      ? _frontSpriteShinyAnimated(gen, gameKey, natiId, formKey)
      : _frontSpriteShiny(gen, gameKey, natiId, formKey);
  };
}

export function _model(gen, gk, id, form, shiny) {
  if (gen < 6) return undefined;

  const gameKey = String(gk || '').trim();
  const game = resolveGameSpritePathPrefix(gameKey);
  const nati = pad4(id);
  const formKey = formKeyToSuffix(Number(id), form);
  const fileName = formKey ? `${nati}-${formKey}.glb` : `${nati}.glb`;

  return _assetPath(`sprites/${game}models/${nati}/${fileName}`);
}

export const _frontSprite = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, false, false, false, false);
export const _backSprite = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, false, true, false, false);
export const _frontSpriteAnimated = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, false, false, false, true);
export const _backSpriteAnimated = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, false, true, false, true);
export const _iconSprite = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, false, false, true, false);
export const _baseModel = (gen, game, natiId, form) => _model(gen, game, natiId, form, false);
export const _frontSpriteShiny = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, true, false, false, false);
export const _backSpriteShiny = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, true, true, false, false);
export const _frontSpriteShinyAnimated = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, true, false, false, true);
export const _backSpriteShinyAnimated = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, true, true, false, true);
export const _iconSpriteShiny = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, true, false, true, false);
export const _shinyModel = (gen, game, natiId, form) => _model(gen, game, natiId, form, true);

export function buildMonInfoEntry(gen, gameKey, natiId, nameVal) {
  return {
    name: nameVal,
    sprites: {
      front: _frontSprite(gen, gameKey, natiId),
      back: _backSprite(gen, gameKey, natiId),
      frontAnimated: !(gen < 5) ? _frontSpriteAnimated(gen, gameKey, natiId) : null,
      backAnimated: !(gen < 5) ? _backSpriteAnimated(gen, gameKey, natiId) : null,
      icon: (gameKey === 'legendsarceus' || gameKey === 'legendsza') ? _iconSprite(gen, gameKey, natiId) : null,
      iconShiny: (gameKey === 'legendsarceus' || gameKey === 'legendsza') ? _iconSpriteShiny(gen, gameKey, natiId) : null,
      menu: (gameKey === 'legendsarceus' || gameKey === 'legendsza') ? null : _menuSprite(gen, gameKey, natiId),
      frontShiny: _frontSpriteShiny(gen, gameKey, natiId),
      backShiny: _backSpriteShiny(gen, gameKey, natiId),
      frontShinyAnimated: !(gen < 5) ? _frontSpriteShinyAnimated(gen, gameKey, natiId) : null,
      backShinyAnimated: !(gen < 5) ? _backSpriteShinyAnimated(gen, gameKey, natiId) : null,
    },
    models: {
      base: !(gen < 6) ? _baseModel(gen, gameKey, natiId) : null,
      shiny: !(gen < 6) ? _shinyModel(gen, gameKey, natiId) : null,
    },
  };
}

export function buildMonInfoEntryForm(gen, gameKey, natiId, form) {
  return {
    sprites: {
      front: _frontSprite(gen, gameKey, natiId, form),
      back: _backSprite(gen, gameKey, natiId, form),
      frontAnimated: !(gen < 5) ? _frontSpriteAnimated(gen, gameKey, natiId, form) : null,
      backAnimated: !(gen < 5) ? _backSpriteAnimated(gen, gameKey, natiId, form) : null,
      icon: (gameKey === 'legendsarceus' || gameKey === 'legendsza') ? _iconSprite(gen, gameKey, natiId, form) : null,
      iconShiny: (gameKey === 'legendsarceus' || gameKey === 'legendsza') ? _iconSpriteShiny(gen, gameKey, natiId, form) : null,
      menu: (gameKey === 'legendsarceus' || gameKey === 'legendsza') ? null : _menuSprite(gen, gameKey, natiId, form),
      frontShiny: _frontSpriteShiny(gen, gameKey, natiId, form),
      backShiny: _backSpriteShiny(gen, gameKey, natiId, form),
      frontShinyAnimated: !(gen < 5) ? _frontSpriteShinyAnimated(gen, gameKey, natiId, form) : null,
      backShinyAnimated: !(gen < 5) ? _backSpriteShinyAnimated(gen, gameKey, natiId, form) : null,
    },
    models: {
      base: !(gen < 6) ? _baseModel(gen, gameKey, natiId, form) : null,
      shiny: !(gen < 6) ? _shinyModel(gen, gameKey, natiId, form) : null,
    },
  };
}

export function buildMonInfoByGame(natiId, nameVal, games) {
  return Object.fromEntries(
    Object.entries(games).map(([gameKey, gen]) => [
      gameKey,
      {
        [natiId]: buildMonInfoEntry(gen, gameKey, natiId, nameVal),
      },
    ])
  );
}

export function buildMonInfoFormsByGame(natiId, form, games) {
  return Object.fromEntries(
    Object.entries(games).map(([gameKey, gen]) => [
      gameKey,
      {
        [natiId]: {
          [form]: buildMonInfoEntryForm(gen, gameKey, natiId, form),
        },
      },
    ])
  );
}

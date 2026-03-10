
function resolveGameSpritePathPrefix(gameKey) {
	if (gameKey.indexOf("-") > 0) gameKey = gameKey.split("-")[0];

	switch (String(gameKey || "").toLowerCase()) {
		// Gen 1
		case "red":
		case "blue":
			return "gen1/red-blue/";
		case "green":
			return "gen1/green/";
		case "yellow":
			return "gen1/yellow/";

		// Gen 2
		case "gold":
			return "gen2/gold/";
		case "silver":
			return "gen2/silver/";
		case "crystal":
			return "gen2/crystal/";

		// Gen 3
		case "ruby":
		case "sapphire":
			return "gen3/ruby-sapphire/";
		case "firered":
		case "leafgreen":
			return "gen3/firered-leafgreen/";
		case "emerald":
			return "gen3/emerald/";

		// Gen 4
		case "diamond":
		case "pearl":
			return "gen4/diamond-pearl/";
		case "platinum":
			return "gen4/platinum/";
		case "heartgold":
		case "soulsilver":
			return "gen4/heartgold-soulsilver/";

		// Gen 5
		case "black":
		case "white":
		case "black2":
		case "white2":
			return "gen5/";

		// Gen 6
		case "x":
		case "y":
		case "omegaruby":
		case "alphasapphire":

		// Gen 7
		case "sun":
		case "moon":
		case "ultrasun":
		case "ultramoon":
			return "gen6-7/x-ultra/";

		// Gen 7 Part 2
		case "letsgopikachu":
		case "letsgoeevee":
			return "gen6-7/lgpe/";

		// Gen 8
		case "sword":
		case "swordioa":
		case "swordct":
		case "shield":
		case "shieldioa":
		case "shieldct":
			return "gen8/sword-shield/";

		// Gen 8 Part 2
		case "brilliantdiamond":
		case "shiningpearl":
			return "gen8/brilliantdiamond-shiningpearl/";
		case "legendsarceus":
			return "gen8/legendsarceus/";

		// Gen 9
		case "scarlet":
		case "scarlettm":
		case "scarletid":
		case "violet":
		case "violettm":
		case "violetid":
			return "gen9/scarlet-violet/";

		// Gen 9 Part 2
		case "legendsza":
		case "legendszamd":
			return "gen9/legendsza/";

		// HOME
		case "home":
		default:
			return "pokemon_home/";
	}
}
window._sprite = function (gen, game, id, form, shiny, frontBack, thumbIcon, animated) {
	let path = _assetPath("imgs/sprites/") + resolveGameSpritePathPrefix(game);

	let folder = "";
	if (gen === 1) folder += !shiny ? "bw" : "colored";
	else folder += !shiny ? "base" : "shiny";
	folder += !thumbIcon ? (!frontBack ? "-front" : "-back") : "";
	if (!(gen < 6) || gen === "home") folder += !thumbIcon ? "-thumb" : "-icon";
	folder += !animated ? "" : "-animated";
	path += folder + "/";

	path += pad4(id);
	path += form ? "-" + formKeyToSuffix(Number(id), form) : "";

	if (gen === 5 && animated) path += ".gif";
	else path += animated ? ".webm" : ".png";

	return path;
};
window._menuSprite = function (gen, game, id, formKey, type) {
	const form = formKey ? "-" + formKeyToSuffix(Number(id), formKey) : "";

	if (gen < 2) {
		return _assetPath("imgs/sprites/gen") + gen + "/menu-sprites/" + type + ".png";
	} else if (gen < 6) {
		return _assetPath("imgs/sprites/gen") + gen + "/menu-sprites/" + pad4(id) + form + ".png";
	} else {
		return _assetPath("imgs/sprites/") + resolveGameSpritePathPrefix(game) + "menu-sprites/" + pad4(id) + form + ".png";
	}
};

window.dexSprite = function dexSprite(gen, gameKey, opts) {
	const shiny = !!(opts && opts.shiny);

	return (natiId, formKey) => {
		const animated = window.wantAnimatedDexSprites(gen);

		if (!shiny) {
			return animated
				? window._frontSpriteAnimated(gen, gameKey, natiId, formKey)
				: window._frontSprite(gen, gameKey, natiId, formKey);
		}

		return animated
			? window._frontSpriteShinyAnimated(gen, gameKey, natiId, formKey)
			: window._frontSpriteShiny(gen, gameKey, natiId, formKey);
	};
};
window.wantAnimatedDexSprites = function (gen) {
	const mode = window.PPGC?._storeRef?.state?.dexSpriteMode
		?? window.PPGC?.store?.state?.dexSpriteMode
		?? "static";

	// Explicit boolean return (never undefined)
	return mode === "animated" && Number(gen) >= 5;
};
window._model = function (gen, gk, id, form, shiny) {
	if (gen < 6) return;

	const gameKey = String(gk || "").trim();
	const game = resolveGameSpritePathPrefix(gameKey);

	const nati = pad4(id);
	const formKey = formKeyToSuffix(Number(id), form);
	const fileName = formKey ? `${nati}-${formKey}.glb` : `${nati}.glb`;

	return _assetPath("imgs/sprites/${game}models/${nati}/${fileName}");
};

window._frontSprite = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, false, false, false, false);
window._backSprite = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, false, true, false, false);
window._frontSpriteAnimated = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, false, false, false, true);
window._backSpriteAnimated = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, false, true, false, true);
window._iconSprite = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, false, false, true, false);
window._baseModel = (gen, game, natiId, form) => _model(gen, game, natiId, form, false);

window._frontSpriteShiny = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, true, false, false, false);
window._backSpriteShiny = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, true, true, false, false);
window._frontSpriteShinyAnimated = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, true, false, false, true);
window._backSpriteShinyAnimated = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, true, true, false, true);
window._iconSpriteShiny = (gen, game, natiId, form) => _sprite(gen, game, natiId, form, true, false, true, false);
window._shinyModel = (gen, game, natiId, form) => _model(gen, game, natiId, form, true);

window.buildMonInfoEntry = function (gen, gameKey, natiId, nameVal) {
	return {
		name: nameVal,
		sprites: {
			front: _frontSprite(gen, gameKey, natiId),
			back: _backSprite(gen, gameKey, natiId),
			frontAnimated: !(gen < 5) ? _frontSpriteAnimated(gen, gameKey, natiId) : null,
			backAnimated: !(gen < 5) ? _backSpriteAnimated(gen, gameKey, natiId) : null,

			icon: (gameKey === "legendsarceus" || gameKey === "legendsza") ? _iconSprite(gen, gameKey, natiId) : null,
			iconShiny: (gameKey === "legendsarceus" || gameKey === "legendsza") ? _iconSpriteShiny(gen, gameKey, natiId) : null,
			menu: (gameKey === "legendsarceus" || gameKey === "legendsza") ? null : _menuSprite(gen, gameKey, natiId),

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
};
window.buildMonInfoEntryForm = function (gen, gameKey, natiId, form) {
	return {
		sprites: {
			front: _frontSprite(gen, gameKey, natiId, form),
			back: _backSprite(gen, gameKey, natiId, form),
			frontAnimated: !(gen < 5) ? _frontSpriteAnimated(gen, gameKey, natiId, form) : null,
			backAnimated: !(gen < 5) ? _backSpriteAnimated(gen, gameKey, natiId, form) : null,

			icon: (gameKey === "legendsarceus" || gameKey === "legendsza") ? _iconSprite(gen, gameKey, natiId, form) : null,
			iconShiny: (gameKey === "legendsarceus" || gameKey === "legendsza") ? _iconSpriteShiny(gen, gameKey, natiId, form) : null,
			menu: (gameKey === "legendsarceus" || gameKey === "legendsza") ? null : _menuSprite(gen, gameKey, natiId, form),

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
};
window.buildMonInfoByGame = function (natiId, nameVal, games) {
	return Object.fromEntries(
		Object.entries(games).map(([gameKey, gen]) => [
			gameKey,
			{
				[natiId]: buildMonInfoEntry(gen, gameKey, natiId, nameVal),
			},
		])
	);
};
window.buildMonInfoFormsByGame = function (natiId, form, games) {
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
};
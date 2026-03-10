(() => {
	const natiId = 710;
	const form = "small";
	const games = gameSearch("gen6", "gen7", "swsh", "lza");

	const monInfoFormsByGame = Object.fromEntries(
		Object.entries(games).map(([gameKey, gen]) => [
			gameKey,
			{
				[natiId]: {
					[form]: {
						sprites: {
							front: _frontSprite(gen, gameKey, natiId, form),
							back: _backSprite(gen, gameKey, natiId, form),
							frontAnimated: (gen < 5) ? null : _frontSpriteAnimated(gen, gameKey, natiId, form),
							backAnimated: (gen < 5) ? null : _backSpriteAnimated(gen, gameKey, natiId, form),
							icon: (gameKey === "legendsarceus" || gameKey === "legendsza") ? _iconSprite(gen, gameKey, natiId, form) : null,
							iconShiny: (gameKey === "legendsarceus" || gameKey === "legendsza") ? _iconSpriteShiny(gen, gameKey, natiId, form) : null,
							menu: (gameKey === "legendsarceus" || gameKey === "legendsza") ? null : _menuSprite(gen, gameKey, natiId, form),
							frontShiny: _frontSpriteShiny(gen, gameKey, natiId, form),
							backShiny: _backSpriteShiny(gen, gameKey, natiId, form),
							frontShinyAnimated: (gen < 5) ? null : _frontSpriteShinyAnimated(gen, gameKey, natiId, form),
							backShinyAnimated: (gen < 5) ? null : _backSpriteShinyAnimated(gen, gameKey, natiId, form),
						},
						models: {
							base: (gen >= 6) ? _baseModel(gen, gameKey, natiId, form) : null,
							shiny: (gen >= 6) ? _shinyModel(gen, gameKey, natiId, form) : null,
						},
					},
				},
			},
		])
	);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
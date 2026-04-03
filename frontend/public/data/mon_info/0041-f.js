(() => {
	const natiId = 41;
	const form = "female";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "lgpe", "swsh", "bdsp", "la", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
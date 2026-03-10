(() => {
	const natiId = 315;
	const form = "female";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "swsh", "bdsp", "la", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
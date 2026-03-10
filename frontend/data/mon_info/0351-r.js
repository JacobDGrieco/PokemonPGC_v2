(() => {
	const natiId = 351;
	const form = "rainy";
	const games = gameSearch("gen3", "gen4", "gen5", "gen6", "gen7", "bdsp");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
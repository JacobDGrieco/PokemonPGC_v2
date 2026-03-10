(() => {
	const natiId = 201;
	const form = "f";
	const games = gameSearch("gen2", "gen3", "gen4", "gen5", "gen6", "gen7", "bdsp", "la");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
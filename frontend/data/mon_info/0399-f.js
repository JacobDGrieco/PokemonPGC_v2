(() => {
	const natiId = 399;
	const form = "female";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "bdsp", "la");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
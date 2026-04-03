(() => {
	const natiId = 493;
	const form = "fairy";
	const games = gameSearch("gen6", "gen7", "bdsp", "la", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
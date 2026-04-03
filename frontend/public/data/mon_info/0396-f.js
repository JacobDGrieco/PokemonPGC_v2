(() => {
	const natiId = 396;
	const form = "female";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "bdsp", "la", "scvi", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
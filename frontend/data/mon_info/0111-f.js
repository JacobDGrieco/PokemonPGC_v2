(() => {
	const natiId = 111;
	const form = "female";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "lgpe", "bdsp", "la", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
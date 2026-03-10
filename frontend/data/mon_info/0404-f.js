(() => {
	const natiId = 404;
	const form = "female";
	const games = gameSearch("gen4", "gen5", "gen6", "gen7", "swsh", "bdsp", "la", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
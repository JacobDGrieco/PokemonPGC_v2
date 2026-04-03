(() => {
	const natiId = 550;
	const form = "blue-striped";
	const games = gameSearch("gen5", "gen6", "gen7", "swsh", "la", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
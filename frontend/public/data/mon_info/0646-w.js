(() => {
	const natiId = 646;
	const form = "white-kyurem";
	const games = gameSearch("bw2", "gen6", "gen7", "swsh", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
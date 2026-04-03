(() => {
	const natiId = 25;
	const form = "kalos-cap";
	const games = gameSearch("gen7", "swsh", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
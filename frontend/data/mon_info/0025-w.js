(() => {
	const natiId = 25;
	const form = "world-cap";
	const games = gameSearch("swsh", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
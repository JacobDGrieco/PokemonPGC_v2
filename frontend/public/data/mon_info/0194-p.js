(() => {
	const natiId = 194;
	const form = "paldean";
	const games = gameSearch("scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
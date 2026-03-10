(() => {
	const natiId = 484;
	const form = "origin";
	const games = gameSearch("la", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
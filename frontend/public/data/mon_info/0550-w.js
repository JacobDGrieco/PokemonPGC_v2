(() => {
	const natiId = 550;
	const form = "white-striped";
	const games = gameSearch("la", "scvi");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
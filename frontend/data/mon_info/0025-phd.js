(() => {
	const natiId = 25;
	const form = "phd";
	const games = gameSearch("oras");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
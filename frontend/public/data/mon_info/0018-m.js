(() => {
	const natiId = 18;
	const form = "mega";
	const games = gameSearch("oras", "gen7", "lgpe", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
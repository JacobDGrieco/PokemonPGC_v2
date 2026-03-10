(() => {
	const natiId = 382;
	const form = "primal";
	const games = gameSearch("oras", "gen7", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
(() => {
	const natiId = 150;
	const form = "mega-x";
	const games = gameSearch("gen6", "gen7", "lgpe", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
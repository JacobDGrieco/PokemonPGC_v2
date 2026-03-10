(() => {
	const natiId = 26;
	const form = "mega-x";
	const games = gameSearch("lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
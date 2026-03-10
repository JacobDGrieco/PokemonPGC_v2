(() => {
	const natiId = 36;
	const form = "mega";
	const games = gameSearch("lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
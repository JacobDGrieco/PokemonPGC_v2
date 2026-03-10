(() => {
	const natiId = 618;
	const form = "galarian";
	const games = gameSearch("swsh", "lza");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
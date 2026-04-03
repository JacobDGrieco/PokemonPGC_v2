(() => {
	const natiId = 20;
	const form = "alolan";
	const games = gameSearch("gen7", "lgpe");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
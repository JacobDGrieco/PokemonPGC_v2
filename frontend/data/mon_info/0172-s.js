(() => {
	const natiId = 172;
	const form = "spiky-eared";
	const games = gameSearch("hgss");

	const monInfoFormsByGame = buildMonInfoFormsByGame(natiId, form, games);

	window.PPGC.register({
		monInfoForms: monInfoFormsByGame,
	});
})();
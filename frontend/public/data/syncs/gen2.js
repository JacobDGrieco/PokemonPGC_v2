window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS = ["gold", "silver", "crystal"];

defineSyncsMany(GAME_KEYS, (gameKey, { taskSync, eitherTaskSync, regionalSync }) => [
	{ name: "Trade for Articuno", members: [taskSync("catching", 1, 1), regionalSync(235, { oneWay: true }),], },
	{ name: "Trade for Zapdos", members: [taskSync("catching", 1, 2), regionalSync(236, { oneWay: true }),], },
	{ name: "Trade for Moltres", members: [taskSync("catching", 1, 3), regionalSync(237, { oneWay: true }),], },
	{ name: "Trade for Mewtwo", members: [taskSync("catching", 1, 4), regionalSync(249, { oneWay: true }),], },

	{ name: "Catch Raikou", members: [taskSync("catching", 1, 5), regionalSync(238, { oneWay: true }),], },
	{ name: "Catch Entei", members: [taskSync("catching", 1, 6), regionalSync(239, { oneWay: true }),], },
	{ name: "Catch Suicune", members: [taskSync("catching", 1, 7), regionalSync(240, { oneWay: true }),], },
	{ name: "Trade for Lugia", members: [taskSync("catching", 1, 8), regionalSync(247, { oneWay: true }),], },
	{ name: "Catch Ho-Oh", members: [taskSync("catching", 1, 9), regionalSync(248, { oneWay: true }),], },

	{ name: "Bellsprout for Onix", members: [taskSync("catching", 6, 1), regionalSync(64, { oneWay: true }), regionalSync(62, { oneWay: true }),], },
	{ name: "Drowzee for Machop", members: [taskSync("catching", 6, 2), regionalSync(87, { oneWay: true }), regionalSync(140, { oneWay: true }),], },
	{ name: "Krabby for Voltorb", members: [taskSync("catching", 6, 3), regionalSync(164, { oneWay: true }), regionalSync(120, { oneWay: true }),], },
	{ name: "Dragonair for Rhydon", members: [taskSync("catching", 6, 4), regionalSync(242, { oneWay: true }), regionalSync(207, { oneWay: true }),], },
	{ name: "Gloom for Rapidash", members: [taskSync("catching", 6, 5), regionalSync(84, { oneWay: true }), regionalSync(202, { oneWay: true }),], },
	{ name: "Chansey for Aerodactyl", members: [taskSync("catching", 6, 6), regionalSync(217, { oneWay: true }), regionalSync(224, { oneWay: true }),], },

	{ name: "Defeat Blue", members: [taskSync("story", 2, 2, { oneWay: true }), taskSync("story", 3, 8),], },
	{ name: "Defeat Blaine", members: [taskSync("story", 2, 3), taskSync("story", 3, 7),], },

	{ name: "Obtain Mew", members: [taskSync("extra-credit", 1), regionalSync(250),], },
	{ name: "Obtain Celebi", members: [taskSync("extra-credit", 2), regionalSync(251),], },
]);

defineSyncsMany([GAME_KEYS[0], GAME_KEYS[1]], (gameKey, { taskSync, eitherTaskSync, regionalSync }) => [
	{ name: "Spearow Gift", members: [taskSync("catching", 5, 1), regionalSync(13, { oneWay: true }),], },
	{ name: "Eevee Gift", members: [taskSync("catching", 5, 2), regionalSync(180, { oneWay: true }),], },
	{ name: "Togepi Gift", members: [taskSync("catching", 5, 3), regionalSync(46, { oneWay: true }),], },
	{ name: "Shuckle Gift", members: [taskSync("catching", 5, 4), regionalSync(166, { oneWay: true }),], },
	{ name: "Tyrogue Gift", members: [taskSync("catching", 5, 5), regionalSync(143, { oneWay: true }),], },
]);

defineSyncsMany([GAME_KEYS[2]], (gameKey, { taskSync, eitherTaskSync, regionalSync }) => [
	{ name: "Spearow Gift", members: [taskSync("catching", 5, 2), regionalSync(13, { oneWay: true }),], },
	{ name: "Eevee Gift", members: [taskSync("catching", 5, 3), regionalSync(180, { oneWay: true }),], },
	{ name: "Togepi Gift", members: [taskSync("catching", 5, 4), regionalSync(46, { oneWay: true }),], },
	{ name: "Dratini Gift", members: [taskSync("catching", 5, 5), regionalSync(241, { oneWay: true }),], },
	{ name: "Shuckle Gift", members: [taskSync("catching", 5, 6), regionalSync(166, { oneWay: true }),], },
	{ name: "Tyrogue Gift", members: [taskSync("catching", 5, 7), regionalSync(143, { oneWay: true }),], },
]);
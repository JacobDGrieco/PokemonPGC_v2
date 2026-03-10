window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS = ["diamond", "pearl", "platinum"];
const GAME_KEYS2 = ["heartgold", "soulsilver"];

defineSyncsMany(GAME_KEYS, (gameKey, { taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Catch Dialga", members: [taskSync("catching", 1, 1), regionalSync(149, { oneWay: true }), nationalSync(483, { oneWay: true })], },
	{ name: "Catch Palkia", members: [taskSync("catching", 1, 2), regionalSync(150, { oneWay: true }), nationalSync(484, { oneWay: true })], },
	{ name: "Catch Giratina", members: [taskSync("catching", 1, 3), nationalSync(487, { oneWay: true })], },
	{ name: "Catch Uxie", members: [taskSync("catching", 1, 4), regionalSync(146, { oneWay: true }), nationalSync(480, { oneWay: true })], },
	{ name: "Catch Mesprit", members: [taskSync("catching", 1, 5), regionalSync(147, { oneWay: true }), nationalSync(481, { oneWay: true })], },
	{ name: "Catch Azelf", members: [taskSync("catching", 1, 6), regionalSync(148, { oneWay: true }), nationalSync(482, { oneWay: true })], },
	{ name: "Catch Heatran", members: [taskSync("catching", 1, 7), nationalSync(485, { oneWay: true })], },
	{ name: "Catch Regigigas", members: [taskSync("catching", 1, 8), nationalSync(486, { oneWay: true })], },
	{ name: "Catch Cresselia", members: [taskSync("catching", 1, 9), nationalSync(488, { oneWay: true })], },

	{ name: "Catch Rotom", members: [taskSync("catching", 2, 1), nationalSync(479, { oneWay: true })], },
	{ name: "Catch Spiritomb", members: [taskSync("catching", 3, 1), nationalSync(442, { oneWay: true })], },

	{
		name: "Machop for Abra", members: [
			taskSync("catching", 5, 1),
			regionalSync(40, { oneWay: true }),
			regionalSync(20, { oneWay: true }),
			nationalSync(66, { oneWay: true }),
			nationalSync(63, { oneWay: true })
		],
	},
	{
		name: "Buizel for Chatot", members: [
			taskSync("catching", 5, 2),
			regionalSync(56, { oneWay: true }),
			regionalSync(102, { oneWay: true }),
			nationalSync(418, { oneWay: true }),
			nationalSync(441, { oneWay: true })
		],
	},
	{
		name: "Medicham for Haunter", members: [
			taskSync("catching", 5, 3),
			regionalSync(87, { oneWay: true }),
			regionalSync(70, { oneWay: true }),
			nationalSync(308, { oneWay: true }),
			nationalSync(93, { oneWay: true })
		],
	},
	{
		name: "Finneon for Magikarp", members: [
			taskSync("catching", 5, 4),
			regionalSync(134, { oneWay: true }),
			regionalSync(70, { oneWay: true }),
			nationalSync(356, { oneWay: true }),
			nationalSync(93, { oneWay: true })
		],
	},

	{ name: "Defeat E4", members: [taskSync("story", 1), taskSync("upgrades", 3, 1),], },

	{ name: "Obtain Phione", members: [taskSync("extra-credit", 1), nationalSync(489, { oneWay: true })], },
	{ name: "Obtain Manaphy", members: [taskSync("extra-credit", 2), regionalSync(151, { oneWay: true }), nationalSync(490, { oneWay: true })], },
	{ name: "Obtain Darkrai", members: [taskSync("extra-credit", 3), nationalSync(491, { oneWay: true })], },
	{ name: "Obtain Shaymin", members: [taskSync("extra-credit", 4), nationalSync(492, { oneWay: true })], },
	{ name: "Obtain Arceus", members: [taskSync("extra-credit", 5), nationalSync(493, { oneWay: true })], },
]);

defineSyncsMany([GAME_KEYS[0], GAME_KEYS[1]], (gameKey, { taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Eevee Gift", members: [taskSync("catching", 4, 3), nationalSync(133, { oneWay: true })], },
	{ name: "Riolu Gift", members: [taskSync("catching", 4, 4), regionalSync(115, { oneWay: true }), nationalSync(447, { oneWay: true })], },
]);
defineSyncsMany([GAME_KEYS[2]], (gameKey, { taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Eevee Gift", members: [taskSync("catching", 4, 2), nationalSync(133, { oneWay: true })], },
	{ name: "Riolu Gift", members: [taskSync("catching", 4, 3), regionalSync(115, { oneWay: true }), nationalSync(447, { oneWay: true })], },
]);

defineSyncsMany(GAME_KEYS2, (gameKey, { taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Catch Lugia", members: [taskSync("catching", 1, 1), regionalSync(252, { oneWay: true }), nationalSync(249, { oneWay: true })], },
	{ name: "Catch Ho-Oh", members: [taskSync("catching", 1, 2), regionalSync(253, { oneWay: true }), nationalSync(250, { oneWay: true })], },
]);
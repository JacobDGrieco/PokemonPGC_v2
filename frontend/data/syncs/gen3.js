import {
	defineSyncsMany,
} from '../helpers/index.js';

window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS1 = ["ruby", "sapphire", "emerald"];
const GAME_KEYS2 = ["emerald"];
const GAME_KEYS3 = ["firered", "leafgreen"];

defineSyncsMany([...GAME_KEYS1, ...GAME_KEYS2], ({ taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Catch Kyogre", members: [taskSync("catching", 1, 1), regionalSync(198, { oneWay: true }), nationalSync(382, { oneWay: true })], },
	{ name: "Catch Groudon", members: [taskSync("catching", 1, 2), regionalSync(199, { oneWay: true }), nationalSync(383, { oneWay: true })], },
	{ name: "Catch Rayquaza", members: [taskSync("catching", 1, 3), regionalSync(200, { oneWay: true }), nationalSync(384, { oneWay: true })], },
	{ name: "Catch Regirock", members: [taskSync("catching", 1, 4), regionalSync(193, { oneWay: true }), nationalSync(377, { oneWay: true })], },
	{ name: "Catch Regice", members: [taskSync("catching", 1, 5), regionalSync(194, { oneWay: true }), nationalSync(378, { oneWay: true })], },
	{ name: "Catch Registeel", members: [taskSync("catching", 1, 6), regionalSync(195, { oneWay: true }), nationalSync(379, { oneWay: true })], },
	{ name: "Catch Latias", members: [taskSync("catching", 1, 7), regionalSync(196, { oneWay: true }), nationalSync(380, { oneWay: true })], },
	{ name: "Catch Latios", members: [taskSync("catching", 1, 8), regionalSync(167, { oneWay: true }), nationalSync(381, { oneWay: true })], },

	{ name: "Fossil Choice - Lileep", members: [eitherTaskSync("catching", 2, 1, "1"), regionalSync(133, { oneWay: true }), nationalSync(345, { oneWay: true })] },
	{ name: "Fossil Choice - Anorith", members: [eitherTaskSync("catching", 2, 1, "2"), regionalSync(135, { oneWay: true }), nationalSync(347, { oneWay: true })] },
	{ name: "Beldum Gift", members: [taskSync("catching", 2, 2), regionalSync(190, { oneWay: true }), nationalSync(374, { oneWay: true })], },
	{ name: "Castform Gift", members: [taskSync("catching", 2, 3), regionalSync(142, "Normal", { oneWay: true }), nationalSync(351, "Normal", { oneWay: true })], },
	{ name: "Wynaut Gift", members: [taskSync("catching", 2, 4), regionalSync(160, { oneWay: true }), nationalSync(360, { oneWay: true })], },

	{
		name: "Slakoth for Makuhita", members: [
			taskSync("catching", 3, 1),
			regionalSync(36, { oneWay: true }),
			regionalSync(48, { oneWay: true }),
			nationalSync(287, { oneWay: true }),
			nationalSync(296, { oneWay: true })
		],
	},
	{
		name: "Pikachu for Skitty", members: [
			taskSync("catching", 3, 2),
			regionalSync(156, { oneWay: true }),
			regionalSync(61, { oneWay: true }),
			nationalSync(25, { oneWay: true }),
			nationalSync(300, { oneWay: true })
		],
	},
	{
		name: "Bellossum for Corsola", members: [
			taskSync("catching", 3, 3),
			regionalSync(91, { oneWay: true }),
			regionalSync(180, { oneWay: true }),
			nationalSync(182, { oneWay: true }),
			nationalSync(222, { oneWay: true })
		],
	},

	{ name: "Defeat E4", members: [taskSync("story", 1), taskSync("upgrades", 2, 1),], },
	{ name: "Master all Contests", members: [taskSync("activities", 1), taskSync("upgrades", 2, 2),], },
	{ name: "Pretty Chair", members: [taskSync("collectables", 2, 1), taskSync("collectables", 4, 13),], },
	{ name: "Pretty Desk", members: [taskSync("collectables", 2, 2), taskSync("collectables", 4, 6),], },
	{ name: "Obtain Jirachi", members: [taskSync("extra-credit", 1), regionalSync(201), nationalSync(385)], },
]);

defineSyncsMany(GAME_KEYS1, ({ taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Obtain Deoxys", members: [taskSync("extra-credit", 2), regionalSync(202, "Normal"), nationalSync(386, "Normal")], },
]);
defineSyncsMany(GAME_KEYS2, ({ taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Catch Lugia", members: [taskSync("catching", 1, 9), nationalSync(249, { oneWay: true })], },
	{ name: "Catch Ho-Oh", members: [taskSync("catching", 1, 10), nationalSync(250, { oneWay: true })], },

	{ name: "Obtain Deoxys", members: [taskSync("extra-credit", 2), regionalSync(202, "Speed"), nationalSync(386, "Speed")], },
]);

defineSyncsMany(GAME_KEYS3, ({ taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Catch Articuno", members: [taskSync("catching", 1, 1), regionalSync(144, { oneWay: true }), nationalSync(144, { oneWay: true })], },
	{ name: "Catch Zapdos", members: [taskSync("catching", 1, 2), regionalSync(145, { oneWay: true }), nationalSync(144, { oneWay: true })], },
	{ name: "Catch Moltres", members: [taskSync("catching", 1, 3), regionalSync(146, { oneWay: true }), nationalSync(144, { oneWay: true })], },
	{ name: "Catch Mewtwo", members: [taskSync("catching", 1, 4), taskSync("story", 2, 1), regionalSync(150, { oneWay: true }), nationalSync(144, { oneWay: true })], },
	{ name: "Catch Raikou", members: [taskSync("catching", 1, 5), nationalSync(243, { oneWay: true })], },
	{ name: "Catch Entei", members: [taskSync("catching", 1, 6), nationalSync(244, { oneWay: true })], },
	{ name: "Catch Suicune", members: [taskSync("catching", 1, 7), nationalSync(245, { oneWay: true })], },

	{ name: "Martial Arts Choice - Hitmonlee", members: [eitherTaskSync("catching", 3, 1, "left"), regionalSync(106, { oneWay: true }), nationalSync(106, { oneWay: true })] },
	{ name: "Martial Arts Choice - Hitmonchan", members: [eitherTaskSync("catching", 3, 1, "right"), regionalSync(107, { oneWay: true }), nationalSync(107, { oneWay: true })] },
	{ name: "Fossil Choice - Omanyte", members: [eitherTaskSync("catching", 3, 2, "left"), regionalSync(138, { oneWay: true }), nationalSync(138, { oneWay: true })] },
	{ name: "Fossil Choice - Kabuto", members: [eitherTaskSync("catching", 3, 2, "right"), regionalSync(140, { oneWay: true }), nationalSync(140, { oneWay: true })] },
	{ name: "Lapras Gift", members: [taskSync("catching", 3, 3), regionalSync(131, { oneWay: true }), nationalSync(131, { oneWay: true })], },
	{ name: "Aerodactyl Gift", members: [taskSync("catching", 3, 4), regionalSync(142, { oneWay: true }), nationalSync(142, { oneWay: true })], },
	{ name: "Eevee Gift", members: [taskSync("catching", 3, 5), regionalSync(133, { oneWay: true }), nationalSync(133, { oneWay: true })], },
	{ name: "Togepi Gift", members: [taskSync("catching", 3, 5), nationalSync(175, { oneWay: true }),], },

	{
		name: "Abra for Mr. Mime", members: [
			taskSync("catching", 4, 1),
			regionalSync(63, { oneWay: true }),
			regionalSync(122, { oneWay: true }),
			nationalSync(63, { oneWay: true }),
			nationalSync(122, { oneWay: true })
		],
	},
	{
		name: "Nidoran ♂ for Nidoran ♀", members: [
			taskSync("catching", 4, 2),
			regionalSync(32, { oneWay: true }),
			regionalSync(29, { oneWay: true }),
			nationalSync(32, { oneWay: true }),
			nationalSync(29, { oneWay: true })

		],
	},
	{
		name: "Nidorino for Nidorina", members: [
			taskSync("catching", 4, 3),
			regionalSync(33, { oneWay: true }),
			regionalSync(30, { oneWay: true }),
			nationalSync(33, { oneWay: true }),
			nationalSync(30, { oneWay: true })

		],
	},
	{
		name: "Slowbro for Lickitung", members: [
			taskSync("catching", 4, 4),
			regionalSync(80, { oneWay: true }),
			regionalSync(108, { oneWay: true }),
			nationalSync(80, { oneWay: true }),
			nationalSync(108, { oneWay: true })

		],
	},
	{
		name: "Poliwhirl for Jynx", members: [
			taskSync("catching", 4, 5),
			regionalSync(61, { oneWay: true }),
			regionalSync(124, { oneWay: true }),
			nationalSync(61, { oneWay: true }),
			nationalSync(124, { oneWay: true })

		],
	},
	{
		name: "Spearow for Farfetch'd", members: [
			taskSync("catching", 4, 6),
			regionalSync(21, { oneWay: true }),
			regionalSync(83, { oneWay: true }),
			nationalSync(21, { oneWay: true }),
			nationalSync(83, { oneWay: true })

		],
	},
	{
		name: "Ponyta for Seel", members: [
			taskSync("catching", 4, 7),
			regionalSync(77, { oneWay: true }),
			regionalSync(86, { oneWay: true }),
			nationalSync(77, { oneWay: true }),
			nationalSync(86, { oneWay: true })

		],
	},
	{
		name: "Raichu for Electrode", members: [
			taskSync("catching", 4, 8),
			regionalSync(26, { oneWay: true }),
			regionalSync(101, { oneWay: true }),
			nationalSync(26, { oneWay: true }),
			nationalSync(101, { oneWay: true })
		],
	},
	{
		name: "Venonat for Tangela", members: [
			taskSync("catching", 4, 9),
			regionalSync(48, { oneWay: true }),
			regionalSync(114, { oneWay: true }),
			nationalSync(48, { oneWay: true }),
			nationalSync(114, { oneWay: true })
		],
	},

	{ name: "Defeat E4", members: [taskSync("story", 1), taskSync("upgrades", 2, 1),], },

	{ name: "Obtain Mew", members: [taskSync("extra-credit", 1), regionalSync(151), nationalSync(151)], },
]);

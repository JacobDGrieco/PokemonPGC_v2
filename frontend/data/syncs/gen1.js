window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS = ["red", "blue", "yellow"];

defineSyncsMany(GAME_KEYS, (gameKey, { taskSync, eitherTaskSync, regionalSync }) => [
	{ name: "Catch Articuno", members: [taskSync("catching", 1, 1), regionalSync(144, { oneWay: true }),], },
	{ name: "Catch Zapdos", members: [taskSync("catching", 1, 2), regionalSync(145, { oneWay: true }),], },
	{ name: "Catch Moltres", members: [taskSync("catching", 1, 3), regionalSync(146, { oneWay: true }),], },
	{ name: "Catch Mewtwo", members: [taskSync("catching", 1, 4), taskSync("story", 2, 1), regionalSync(150, { oneWay: true }),], },

	{ name: "Martial Arts Choice - Hitmonlee", members: [eitherTaskSync("catching", 3, 1, "left"), regionalSync(106, { oneWay: true }),] },
	{ name: "Martial Arts Choice - Hitmonchan", members: [eitherTaskSync("catching", 3, 1, "right"), regionalSync(107, { oneWay: true }),] },
	{ name: "Fossil Choice - Omanyte", members: [eitherTaskSync("catching", 3, 2, "left"), regionalSync(138, { oneWay: true }),] },
	{ name: "Fossil Choice - Kabuto", members: [eitherTaskSync("catching", 3, 2, "right"), regionalSync(140, { oneWay: true }),] },
	{ name: "Lapras Gift", members: [taskSync("catching", 3, 3), regionalSync(131, { oneWay: true }),], },
	{ name: "Aerodactyl Gift", members: [taskSync("catching", 3, 4), regionalSync(142, { oneWay: true }),], },
	{ name: "Eevee Gift", members: [taskSync("catching", 3, 5), regionalSync(133, { oneWay: true }),], },

	{ name: "Abra for Mr. Mime", members: [taskSync("catching", 4, 1), regionalSync(63, { oneWay: true }), regionalSync(122, { oneWay: true }),], },
	{ name: "Nidoran ♂ for Nidoran ♀", members: [taskSync("catching", 4, 2), regionalSync(32, { oneWay: true }), regionalSync(29, { oneWay: true }),], },
	{ name: "Nidorino for Nidorina", members: [taskSync("catching", 4, 3), regionalSync(33, { oneWay: true }), regionalSync(30, { oneWay: true }),], },
	{ name: "Slowbro for Lickitung", members: [taskSync("catching", 4, 4), regionalSync(80, { oneWay: true }), regionalSync(108, { oneWay: true }),], },
	{ name: "Poliwhirl for Jynx", members: [taskSync("catching", 4, 5), regionalSync(61, { oneWay: true }), regionalSync(124, { oneWay: true }),], },
	{ name: "Spearow for Farfetch'd", members: [taskSync("catching", 4, 6), regionalSync(21, { oneWay: true }), regionalSync(83, { oneWay: true }),], },
	{ name: "Ponyta for Seel", members: [taskSync("catching", 4, 7), regionalSync(77, { oneWay: true }), regionalSync(86, { oneWay: true }),], },
	{ name: "Raichu for Electrode", members: [taskSync("catching", 4, 8), regionalSync(26, { oneWay: true }), regionalSync(101, { oneWay: true }),], },
	{ name: "Venonat for Tangela", members: [taskSync("catching", 4, 9), regionalSync(48, { oneWay: true }), regionalSync(114, { oneWay: true }),], },

	{ name: "Obtain Mew", members: [taskSync("extra-credit", 1), regionalSync(151)], },
]);

window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS = ["x", "y"];
const GAME_KEYS2 = ["omegaruby", "alphasapphire"];

defineSyncsMany(GAME_KEYS, (gameKey, { taskSync, eitherTaskSync, centralKalosSync, coastalKalosSync, mountainKalosSync, nationalSync }) => [
	{ name: "Catch Xerneas", members: [taskSync("catching", 1, 1), mountainKalosSync(148, { oneWay: true }), nationalSync(716, { oneWay: true })], },
	{ name: "Catch Yveltal", members: [taskSync("catching", 1, 2), mountainKalosSync(149, { oneWay: true }), nationalSync(717, { oneWay: true })], },
	{ name: "Catch Zygarde", members: [taskSync("catching", 1, 3), mountainKalosSync(150, { oneWay: true }), nationalSync(718, { oneWay: true })], },
]);

defineSyncsMany(GAME_KEYS2, (gameKey, { taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Catch Kyogre", members: [taskSync("catching", 1, 1), regionalSync(207, { oneWay: true }), nationalSync(382, { oneWay: true })], },
	{ name: "Catch Groudon", members: [taskSync("catching", 1, 2), regionalSync(208, { oneWay: true }), nationalSync(383, { oneWay: true })], },
	{ name: "Catch Rayquaza", members: [taskSync("catching", 1, 3), regionalSync(209, { oneWay: true }), nationalSync(384, { oneWay: true })], },
]);
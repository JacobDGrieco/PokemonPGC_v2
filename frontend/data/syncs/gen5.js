window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS = ["black", "white"];
const GAME_KEYS2 = ["black2", "white2"];

defineSyncsMany(GAME_KEYS, (gameKey, { taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Catch Reshiram", members: [taskSync("catching", 1, 1), regionalSync(149, { oneWay: true }), nationalSync(643, { oneWay: true })], },
	{ name: "Catch Zekrom", members: [taskSync("catching", 1, 2), regionalSync(150, { oneWay: true }), nationalSync(644, { oneWay: true })], },
	{ name: "Catch Kyurem", members: [taskSync("catching", 1, 3), regionalSync(152, { oneWay: true }), nationalSync(646, { oneWay: true })], },
	{ name: "Catch Tornadus", members: [taskSync("catching", 1, 4), regionalSync(147, { oneWay: true }), nationalSync(641, { oneWay: true })], },
	{ name: "Catch Thundurus", members: [taskSync("catching", 1, 5), regionalSync(148, { oneWay: true }), nationalSync(642, { oneWay: true })], },
	{ name: "Catch Landorus", members: [taskSync("catching", 1, 6), regionalSync(151, { oneWay: true }), nationalSync(645, { oneWay: true })], },

	{ name: "Pansage Gift", members: [taskSync("catching", 2, 1), regionalSync(17, { oneWay: true }), nationalSync(511, { oneWay: true })], },

	{ name: "Defeat E4", members: [taskSync("story", 1), taskSync("upgrades", 2, 1)], },

	{ name: "Obtain Victini", members: [taskSync("extra-credit", 1, 1), regionalSync(0, { oneWay: true }), nationalSync(494, { oneWay: true })], },
	{ name: "Obtain Keldeo", members: [taskSync("extra-credit", 1, 2), regionalSync(153, { oneWay: true }), nationalSync(647, { oneWay: true })], },
	{ name: "Obtain Meloetta", members: [taskSync("extra-credit", 1, 3), regionalSync(154, { oneWay: true }), nationalSync(648, { oneWay: true })], },
	{ name: "Obtain Genesect", members: [taskSync("extra-credit", 1, 4), regionalSync(155, { oneWay: true }), nationalSync(649, { oneWay: true })], },
]);

defineSyncsMany(GAME_KEYS2, (gameKey, { taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Catch Reshiram", members: [taskSync("catching", 1, 1), regionalSync(295, { oneWay: true }), nationalSync(643, { oneWay: true })], },
	{ name: "Catch Zekrom", members: [taskSync("catching", 1, 2), regionalSync(296, { oneWay: true }), nationalSync(644, { oneWay: true })], },
	{ name: "Catch Kyurem", members: [taskSync("catching", 1, 3), regionalSync(298, { oneWay: true }), nationalSync(646, { oneWay: true })], },
]);

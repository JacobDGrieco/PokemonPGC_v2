window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS = ["black", "white"];
const GAME_KEYS2 = ["black2", "white2"];

defineSyncsMany(GAME_KEYS, (gameKey, { taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Catch Reshiram", members: [taskSync("catching", 1, 1), regionalSync(149, { oneWay: true }), nationalSync(643, { oneWay: true })], },
	{ name: "Catch Zekrom", members: [taskSync("catching", 1, 2), regionalSync(150, { oneWay: true }), nationalSync(644, { oneWay: true })], },
	{ name: "Catch Kyurem", members: [taskSync("catching", 1, 3), regionalSync(152, { oneWay: true }), nationalSync(646, { oneWay: true })], },
]);

defineSyncsMany(GAME_KEYS2, (gameKey, { taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Catch Reshiram", members: [taskSync("catching", 1, 1), regionalSync(295, { oneWay: true }), nationalSync(643, { oneWay: true })], },
	{ name: "Catch Zekrom", members: [taskSync("catching", 1, 2), regionalSync(296, { oneWay: true }), nationalSync(644, { oneWay: true })], },
	{ name: "Catch Kyurem", members: [taskSync("catching", 1, 3), regionalSync(298, { oneWay: true }), nationalSync(646, { oneWay: true })], },
]);
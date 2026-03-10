window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS = ["brilliantdiamond", "shiningpearl"];
const GAME_KEYS2 = ["legendsarceus"];

defineSyncsMany(GAME_KEYS, (gameKey, { taskSync, eitherTaskSync, regionalSync, nationalSync }) => [
	{ name: "Catch Dialga", members: [taskSync("catching", 1, 1), regionalSync(149, { oneWay: true }), nationalSync(483, { oneWay: true })], },
	{ name: "Catch Palkia", members: [taskSync("catching", 1, 2), regionalSync(150, { oneWay: true }), nationalSync(484, { oneWay: true })], },
	{ name: "Catch Giratina", members: [taskSync("catching", 1, 3), nationalSync(487, { oneWay: true })], },
]);

defineSyncsMany(GAME_KEYS2, (gameKey, { taskSync, eitherTaskSync, regionalSync }) => [
	{ name: "Catch Dialga", members: [taskSync("catching", 1, 1), regionalSync(235, { oneWay: true })], },
	{ name: "Catch Palkia", members: [taskSync("catching", 1, 2), regionalSync(236, { oneWay: true })], },
	{ name: "Catch Giratina", members: [taskSync("catching", 1, 3), regionalSync(237, { oneWay: true })], },
]);
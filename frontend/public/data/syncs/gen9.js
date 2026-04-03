window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS = ["scarlet", "violet"];
const GAME_KEYS2 = ["scarlettm", "violettm"];
const GAME_KEYS3 = ["scarletid", "violetid"];

defineSyncsMany(GAME_KEYS, (gameKey, { taskSync, eitherTaskSync, regionalSync, regionalSyncCross }) => [
	{ name: "Catch Koraidon", members: [taskSync("catching", 1, 1), regionalSync(399, { oneWay: true })], },
	{ name: "Catch Miraidon", members: [taskSync("catching", 1, 2), regionalSync(400, { oneWay: true })], },
]);

defineSyncsMany(GAME_KEYS2, (gameKey, { taskSync, eitherTaskSync, regionalSync, regionalSyncCross }) => [
	{ name: "Catch Okidogi", members: [taskSync("catching", 1, 1), regionalSync(197, { oneWay: true })], },
	{ name: "Catch Munkidori", members: [taskSync("catching", 1, 2), regionalSync(198, { oneWay: true })], },
	{ name: "Catch Fezandipiti", members: [taskSync("catching", 1, 3), regionalSync(199, { oneWay: true })], },
	{ name: "Catch Ogerpon", members: [taskSync("catching", 1, 4), regionalSync(200, { oneWay: true })], },
]);

defineSyncsMany(GAME_KEYS3, (gameKey, { taskSync, eitherTaskSync, regionalSync, regionalSyncCross }) => [
	{ name: "Catch Terapagos", members: [taskSync("catching", 1, 1), regionalSync(240, { oneWay: true })], },
]);
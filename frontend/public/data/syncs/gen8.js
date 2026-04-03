window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS = ["sword", "shield"];
const GAME_KEYS2 = ["swordioa", "shieldioa"];
const GAME_KEYS3 = ["swordct", "shieldct"];

defineSyncsMany(GAME_KEYS, (gameKey, { taskSync, eitherTaskSync, regionalSync, regionalSyncCross }) => [
	{ name: "Catch Zacian", members: [taskSync("catching", 1, 1), regionalSync(398, { oneWay: true })], },
	{ name: "Catch Zamazenta", members: [taskSync("catching", 1, 2), regionalSync(399, { oneWay: true })], },
	{ name: "Catch Eternatus", members: [taskSync("catching", 1, 3), regionalSync(400, { oneWay: true })], },
]);

defineSyncsMany(GAME_KEYS2, (gameKey, { taskSync, eitherTaskSync, regionalSync, regionalSyncCross }) => [
	{ name: "Obtain Kubfu", members: [taskSync("catching", 1, 1), regionalSync(100, { oneWay: true })], },
	{ name: "Evolve to Urshifu - Single Strike", members: [eitherTaskSync("catching", 1, 2, "left"), regionalSync(101, "Single Strike Style", { oneWay: true })], },
	{ name: "Evolve to Urshifu - Rapid Strike", members: [eitherTaskSync("catching", 1, 2, "right"), regionalSync(101, "Rapid Strike Style", { oneWay: true })], },
]);

defineSyncsMany(GAME_KEYS3, (gameKey, { taskSync, eitherTaskSync, regionalSync, regionalSyncCross }) => [
	{ name: "Catch Glastrier", members: [taskSync("catching", 1, 1), regionalSync(208, { oneWay: true })], },
	{ name: "Catch Spectrier", members: [taskSync("catching", 1, 2), regionalSync(209, { oneWay: true })], },
	{ name: "Catch Calyrex", members: [taskSync("catching", 1, 3), regionalSync(210, { oneWay: true })], },
]);
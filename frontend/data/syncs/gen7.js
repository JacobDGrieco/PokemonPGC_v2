window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS = ["sun", "moon"];
const GAME_KEYS2 = ["ultrasun", "ultramoon"];

defineSyncsMany(GAME_KEYS, (gameKey, { taskSync, eitherTaskSync, alolaSync, melemeleSync, akalaSync, ulaulaSync, poniSync }) => [
	{ name: "Catch Solgaleo", members: [taskSync("catching", 1, 1), alolaSync(291, { oneWay: true })], },
	{ name: "Catch Lunala", members: [taskSync("catching", 1, 2), alolaSync(292, { oneWay: true })], },
	{ name: "Catch Necrozma", members: [taskSync("catching", 1, 3), alolaSync(300, { oneWay: true })], },
]);

defineSyncsMany(GAME_KEYS2, (gameKey, { taskSync, eitherTaskSync, alolaSync, melemeleSync, akalaSync, ulaulaSync, poniSync }) => [
	{ name: "Catch Solgaleo", members: [taskSync("catching", 1, 1), alolaSync(389, { oneWay: true })], },
	{ name: "Catch Lunala", members: [taskSync("catching", 1, 2), alolaSync(390, { oneWay: true })], },
	{ name: "Catch Necrozma", members: [taskSync("catching", 1, 3), alolaSync(400, { oneWay: true })], },
]);
window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS = ["letsgopikachu", "letsgoeevee"];

defineSyncsMany(GAME_KEYS, (gameKey, { taskSync, eitherTaskSync, regionalSync }) => [
	{ name: "Catch Articuno", members: [taskSync("catching", 1, 1), regionalSync(144, { oneWay: true }),], },
	{ name: "Catch Zapdos", members: [taskSync("catching", 1, 2), regionalSync(145, { oneWay: true }),], },
	{ name: "Catch Moltres", members: [taskSync("catching", 1, 3), regionalSync(146, { oneWay: true }),], },
	{ name: "Catch Mewtwo", members: [taskSync("catching", 1, 4), regionalSync(150, { oneWay: true }),], },
]);
import {
	defineSyncsMany,
} from '../helpers/index.js';

window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS1 = ["red", "blue"];
const GAME_KEYS2 = ["yellow"];

defineSyncsMany([...GAME_KEYS1, ...GAME_KEYS2], ({ taskSync, regionalSync }) => [
	{ name: "Catch Articuno", members: [taskSync("catching", 1, 1), regionalSync(144, { oneWay: true }),], },
	{ name: "Catch Zapdos", members: [taskSync("catching", 1, 2), regionalSync(145, { oneWay: true }),], },
	{ name: "Catch Moltres", members: [taskSync("catching", 1, 3), regionalSync(146, { oneWay: true }),], },
	{ name: "Catch Mewtwo", members: [taskSync("catching", 1, 4), taskSync("story", 2, 1), regionalSync(150, { oneWay: true }),], },
	{ name: "Power Plant Electrode", members: [taskSync("catching", 2, 4), regionalSync(101, { oneWay: true }),], },
	{ name: "Power Plant Voltorb", members: [taskSync("catching", 2, 5), regionalSync(100, { oneWay: true }),], },
	{ name: "Obtain Mew", members: [taskSync("extra-credit", 1, 1), regionalSync(151)], },
]);

defineSyncsMany(GAME_KEYS1, ({ taskSync, eitherTaskSync, regionalSync }) => [
	{ name: "Magikarp Gift", members: [taskSync("catching", 3, 1), regionalSync(129, { oneWay: true }),], },
	{ name: "Martial Arts Choice - Hitmonlee", members: [eitherTaskSync("catching", 3, 2, "left"), regionalSync(106, { oneWay: true }),] },
	{ name: "Martial Arts Choice - Hitmonchan", members: [eitherTaskSync("catching", 3, 2, "right"), regionalSync(107, { oneWay: true }),] },
	{ name: "Fossil Choice - Omanyte", members: [eitherTaskSync("catching", 3, 3, "left"), regionalSync(138, { oneWay: true }),] },
	{ name: "Fossil Choice - Kabuto", members: [eitherTaskSync("catching", 3, 3, "right"), regionalSync(140, { oneWay: true }),] },
	{ name: "Lapras Gift", members: [taskSync("catching", 3, 4), regionalSync(131, { oneWay: true }),], },
	{ name: "Aerodactyl Gift", members: [taskSync("catching", 3, 5), regionalSync(142, { oneWay: true }),], },
	{ name: "Eevee Gift", members: [taskSync("catching", 3, 6), regionalSync(133, { oneWay: true }),], },

	{ name: "Abra for Mr. Mime", members: [taskSync("catching", 4, 1), regionalSync(63, { oneWay: true }), regionalSync(122, { oneWay: true }),], },
	{ name: "Nidoran male for Nidoran female", members: [taskSync("catching", 4, 2), regionalSync(32, { oneWay: true }), regionalSync(29, { oneWay: true }),], },
	{ name: "Nidorino for Nidorina", members: [taskSync("catching", 4, 3), regionalSync(33, { oneWay: true }), regionalSync(30, { oneWay: true }),], },
	{ name: "Slowbro for Lickitung", members: [taskSync("catching", 4, 4), regionalSync(80, { oneWay: true }), regionalSync(108, { oneWay: true }),], },
	{ name: "Poliwhirl for Jynx", members: [taskSync("catching", 4, 5), regionalSync(61, { oneWay: true }), regionalSync(124, { oneWay: true }),], },
	{ name: "Spearow for Farfetch'd", members: [taskSync("catching", 4, 6), regionalSync(21, { oneWay: true }), regionalSync(83, { oneWay: true }),], },
	{ name: "Ponyta for Seel", members: [taskSync("catching", 4, 7), regionalSync(77, { oneWay: true }), regionalSync(86, { oneWay: true }),], },
	{ name: "Raichu for Electrode", members: [taskSync("catching", 4, 8), regionalSync(26, { oneWay: true }), regionalSync(101, { oneWay: true }),], },
	{ name: "Venonat for Tangela", members: [taskSync("catching", 4, 9), regionalSync(48, { oneWay: true }), regionalSync(114, { oneWay: true }),], },
]);

defineSyncsMany(GAME_KEYS2, ({ taskSync, eitherTaskSync, regionalSync }) => [
	{ name: "Magikarp Gift", members: [taskSync("catching", 3, 1), regionalSync(129, { oneWay: true }),], },
	{ name: "Martial Arts Choice - Hitmonlee", members: [eitherTaskSync("catching", 3, 2, "left"), regionalSync(106, { oneWay: true }),] },
	{ name: "Martial Arts Choice - Hitmonchan", members: [eitherTaskSync("catching", 3, 2, "right"), regionalSync(107, { oneWay: true }),] },
	{ name: "Bulbasaur Gift", members: [taskSync("catching", 3, 3), regionalSync(1, { oneWay: true }),], },
	{ name: "Charmander Gift", members: [taskSync("catching", 3, 4), regionalSync(4, { oneWay: true }),], },
	{ name: "Squirtle Gift", members: [taskSync("catching", 3, 5), regionalSync(7, { oneWay: true }),], },
	{ name: "Fossil Choice - Omanyte", members: [eitherTaskSync("catching", 3, 6, "left"), regionalSync(138, { oneWay: true }),] },
	{ name: "Fossil Choice - Kabuto", members: [eitherTaskSync("catching", 3, 6, "right"), regionalSync(140, { oneWay: true }),] },
	{ name: "Lapras Gift", members: [taskSync("catching", 3, 7), regionalSync(131, { oneWay: true }),], },
	{ name: "Aerodactyl Gift", members: [taskSync("catching", 3, 8), regionalSync(142, { oneWay: true }),], },
	{ name: "Eevee Gift", members: [taskSync("catching", 3, 9), regionalSync(133, { oneWay: true }),], },

	{ name: "Clefairy for Mr. Mime", members: [taskSync("catching", 4, 1), regionalSync(35, { oneWay: true }), regionalSync(122, { oneWay: true }),], },
	{ name: "Cubone for Machoke", members: [taskSync("catching", 4, 2), regionalSync(104, { oneWay: true }), regionalSync(67, { oneWay: true }),], },
	{ name: "Lickitung for Dugtrio", members: [taskSync("catching", 4, 3), regionalSync(108, { oneWay: true }), regionalSync(51, { oneWay: true }),], },
	{ name: "Parasect for Tangela", members: [taskSync("catching", 4, 4), regionalSync(47, { oneWay: true }), regionalSync(114, { oneWay: true }),], },
	{ name: "Golduck for Rhydon", members: [taskSync("catching", 4, 5), regionalSync(55, { oneWay: true }), regionalSync(112, { oneWay: true }),], },
	{ name: "Growlithe for Dewgong", members: [taskSync("catching", 4, 6), regionalSync(58, { oneWay: true }), regionalSync(87, { oneWay: true }),], },
	{ name: "Kangaskhan for Muk", members: [taskSync("catching", 4, 7), regionalSync(115, { oneWay: true }), regionalSync(89, { oneWay: true }),], },
]);

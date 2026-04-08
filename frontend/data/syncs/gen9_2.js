import {
  defineSyncsMany,
} from '../helpers/index.js';

window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS = ["legendsza", "legendszamd"];

defineSyncsMany([GAME_KEYS[0]], (gameKey, { taskSync, eitherTaskSync, regionalSync }) => [
	{ name: "Catch Xerneas", members: [taskSync("catching", 1, 1), taskSync("story", 2, 2), regionalSync(228, { oneWay: true }),], },
	{ name: "Catch Yveltal", members: [taskSync("catching", 1, 2), taskSync("story", 2, 3), regionalSync(229, { oneWay: true }),], },
	{
		name: "Obtain Zygarde", members: [
			taskSync("catching", 1, 3),
			taskSync("story", 2, 4),
			taskSync("mega-stones", 62),
			regionalSync(230, { oneWay: true }),
		],
	},

	{ name: "Absol Gift", members: [taskSync("catching", 2, 1), regionalSync(134, { oneWay: true }),], },
	{ name: "Chespin Gift", members: [taskSync("catching", 2, 2), taskSync("side-quests", 7), regionalSync(213, { oneWay: true }),], },
	{ name: "Fennekin Gift", members: [taskSync("catching", 2, 3), taskSync("side-quests", 8), regionalSync(217, { oneWay: true }),], },
	{ name: "Froakie Gift", members: [taskSync("catching", 2, 4), taskSync("side-quests", 9), regionalSync(209, { oneWay: true }),], },
	{ name: "Spewpa Gift", members: [taskSync("catching", 2, 5), taskSync("side-quests", 21), regionalSync(16, { oneWay: true }),], },
	{ name: "Obtain Kanto Starter - Bulbasaur", members: [eitherTaskSync("catching", 2, 6, 1), taskSync("side-quests", 22), regionalSync(148, { oneWay: true }),], },
	{ name: "Obtain Kanto Starter - Charmander", members: [eitherTaskSync("catching", 2, 6, 2), taskSync("side-quests", 22), regionalSync(151, { oneWay: true }),], },
	{ name: "Obtain Kanto Starter - Squirtle", members: [eitherTaskSync("catching", 2, 6, 3), taskSync("side-quests", 22), regionalSync(154, { oneWay: true }),], },
	{ name: "Galarian Stunfisk Gift", members: [taskSync("catching", 2, 7), taskSync("side-quests", 72), regionalSync(57, "Galarian", { oneWay: true }),], },
	{ name: "Lucario Gift", members: [taskSync("catching", 2, 8), regionalSync(136, { oneWay: true }),], },
	{
		name: "Obtain Eternal Flower Floette", members: [
			taskSync("catching", 2, 9),
			taskSync("story", 2, 1),
			taskSync("mega-stones", 10),
			regionalSync(39, "Eternal Flower", { oneWay: true }),
		],
	},

	{
		name: "Pichu for Heracross",
		members: [
			taskSync("catching", 3, 1),
			taskSync("side-quests", 2),
			regionalSync(52, { oneWay: true }),
			regionalSync(179, "Male", { oneWay: true }),
		],
	},

	{
		name: "Abra for Riolu",
		members: [
			taskSync("catching", 3, 2),
			taskSync("side-quests", 24),
			regionalSync(62, { oneWay: true }),
			regionalSync(135, { oneWay: true }),
		],
	},

	{
		name: "K Slowpoke for G Slowpoke",
		members: [
			taskSync("catching", 3, 3),
			taskSync("side-quests", 39),
			regionalSync(137, "Kantonian", { oneWay: true }),
			regionalSync(137, "Galarian", { oneWay: true }),
		],
	},
	{
		name: "K Raichu for A Raichu",
		members: [
			taskSync("catching", 3, 4),
			taskSync("side-quests", 108),
			regionalSync(54, "Kantonian Male", { oneWay: true }),
			regionalSync(54, "Alolan", { oneWay: true }),
		],
	},

	{ name: "Buy all Canari Plushies", members: [taskSync("battle", 1, 7), taskSync("upgrades", 1),], },

	{ name: "Obtain Absolite", members: [taskSync("story", 1, 9), taskSync("mega-stones", 31),], },
	{ name: "Obtain Slowbronite", members: [taskSync("story", 1, 11), taskSync("mega-stones", 33),], },
	{ name: "Obtain Cameruptite", members: [taskSync("story", 1, 12), taskSync("mega-stones", 26),], },
	{ name: "Obtain Victreebelite", members: [taskSync("story", 1, 13), taskSync("mega-stones", 16),], },
	{ name: "Obtain Beedrillite", members: [taskSync("story", 1, 16), taskSync("mega-stones", 4),], },
	{ name: "Obtain Hawluchanite", members: [taskSync("story", 1, 17), taskSync("mega-stones", 49),], },
	{ name: "Obtain Banettite", members: [taskSync("story", 1, 18), taskSync("mega-stones", 25),], },
	{ name: "Obtain Mawilite", members: [taskSync("story", 1, 21), taskSync("mega-stones", 30),], },
	{ name: "Obtain Barbaracite", members: [taskSync("story", 1, 22), taskSync("mega-stones", 8),], },
	{ name: "Obtain Ampharosite", members: [taskSync("story", 1, 23), taskSync("mega-stones", 6),], },
	{ name: "Obtain Froslassite", members: [taskSync("story", 1, 27), taskSync("mega-stones", 44),], },
	{ name: "Obtain Altarianite", members: [taskSync("story", 1, 28), taskSync("mega-stones", 22),], },
	{ name: "Obtain Venusaurite", members: [taskSync("story", 1, 29), taskSync("mega-stones", 37),], },
	{ name: "Obtain Dragoninite", members: [taskSync("story", 1, 32), taskSync("mega-stones", 36),], },
	{ name: "Obtain Tyranitarite", members: [taskSync("story", 1, 33), taskSync("mega-stones", 55),], },
	{ name: "Obtain Starminite", members: [taskSync("story", 1, 34), taskSync("mega-stones", 9),], },

	{ name: "Obtain TM 31", members: [taskSync("side-quests", 34), taskSync("thms", 31),], },
	{ name: "Obtain TM 43", members: [taskSync("side-quests", 46), taskSync("thms", 43),], },
	{ name: "Obtain TM 48", members: [taskSync("side-quests", 96), taskSync("thms", 48),], },
	{ name: "Obtain TM 57", members: [taskSync("side-quests", 26), taskSync("thms", 57),], },
	{ name: "Obtain TM 70", members: [taskSync("side-quests", 60), taskSync("thms", 70),], },
	{ name: "Obtain TM 85", members: [taskSync("side-quests", 29), taskSync("thms", 85),], },
	{ name: "Obtain TM 88", members: [taskSync("side-quests", 41), taskSync("thms", 88),], },
	{ name: "Obtain TM 99", members: [taskSync("side-quests", 79), taskSync("thms", 99),], },
]);

defineSyncsMany([GAME_KEYS[1]], (gameKey, { taskSync, eitherTaskSync, regionalSync, regionalSyncCross, fashionSync }) => [
	{ name: "Catch Heatran", members: [taskSync("catching", 1, 1), taskSync("story", 1, 9), regionalSync(113, { oneWay: true }),], },
	{ name: "Catch Darkrai", members: [taskSync("catching", 1, 2), taskSync("story", 1, 11), regionalSync(114, { oneWay: true }),], },
	{ name: "Catch Kyogre", members: [taskSync("catching", 1, 3), taskSync("story", 2, 3), regionalSync(128, { oneWay: true }),], },
	{ name: "Catch Groudon", members: [taskSync("catching", 1, 4), taskSync("story", 2, 2), regionalSync(129, { oneWay: true }),], },
	{ name: "Catch Rayquaza", members: [taskSync("catching", 1, 5), taskSync("story", 2, 1), regionalSync(130, { oneWay: true }),], },
	{
		name: "Catch Latias", members: [
			taskSync("catching", 1, 6),
			taskSync("side-quests", 2, 70),
			taskSync("mega-stones", 20),
			taskSync("mega-stones", 21),
			regionalSync(126, { oneWay: true }),
		],
	},
	{
		name: "Catch Latios", members: [
			taskSync("catching", 1, 7),
			taskSync("side-quests", 2, 70),
			taskSync("mega-stones", 20),
			taskSync("mega-stones", 21),
			regionalSync(127, { oneWay: true }),
		],
	},
	{ name: "Catch Cobalion", members: [taskSync("catching", 1, 8), regionalSync(115, { oneWay: true }),], },
	{ name: "Catch Terrakion", members: [taskSync("catching", 1, 9), regionalSync(116, { oneWay: true }),], },
	{ name: "Catch Virizion", members: [taskSync("catching", 1, 10), regionalSync(117, { oneWay: true }),], },

	{ name: "Catch Keldeo", members: [taskSync("catching", 2, 1), regionalSync(118, { oneWay: true }),], },
	{ name: "Catch Meloetta", members: [taskSync("catching", 2, 2), regionalSync(119, { oneWay: true }),], },
	{ name: "Catch Genesect", members: [taskSync("catching", 2, 3), taskSync("side-quests", 2, 72), regionalSync(120, { oneWay: true }),], },
	{ name: "Catch Hoopa", members: [taskSync("catching", 2, 4), taskSync("side-quests", 2, 77), regionalSync(121, { oneWay: true }),], },
	{ name: "Catch Volcanion", members: [taskSync("catching", 2, 5), taskSync("side-quests", 2, 75), regionalSync(114, { oneWay: true }),], },
	{
		name: "Catch Megearna", members: [
			taskSync("catching", 2, 6),
			taskSync("side-quests", 2, 76),
			taskSync("mega-stones", 24),
			regionalSync(131, { oneWay: true }),
		],
	},
	{ name: "Catch Marshadow", members: [taskSync("catching", 2, 7), taskSync("side-quests", 2, 73), regionalSync(122, { oneWay: true }),], },
	{
		name: "Obtain Zeraorite", members: [
			taskSync("catching", 2, 8),
			taskSync("side-quests", 1, 3),
			taskSync("mega-stones", 25),
			regionalSync(132, { oneWay: true }),
		],
	},
	{ name: "Catch Melmetal", members: [taskSync("catching", 2, 9), taskSync("side-quests", 2, 74), regionalSync(123, { oneWay: true }),], },
	{ name: "Catch Meltan", members: [taskSync("catching", 2, 10), taskSync("side-quests", 2, 74), regionalSync(124, { oneWay: true }),], },

	{
		name: "Porygon for Porygon", members: [
			taskSync("catching", 3, 1),
			taskSync("side-quests", 2, 48),
			taskSync("thms", 40),
			regionalSync(11, { oneWay: true }),
			regionalSync(12, { oneWay: true }),
		],
	},

	{
		name: "Obtain Mewtwonite X & Y", members: [
			taskSync("side-quests", 1, 2),
			taskSync("mega-stones", 7),
			taskSync("mega-stones", 8),
			regionalSyncCross(GAME_KEYS[0], 232, { oneWay: true }),
		],
	},
	{ name: "Obtain Diancite", members: [taskSync("side-quests", 1, 1), taskSync("mega-stones", 9), regionalSyncCross(GAME_KEYS[0], 231, { oneWay: true }),], },

	{ name: "Obtain Raichunite X & Y", members: [taskSync("side-quests", 2, 20), taskSync("mega-stones", 2), taskSync("mega-stones", 3),], },
	{ name: "Obtain Crabominite", members: [taskSync("side-quests", 2, 22), taskSync("mega-stones", 17),], },
	{ name: "DYNA4MO Duo", members: [taskSync("side-quests", 2, 32), fashionSync("all-in-one", 1, 1), fashionSync("satchels", 2, 1),], },
	{
		name: "Fist of Justice Duo", members: [
			taskSync("side-quests", 2, 33),
			fashionSync("all-in-one", 2, 1),
			fashionSync("gloves", 1, 1),
			fashionSync("footwear", 3, 1),
			fashionSync("satchels", 3, 1,)
		],
	},
	{
		name: "Rust Syndicate Duo", members: [
			taskSync("side-quests", 2, 34),
			fashionSync("all-in-one", 3, 1),
			fashionSync("eyewear", 2, 1),
			fashionSync("satchels", 4, 1),
		],
	},
	{
		name: "SBC Duo", members: [
			taskSync("side-quests", 2, 35),
			fashionSync("all-in-one", 4, 1),
			fashionSync("headwear", 2, 1),
			fashionSync("gloves", 2, 1),
			fashionSync("legwear", 1, 1),
			fashionSync("footwear", 4, 1),
			fashionSync("satchels", 5, 1),
		],
	},
	{
		name: "Team Flare Nouveau Duo", members: [
			taskSync("side-quests", 2, 36),
			fashionSync("tops", 3, 1),
			fashionSync("bottoms", 3, 1),
			fashionSync("eyewear", 3, 1),
			fashionSync("footwear", 5, 1),
			fashionSync("satchels", 6, 1),
		],
	},
	{ name: "DYNA4MO Duo...Again", members: [taskSync("side-quests", 2, 62), fashionSync("all-in-one", 1, 2), fashionSync("satchels", 2, 2),], },
	{
		name: "Fist of Justice Duo...Again", members: [
			taskSync("side-quests", 2, 63),
			fashionSync("all-in-one", 2, 2),
			fashionSync("gloves", 1, 2),
			fashionSync("footwear", 3, 2),
			fashionSync("satchels", 3, 2),
		],
	},
	{
		name: "Rust Syndicate Duo...Again", members: [
			taskSync("side-quests", 2, 64),
			fashionSync("all-in-one", 3, 2),
			fashionSync("glasses", 2, 2),
			fashionSync("satchels", 4, 2),
		],
	},
	{
		name: "SBC Duo...Again", members: [
			taskSync("side-quests", 2, 65),
			fashionSync("all-in-one", 4, 2),
			fashionSync("headdwear", 2, 2),
			fashionSync("gloves", 2, 2),
			fashionSync("legwear", 1, 2),
			fashionSync("footwear", 4, 2),
			fashionSync("satchels", 5, 2),
		],
	},
	{
		name: "Team Flare Nouveau Duo...Again", members: [
			taskSync("side-quests", 2, 66),
			fashionSync("tops", 3, 2),
			fashionSync("bottoms", 3, 2),
			fashionSync("eyewear", 3, 2),
			fashionSync("footwear", 5, 2),
			fashionSync("satchels", 6, 2),
		],
	},
	{ name: "Obtain Lucarionite Z", members: [taskSync("side-quests", 2, 78), taskSync("mega-stones", 6),] },
	{ name: "Obtain Absolite Z", members: [taskSync("story", 1, 1), taskSync("mega-stones", 5),], },
	{ name: "Obtain Staraptite", members: [taskSync("story", 1, 3), taskSync("mega-stones", 16),], },
	{ name: "Obtain Tatsugirinite", members: [taskSync("story", 1, 6), taskSync("mega-stones", 12),], },
	{ name: "Obtain Meowsticite", members: [taskSync("story", 1, 8), taskSync("mega-stones", 1),], },

	{ name: "Obtain TM 109", members: [taskSync("story", 2, 19), taskSync("thms", 2),], },
	{ name: "Obtain TM 114", members: [taskSync("story", 2, 6), taskSync("thms", 7),], },
	{ name: "Obtain TM 116", members: [taskSync("story", 2, 24), taskSync("thms", 9),], },
	{ name: "Obtain TM 118", members: [taskSync("story", 2, 52), taskSync("thms", 11),], },
	{ name: "Obtain TM 119", members: [taskSync("story", 2, 29), taskSync("thms", 12),], },
	{ name: "Obtain TM 121", members: [taskSync("story", 2, 26), taskSync("thms", 14),], },
	{ name: "Obtain TM 122", members: [taskSync("story", 2, 14), taskSync("thms", 15),], },
	{ name: "Obtain TM 123", members: [taskSync("story", 2, 37), taskSync("thms", 16),], },
	{ name: "Obtain TM 125", members: [taskSync("story", 2, 47), taskSync("thms", 18),], },
	{ name: "Obtain TM 127", members: [taskSync("story", 2, 49), taskSync("thms", 20),], },
	{ name: "Obtain TM 130", members: [taskSync("story", 2, 54), taskSync("thms", 23),], },
	{ name: "Obtain TM 136", members: [taskSync("story", 2, 27), taskSync("thms", 29),], },
	{ name: "Obtain TM 139", members: [taskSync("story", 2, 15), taskSync("thms", 32),], },
	{ name: "Obtain TM 141", members: [taskSync("story", 2, 56), taskSync("thms", 34),], },
	{ name: "Obtain TM 144", members: [taskSync("story", 2, 5), taskSync("thms", 37),], },
	{ name: "Obtain TM 146", members: [taskSync("story", 2, 4), taskSync("thms", 39),], },
]);
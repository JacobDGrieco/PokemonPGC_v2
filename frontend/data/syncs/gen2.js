import {
	defineSyncsMany,
} from '../helpers/index.js';

window.DATA = window.DATA || {};
window.DATA.syncs = window.DATA.syncs || {};

const GAME_KEYS = ["gold", "silver", "crystal"];

defineSyncsMany(GAME_KEYS, (gameKey, { taskSync, eitherTaskSync, regionalSync }) => [
	{ name: "Catch Raikou", members: [taskSync("catching", 1, 1), regionalSync(238, { oneWay: true }),], },
	{ name: "Catch Entei", members: [taskSync("catching", 1, 2), regionalSync(239, { oneWay: true }),], },
	{ name: "Catch Suicune", members: [taskSync("catching", 1, 3), regionalSync(240, { oneWay: true }),], },
	{ name: "Catch Lugia", members: [taskSync("catching", 1, 4), regionalSync(247, { oneWay: true }),], },
	{ name: "Catch Ho-Oh", members: [taskSync("catching", 1, 5), regionalSync(248, { oneWay: true }),], },

	{ name: "Bellsprout for Onix", members: [taskSync("catching", 4, 1), regionalSync(64, { oneWay: true }), regionalSync(62, { oneWay: true }),], },
	{ name: "Drowzee for Machop", members: [taskSync("catching", 4, 2), regionalSync(87, { oneWay: true }), regionalSync(140, { oneWay: true }),], },
	{ name: "Krabby for Voltorb", members: [taskSync("catching", 4, 3), regionalSync(164, { oneWay: true }), regionalSync(120, { oneWay: true }),], },
	{ name: "Dragonair for Rhydon", members: [taskSync("catching", 4, 4), regionalSync(242, { oneWay: true }), regionalSync(207, { oneWay: true }),], },
	{ name: "Gloom for Rapidash", members: [taskSync("catching", 4, 5), regionalSync(84, { oneWay: true }), regionalSync(202, { oneWay: true }),], },
	{ name: "Chansey for Aerodactyl", members: [taskSync("catching", 4, 6), regionalSync(217, { oneWay: true }), regionalSync(224, { oneWay: true }),], },

	{ name: "Defeat Blue", members: [taskSync("story", 2, 2, { oneWay: true }), taskSync("story", 3, 8),], },
	{ name: "Defeat Blaine", members: [taskSync("story", 2, 3), taskSync("story", 3, 7),], },

	{ name: "Obtain Mew", members: [taskSync("extra-credit", 1), regionalSync(250),], },
	{ name: "Obtain Celebi", members: [taskSync("extra-credit", 2), regionalSync(251),], },
]);

defineSyncsMany([GAME_KEYS[0], GAME_KEYS[1]], (gameKey, { taskSync, eitherTaskSync, regionalSync }) => [
	{ name: "Rocket HQ Geodude", members: [taskSync("catching", 2, 4), regionalSync(34, { oneWay: true }),], },
	{ name: "Rocket HQ Koffing", members: [taskSync("catching", 2, 5), regionalSync(114, { oneWay: true }),], },
	{ name: "Rocket HQ Voltorb", members: [taskSync("catching", 2, 6), regionalSync(120, { oneWay: true }),], },
	{ name: "Rocket HQ Electrode", members: [taskSync("catching", 2, 7), regionalSync(121, { oneWay: true }),], },

	{ name: "Spearow Gift", members: [taskSync("catching", 3, 1), regionalSync(13, { oneWay: true }),], },
	{ name: "Eevee Gift", members: [taskSync("catching", 3, 2), regionalSync(180, { oneWay: true }),], },
	{ name: "Togepi Gift", members: [taskSync("catching", 3, 3), regionalSync(46, { oneWay: true }),], },
	{ name: "Shuckle Gift", members: [taskSync("catching", 3, 4), regionalSync(166, { oneWay: true }),], },
	{ name: "Tyrogue Gift", members: [taskSync("catching", 3, 5), regionalSync(143, { oneWay: true }),], },
]);

defineSyncsMany([GAME_KEYS[2]], (gameKey, { taskSync, eitherTaskSync, regionalSync }) => [
	{ name: "Rocket HQ Geodude", members: [taskSync("catching", 2, 4), regionalSync(34, { oneWay: true }),], },
	{ name: "Rocket HQ Koffing", members: [taskSync("catching", 2, 5), regionalSync(114, { oneWay: true }),], },
	{ name: "Rocket HQ Voltorb", members: [taskSync("catching", 2, 6), regionalSync(120, { oneWay: true }),], },
	{ name: "Rocket HQ Electrode", members: [taskSync("catching", 2, 7), regionalSync(121, { oneWay: true }),], },

	{ name: "Spearow Gift", members: [taskSync("catching", 3, 2), regionalSync(13, { oneWay: true }),], },
	{ name: "Eevee Gift", members: [taskSync("catching", 3, 3), regionalSync(180, { oneWay: true }),], },
	{ name: "Togepi Gift", members: [taskSync("catching", 3, 4), regionalSync(46, { oneWay: true }),], },
	{ name: "Dratini Gift", members: [taskSync("catching", 3, 5), regionalSync(241, { oneWay: true }),], },
	{ name: "Shuckle Gift", members: [taskSync("catching", 3, 6), regionalSync(166, { oneWay: true }),], },
	{ name: "Tyrogue Gift", members: [taskSync("catching", 3, 7), regionalSync(143, { oneWay: true }),], },
]);

import {
	_keyItem,
	_tm,
	_location,
	_npc,
	_task,
	_frontSprite,
	defineTasksMany,
} from '../helpers/index.js';

(() => {
	const gen = 9;
	const GAME_KEYS = ["scarlettm", "violettm"];

	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);
	const task = (gameKey, name) => _task(gameKey, name);
	const npc = (gameKey, name) => _npc(gameKey, name);
	const location = (gameKey, name) => _location(gameKey, name);
	const keyItem = (name) => _keyItem(gen, name);
	const tm = (type) => _tm(gen, type);

	const SECTIONS = [
		{ id: "catching", title: "Gotta Catch 'Em All" },
		{ id: "story", title: "Main Story" },
		{ id: "sideQuests", title: "Side Quests" },
		{ id: "activities", title: "Activities" },
		{ id: "battle", title: "Battle" },
		{ id: "upgrades", title: "Upgrades" },
		{ id: "collectables", title: "Collectables" },
		{ id: "fashion", title: "Fashion" },
		{ id: "thms", title: "TMs" },
	];

	const TASKS_BY_SECTION = {
		catching: [
			{
				id: 1, text: "Catch all the Legendaries/Mythicals", children: [
					{ id: 1, text: "Catch Okidogi", img: ({ gameKey }) => baseSprite(gameKey, 1014), tooltip: "Re-catchable after story in original battle location" },
					{ id: 2, text: "Catch Munkidori", img: ({ gameKey }) => baseSprite(gameKey, 1015), tooltip: "Re-catchable after story in original battle location" },
					{ id: 3, text: "Catch Fezandipiti", img: ({ gameKey }) => baseSprite(gameKey, 1016), tooltip: "Re-catchable after story in original battle location" },
					{ id: 4, text: "Catch Ogerpon", img: ({ gameKey }) => baseSprite(gameKey, 1017), tooltip: "Other mask forms change Ogerpon's secondary type" },
					{ id: 5, text: "Catch Pecharunt", img: ({ gameKey }) => baseSprite(gameKey, 1025) },
				],
			},
			{
				id: 2, text: "Catch all Static Encounter Pokémon", tooltip: "Each titan returns as a static encounter at its original location after completing Path of Legends", children: [
					{ id: 1, text: "Catch Bloodmoon Ursaluna", img: ({ gameKey }) => baseSprite(gameKey, 901), tooltip: "Normal/Ground — unique form\nUnlocked by completing Perrin's Photography Quest" },
				],
			},
			{
				id: 3, text: "Obtain all In-Game Gift Pokémon", children: [
					{ id: 1, text: "Sinnoh Starter Egg", tooltip: "East of Mossui Town — received from Jacq" },
					{ id: 2, text: "Hisuian Growlithe", img: ({ gameKey }) => baseSprite(gameKey, "0058-h"), tooltip: "Reward for completing Perrin's Photography Quest" },
				],
			},
		],
		story: [
			{
				id: 1, text: "Complete the Teal Mask story", children: [
					{ id: 1, text: "Arrive in Kitakami and meet Kieran and Carmine" },
					{ id: 2, text: "Investigate the legend of the Loyal Three" },
					{ id: 3, text: "Defeat Okidogi at Loyalty Plaza", tooltip: "First of the Loyal Three" },
					{ id: 4, text: "Defeat Munkidori at Oni's Maw", tooltip: "Second of the Loyal Three" },
					{ id: 5, text: "Defeat Fezandipiti at Infernal Pass", tooltip: "Third of the Loyal Three" },
					{ id: 6, text: "Learn the truth about Ogerpon and the Loyal Three" },
					{ id: 7, text: "Protect Ogerpon and complete the finale", tooltip: "Ogerpon joins your team" },
				],
			},
		],
		sideQuests: [
			{
				id: 1, text: "Complete Perrin's Photography Quest", children: [
					{ id: 1, text: "Catch at least 150 Kitakami Pokédex entries", tooltip: "Prerequisite to trigger Perrin's appearance" },
					{ id: 2, text: "Photograph 10 different Pokémon in the Timeless Woods", tooltip: "Perrin challenges you after each photo" },
					{ id: 3, text: "Defeat and catch Bloodmoon Ursaluna", tooltip: "Reward: Hisuian Growlithe from Perrin" },
				],
			},
			{ id: 2, text: "Complete the Ogre Clan Hunt", tooltip: "Find and defeat 8 trainers disguised with Ogerpon masks scattered across Kitakami", },
			{ id: 3, text: "Complete Billy and O'Nare's errand chain", tooltip: "7 locations across Kitakami and Paldea — reward is 1,000,000 PokéCoins", },
			{ id: 4, text: "Restore Loyalty Plaza", tooltip: "Donate 1,000,000 PokéDollars to repair the shrine", },
		],
		collectables: [
			{ id: 1, text: "Obtain the Diploma", tooltip: "Reveler's Road - east of Mossui Town\nReward for completing the Kitakami Pokédex" },
			{
				id: 2, text: "Obtain all Key Items", children: [
					{ id: 1, text: "Glimmering Charm", img: () => keyItem("glimmering-charm"), tooltip: "Given by Jacq after completing the Kitakami Pokédex (200 entries)\nIncreases Tera Shard drops from Tera Raid Battles" },
					{ id: 1, text: "Exp Charm", img: () => keyItem("exp-charm") },
					{ id: 1, text: "Teal Style Card", img: () => keyItem("teal-style-card") },
					{ id: 2, text: "Wellspring Mask", img: () => keyItem("wellspring-mask"), tooltip: "Obtained during the main story" },
					{ id: 3, text: "Hearthflame Mask", img: () => keyItem("hearthflame-mask"), tooltip: "Obtained during the main story" },
					{ id: 4, text: "Cornerstone Mask", img: () => keyItem("cornerstone-mask"), tooltip: "Obtained during the main story" },
				],
			},
			{
				id: 3, text: "Get all emotes", children: [
					{ id: 1, text: "Shhh" },
					{ id: 2, text: "Heart (Right)" },
					{ id: 3, text: "Heart (Left)" },
					{ id: 4, text: "Upside-Down Peace" },
					{ id: 5, text: "Oh No!" },
					{ id: 6, text: "Poke Ball" },
					{ id: 7, text: "Hurray!" },
					{ id: 8, text: "Please" },
					{ id: 9, text: "Eureka" },
				],
			},
			{
				id: 4, text: "Collect all Picnic Chairs", children: [
					{ id: 1, text: "Academy" },
					{ id: 2, text: "Simple" },
				],
			},
		],
	};

	const TASKS_BY_SECTION_GAME1 = {
		...TASKS_BY_SECTION,
	};

	const TASKS_BY_SECTION_GAME2 = {
		...TASKS_BY_SECTION,
	};

	defineTasksMany(GAME_KEYS[0], SECTIONS, TASKS_BY_SECTION_GAME1);
	defineTasksMany(GAME_KEYS[1], SECTIONS, TASKS_BY_SECTION_GAME2);
	try {
		window.PPGC = window.PPGC || {};
		window.PPGC._seedTaskRegistry = null;
	} catch { }
})();

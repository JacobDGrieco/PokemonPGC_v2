import {
	_npc,
	_frontSprite,
	injectTasksMany,
} from '../helpers/index.js';

(() => {
	const gen = 1;
	const GAME_KEYS = ["red", "blue"];

	const npc = (gameKey, name) => _npc({ generation: gen, game: gameKey }, name);
	const baseSprite = (gameKey, natiId) => _frontSprite(gen, gameKey, natiId);

	const TASKS_BY_SECTION = {
		trainers: [
			{
				id: 1, text: "Route 22", children: [
					{
						id: 1, text: "Rival (Blue)", img: ({ gameKey }) => npc(gameKey, "blue_1"), reward: 280, party: [
							{
								name: "Pidgey", level: 9, types: ["Normal", "Flying"], sprite: ({ gameKey }) => baseSprite(gameKey, 16), moves: [
									{ name: "Gust", type: "Flying", category: "special" },
									{ name: "Sand-Attack", type: "Normal", category: "status" },
								],
							},
						],
					},
					{
						id: 2, text: "Bug Catcher", img: ({ gameKey }) => npc(gameKey, "bug_catcher"), reward: 96, party: [
							{
								name: "Weedle", level: 6, types: ["Bug", "Poison"], sprite: ({ gameKey }) => baseSprite(gameKey, 13), moves: [
									{ name: "Poison Sting", type: "Poison", category: "physical" },
									{ name: "String Shot", type: "Bug", category: "status" },
								],
							},
							{
								name: "Caterpie", level: 6, types: ["Bug"], sprite: ({ gameKey }) => baseSprite(gameKey, 10), moves: [
									{ name: "Tackle", type: "Normal", category: "physical" },
									{ name: "String Shot", type: "Bug", category: "status" },
								],
							},
						],
						rematchReward: 200, rematchParty: [
							{
								name: "Beedrill", level: 20, types: ["Bug", "Poison"], sprite: ({ gameKey }) => baseSprite(gameKey, 15), moves: [
									{ name: "Twineedle", type: "Bug", category: "physical" },
									{ name: "Poison Sting", type: "Poison", category: "physical" },
									{ name: "Rage", type: "Normal", category: "physical" },
								],
							},
						],
					},
				],
			},
		],
	};

	injectTasksMany(GAME_KEYS, TASKS_BY_SECTION);
})();

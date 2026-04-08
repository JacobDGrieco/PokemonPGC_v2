import {
  _registerDexDataFromBaseDex,
  dexSprite,
} from '../helpers/index.js';

(() => {
	const gen = 8.5;
	const GAME_KEYS = ["legendsarceus"];
	const DEX_NAME = "Hisui Dex";

	const baseSprite = (gameKey, natiId) => dexSprite(gen, gameKey)(natiId);
	const shinySprite = (gameKey, natiId) => dexSprite(gen, gameKey, { shiny: true })(natiId);

	const BASE_DEX = [
		{
			id: 1, natiId: 722, name: "Rowlet", img: ({ gameKey }) => baseSprite(gameKey, 722), imgS: ({ gameKey }) => shinySprite(gameKey, 722), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Leafage", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Roost", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Aerial Ace", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've evolved", tiers: [1] }
			]
		},
		{
			id: 2, natiId: 723, name: "Dartrix", img: ({ gameKey }) => baseSprite(gameKey, 723), imgS: ({ gameKey }) => shinySprite(gameKey, 723), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Leafage", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Roost", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Aerial Ace", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 3, name: "Decidueye", img: ({ gameKey }) => baseSprite(gameKey, "0724-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0724-h"), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Triple Arrows", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Leaf Blade", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Leaf Storm", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 4, natiId: 155, name: "Cyndaquil", img: ({ gameKey }) => baseSprite(gameKey, 155), imgS: ({ gameKey }) => shinySprite(gameKey, 155), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Ember", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Quick Attack", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Flame Wheel", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 5, natiId: 156, name: "Quilava", img: ({ gameKey }) => baseSprite(gameKey, 156), imgS: ({ gameKey }) => shinySprite(gameKey, 156), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Ember", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Quick Attack", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Flame Wheel", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 6, name: "Typhlosion", img: ({ gameKey }) => baseSprite(gameKey, "0157-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0157-h"), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Infernal Parade", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Flamethrower", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Overheat", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 7, natiId: 501, name: "Oshawott", img: ({ gameKey }) => baseSprite(gameKey, 501), imgS: ({ gameKey }) => shinySprite(gameKey, 501), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Aqua Jet", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Water Pulse", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Slash", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 8, natiId: 502, name: "Dewott", img: ({ gameKey }) => baseSprite(gameKey, 502), imgS: ({ gameKey }) => shinySprite(gameKey, 502), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Aqua Jet", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Water Pulse", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Slash", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },]
		},
		{
			id: 9, name: "Samurott", img: ({ gameKey }) => baseSprite(gameKey, "0503-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0503-h"), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Ceaseless Edge", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Aqua Tail", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Hydro Pump", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },]
		},
		{
			id: 10, natiId: 399, name: "Bidoof", img: ({ gameKey }) => baseSprite(gameKey, 399), imgS: ({ gameKey }) => shinySprite(gameKey, 399), forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 399), imgS: ({ gameKey }) => shinySprite(gameKey, 399), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0399-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0399-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
				{ boost: true, text: "Investigated the Bidoof that bother the village", tiers: [1] },
			],
		},
		{
			id: 11, natiId: 400, name: "Bibarel", img: ({ gameKey }) => baseSprite(gameKey, 400), imgS: ({ gameKey }) => shinySprite(gameKey, 400), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 400), imgS: ({ gameKey }) => shinySprite(gameKey, 400), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0400-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0400-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 20] },
				{ boost: false, text: "Times you have seen it use Bite", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Aqua Tail", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 12, natiId: 396, name: "Starly", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 396), imgS: ({ gameKey }) => shinySprite(gameKey, 396), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0396-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0396-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 13, natiId: 397, name: "Staravia", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 397), imgS: ({ gameKey }) => shinySprite(gameKey, 397), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0397-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0397-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number of you've defeated with Electric-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Aerial Ace", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 14, natiId: 398, name: "Staraptor", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 398), imgS: ({ gameKey }) => shinySprite(gameKey, 398), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0398-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0398-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've caught while they were in the air", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of you've defeated with Rock-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Air Slash", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you have seen it use Brave Bird", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 15, natiId: 403, name: "Shinx", img: ({ gameKey }) => baseSprite(gameKey, 403), imgS: ({ gameKey }) => shinySprite(gameKey, 403), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 403), imgS: ({ gameKey }) => shinySprite(gameKey, 403), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0403-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0403-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Quick Attack", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Bite", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 16, natiId: 404, name: "Luxio", img: ({ gameKey }) => baseSprite(gameKey, 404), imgS: ({ gameKey }) => shinySprite(gameKey, 404), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 404), imgS: ({ gameKey }) => shinySprite(gameKey, 404), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0404-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0404-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Bite", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Thunder Fang", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 17, natiId: 405, name: "Luxray", img: ({ gameKey }) => baseSprite(gameKey, 405), imgS: ({ gameKey }) => shinySprite(gameKey, 405), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 405), imgS: ({ gameKey }) => shinySprite(gameKey, 405), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0405-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0405-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Thunder Fang", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Crunch", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Wild Charge", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 18, natiId: 265, name: "Wurmple", img: ({ gameKey }) => baseSprite(gameKey, 265), imgS: ({ gameKey }) => shinySprite(gameKey, 265), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of light specimens caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Poison Sting", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 19, natiId: 266, name: "Silcoon", img: ({ gameKey }) => baseSprite(gameKey, 266), imgS: ({ gameKey }) => shinySprite(gameKey, 266), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number caught during daylight hours", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Flying-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Poison Sting", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 20, natiId: 267, name: "Beautifly", img: ({ gameKey }) => baseSprite(gameKey, 267), imgS: ({ gameKey }) => shinySprite(gameKey, 267), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 267), imgS: ({ gameKey }) => shinySprite(gameKey, 267), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0267-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0267-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number caught during daylight hours", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Rock-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Stun Spore", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 21, natiId: 268, name: "Cascoon", img: ({ gameKey }) => baseSprite(gameKey, 268), imgS: ({ gameKey }) => shinySprite(gameKey, 268), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 20] },
				{ boost: false, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Poison Sting", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
				{ boost: true, text: "Investigated how Silcoon and Cascoon differ", tiers: [1] },
			],
		},
		{
			id: 22, natiId: 269, name: "Dustox", img: ({ gameKey }) => baseSprite(gameKey, 269), imgS: ({ gameKey }) => shinySprite(gameKey, 269), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 269), imgS: ({ gameKey }) => shinySprite(gameKey, 269), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0269-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0269-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Psychic-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Poison Powder", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 23, natiId: 77, name: "Ponyta", img: ({ gameKey }) => baseSprite(gameKey, 77), imgS: ({ gameKey }) => shinySprite(gameKey, 77), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 77), imgS: ({ gameKey }) => shinySprite(gameKey, 77), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0077-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0077-g"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of heavy specimens caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Water-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Ember", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Investigated a sighting of an unusual Ponyta", tiers: [1] },
			],
		},
		{
			id: 24, natiId: 78, name: "Rapidash", img: ({ gameKey }) => baseSprite(gameKey, 78), imgS: ({ gameKey }) => shinySprite(gameKey, 78), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 78), imgS: ({ gameKey }) => shinySprite(gameKey, 78), },
				{ name: "Galarian", img: ({ gameKey }) => baseSprite(gameKey, "0078-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0078-g"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Water-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Fire Blast", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 25, natiId: 133, name: "Eevee", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 133), imgS: ({ gameKey }) => shinySprite(gameKey, 133), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0133-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0133-f"), },
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Quick Attack", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3, 5, 10] },
				{ boost: true, text: "Investigated more about how Eevee evolves", tiers: [1] },
			],
		},
		{
			id: 26, natiId: 134, name: "Vaporeon", img: ({ gameKey }) => baseSprite(gameKey, 134), imgS: ({ gameKey }) => shinySprite(gameKey, 134), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Baby-Doll Eyes", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you have seen it use Aqua Tail", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 27, natiId: 135, name: "Jolteon", img: ({ gameKey }) => baseSprite(gameKey, 135), imgS: ({ gameKey }) => shinySprite(gameKey, 135), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Baby-Doll Eyes", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you have seen it use Thunderbolt", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 28, natiId: 136, name: "Flareon", img: ({ gameKey }) => baseSprite(gameKey, 136), imgS: ({ gameKey }) => shinySprite(gameKey, 136), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Baby-Doll Eyes", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you have seen it use Flamethrower", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 29, natiId: 196, name: "Espeon", img: ({ gameKey }) => baseSprite(gameKey, 196), imgS: ({ gameKey }) => shinySprite(gameKey, 196), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Baby-Doll Eyes", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you have seen it use Psychic", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 30, natiId: 197, name: "Umbreon", img: ({ gameKey }) => baseSprite(gameKey, 197), imgS: ({ gameKey }) => shinySprite(gameKey, 197), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Baby-Doll Eyes", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you have seen it use Dark Pulse", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 31, natiId: 470, name: "Leafeon", img: ({ gameKey }) => baseSprite(gameKey, 470), imgS: ({ gameKey }) => shinySprite(gameKey, 470), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Baby-Doll Eyes", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you have seen it use Leaf Blade", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 32, natiId: 471, name: "Glaceon", img: ({ gameKey }) => baseSprite(gameKey, 471), imgS: ({ gameKey }) => shinySprite(gameKey, 471), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Baby-Doll Eyes", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you have seen it use Ice Beam", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 33, natiId: 700, name: "Sylveon", img: ({ gameKey }) => baseSprite(gameKey, 700), imgS: ({ gameKey }) => shinySprite(gameKey, 700), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Baby-Doll Eyes", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you have seen it use Fairy Wind", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 34, natiId: 41, name: "Zubat", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 41), imgS: ({ gameKey }) => shinySprite(gameKey, 41), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0041-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0041-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number caught during daylight hours", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Rock-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Gust", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
				{ boost: true, text: "Investigated Zubat’s knack for navigating in the dark", tiers: [1] },
			],
		},
		{
			id: 35, natiId: 42, name: "Golbat", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 42), imgS: ({ gameKey }) => shinySprite(gameKey, 42), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0042-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0042-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of you've defeated with Ice-type moves", tiers: [1, 2, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Psychic-type moves", tiers: [1, 2, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Bite", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Air Cutter", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 36, natiId: 169, name: "Crobat", img: ({ gameKey }) => baseSprite(gameKey, 169), imgS: ({ gameKey }) => shinySprite(gameKey, 169), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: true, text: "Number you've caught while they were in the air", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of you've defeated with Ice-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Cross Poison", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Leech Life", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 37, natiId: 425, name: "Drifloon", img: ({ gameKey }) => baseSprite(gameKey, 425), imgS: ({ gameKey }) => shinySprite(gameKey, 425), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of you've defeated with Ghost-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Confusion", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Hypnosis", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
				{ boost: true, text: "Investigated whether Drifloon truly does play with kids", tiers: [1] },
			],
		},
		{
			id: 38, natiId: 426, name: "Drifblim", img: ({ gameKey }) => baseSprite(gameKey, 426), imgS: ({ gameKey }) => shinySprite(gameKey, 426), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number of you've defeated with Dark-type moves", tiers: [1, 3, 10, 25, 40] },
				{ boost: false, text: "Times you have seen it use Mystical Fire", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Self-Destruct", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 39, natiId: 401, name: "Kricketot", img: ({ gameKey }) => baseSprite(gameKey, 401), imgS: ({ gameKey }) => shinySprite(gameKey, 401), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 401), imgS: ({ gameKey }) => shinySprite(gameKey, 401), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0401-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0401-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 6, 12, 25] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 4, 6, 8] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 40, natiId: 402, name: "Kricketune", img: ({ gameKey }) => baseSprite(gameKey, 402), imgS: ({ gameKey }) => shinySprite(gameKey, 402), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 402), imgS: ({ gameKey }) => shinySprite(gameKey, 402), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0402-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0402-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: true, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Slash", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use X-Scissor", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 41, natiId: 418, name: "Buizel", img: ({ gameKey }) => baseSprite(gameKey, 418), imgS: ({ gameKey }) => shinySprite(gameKey, 418), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 418), imgS: ({ gameKey }) => shinySprite(gameKey, 418), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0418-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0418-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of large specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: true, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Electric-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Aqua Jet", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 42, natiId: 419, name: "Floatzel", img: ({ gameKey }) => baseSprite(gameKey, 419), imgS: ({ gameKey }) => shinySprite(gameKey, 419), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 419), imgS: ({ gameKey }) => shinySprite(gameKey, 419), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0419-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0419-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Grass-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: true, text: "Times you have seen it use Water Pulse", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 43, natiId: 412, name: "Burmy", img: ({ gameKey }) => baseSprite(gameKey, 412), imgS: ({ gameKey }) => shinySprite(gameKey, 412), maxStatus: "shiny", tags: ["other"], forms: [
				{ name: "Plant Cloak", img: ({ gameKey }) => baseSprite(gameKey, 412), imgS: ({ gameKey }) => shinySprite(gameKey, 412), maxStatus: "shiny", },
				{ name: "Sandy Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0412-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0412-s"), maxStatus: "shiny", },
				{ name: "Trash Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0412-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0412-t"), maxStatus: "shiny", }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Flying-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Struggle Bug", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number of different forms you've obtained", tiers: [3] },
				{ boost: false, text: "Number you've seen leap out of trees", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 44, natiId: 413, name: "Wormadam", img: ({ gameKey }) => baseSprite(gameKey, 413), imgS: ({ gameKey }) => shinySprite(gameKey, 413), maxStatus: "shiny", tags: ["other"], forms: [
				{ name: "Plant Cloak", img: ({ gameKey }) => baseSprite(gameKey, 413), imgS: ({ gameKey }) => shinySprite(gameKey, 413), maxStatus: "shiny", },
				{ name: "Sandy Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0413-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0413-s"), maxStatus: "shiny", },
				{ name: "Trash Cloak", img: ({ gameKey }) => baseSprite(gameKey, "0413-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0413-t"), maxStatus: "shiny", }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Confusion", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Bug Buzz", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
				{ boost: false, text: "Number you've seen leap out of trees", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of different forms you've obtained", tiers: [3] },
			],
		},
		{
			id: 45, natiId: 414, name: "Mothim", img: ({ gameKey }) => baseSprite(gameKey, 414), imgS: ({ gameKey }) => shinySprite(gameKey, 414), maxStatus: "shiny", research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number of you've defeated with Rock-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Silver Wind", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Bug Buzz", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
			],
		},
		{
			id: 46, natiId: 74, name: "Geodude", img: ({ gameKey }) => baseSprite(gameKey, 74), imgS: ({ gameKey }) => shinySprite(gameKey, 74), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Rollout", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Water-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number of you've defeated with Grass-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: true, text: "Number you've seen leap out of ore deposits", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 47, natiId: 75, name: "Graveler", img: ({ gameKey }) => baseSprite(gameKey, 75), imgS: ({ gameKey }) => shinySprite(gameKey, 75), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of you've defeated with Fighting-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Rock Slide", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've seen leap out of ore deposits", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 48, natiId: 76, name: "Golem", img: ({ gameKey }) => baseSprite(gameKey, 76), imgS: ({ gameKey }) => shinySprite(gameKey, 76), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Steel-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Stealth Rock", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Double-Edge", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
			],
		},
		{
			id: 49, natiId: 234, name: "Stantler", img: ({ gameKey }) => baseSprite(gameKey, 234), imgS: ({ gameKey }) => shinySprite(gameKey, 234), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you have seen it use Psyshield Bash", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 50, natiId: 899, name: "Wyrdeer", img: ({ gameKey }) => baseSprite(gameKey, 899), imgS: ({ gameKey }) => shinySprite(gameKey, 899), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Psyshield Bash", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Extrasensory", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },]
		},
		{
			id: 51, natiId: 446, name: "Munchlax", img: ({ gameKey }) => baseSprite(gameKey, 446), imgS: ({ gameKey }) => shinySprite(gameKey, 446), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Rest", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 5, 10, 15, 20] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 52, natiId: 143, name: "Snorlax", img: ({ gameKey }) => baseSprite(gameKey, 143), imgS: ({ gameKey }) => shinySprite(gameKey, 143), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number you've caught while they were sleeping", tiers: [1] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Fighting-type moves", tiers: [1, 2, 3] },
				{ boost: true, text: "Times you have seen it use Double-Edge", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 10, 20, 30, 50] },
			],
		},
		{
			id: 53, natiId: 46, name: "Paras", img: ({ gameKey }) => baseSprite(gameKey, 46), imgS: ({ gameKey }) => shinySprite(gameKey, 46), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of large specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Absorb", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Stun Spore", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 54, natiId: 47, name: "Parasect", img: ({ gameKey }) => baseSprite(gameKey, 47), imgS: ({ gameKey }) => shinySprite(gameKey, 47), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of you've defeated with Flying-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Spore", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Venoshock", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Investigated the mushroom growing on Parasect", tiers: [1] },
			],
		},
		{
			id: 55, natiId: 172, name: "Pichu", img: ({ gameKey }) => baseSprite(gameKey, 172), imgS: ({ gameKey }) => shinySprite(gameKey, 172), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of small specimens caught", tiers: [1, 2, 3] },
				{ boost: true, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number you've caught while they were sleeping", tiers: [1] },
				{ boost: false, text: "Number caught during daylight hours", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 56, natiId: 25, name: "Pikachu", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 25), imgS: ({ gameKey }) => shinySprite(gameKey, 25), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0025-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0025-f"), },
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of light specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Thunder Shock", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Thunderbolt", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 57, natiId: 26, name: "Raichu", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 26), imgS: ({ gameKey }) => shinySprite(gameKey, 26), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0026-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0026-f"), },
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Iron Tail", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you have seen it use Thunder", tiers: [1, 3, 10, 30, 70] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 58, natiId: 63, name: "Abra", img: ({ gameKey }) => baseSprite(gameKey, 63), imgS: ({ gameKey }) => shinySprite(gameKey, 63), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of light specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Teleport", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've scared it off with a Scatter Bang", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 59, natiId: 64, name: "Kadabra", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 64), imgS: ({ gameKey }) => shinySprite(gameKey, 64), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0064-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0064-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of you've defeated with Bug-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Calm Mind", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Psycho Cut", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 60, natiId: 65, name: "Alakazam", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 65), imgS: ({ gameKey }) => shinySprite(gameKey, 65), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0065-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0065-f"), },
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Dark-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Recover", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you have seen it use Psychic", tiers: [1, 3, 10, 30, 70] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 61, natiId: 390, name: "Chimchar", img: ({ gameKey }) => baseSprite(gameKey, 390), imgS: ({ gameKey }) => shinySprite(gameKey, 390), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Ember", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 62, natiId: 391, name: "Monferno", img: ({ gameKey }) => baseSprite(gameKey, 391), imgS: ({ gameKey }) => shinySprite(gameKey, 391), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Flame Wheel", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Flamethrower", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 63, natiId: 392, name: "Infernape", img: ({ gameKey }) => baseSprite(gameKey, 392), imgS: ({ gameKey }) => shinySprite(gameKey, 392), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 3] },
				{ boost: true, text: "Times you have seen it use Flare Blitz", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Raging Fury", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 64, natiId: 427, name: "Buneary", img: ({ gameKey }) => baseSprite(gameKey, 427), imgS: ({ gameKey }) => shinySprite(gameKey, 427), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Baby-Doll Eyes", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 65, natiId: 428, name: "Lopunny", img: ({ gameKey }) => baseSprite(gameKey, 428), imgS: ({ gameKey }) => shinySprite(gameKey, 428), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Draining Kiss", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Close Combat", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 66, natiId: 420, name: "Cherubi", img: ({ gameKey }) => baseSprite(gameKey, 420), imgS: ({ gameKey }) => shinySprite(gameKey, 420), maxStatus: "shiny", research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 5, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Absorb", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number you've seen leap out of trees", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 67, natiId: 421, name: "Cherrim", img: ({ gameKey }) => baseSprite(gameKey, 421), imgS: ({ gameKey }) => shinySprite(gameKey, 421), maxStatus: "shiny", tags: ["other"], forms: [
				{ name: "Overcast", img: ({ gameKey }) => baseSprite(gameKey, 421), imgS: ({ gameKey }) => shinySprite(gameKey, 421), maxStatus: "shiny", },
				{ name: "Sunshine", img: ({ gameKey }) => baseSprite(gameKey, "0421-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0421-s"), maxStatus: "shiny", }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number caught during daylight hours", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Petal Dance", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've seen leap out of trees", tiers: [1, 2, 4, 10, 15] },
			],
		},
		{
			id: 68, natiId: 54, name: "Psyduck", img: ({ gameKey }) => baseSprite(gameKey, 54), imgS: ({ gameKey }) => shinySprite(gameKey, 54), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number of you've defeated with Electric-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Confusion", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 69, natiId: 55, name: "Golduck", img: ({ gameKey }) => baseSprite(gameKey, 55), imgS: ({ gameKey }) => shinySprite(gameKey, 55), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of you've defeated with Grass-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Zen Headbutt", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Aqua Tail", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you've scared it off with a Scatter Bang", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 70, natiId: 415, name: "Combee", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 415), imgS: ({ gameKey }) => shinySprite(gameKey, 415), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0415-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0415-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Rock-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Gust", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've seen leap out of trees", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
				{ boost: true, text: "Investigated the different flavors of Combee honey", tiers: [1] },
			],
		},
		{
			id: 71, natiId: 416, name: "Vespiquen", img: ({ gameKey }) => baseSprite(gameKey, 416), imgS: ({ gameKey }) => shinySprite(gameKey, 416), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Air Slash", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Bug Buzz", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've seen leap out of trees", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 72, natiId: 123, name: "Scyther", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 123), imgS: ({ gameKey }) => shinySprite(gameKey, 123), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0123-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0123-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Rock-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Air Slash", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use X-Scissor", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 73, natiId: 900, name: "Kleavor", img: ({ gameKey }) => baseSprite(gameKey, 900), imgS: ({ gameKey }) => shinySprite(gameKey, 900), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Stone Axe", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use X-Scissor", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },]
		},
		{
			id: 74, natiId: 212, name: "Scizor", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 212), imgS: ({ gameKey }) => shinySprite(gameKey, 212), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0212-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0212-f"), },
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Double Hit", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use X-Scissor", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 75, natiId: 214, name: "Heracross", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 214), imgS: ({ gameKey }) => shinySprite(gameKey, 214), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0214-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0214-f"), },
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of large specimens caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Double-Edge", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number you've seen leap out of trees", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 76, natiId: 439, name: "Mime Jr.", img: ({ gameKey }) => baseSprite(gameKey, 439), imgS: ({ gameKey }) => shinySprite(gameKey, 439), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Mimic", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 77, natiId: 122, name: "Mr. Mime", img: ({ gameKey }) => baseSprite(gameKey, 122), imgS: ({ gameKey }) => shinySprite(gameKey, 122), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you have seen it use Mimic", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you've scared it off with a Scatter Bang", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Investigated the suspicious movements of Mr. Mime", tiers: [1] },
			],
		},
		{
			id: 78, natiId: 190, name: "Aipom", img: ({ gameKey }) => baseSprite(gameKey, 190), imgS: ({ gameKey }) => shinySprite(gameKey, 190), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 190), imgS: ({ gameKey }) => shinySprite(gameKey, 190), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0190-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0190-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Fighting-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: true, text: "Times you have seen it use Double Hit", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 4, 6, 8] },
				{ boost: false, text: "Number you've seen leap out of trees", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 79, natiId: 424, name: "Ambipom", img: ({ gameKey }) => baseSprite(gameKey, 424), imgS: ({ gameKey }) => shinySprite(gameKey, 424), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 424), imgS: ({ gameKey }) => shinySprite(gameKey, 424), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0424-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0424-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Fighting-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: true, text: "Times you have seen it use Double Hit", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Iron Tail", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 80, natiId: 129, name: "Magikarp", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 129), imgS: ({ gameKey }) => shinySprite(gameKey, 129), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0129-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0129-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of large specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you have seen it use Splash", tiers: [1, 5, 20, 50, 100] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3, 5, 10] },
			],
		},
		{
			id: 81, natiId: 130, name: "Gyarados", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 130), imgS: ({ gameKey }) => shinySprite(gameKey, 130), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0130-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0130-f"), },
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've caught while they were in the air", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Electric-type moves", tiers: [1, 2, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Bite", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you have seen it use Hurricane", tiers: [1, 3, 10, 30, 70] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 82, natiId: 422, name: "Shellos", img: ({ gameKey }) => baseSprite(gameKey, 422), imgS: ({ gameKey }) => shinySprite(gameKey, 422), tags: ["other"], forms: [
				{ name: "West Sea", img: ({ gameKey }) => baseSprite(gameKey, 422), imgS: ({ gameKey }) => shinySprite(gameKey, 422), },
				{ name: "East Sea", img: ({ gameKey }) => baseSprite(gameKey, "0422-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0422-e"), },
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of small specimens caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Water Pulse", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 4, 6, 8] },
				{ boost: true, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 83, natiId: 423, name: "Gastrodon", img: ({ gameKey }) => baseSprite(gameKey, 423), imgS: ({ gameKey }) => shinySprite(gameKey, 423), tags: ["other"], forms: [
				{ name: "West Sea", img: ({ gameKey }) => baseSprite(gameKey, 423), imgS: ({ gameKey }) => shinySprite(gameKey, 423), },
				{ name: "East Sea", img: ({ gameKey }) => baseSprite(gameKey, "0423-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0423-e"), },
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Mud Bomb", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 84, name: "Qwilfish", img: ({ gameKey }) => baseSprite(gameKey, "0211-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0211-h"), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Barb Barrage", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 85, natiId: 904, name: "Overqwil", img: ({ gameKey }) => baseSprite(gameKey, 904), imgS: ({ gameKey }) => shinySprite(gameKey, 904), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Barb Barrage", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Dark Pulse", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },]
		},
		{
			id: 86, natiId: 440, name: "Happiny", img: ({ gameKey }) => baseSprite(gameKey, 440), imgS: ({ gameKey }) => shinySprite(gameKey, 440), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Baby-Doll Eyes", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 87, natiId: 113, name: "Chansey", img: ({ gameKey }) => baseSprite(gameKey, 113), imgS: ({ gameKey }) => shinySprite(gameKey, 113), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number you've caught while they were sleeping", tiers: [1] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Fighting-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Soft-Boiled", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 5, 10, 15, 20] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 88, natiId: 242, name: "Blissey", img: ({ gameKey }) => baseSprite(gameKey, 242), imgS: ({ gameKey }) => shinySprite(gameKey, 242), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Fighting-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Draining Kiss", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Double-Edge", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Investigated what would make Blissey help a human", tiers: [1] },
			],
		},
		{
			id: 89, natiId: 406, name: "Budew", img: ({ gameKey }) => baseSprite(gameKey, 406), imgS: ({ gameKey }) => shinySprite(gameKey, 406), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number caught during daylight hours", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Absorb", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 90, natiId: 315, name: "Roselia", img: ({ gameKey }) => baseSprite(gameKey, 315), imgS: ({ gameKey }) => shinySprite(gameKey, 315), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 315), imgS: ({ gameKey }) => shinySprite(gameKey, 315), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0315-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0315-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number caught during daylight hours", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number of you've defeated with Psychic-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Poison Powder", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 91, natiId: 407, name: "Roserade", img: ({ gameKey }) => baseSprite(gameKey, 407), imgS: ({ gameKey }) => shinySprite(gameKey, 407), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 407), imgS: ({ gameKey }) => shinySprite(gameKey, 407), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0407-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0407-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of you've defeated with Flying-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Energy Ball", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Petal Dance", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 3, 5, 7, 10] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 92, natiId: 455, name: "Carnivine", img: ({ gameKey }) => baseSprite(gameKey, 455), imgS: ({ gameKey }) => shinySprite(gameKey, 455), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1] },
				{ boost: false, text: "Number of large specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number of you've defeated with Flying-type moves", tiers: [1, 2, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Acid Spray", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 93, natiId: 548, name: "Petilil", img: ({ gameKey }) => baseSprite(gameKey, 548), imgS: ({ gameKey }) => shinySprite(gameKey, 548), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number of small specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Poison Powder", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 94, name: "Lilligant", img: ({ gameKey }) => baseSprite(gameKey, "0549-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0549-h"), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Petal Dance", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Victory Dance", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 95, natiId: 114, name: "Tangela", img: ({ gameKey }) => baseSprite(gameKey, 114), imgS: ({ gameKey }) => shinySprite(gameKey, 114), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Ancient Power", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 96, natiId: 465, name: "Tangrowth", img: ({ gameKey }) => baseSprite(gameKey, 465), imgS: ({ gameKey }) => shinySprite(gameKey, 465), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 465), imgS: ({ gameKey }) => shinySprite(gameKey, 465), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0465-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0465-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of you've defeated with Poison-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Double Hit", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Energy Ball", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 97, natiId: 339, name: "Barboach", img: ({ gameKey }) => baseSprite(gameKey, 339), imgS: ({ gameKey }) => shinySprite(gameKey, 339), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Grass-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Mud-Slap", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Mud Bomb", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 98, natiId: 340, name: "Whiscash", img: ({ gameKey }) => baseSprite(gameKey, 340), imgS: ({ gameKey }) => shinySprite(gameKey, 340), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of you've defeated with Grass-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Mud Bomb", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Aqua Tail", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
			],
		},
		{
			id: 99, natiId: 453, name: "Croagunk", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 453), imgS: ({ gameKey }) => shinySprite(gameKey, 453), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0453-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0453-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Number of you've defeated with Psychic-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Mud Bomb", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've scared it off with a Scatter Bang", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
				{ boost: true, text: "Investigated Croagunk poison’s medicinal properties", tiers: [1] },
			],
		},
		{
			id: 100, natiId: 454, name: "Toxicroak", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 454), imgS: ({ gameKey }) => shinySprite(gameKey, 454), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0454-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0454-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Psychic-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: true, text: "Times you have seen it use Venoshock", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Nasty Plot", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've scared it off with a Scatter Bang", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 101, natiId: 280, name: "Ralts", img: ({ gameKey }) => baseSprite(gameKey, 280), imgS: ({ gameKey }) => shinySprite(gameKey, 280), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number of small specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Hypnosis", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 102, natiId: 281, name: "Kirlia", img: ({ gameKey }) => baseSprite(gameKey, 281), imgS: ({ gameKey }) => shinySprite(gameKey, 281), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of small specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Draining Kiss", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 103, natiId: 282, name: "Gardevoir", img: ({ gameKey }) => baseSprite(gameKey, 282), imgS: ({ gameKey }) => shinySprite(gameKey, 282), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Steel-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Dazzling Gleam", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Psychic", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 104, natiId: 475, name: "Gallade", img: ({ gameKey }) => baseSprite(gameKey, 475), imgS: ({ gameKey }) => shinySprite(gameKey, 475), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of you've defeated with Ghost-type moves", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Swords Dance", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Close Combat", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 105, natiId: 193, name: "Yanma", img: ({ gameKey }) => baseSprite(gameKey, 193), imgS: ({ gameKey }) => shinySprite(gameKey, 193), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number caught in the evening", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Rock-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Ancient Power", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 106, natiId: 469, name: "Yanmega", img: ({ gameKey }) => baseSprite(gameKey, 469), imgS: ({ gameKey }) => shinySprite(gameKey, 469), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: true, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Flying-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Ancient Power", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Bug Buzz", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 107, natiId: 449, name: "Hippopotas", img: ({ gameKey }) => baseSprite(gameKey, 449), imgS: ({ gameKey }) => shinySprite(gameKey, 449), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 449), imgS: ({ gameKey }) => shinySprite(gameKey, 449), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0449-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0449-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Grass-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Bite", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 4, 6, 8] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 108, natiId: 450, name: "Hippowdon", img: ({ gameKey }) => baseSprite(gameKey, 450), imgS: ({ gameKey }) => shinySprite(gameKey, 450), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 450), imgS: ({ gameKey }) => shinySprite(gameKey, 450), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0450-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0450-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Ice-type moves", tiers: [1, 2, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Mud Bomb", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 109, natiId: 417, name: "Pachirisu", img: ({ gameKey }) => baseSprite(gameKey, 417), imgS: ({ gameKey }) => shinySprite(gameKey, 417), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 417), imgS: ({ gameKey }) => shinySprite(gameKey, 417), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0417-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0417-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number you've caught while they were sleeping", tiers: [1] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you have seen it use Spark", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number you've seen leap out of trees", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Investigated strategies for battling with Pachirisu", tiers: [1] },
			],
		},
		{
			id: 110, natiId: 434, name: "Stunky", img: ({ gameKey }) => baseSprite(gameKey, 434), imgS: ({ gameKey }) => shinySprite(gameKey, 434), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Poison Gas", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Acid Spray", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 111, natiId: 435, name: "Skuntank", img: ({ gameKey }) => baseSprite(gameKey, 435), imgS: ({ gameKey }) => shinySprite(gameKey, 435), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Venoshock", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Flamethrower", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 112, natiId: 216, name: "Teddiursa", img: ({ gameKey }) => baseSprite(gameKey, 216), imgS: ({ gameKey }) => shinySprite(gameKey, 216), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Baby-Doll Eyes", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 113, natiId: 217, name: "Ursaring", img: ({ gameKey }) => baseSprite(gameKey, 217), imgS: ({ gameKey }) => shinySprite(gameKey, 217), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 217), imgS: ({ gameKey }) => shinySprite(gameKey, 217), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0217-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0217-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of you've defeated with Fighting-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: true, text: "Times you have seen it use Bulldoze", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Slash", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've scared it off with a Scatter Bang", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 114, natiId: 901, name: "Ursaluna", img: ({ gameKey }) => baseSprite(gameKey, 901), imgS: ({ gameKey }) => shinySprite(gameKey, 901), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Headlong Rush", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Double-Edge", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },]
		},
		{
			id: 115, natiId: 704, name: "Goomy", img: ({ gameKey }) => baseSprite(gameKey, 704), imgS: ({ gameKey }) => shinySprite(gameKey, 704), tags: ["pseudo"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Acid Spray", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Acid Armor", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 4, 6, 8] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 116, name: "Sliggoo", img: ({ gameKey }) => baseSprite(gameKey, "0705-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0705-h"), tags: ["pseudo"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Water Pulse", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Iron Head", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 117, name: "Goodra", img: ({ gameKey }) => baseSprite(gameKey, "0706-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0706-h"), tags: ["pseudo"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of you've defeated with Fighting-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Dragon Pulse", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Shelter", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 118, natiId: 95, name: "Onix", img: ({ gameKey }) => baseSprite(gameKey, 95), imgS: ({ gameKey }) => shinySprite(gameKey, 95), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of large specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Water-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Rock Slide", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Stealth Rock", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 119, natiId: 208, name: "Steelix", img: ({ gameKey }) => baseSprite(gameKey, 208), imgS: ({ gameKey }) => shinySprite(gameKey, 208), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 208), imgS: ({ gameKey }) => shinySprite(gameKey, 208), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0208-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0208-f"), },
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Stealth Rock", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Iron Tail", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 120, natiId: 111, name: "Rhyhorn", img: ({ gameKey }) => baseSprite(gameKey, 111), imgS: ({ gameKey }) => shinySprite(gameKey, 111), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 111), imgS: ({ gameKey }) => shinySprite(gameKey, 111), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0111-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0111-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Grass-type moves", tiers: [1, 2, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Stealth Rock", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 121, natiId: 112, name: "Rhydon", img: ({ gameKey }) => baseSprite(gameKey, 112), imgS: ({ gameKey }) => shinySprite(gameKey, 112), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 112), imgS: ({ gameKey }) => shinySprite(gameKey, 112), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0112-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0112-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of you've defeated with Water-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Rock Slide", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you have seen it use Double-Edge", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 122, natiId: 464, name: "Rhyperior", img: ({ gameKey }) => baseSprite(gameKey, 464), imgS: ({ gameKey }) => shinySprite(gameKey, 464), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 464), imgS: ({ gameKey }) => shinySprite(gameKey, 464), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0464-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0464-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of you've defeated with Ice-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Rock Slide", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Double-Edge", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 123, natiId: 438, name: "Bonsly", img: ({ gameKey }) => baseSprite(gameKey, 438), imgS: ({ gameKey }) => shinySprite(gameKey, 438), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Mimic", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've seen leap out of ore deposits", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 124, natiId: 185, name: "Sudowoodo", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 185), imgS: ({ gameKey }) => shinySprite(gameKey, 185), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0185-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0185-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of you've defeated with Water-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Mimic", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've scared it off with a Scatter Bang", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Investigated the causes behind a listless Sudowoodo", tiers: [1] },
			],
		},
		{
			id: 125, natiId: 108, name: "Lickitung", img: ({ gameKey }) => baseSprite(gameKey, 108), imgS: ({ gameKey }) => shinySprite(gameKey, 108), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number you've caught while they were sleeping", tiers: [1] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Fighting-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Rollout", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 10, 20, 30, 50] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 126, natiId: 463, name: "Lickilicky", img: ({ gameKey }) => baseSprite(gameKey, 463), imgS: ({ gameKey }) => shinySprite(gameKey, 463), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of you've defeated with Fighting-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Zen Headbutt", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Giga Impact", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3] },
			],
		},
		{
			id: 127, natiId: 175, name: "Togepi", img: ({ gameKey }) => baseSprite(gameKey, 175), imgS: ({ gameKey }) => shinySprite(gameKey, 175), maxStatus: "shiny", research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of small specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number you've caught while they were sleeping", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Draining Kiss", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 128, natiId: 176, name: "Togetic", img: ({ gameKey }) => baseSprite(gameKey, 176), imgS: ({ gameKey }) => shinySprite(gameKey, 176), maxStatus: "shiny", research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've caught while they were in the air", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Fairy Wind", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Air Slash", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 129, natiId: 468, name: "Togekiss", img: ({ gameKey }) => baseSprite(gameKey, 468), imgS: ({ gameKey }) => shinySprite(gameKey, 468), maxStatus: "shiny", research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of light specimens caught", tiers: [1, 2, 3] },
				{ boost: true, text: "Number you've caught while they were in the air", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Air Slash", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Extrasensory", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Moonblast", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 130, natiId: 387, name: "Turtwig", img: ({ gameKey }) => baseSprite(gameKey, 387), imgS: ({ gameKey }) => shinySprite(gameKey, 387), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Leafage", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 131, natiId: 388, name: "Grotle", img: ({ gameKey }) => baseSprite(gameKey, 388), imgS: ({ gameKey }) => shinySprite(gameKey, 388), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Bite", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Leaf Blade", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 132, natiId: 389, name: "Torterra", img: ({ gameKey }) => baseSprite(gameKey, 389), imgS: ({ gameKey }) => shinySprite(gameKey, 389), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of you've defeated with Ice-type moves", tiers: [1, 2, 3] },
				{ boost: true, text: "Times you have seen it use Wood Hammer", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Headlong Rush", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 133, natiId: 137, name: "Porygon", img: ({ gameKey }) => baseSprite(gameKey, 137), imgS: ({ gameKey }) => shinySprite(gameKey, 137), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of large specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Tackle", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Times you have seen it use Tri Attack", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 134, natiId: 233, name: "Porygon2", img: ({ gameKey }) => baseSprite(gameKey, 233), imgS: ({ gameKey }) => shinySprite(gameKey, 233), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Thunderbolt", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Recover", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 135, natiId: 474, name: "Porygon-Z", img: ({ gameKey }) => baseSprite(gameKey, 474), imgS: ({ gameKey }) => shinySprite(gameKey, 474), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Thunderbolt", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Recover", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Hyper Beam", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 6, 12, 25] },
			],
		},
		{
			id: 136, natiId: 92, name: "Gastly", img: ({ gameKey }) => baseSprite(gameKey, 92), imgS: ({ gameKey }) => shinySprite(gameKey, 92), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Ghost-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Astonish", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've scared it off with a Scatter Bang", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 137, natiId: 93, name: "Haunter", img: ({ gameKey }) => baseSprite(gameKey, 93), imgS: ({ gameKey }) => shinySprite(gameKey, 93), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number of you've defeated with Dark-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Venoshock", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've scared it off with a Scatter Bang", tiers: [1, 2, 3, 5, 7] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 138, natiId: 94, name: "Gengar", img: ({ gameKey }) => baseSprite(gameKey, 94), imgS: ({ gameKey }) => shinySprite(gameKey, 94), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Hypnosis", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Shadow Ball", tiers: [1, 3, 10, 30, 70] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 139, natiId: 442, name: "Spiritomb", img: ({ gameKey }) => baseSprite(gameKey, 442), imgS: ({ gameKey }) => shinySprite(gameKey, 442), research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: true, text: "Times you have seen it use Hex", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Dark Pulse", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 140, natiId: 198, name: "Murkrow", img: ({ gameKey }) => baseSprite(gameKey, 198), imgS: ({ gameKey }) => shinySprite(gameKey, 198), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 198), imgS: ({ gameKey }) => shinySprite(gameKey, 198), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0198-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0198-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Rock-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: true, text: "Times you have seen it use Roost", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 141, natiId: 430, name: "Honchkrow", img: ({ gameKey }) => baseSprite(gameKey, 430), imgS: ({ gameKey }) => shinySprite(gameKey, 430), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: true, text: "Number you've caught while they were in the air", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Fairy-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Snarl", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Dark Pulse", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 142, natiId: 201, name: "Unown", img: ({ gameKey }) => baseSprite(gameKey, 201), imgS: ({ gameKey }) => shinySprite(gameKey, 201), maxStatus: "shiny", tags: ["other"], forms: [
				{ name: "A", img: ({ gameKey }) => baseSprite(gameKey, "0201-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-a"), maxStatus: "shiny", },
				{ name: "B", img: ({ gameKey }) => baseSprite(gameKey, "0201-b"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-b"), maxStatus: "shiny", },
				{ name: "C", img: ({ gameKey }) => baseSprite(gameKey, "0201-c"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-c"), maxStatus: "shiny", },
				{ name: "D", img: ({ gameKey }) => baseSprite(gameKey, "0201-d"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-d"), maxStatus: "shiny", },
				{ name: "E", img: ({ gameKey }) => baseSprite(gameKey, "0201-e"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-e"), maxStatus: "shiny", },
				{ name: "F", img: ({ gameKey }) => baseSprite(gameKey, "0201-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-f"), maxStatus: "shiny", },
				{ name: "G", img: ({ gameKey }) => baseSprite(gameKey, "0201-g"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-g"), maxStatus: "shiny", },
				{ name: "H", img: ({ gameKey }) => baseSprite(gameKey, "0201-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-h"), maxStatus: "shiny", },
				{ name: "I", img: ({ gameKey }) => baseSprite(gameKey, "0201-i"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-i"), maxStatus: "shiny", },
				{ name: "J", img: ({ gameKey }) => baseSprite(gameKey, "0201-j"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-j"), maxStatus: "shiny", },
				{ name: "K", img: ({ gameKey }) => baseSprite(gameKey, "0201-k"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-k"), maxStatus: "shiny", },
				{ name: "L", img: ({ gameKey }) => baseSprite(gameKey, "0201-l"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-l"), maxStatus: "shiny", },
				{ name: "M", img: ({ gameKey }) => baseSprite(gameKey, "0201-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-m"), maxStatus: "shiny", },
				{ name: "N", img: ({ gameKey }) => baseSprite(gameKey, "0201-n"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-n"), maxStatus: "shiny", },
				{ name: "O", img: ({ gameKey }) => baseSprite(gameKey, "0201-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-o"), maxStatus: "shiny", },
				{ name: "P", img: ({ gameKey }) => baseSprite(gameKey, "0201-p"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-p"), maxStatus: "shiny", },
				{ name: "Q", img: ({ gameKey }) => baseSprite(gameKey, "0201-q"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-q"), maxStatus: "shiny", },
				{ name: "R", img: ({ gameKey }) => baseSprite(gameKey, "0201-r"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-r"), maxStatus: "shiny", },
				{ name: "S", img: ({ gameKey }) => baseSprite(gameKey, "0201-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-s"), maxStatus: "shiny", },
				{ name: "T", img: ({ gameKey }) => baseSprite(gameKey, "0201-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-t"), maxStatus: "shiny", },
				{ name: "U", img: ({ gameKey }) => baseSprite(gameKey, "0201-u"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-u"), maxStatus: "shiny", },
				{ name: "V", img: ({ gameKey }) => baseSprite(gameKey, "0201-v"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-v"), maxStatus: "shiny", },
				{ name: "W", img: ({ gameKey }) => baseSprite(gameKey, "0201-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-w"), maxStatus: "shiny", },
				{ name: "X", img: ({ gameKey }) => baseSprite(gameKey, "0201-x"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-x"), maxStatus: "shiny", },
				{ name: "Y", img: ({ gameKey }) => baseSprite(gameKey, "0201-y"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-y"), maxStatus: "shiny", },
				{ name: "Z", img: ({ gameKey }) => baseSprite(gameKey, "0201-z"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-z"), maxStatus: "shiny", },
				{ name: "!", img: ({ gameKey }) => baseSprite(gameKey, "0201-em"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-em"), maxStatus: "shiny", },
				{ name: "?", img: ({ gameKey }) => baseSprite(gameKey, "0201-qm"), imgS: ({ gameKey }) => shinySprite(gameKey, "0201-qm"), maxStatus: "shiny", },
			],
			research: [{ boost: true, text: "Number of different forms you've obtained", tiers: [1, 5, 10, 15, 28] },
			],
		},
		{
			id: 143, natiId: 363, name: "Spheal", img: ({ gameKey }) => baseSprite(gameKey, 363), imgS: ({ gameKey }) => shinySprite(gameKey, 363), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Rollout", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 4, 6, 8] },
				{ boost: false, text: "Times you've scared it off with a Scatter Bang", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 144, natiId: 364, name: "Sealeo", img: ({ gameKey }) => baseSprite(gameKey, 364), imgS: ({ gameKey }) => shinySprite(gameKey, 364), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Rock-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Liquidation", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 145, natiId: 365, name: "Walrein", img: ({ gameKey }) => baseSprite(gameKey, 365), imgS: ({ gameKey }) => shinySprite(gameKey, 365), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Fighting-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Ice Beam", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Blizzard", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 4, 6, 8] },
			],
		},
		{
			id: 146, natiId: 223, name: "Remoraid", img: ({ gameKey }) => baseSprite(gameKey, 223), imgS: ({ gameKey }) => shinySprite(gameKey, 223), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Grass-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Charge Beam", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Ice Beam", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 147, natiId: 224, name: "Octillery", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 224), imgS: ({ gameKey }) => shinySprite(gameKey, 224), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0224-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0224-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Electric-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Hydro Pump", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Hyper Beam", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 148, natiId: 451, name: "Skorupi", img: ({ gameKey }) => baseSprite(gameKey, 451), imgS: ({ gameKey }) => shinySprite(gameKey, 451), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of small specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Poison Sting", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 149, natiId: 452, name: "Drapion", img: ({ gameKey }) => baseSprite(gameKey, 452), imgS: ({ gameKey }) => shinySprite(gameKey, 452), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Venoshock", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Cross Poison", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've stunned it by using items", tiers: [1, 3, 5, 7, 10] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
			],
		},
		{
			id: 150, name: "Growlithe", img: ({ gameKey }) => baseSprite(gameKey, "0058-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0058-h"), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number you've caught while they were sleeping", tiers: [1] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Water-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Fire Fang", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 151, name: "Arcanine", img: ({ gameKey }) => baseSprite(gameKey, "0059-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0059-h"), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Rock Slide", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Raging Fury", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Flare Blitz", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
			],
		},
		{
			id: 152, natiId: 431, name: "Glameow", img: ({ gameKey }) => baseSprite(gameKey, 431), imgS: ({ gameKey }) => shinySprite(gameKey, 431), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of light specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Nasty Plot", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 153, natiId: 432, name: "Purugly", img: ({ gameKey }) => baseSprite(gameKey, 432), imgS: ({ gameKey }) => shinySprite(gameKey, 432), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Play Rough", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Double-Edge", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 5, 10, 15, 20] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 6, 12, 25] },
			],
		},
		{
			id: 154, natiId: 66, name: "Machop", img: ({ gameKey }) => baseSprite(gameKey, 66), imgS: ({ gameKey }) => shinySprite(gameKey, 66), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of you've defeated with Flying-type moves", tiers: [1, 2, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Rock Smash", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 155, natiId: 67, name: "Machoke", img: ({ gameKey }) => baseSprite(gameKey, 67), imgS: ({ gameKey }) => shinySprite(gameKey, 67), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of you've defeated with Psychic-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Bullet Punch", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 156, natiId: 68, name: "Machamp", img: ({ gameKey }) => baseSprite(gameKey, 68), imgS: ({ gameKey }) => shinySprite(gameKey, 68), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Fairy-type moves", tiers: [1, 2, 3] },
				{ boost: true, text: "Times you have seen it use Bulk Up", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Close Combat", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 3, 10, 30, 70] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 157, natiId: 441, name: "Chatot", img: ({ gameKey }) => baseSprite(gameKey, 441), imgS: ({ gameKey }) => shinySprite(gameKey, 441), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number caught during daylight hours", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Electric-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Air Cutter", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 158, natiId: 355, name: "Duskull", img: ({ gameKey }) => baseSprite(gameKey, 355), imgS: ({ gameKey }) => shinySprite(gameKey, 355), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Ghost-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Hex", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've scared it off with a Scatter Bang", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 159, natiId: 356, name: "Dusclops", img: ({ gameKey }) => baseSprite(gameKey, 356), imgS: ({ gameKey }) => shinySprite(gameKey, 356), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Ghost-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Dark Pulse", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Shadow Ball", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 160, natiId: 477, name: "Dusknoir", img: ({ gameKey }) => baseSprite(gameKey, 477), imgS: ({ gameKey }) => shinySprite(gameKey, 477), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of you've defeated with Dark-type moves", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Dark Pulse", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Shadow Ball", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 10, 30, 70] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 161, natiId: 393, name: "Piplup", img: ({ gameKey }) => baseSprite(gameKey, 393), imgS: ({ gameKey }) => shinySprite(gameKey, 393), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Bubble", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 162, natiId: 394, name: "Prinplup", img: ({ gameKey }) => baseSprite(gameKey, 394), imgS: ({ gameKey }) => shinySprite(gameKey, 394), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Water Pulse", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Roost", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 163, natiId: 395, name: "Empoleon", img: ({ gameKey }) => baseSprite(gameKey, 395), imgS: ({ gameKey }) => shinySprite(gameKey, 395), tags: ["starter"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of you've defeated with Fighting-type moves", tiers: [1, 2, 3] },
				{ boost: true, text: "Times you have seen it use Hydro Pump", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Wave Crash", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 164, natiId: 458, name: "Mantyke", img: ({ gameKey }) => baseSprite(gameKey, 458), imgS: ({ gameKey }) => shinySprite(gameKey, 458), maxStatus: "shiny", research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of small specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Electric-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Water Pulse", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 165, natiId: 226, name: "Mantine", img: ({ gameKey }) => baseSprite(gameKey, 226), imgS: ({ gameKey }) => shinySprite(gameKey, 226), maxStatus: "shiny", research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of large specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of you've defeated with Electric-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Air Slash", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you have seen it use Double-Edge", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 6, 12, 25] },
			],
		},
		{
			id: 166, name: "Basculin", img: ({ gameKey }) => baseSprite(gameKey, "0550-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0550-w"), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of large specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: true, text: "Times you have seen it use Wave Crash", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you have seen it use Double-Edge", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 167, natiId: 902, name: "Basculegion", img: ({ gameKey }) => baseSprite(gameKey, 902), imgS: ({ gameKey }) => shinySprite(gameKey, 902), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 902), imgS: ({ gameKey }) => shinySprite(gameKey, 902), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0902-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0902-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Wave Crash", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Shadow Ball", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },]
		},
		{
			id: 168, natiId: 37, name: "Vulpix", img: ({ gameKey }) => baseSprite(gameKey, 37), imgS: ({ gameKey }) => shinySprite(gameKey, 37), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 37), imgS: ({ gameKey }) => shinySprite(gameKey, 37), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0037-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0037-a"), tags: ["alolan"], }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number you've caught while they were sleeping", tiers: [1] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Ember", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
				{ boost: true, text: "Investigated about Vulpix from the Alola region", tiers: [1] },
			],
		},
		{
			id: 169, natiId: 38, name: "Ninetales", img: ({ gameKey }) => baseSprite(gameKey, 38), imgS: ({ gameKey }) => shinySprite(gameKey, 38), forms: [
				{ name: "Kantonian", img: ({ gameKey }) => baseSprite(gameKey, 38), imgS: ({ gameKey }) => shinySprite(gameKey, 38), },
				{ name: "Alolan", img: ({ gameKey }) => baseSprite(gameKey, "0038-a"), imgS: ({ gameKey }) => shinySprite(gameKey, "0038-a"), tags: ["alolan"], }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of you've defeated with Water-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Flamethrower", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Fire Blast", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 170, natiId: 72, name: "Tentacool", img: ({ gameKey }) => baseSprite(gameKey, 72), imgS: ({ gameKey }) => shinySprite(gameKey, 72), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of light specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: true, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Electric-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Bubble", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 171, natiId: 73, name: "Tentacruel", img: ({ gameKey }) => baseSprite(gameKey, 73), imgS: ({ gameKey }) => shinySprite(gameKey, 73), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Electric-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Poison Jab", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Hydro Pump", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 172, natiId: 456, name: "Finneon", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 456), imgS: ({ gameKey }) => shinySprite(gameKey, 456), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0456-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0456-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Grass-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Bubble", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 173, natiId: 457, name: "Lumineon", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 457), imgS: ({ gameKey }) => shinySprite(gameKey, 457), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0457-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0457-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Electric-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Silver Wind", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 174, natiId: 240, name: "Magby", img: ({ gameKey }) => baseSprite(gameKey, 240), imgS: ({ gameKey }) => shinySprite(gameKey, 240), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number you've caught while they were sleeping", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Flame Wheel", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 175, natiId: 126, name: "Magmar", img: ({ gameKey }) => baseSprite(gameKey, 126), imgS: ({ gameKey }) => shinySprite(gameKey, 126), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Water-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: true, text: "Times you have seen it use Flamethrower", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Fire Blast", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 176, natiId: 467, name: "Magmortar", img: ({ gameKey }) => baseSprite(gameKey, 467), imgS: ({ gameKey }) => shinySprite(gameKey, 467), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Fire Punch", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Flamethrower", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you have seen it use Fire Blast", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 177, natiId: 81, name: "Magnemite", img: ({ gameKey }) => baseSprite(gameKey, 81), imgS: ({ gameKey }) => shinySprite(gameKey, 81), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of light specimens caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Thunder Shock", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Thunder Wave", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 178, natiId: 82, name: "Magneton", img: ({ gameKey }) => baseSprite(gameKey, 82), imgS: ({ gameKey }) => shinySprite(gameKey, 82), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Spark", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Tri Attack", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 179, natiId: 462, name: "Magnezone", img: ({ gameKey }) => baseSprite(gameKey, 462), imgS: ({ gameKey }) => shinySprite(gameKey, 462), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've caught while they were in the air", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Flash Cannon", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Thunderbolt", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 180, natiId: 436, name: "Bronzor", img: ({ gameKey }) => baseSprite(gameKey, 436), imgS: ({ gameKey }) => shinySprite(gameKey, 436), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of large specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Confusion", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've seen leap out of ore deposits", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 181, natiId: 437, name: "Bronzong", img: ({ gameKey }) => baseSprite(gameKey, 437), imgS: ({ gameKey }) => shinySprite(gameKey, 437), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of heavy specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Ghost-type moves", tiers: [1, 2, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Flash Cannon", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Extrasensory", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 182, natiId: 239, name: "Elekid", img: ({ gameKey }) => baseSprite(gameKey, 239), imgS: ({ gameKey }) => shinySprite(gameKey, 239), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number you've caught while they were sleeping", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Spark", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 183, natiId: 125, name: "Electabuzz", img: ({ gameKey }) => baseSprite(gameKey, 125), imgS: ({ gameKey }) => shinySprite(gameKey, 125), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: true, text: "Times you have seen it use Thunder Punch", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Thunder", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 184, natiId: 466, name: "Electivire", img: ({ gameKey }) => baseSprite(gameKey, 466), imgS: ({ gameKey }) => shinySprite(gameKey, 466), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Thunder Wave", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Thunder Punch", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3] },
			],
		},
		{
			id: 185, natiId: 207, name: "Gligar", img: ({ gameKey }) => baseSprite(gameKey, 207), imgS: ({ gameKey }) => shinySprite(gameKey, 207), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 207), imgS: ({ gameKey }) => shinySprite(gameKey, 207), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0207-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0207-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of you've defeated with Ice-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: true, text: "Times you have seen it use Mud Bomb", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 4, 6, 8] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 186, natiId: 472, name: "Gliscor", img: ({ gameKey }) => baseSprite(gameKey, 472), imgS: ({ gameKey }) => shinySprite(gameKey, 472), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Water-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Mud Bomb", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use X-Scissor", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 10, 30, 70] },
				{ boost: true, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 187, natiId: 443, name: "Gible", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 443), imgS: ({ gameKey }) => shinySprite(gameKey, 443), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0443-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0443-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Ice-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Twister", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Slash", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 188, natiId: 444, name: "Gabite", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 444), imgS: ({ gameKey }) => shinySprite(gameKey, 444), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0444-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0444-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Dragon-type moves", tiers: [1, 2, 3] },
				{ boost: true, text: "Times you have seen it use Dragon Claw", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 4, 6, 8] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 189, natiId: 445, name: "Garchomp", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), tags: ["gender", "pseudo"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 445), imgS: ({ gameKey }) => shinySprite(gameKey, 445), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0445-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0445-f"), },
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of you've defeated with Fairy-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Dragon Claw", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Outrage", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 5, 20, 50, 100] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 190, natiId: 299, name: "Nosepass", img: ({ gameKey }) => baseSprite(gameKey, 299), imgS: ({ gameKey }) => shinySprite(gameKey, 299), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 6, 12, 25] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Grass-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Iron Defense", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've seen leap out of ore deposits", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
				{ boost: true, text: "Investigated an old saying about Nosepass’s handiness", tiers: [1] },
			],
		},
		{
			id: 191, natiId: 476, name: "Probopass", img: ({ gameKey }) => baseSprite(gameKey, 476), imgS: ({ gameKey }) => shinySprite(gameKey, 476), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of you've defeated with Ground-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Power Gem", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Earth Power", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 10, 30, 70] },
				{ boost: true, text: "Times you've stunned it by using items", tiers: [1, 3, 5, 7, 10] },
			],
		},
		{
			id: 192, name: "Voltorb", img: ({ gameKey }) => baseSprite(gameKey, "0100-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0100-h"), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Spark", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've scared it off with a Scatter Bang", tiers: [1, 2, 3, 5, 7] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 193, name: "Electrode", img: ({ gameKey }) => baseSprite(gameKey, "0101-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0101-h"), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Thunder", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Chloroblast", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Self-Destruct", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 194, natiId: 479, name: "Rotom", img: ({ gameKey }) => baseSprite(gameKey, 479), imgS: ({ gameKey }) => shinySprite(gameKey, 479), tags: ["other"], forms: [
				{ name: "Normal", img: ({ gameKey }) => baseSprite(gameKey, 479), imgS: ({ gameKey }) => shinySprite(gameKey, 479), },
				{ name: "Fan", img: ({ gameKey }) => baseSprite(gameKey, "0479-fa"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-fa"), },
				{ name: "Frost", img: ({ gameKey }) => baseSprite(gameKey, "0479-fr"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-fr"), },
				{ name: "Heat", img: ({ gameKey }) => baseSprite(gameKey, "0479-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-h"), },
				{ name: "Mow", img: ({ gameKey }) => baseSprite(gameKey, "0479-m"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-m"), },
				{ name: "Wash", img: ({ gameKey }) => baseSprite(gameKey, "0479-w"), imgS: ({ gameKey }) => shinySprite(gameKey, "0479-w"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Thunder Shock", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Number of different forms you've obtained", tiers: [2, 4, 6] },
			],
		},
		{
			id: 195, natiId: 433, name: "Chingling", img: ({ gameKey }) => baseSprite(gameKey, 433), imgS: ({ gameKey }) => shinySprite(gameKey, 433), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of light specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Confusion", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: false, text: "Times you've scared it off with a Scatter Bang", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 196, natiId: 358, name: "Chimecho", img: ({ gameKey }) => baseSprite(gameKey, 358), imgS: ({ gameKey }) => shinySprite(gameKey, 358), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of light specimens caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Ominous Wind", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Extrasensory", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Investigated a Chimecho settled in a human home", tiers: [1] },
			],
		},
		{
			id: 197, natiId: 200, name: "Misdreavus", img: ({ gameKey }) => baseSprite(gameKey, 200), imgS: ({ gameKey }) => shinySprite(gameKey, 200), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 5, 10, 20] },
				{ boost: true, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Hex", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 4, 6, 8] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 198, natiId: 429, name: "Mismagius", img: ({ gameKey }) => baseSprite(gameKey, 429), imgS: ({ gameKey }) => shinySprite(gameKey, 429), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Dark-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Hex", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you have seen it use Power Gem", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 199, natiId: 173, name: "Cleffa", img: ({ gameKey }) => baseSprite(gameKey, 173), imgS: ({ gameKey }) => shinySprite(gameKey, 173), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of small specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number you've caught while they were sleeping", tiers: [1] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
			],
		},
		{
			id: 200, natiId: 35, name: "Clefairy", img: ({ gameKey }) => baseSprite(gameKey, 35), imgS: ({ gameKey }) => shinySprite(gameKey, 35), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Draining Kiss", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
				{ boost: true, text: "Investigated whether Clefairy dance under a full moon", tiers: [1] },
			],
		},
		{
			id: 201, natiId: 36, name: "Clefable", img: ({ gameKey }) => baseSprite(gameKey, 36), imgS: ({ gameKey }) => shinySprite(gameKey, 36), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 6, 12, 25] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Poison-type moves", tiers: [1, 2, 3] },
				{ boost: false, text: "Times you have seen it use Psychic", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Moonblast", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
			],
		},
		{
			id: 202, name: "Sneasel", img: ({ gameKey }) => baseSprite(gameKey, "0215-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-h"), tags: ["gender"], forms: [
				{ name: "Johtonian Male", img: ({ gameKey }) => baseSprite(gameKey, 215), imgS: ({ gameKey }) => shinySprite(gameKey, 215), },
				{ name: "Johtonian Female", img: ({ gameKey }) => baseSprite(gameKey, "0215-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-f"), },
				{ name: "Hisuian Male", img: ({ gameKey }) => baseSprite(gameKey, "0215-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-h"), tags: ["hisuian"], },
				{ name: "Hisuian Female", img: ({ gameKey }) => baseSprite(gameKey, "0215-h-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0215-h-f"), tags: ["hisuian"], }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of light specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Slash", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 4, 6, 8] },
				{ boost: true, text: "Number of different forms you've obtained", tiers: [4] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 203, natiId: 903, name: "Sneasler", img: ({ gameKey }) => baseSprite(gameKey, 903), imgS: ({ gameKey }) => shinySprite(gameKey, 903), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Dire Claw", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Swords Dance", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },]
		},
		{
			id: 204, natiId: 461, name: "Weavile", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 461), imgS: ({ gameKey }) => shinySprite(gameKey, 461), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0461-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0461-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Slash", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Swords Dance", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 205, natiId: 361, name: "Snorunt", img: ({ gameKey }) => baseSprite(gameKey, 361), imgS: ({ gameKey }) => shinySprite(gameKey, 361), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of light specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Ice Fang", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 206, natiId: 362, name: "Glalie", img: ({ gameKey }) => baseSprite(gameKey, 362), imgS: ({ gameKey }) => shinySprite(gameKey, 362), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number of heavy specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Number of you've defeated with Steel-type moves", tiers: [1, 2, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Ice Fang", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Crunch", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
			],
		},
		{
			id: 207, natiId: 478, name: "Froslass", img: ({ gameKey }) => baseSprite(gameKey, 478), imgS: ({ gameKey }) => shinySprite(gameKey, 478), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Icicle Crash", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
			],
		},
		{
			id: 208, natiId: 408, name: "Cranidos", img: ({ gameKey }) => baseSprite(gameKey, 408), imgS: ({ gameKey }) => shinySprite(gameKey, 408), tags: ["fossil"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of large specimens caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Ancient Power", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 209, natiId: 409, name: "Rampardos", img: ({ gameKey }) => baseSprite(gameKey, 409), imgS: ({ gameKey }) => shinySprite(gameKey, 409), tags: ["fossil"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Iron Head", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Double-Edge", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you have seen it use Head Smash", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 2, 4, 10, 15] },
			],
		},
		{
			id: 210, natiId: 410, name: "Shieldon", img: ({ gameKey }) => baseSprite(gameKey, 410), imgS: ({ gameKey }) => shinySprite(gameKey, 410), tags: ["fossil"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of heavy specimens caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use Ancient Power", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 211, natiId: 411, name: "Bastiodon", img: ({ gameKey }) => baseSprite(gameKey, 411), imgS: ({ gameKey }) => shinySprite(gameKey, 411), tags: ["fossil"], research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Iron Defense", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Earth Power", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you have seen it use Stealth Rock", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 2, 4, 10, 15] },
			],
		},
		{
			id: 212, natiId: 220, name: "Swinub", img: ({ gameKey }) => baseSprite(gameKey, 220), imgS: ({ gameKey }) => shinySprite(gameKey, 220), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number you've caught without being spotted", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Ice Shard", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Number you've evolved", tiers: [1, 2, 3] },
				{ boost: true, text: "Investigated Swinub’s supposed special skill", tiers: [1] },
			],
		},
		{
			id: 213, natiId: 221, name: "Piloswine", img: ({ gameKey }) => baseSprite(gameKey, 221), imgS: ({ gameKey }) => shinySprite(gameKey, 221), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 221), imgS: ({ gameKey }) => shinySprite(gameKey, 221), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0221-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0221-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of heavy specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Grass-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: true, text: "Times you have seen it use Ancient Power", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 214, natiId: 473, name: "Mamoswine", img: ({ gameKey }) => baseSprite(gameKey, 473), imgS: ({ gameKey }) => shinySprite(gameKey, 473), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 473), imgS: ({ gameKey }) => shinySprite(gameKey, 473), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0473-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0473-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Number of alpha specimens caught", tiers: [1, 2, 3] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you have seen it use High Horsepower", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Blizzard", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 10, 30, 70] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 215, natiId: 712, name: "Bergmite", img: ({ gameKey }) => baseSprite(gameKey, 712), imgS: ({ gameKey }) => shinySprite(gameKey, 712), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of light specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Times you have seen it use Ice Shard", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: false, text: "Number you've seen leap out of ore deposits", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 216, name: "Avalugg", img: ({ gameKey }) => baseSprite(gameKey, "0713-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0713-h"), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of heavy specimens caught", tiers: [1, 2, 3, 5, 7] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Fighting-type moves", tiers: [1, 2, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Mountain Gale", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Blizzard", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 217, natiId: 459, name: "Snover", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 459), imgS: ({ gameKey }) => shinySprite(gameKey, 459), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0459-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0459-f"), }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of large specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Powder Snow", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 218, natiId: 460, name: "Abomasnow", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), tags: ["gender"], forms: [
				{ name: "Male", img: ({ gameKey }) => baseSprite(gameKey, 460), imgS: ({ gameKey }) => shinySprite(gameKey, 460), },
				{ name: "Female", img: ({ gameKey }) => baseSprite(gameKey, "0460-f"), imgS: ({ gameKey }) => shinySprite(gameKey, "0460-f"), },
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1] },
				{ boost: false, text: "Number defeated", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Times you have seen it use Blizzard", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Wood Hammer", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 10, 30, 70] },
				{ boost: false, text: "Number of different forms you've obtained", tiers: [2] },
			],
		},
		{
			id: 219, name: "Zorua", img: ({ gameKey }) => baseSprite(gameKey, "0570-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0570-h"), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number caught at night", tiers: [1, 2, 5, 10, 20] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number of you've defeated with Dark-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Snarl", tiers: [1, 3, 8, 20, 40] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 220, name: "Zoroark", img: ({ gameKey }) => baseSprite(gameKey, "0571-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0571-h"), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Number of you've defeated with Dark-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Bitter Malice", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Nasty Plot", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 3, 5, 7, 10] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 221, natiId: 627, name: "Rufflet", img: ({ gameKey }) => baseSprite(gameKey, 627), imgS: ({ gameKey }) => shinySprite(gameKey, 627), research: [
				{ boost: true, text: "Number caught", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Number of light specimens caught", tiers: [1, 2, 5, 7, 10] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number of you've defeated with Electric-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Air Slash", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Roost", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 222, name: "Braviary", img: ({ gameKey }) => baseSprite(gameKey, "0628-h"), imgS: ({ gameKey }) => shinySprite(gameKey, "0628-h"), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: true, text: "Number you've caught while they were in the air", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Esper Wing", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Brave Bird", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 223, natiId: 447, name: "Riolu", img: ({ gameKey }) => baseSprite(gameKey, 447), imgS: ({ gameKey }) => shinySprite(gameKey, 447), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Flying-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: false, text: "Times you have seen it use Rock Smash", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've given it food", tiers: [1, 2, 3, 4, 5] },
				{ boost: false, text: "Times you've stunned it by using items", tiers: [1, 3, 5, 7, 10] },
				{ boost: true, text: "Number you've evolved", tiers: [1] },
			],
		},
		{
			id: 224, natiId: 448, name: "Lucario", img: ({ gameKey }) => baseSprite(gameKey, 448), imgS: ({ gameKey }) => shinySprite(gameKey, 448), research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of alpha specimens caught", tiers: [1] },
				{ boost: false, text: "Number defeated", tiers: [1, 2, 4, 10, 15] },
				{ boost: false, text: "Number of you've defeated with Fire-type moves", tiers: [1, 2, 4, 6, 10] },
				{ boost: true, text: "Times you have seen it use Aura Sphere", tiers: [1, 3, 10, 30, 70] },
				{ boost: false, text: "Times you have seen it use Close Combat", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
				{ boost: true, text: "Times you've stunned it by using items", tiers: [1, 5, 10, 15, 20] },
			],
		},
		{
			id: 225, natiId: 480, name: "Uxie", img: ({ gameKey }) => baseSprite(gameKey, 480), imgS: ({ gameKey }) => shinySprite(gameKey, 480), maxStatus: "shiny", tags: ["legendary"], research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Mystical Power", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Calm Mind", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 226, natiId: 481, name: "Mesprit", img: ({ gameKey }) => baseSprite(gameKey, 481), imgS: ({ gameKey }) => shinySprite(gameKey, 481), maxStatus: "shiny", tags: ["legendary"], research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Mystical Power", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Recover", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 227, natiId: 482, name: "Azelf", img: ({ gameKey }) => baseSprite(gameKey, 482), imgS: ({ gameKey }) => shinySprite(gameKey, 482), maxStatus: "shiny", tags: ["legendary"], research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Mystical Power", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Self-Destruct", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 10, 30, 70] },
			],
		},
		{
			id: 228, natiId: 485, name: "Heatran", img: ({ gameKey }) => baseSprite(gameKey, 485), imgS: ({ gameKey }) => shinySprite(gameKey, 485), maxStatus: "shiny", tags: ["legendary"], research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Fire Fang", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Magma Storm", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 6, 12, 25] },
			],
		},
		{
			id: 229, natiId: 486, name: "Regigigas", img: ({ gameKey }) => baseSprite(gameKey, 486), imgS: ({ gameKey }) => shinySprite(gameKey, 486), maxStatus: "shiny", tags: ["legendary"], research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Iron Head", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Giga Impact", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 6, 12, 25] },
			],
		},
		{
			id: 230, natiId: 488, name: "Cresselia", img: ({ gameKey }) => baseSprite(gameKey, 488), imgS: ({ gameKey }) => shinySprite(gameKey, 488), maxStatus: "shiny", tags: ["legendary"], research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: true, text: "Times you have seen it use Moonblast", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Lunar Blessing", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 231, natiId: 641, name: "Tornadus", img: ({ gameKey }) => baseSprite(gameKey, 641), imgS: ({ gameKey }) => shinySprite(gameKey, 641), maxStatus: "shiny", tags: ["other", "legendary"], forms: [
				{ name: "Incarnate", img: ({ gameKey }) => baseSprite(gameKey, 641), imgS: ({ gameKey }) => shinySprite(gameKey, 641), maxStatus: "shiny", tags: ["legendary"], },
				{ name: "Therian", img: ({ gameKey }) => baseSprite(gameKey, "0641-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0641-t"), maxStatus: "shiny", tags: ["legendary"], }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Extrasensory", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Bleakwind Storm", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 232, natiId: 642, name: "Thundurus", img: ({ gameKey }) => baseSprite(gameKey, 642), imgS: ({ gameKey }) => shinySprite(gameKey, 642), maxStatus: "shiny", tags: ["other", "legendary"], forms: [
				{ name: "Incarnate", img: ({ gameKey }) => baseSprite(gameKey, 642), imgS: ({ gameKey }) => shinySprite(gameKey, 642), maxStatus: "shiny", tags: ["legendary"], },
				{ name: "Therian", img: ({ gameKey }) => baseSprite(gameKey, "0642-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0642-t"), maxStatus: "shiny", tags: ["legendary"], }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Extrasensory", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Wildbolt Storm", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 233, natiId: 645, name: "Landorus", img: ({ gameKey }) => baseSprite(gameKey, 645), imgS: ({ gameKey }) => shinySprite(gameKey, 645), maxStatus: "shiny", tags: ["other", "legendary"], forms: [
				{ name: "Incarnate", img: ({ gameKey }) => baseSprite(gameKey, 645), imgS: ({ gameKey }) => shinySprite(gameKey, 645), maxStatus: "shiny", tags: ["legendary"], },
				{ name: "Therian", img: ({ gameKey }) => baseSprite(gameKey, "0645-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0645-t"), maxStatus: "shiny", tags: ["legendary"], }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Extrasensory", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Sandsear Storm", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 234, natiId: 905, name: "Enamorus", img: ({ gameKey }) => baseSprite(gameKey, 905), imgS: ({ gameKey }) => shinySprite(gameKey, 905), maxStatus: "shiny", tags: ["other", "legendary"], forms: [
				{ name: "Incarnate", img: ({ gameKey }) => baseSprite(gameKey, 905), imgS: ({ gameKey }) => shinySprite(gameKey, 905), maxStatus: "shiny", tags: ["legendary"], },
				{ name: "Therian", img: ({ gameKey }) => baseSprite(gameKey, "0905-t"), imgS: ({ gameKey }) => shinySprite(gameKey, "0905-t"), maxStatus: "shiny", tags: ["legendary"], }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1, 2, 3, 4, 5] },
				{ boost: true, text: "Times you have seen it use Extrasensory", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you have seen it use Springtide Storm", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },]
		},
		{
			id: 235, natiId: 483, name: "Dialga", img: ({ gameKey }) => baseSprite(gameKey, 483), imgS: ({ gameKey }) => shinySprite(gameKey, 483), maxStatus: "shiny", tags: ["other", "legendary"], forms: [
				{ name: "Altered", img: ({ gameKey }) => baseSprite(gameKey, 483), imgS: ({ gameKey }) => shinySprite(gameKey, 483), maxStatus: "shiny", tags: ["legendary"], },
				{ name: "Origin", img: ({ gameKey }) => baseSprite(gameKey, "0483-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0483-o"), maxStatus: "shiny", tags: ["legendary"], }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Iron Tail", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Roar of Time", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 236, natiId: 484, name: "Palkia", img: ({ gameKey }) => baseSprite(gameKey, 484), imgS: ({ gameKey }) => shinySprite(gameKey, 484), maxStatus: "shiny", tags: ["other", "legendary"], forms: [
				{ name: "Altered", img: ({ gameKey }) => baseSprite(gameKey, 484), imgS: ({ gameKey }) => shinySprite(gameKey, 484), maxStatus: "shiny", tags: ["legendary"], },
				{ name: "Origin", img: ({ gameKey }) => baseSprite(gameKey, "0484-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0484-o"), maxStatus: "shiny", tags: ["legendary"], }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Aqua Tail", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Spacial Rend", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 237, natiId: 487, name: "Giratina", img: ({ gameKey }) => baseSprite(gameKey, 487), imgS: ({ gameKey }) => shinySprite(gameKey, 487), maxStatus: "shiny", tags: ["other", "legendary"], forms: [
				{ name: "Altered", img: ({ gameKey }) => baseSprite(gameKey, 487), imgS: ({ gameKey }) => shinySprite(gameKey, 487), maxStatus: "shiny", tags: ["legendary"], },
				{ name: "Origin", img: ({ gameKey }) => baseSprite(gameKey, "0487-o"), imgS: ({ gameKey }) => shinySprite(gameKey, "0487-o"), maxStatus: "shiny", tags: ["legendary"], }
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Shadow Claw", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Shadow Force", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 238, natiId: 493, name: "Arceus", img: ({ gameKey }) => baseSprite(gameKey, 493), imgS: ({ gameKey }) => shinySprite(gameKey, 493), maxStatus: "shiny", tags: ["legendary"], research: [
				{ boost: true, text: "Received a part of Arceus", tiers: [1] },
			],
		},
		{
			id: 239, natiId: 489, name: "Phione", img: ({ gameKey }) => baseSprite(gameKey, 489), imgS: ({ gameKey }) => shinySprite(gameKey, 489), maxStatus: "shiny", tags: ["legendary"], research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: true, text: "Times you have seen it use Water Pulse", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you have seen it use Zen Headbutt", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
			],
		},
		{
			id: 240, natiId: 490, name: "Manaphy", img: ({ gameKey }) => baseSprite(gameKey, 490), imgS: ({ gameKey }) => shinySprite(gameKey, 490), maxStatus: "shiny", tags: ["legendary"], research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Moonblast", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Take Heart", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 241, natiId: 492, name: "Shaymin", img: ({ gameKey }) => baseSprite(gameKey, 492), imgS: ({ gameKey }) => shinySprite(gameKey, 492), maxStatus: "shiny", tags: ["other", "mythical"], forms: [
				{ name: "Land", img: ({ gameKey }) => baseSprite(gameKey, 492), imgS: ({ gameKey }) => shinySprite(gameKey, 492), maxStatus: "shiny", mythical: true },
				{ name: "Sky", img: ({ gameKey }) => baseSprite(gameKey, "0492-s"), imgS: ({ gameKey }) => shinySprite(gameKey, "0492-s"), maxStatus: "shiny", mythical: true },
			],
			research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Earth Power", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Seed Flare", tiers: [1, 3, 6, 12, 25] },
				{ boost: false, text: "Times you've seen it use a strong style move", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use an agile style move", tiers: [1, 3, 8, 20, 40] },
			],
		},
		{
			id: 242, natiId: 491, name: "Darkrai", img: ({ gameKey }) => baseSprite(gameKey, 491), imgS: ({ gameKey }) => shinySprite(gameKey, 491), maxStatus: "shiny", tags: ["mythical"], research: [
				{ boost: true, text: "Number caught", tiers: [1] },
				{ boost: false, text: "Times you have seen it use Shadow Ball", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you have seen it use Dark Void", tiers: [1, 3, 6, 12, 25] },
				{ boost: true, text: "Times you've seen it use a strong style move", tiers: [1, 3, 8, 20, 40] },
				{ boost: false, text: "Times you've seen it use an agile style move", tiers: [1, 3, 6, 12, 25] },
			],
		}
	];

	_registerDexDataFromBaseDex({ gen, baseKeys: GAME_KEYS, dexName: DEX_NAME, baseDex: BASE_DEX, });
})();
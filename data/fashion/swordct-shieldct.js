import {
  buildFashionFor,
  defineFashionMany,
  _fashionItem,
} from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["swordct", "shieldct"];

	// local wrapper (binds to helpers.js global)
	const fashionItem = (gameKey, gender, category, name) => _fashionItem(gameKey, gender, category, name);

	const CATEGORIES = [
		{ id: "hats", label: "Hats" },
		{ id: "glasses", label: "Glasses" },
		{ id: "tops", label: "Tops" },
		{ id: "jackets", label: "Jackets" },
		{ id: "bags", label: "Bags" },
		{ id: "gloves", label: "Gloves" },
		{ id: "bottoms", label: "Bottoms" },
		{ id: "legwear", label: "Legwear" },
		{ id: "shoes", label: "Shoes" }
	];

	// Fashion data authoring format:
	// - item.id stays a slug (e.g. "boater")
	// - item.forms[].id is numeric (e.g. 1), and helpers format it to "hats:boater:001"
	const ITEMS_BY_CATEGORY = {
		"hats": [
			{
				id: 1, name: "Hard Hat", gender: "unisex", forms: [
					{ id: 1, name: "Original Style" },
					{ id: 2, name: "Gold" },
				]
			},
			{ id: 2, name: "Replica State Crown", gender: "unisex" },
			{ id: 3, name: "Sport Cap - Hex Nut", gender: "unisex", extraCredit: true },
		],
		"glasses": [
			{
				id: 1, name: "Futuristic Monocle", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Red" },
					{ id: 3, name: "White" },
					{ id: 4, name: "Yellow" },
				]
			},
			{ id: 2, name: "Futuristic Monocle - Blue", gender: "female" },
			{
				id: 3, name: "Futuristic Shades", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Red" },
					{ id: 3, name: "White" },
					{ id: 4, name: "Yellow" },
				]
			},
			{ id: 4, name: "Futuristic Shades - Blue", gender: "female" },
		],
		"tops": [
			{
				id: 1, name: "Boatneck Sweatshirt", gender: "male", forms: [
					{ id: 1, name: "Freeezington's Fame" },
					{ id: 2, name: "King" },
				]
			},
			{ id: 2, name: "Sport Top - Galarian Star Tournament", gender: "unisex" },
		],
		"jackets": [
			{
				id: 1, name: "Expedition Jacket", gender: "unisex", forms: [
					{ id: 1, name: "Original Style" },
					{ id: 2, name: "Gold" },
				]
			},
			{
				id: 2, name: "Hoodie", gender: "unisex", forms: [
					{ id: 1, name: "C x L" },
					{ id: 1, name: "Legendary R-D" },
					{ id: 1, name: "Legendary R-E" },
				]
			},
		],
		"bags": [
			{
				id: 1, name: "Expedition Rucksack", gender: "female", forms: [
					{ id: 1, name: "Original Style" },
					{ id: 2, name: "Gold" },
				]
			},
			{
				id: 2, name: "Expedition Travel Bag", gender: "male", forms: [
					{ id: 1, name: "Original Style" },
					{ id: 2, name: "Gold" },
				]
			},
		],
		"gloves": [
			{
				id: 1, name: "Expedition Gloves", gender: "unisex", forms: [
					{ id: 1, name: "Original Style" },
					{ id: 2, name: "Gold" },
				]
			},
			{ id: 2, name: "Sport Glove - Galarian Star Tournament", gender: "unisex" },
		],
		"bottoms": [
			{
				id: 1, name: "Expedition Pants", gender: "unisex", forms: [
					{ id: 1, name: "Original Style" },
					{ id: 2, name: "Gold" },
				]
			},
			{ id: 2, name: "Sporty Shorts - Galarian Star Tournament", gender: "unisex" },
		],
		"legwear": [
			{
				id: 1, name: "Hoodie", gender: "unisex", forms: [
					{ id: 1, name: "C x L" },
					{ id: 2, name: "Legendary R-D" },
					{ id: 3, name: "Legendary R-E" },
				]
			},
			{ id: 2, name: "Patterned Tights - C x L", gender: "unisex", },
			{ id: 3, name: "Sport Legwear - Galarian Star Tournament", gender: "unisex" },
		],
		"shoes": [
			{
				id: 1, name: "Hiking Boots", gender: "unisex", forms: [
					{ id: 1, name: "Original Style" },
					{ id: 2, name: "Gold" },
				]
			},
		]
	};

	defineFashionMany(GAME_KEYS, () => buildFashionFor(CATEGORIES, ITEMS_BY_CATEGORY));
})();

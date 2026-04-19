import {
  buildFashionFor,
  defineFashionMany,
  _fashionItem,
} from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["sun"];

	// local wrapper (binds to helpers.js global)
	const fashionItem = (gameKey, gender, category, name) => _fashionItem(gameKey, gender, category, name);

	const CATEGORIES = [
		{ id: "tops", label: "Tops" },
		{ id: "bottoms", label: "Bottoms" },
		{ id: "shoes", label: "Shoes" },
		{ id: "socks", label: "Socks" },
		{ id: "glasses", label: "Glasses" },
		{ id: "bags", label: "Bags" },
		{ id: "hats", label: "Hats" },
	];

	// Fashion data authoring format:
	// - item.id stays a slug (e.g. "boater")
	// - item.forms[].id is numeric (e.g. 1), and helpers format it to "hats:boater:001"
	const ITEMS_BY_CATEGORY = {
		"tops": [
			{
				id: 1, name: "Athletic Tank", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Pink" },
				]
			},
			{
				id: 2, name: "Casual Striped Tee", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "Yellow" },
				]
			},
			{ id: 3, name: "Cherrim Tee", gender: "male" },
			{
				id: 4, name: "Collared Shirt", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{ id: 5, name: "Collegiate Tank", gender: "male" },
			{ id: 6, name: "Dark Tank", gender: "male" },
			{
				id: 7, name: "Designer Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 8, name: "Flower-Print Flared Skirt - White", gender: "female" },
			{ id: 9, name: "Flower-Print Tee", gender: "male" },
			{
				id: 10, name: "Flower-Print Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 11, name: "Halter Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 12, name: "Iconic Top", gender: "male" },
			{ id: 13, name: "Leppa Tee", gender: "male" },
			{ id: 14, name: "Necktie Tee", gender: "male" },
			{
				id: 15, name: "Pinstripe Collared Shirt", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{
				id: 16, name: "Plain Tee", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{ id: 17, name: "Pola-Dot Ruffled Tank - White", gender: "female" },
			{
				id: 18, name: "Polo Shirt", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{
				id: 19, name: "Ruffled Blouse", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 20, name: "Ruffled Tank", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 21, name: "Sandyghast Tank", gender: "male" },
			{ id: 22, name: "Skull Tank", gender: "male" },
			{ id: 23, name: "Sporty Shorts - Sludge", gender: "female" },
			{
				id: 24, name: "Sporty Tank", gender: "male", forms: [
					{ id: 1, name: "Fruit" },
					{ id: 2, name: "Legendary" },
					{ id: 3, name: "Poison Bee" },
					{ id: 4, name: "Sea Cucumber" },
					{ id: 5, name: "Seed" },
					{ id: 6, name: "Sludge" },
				]
			},
			{ id: 25, name: "Sporty Tank - Sludge", gender: "female" },
			{
				id: 26, name: "Star-Print Polo", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{
				id: 27, name: "Striped Halter Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 28, name: "Striped Ruffled Blouse", gender: "female" },
			{
				id: 29, name: "Striped V-Neck Tee", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 30, name: "Surfing Tank", gender: "male" },
			{
				id: 31, name: "Tank Top", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{
				id: 32, name: "V-Neck Tee", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 33, name: "Wolf Tank", gender: "male" },
		],
		"bottoms": [
			{
				id: 1, name: "Athletic Long Shorts", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Pink" },
				]
			},
			{
				id: 2, name: "Bordered Flared Skirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 3, name: "Camo Cargo Shorts", gender: "male", forms: [
					{ id: 1, name: "Gray" },
					{ id: 2, name: "Green" },
				]
			},
			{
				id: 4, name: "Capri Pants", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{
				id: 5, name: "Capri Pants", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 6, name: "Casual Shorts", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 7, name: "Cutoff Jeans", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Light Blue" },
					{ id: 3, name: "Navy Blue" },
				]
			},
			{ id: 8, name: "Patterned Cargo Shorts - Flowers", gender: "male" },
			{
				id: 9, name: "Plaid Miniskirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 10, name: "Plain Cargo Shorts", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{
				id: 11, name: "Pleated Miniskirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 12, name: "Pleated Shorts", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 13, name: "Ribbed Capris", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{
				id: 14, name: "Sporty Long Shorts", gender: "male", forms: [
					{ id: 1, name: "Fruit" },
					{ id: 2, name: "Legendary" },
					{ id: 3, name: "Poison Bee" },
					{ id: 4, name: "Sea Cucumber" },
					{ id: 5, name: "Seed" },
					{ id: 6, name: "Sludge" },
				]
			},
		],
		"socks": [
			{
				id: 1, name: "Crew Socks", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{
				id: 2, name: "Crew Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 3, name: "Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 4, name: "Over-the-Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 5, name: "Sporty Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
		],
		"shoes": [
			{
				id: 1, name: "Espadrilles", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 2, name: "Loafers", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{
				id: 3, name: "Low-Heeled Sandals", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 4, name: "Low-Tap Sneakers - White", gender: "male" },
			{
				id: 5, name: "Penny Loafers", gender: "male", forms: [
					{ id: 1, name: "Long Neck" },
					{ id: 2, name: "Order" },
					{ id: 3, name: "Scaly" },
					{ id: 4, name: "Thunderbolt" },
				]
			},
			{
				id: 6, name: "Sporty Sneakers", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Multi Beige" },
					{ id: 4, name: "Multi Orange" },
					{ id: 5, name: "Multi Pink" },
					{ id: 6, name: "Multi Red" },
					{ id: 7, name: "Multi Yellow" },
					{ id: 8, name: "Orange" },
					{ id: 9, name: "Pink" },
					{ id: 10, name: "Red" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 7, name: "Sporty Sneakers", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 8, name: "Strappy Sandals", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
		],
		"hats": [
			{
				id: 1, name: "Athletic Cap", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 1, name: "Pink" },
				]
			},
			{
				id: 2, name: "Beach Hat", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 3, name: "Sports Cap", gender: "male", forms: [
					{ id: 1, name: "Legendary" },
					{ id: 2, name: "Poison Bee" },
					{ id: 3, name: "Seed" },
					{ id: 4, name: "Sludge" },
				]
			},
			{
				id: 4, name: "Street Cap", gender: "male", forms: [
					{ id: 1, name: "Fruit" },
					{ id: 2, name: "Long Neck" },
					{ id: 3, name: "Order" },
					{ id: 4, name: "Rare Cruel" },
					{ id: 5, name: "Rare Long Neck" },
					{ id: 6, name: "Rare Order" },
					{ id: 7, name: "Rare Scaly" },
					{ id: 8, name: "Rare Thunderbolt" },
					{ id: 9, name: "Scaly" },
					{ id: 10, name: "Sea Cucumber" },
					{ id: 11, name: "Thunderbolt" },
				]
			},
			{
				id: 5, name: "Trilby Hat", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{
				id: 6, name: "Trilby Hat", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
		],
		"glasses": [
			{
				id: 1, name: "Aviator Shades", gender: "male", forms: [
					{ id: 1, name: "Brown" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Pink" },
				]
			},
			{
				id: 2, name: "Horn-Rimmed Glasses", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Orange" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "White" },
					{ id: 6, name: "Yellow" },
				]
			},
			{
				id: 3, name: "Horn-Rimmed Glasses", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 4, name: "Mirrored Sunglasses", gender: "male", forms: [
					{ id: 1, name: "Red" },
					{ id: 2, name: "White" },
					{ id: 3, name: "Yellow" },
				]
			},
		],
		"bags": [
			{
				id: 1, name: "Leather Backpack", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{
				id: 2, name: "Messenger Bag", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 3, name: "Ruffled Shoulder Bag", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 4, name: "Satchel Bag", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 5, name: "Scout Pack", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{
				id: 6, name: "Sporty Backpack", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{
				id: 7, name: "Sporty Bag", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
		],
	};

	defineFashionMany(GAME_KEYS, () => buildFashionFor(CATEGORIES, ITEMS_BY_CATEGORY));
})();

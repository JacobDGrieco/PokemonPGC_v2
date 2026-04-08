import {
  buildFashionFor,
  defineFashionMany,
  _fashionItem,
} from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["ultrasun"];

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
		{ id: "accessories", label: "Accessories" },
	];

	// Fashion data authoring format:
	// - item.id stays a slug (e.g. "boater")
	// - item.forms[].id is numeric (e.g. 1), and helpers format it to "hats:boater:001"
	const ITEMS_BY_CATEGORY = {
		"tops": [
			{ id: 1, name: "Active Shirt", gender: "male", startGame: true },
			{
				id: 2, name: "Alola Shirt", gender: "male", forms: [
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
				id: 3, name: "Alola Shirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 4, name: "Athletic Tank", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Pink" },
				]
			},
			{ id: 5, name: "Athletic Tank - Beige", gender: "female" },
			{
				id: 6, name: "Casual Striped Tee", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{ id: 7, name: "Cherrim Tee", gender: "female" },
			{
				id: 8, name: "Collared Shirt", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{ id: 9, name: "Collegiate Tank", gender: "unisex" },
			{ id: 10, name: "Dark Tee", gender: "male" },
			{
				id: 11, name: "Designer Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 12, name: "Flower-Print Tee", gender: "male" },
			{
				id: 13, name: "Flower-Print Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 14, name: "Halter Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 15, name: "Iconic Top", gender: "unisex" },
			{ id: 16, name: "Karate GI Jacket", gender: "male" },
			{ id: 17, name: "Kommo-o Breastplate", gender: "male" },
			{ id: 18, name: "Leppa Tee", gender: "male" },
			{ id: 19, name: "Luran Tank", gender: "female" },
			{ id: 20, name: "Necktie Tee", gender: "male" },
			{ id: 21, name: "Pikachu Shirt", gender: "unisex" },
			{
				id: 22, name: "Pinstripe Collared Shirt", gender: "male", forms: [
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
				id: 23, name: "Plain Tee", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{ id: 24, name: "Poke Ball Tee", gender: "unisex" },
			{ id: 25, name: "Pokemon Center Nurse Top", gender: "female" },
			{
				id: 26, name: "Polka-Dot Ruffled Tank", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 27, name: "Polo Shirt", gender: "male", forms: [
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
				id: 28, name: "Ruffled Blouse", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 29, name: "Ruffled Tank", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 30, name: "Sandygast Tank", gender: "male" },
			{ id: 31, name: "Skull Tank", gender: "male" },
			{
				id: 32, name: "Sporty Tank", gender: "male", forms: [
					{ id: 1, name: "Fruit" },
					{ id: 2, name: "Legendary" },
					{ id: 3, name: "Poison Bee" },
					{ id: 4, name: "Sea Cucumber" },
					{ id: 5, name: "Seed" },
					{ id: 6, name: "Sludge" },
				]
			},
			{
				id: 33, name: "Sporty Tank", gender: "female", forms: [
					{ id: 1, name: "Fruit" },
					{ id: 2, name: "Seed" },
					{ id: 3, name: "Sludge" },
				]
			},
			{
				id: 34, name: "Star-Print Polo", gender: "male", forms: [
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
				id: 35, name: "Striped Halter Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 36, name: "Striped Ruffled Blouse", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 37, name: "Striped V-Neck Tee", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 38, name: "Surfing Tank", gender: "unisex" },
			{
				id: 39, name: "Tank Top", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Orange" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
					{ id: 7, name: "Yellow" },
				]
			},
			{ id: 40, name: "Trial Guide Tee", gender: "male" },
			{ id: 41, name: "Tropical Tank", gender: "female" },
			{ id: 42, name: "Tropical Tee", gender: "male" },
			{
				id: 43, name: "V-Neck Tee", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 44, name: "Vacation Tank", gender: "female" },
			{ id: 45, name: "Wolf Tank", gender: "male" },
		],
		"bottoms": [
			{ id: 1, name: "Active Shorts", gender: "male", startGame: true },
			{
				id: 2, name: "Athletic Long Shorts", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Pink" },
				]
			},
			{ id: 3, name: "Athletic Shorts - Beige", gender: "female" },
			{
				id: 4, name: "Bordered Flared Skirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 5, name: "Camo Cargo Shorts", gender: "male", forms: [
					{ id: 1, name: "Gray" },
					{ id: 2, name: "Green" },
				]
			},
			{
				id: 6, name: "Capri Pants", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Orange" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "Yellow" },
				]
			},
			{
				id: 7, name: "Capri Pants", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 8, name: "Casual Shorts", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 9, name: "Cutoff Jeans", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Light Blue" },
					{ id: 3, name: "Navy Blue" },
				]
			},
			{ id: 10, name: "Distressed Jeans - Light Blue", gender: "female" },
			{
				id: 3, name: "Flower-Print Flared Skirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 11, name: "Frayed Denim Shorts - Light Blue", gender: "female" },
			{ id: 12, name: "Karate GI Pants", gender: "male" },
			{ id: 13, name: "Kommo-o Tassets", gender: "male" },
			{ id: 14, name: "Luran Shorts", gender: "female" },
			{ id: 15, name: "Patterned Cargo Shorts - Flowers", gender: "male" },
			{
				id: 16, name: "Plaid Miniskirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 17, name: "Plain Cargo Shorts", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Orange" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "Yellow" },
				]
			},
			{
				id: 18, name: "Pleated Miniskirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 19, name: "Pleated Shorts", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 20, name: "Pokemon Center Nurse Skirt", gender: "female" },
			{
				id: 21, name: "Ribbed Capris", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Orange" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "Yellow" },
				]
			},
			{
				id: 22, name: "Sporty Long Shorts", gender: "male", forms: [
					{ id: 1, name: "Fruit" },
					{ id: 2, name: "Poison Bee" },
				]
			},
			{
				id: 23, name: "Sporty Shorts", gender: "female", forms: [
					{ id: 1, name: "Fruit" },
					{ id: 2, name: "Seed" },
					{ id: 2, name: "Sludge" },
				]
			},
			{ id: 24, name: "Vacation Shorts", gender: "female" },
		],
		"socks": [
			{ id: 1, name: "Camo Over-the-Knee Socks - Green", gender: "female" },
			{
				id: 2, name: "Crew Socks", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Orange" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "Yellow" },
				]
			},
			{
				id: 3, name: "Crew Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 4, name: "Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 5, name: "Over-the-Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Striped" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 6, name: "Sporty Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
		],
		"shoes": [
			{
				id: 1, name: "Espadrilles", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Order" },
					{ id: 3, name: "Scaly" },
					{ id: 4, name: "Thunderbolt" },
					{ id: 5, name: "White" },
				]
			},
			{
				id: 2, name: "Loafers", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Orange" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "Yellow" },
				]
			},
			{
				id: 3, name: "Low-Heeled Sandals", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 4, name: "Low-Top Sneakers", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 5, name: "Luran Shoes", gender: "female" },
			{ id: 6, name: "Penny Loafers - Long Neck", gender: "male" },
			{
				id: 1, name: "Sporty Sneakers", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 1, name: "Multi Beige" },
					{ id: 1, name: "Multi Orange" },
					{ id: 1, name: "Multi Pink" },
					{ id: 1, name: "Multi Red" },
					{ id: 1, name: "Multi Yellow" },
					{ id: 2, name: "Orange" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "Yellow" },
				]
			},
			{
				id: 7, name: "Sporty Sneakers", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 8, name: "Strapy Sandals", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 9, name: "Trekking Shoes", gender: "female" },
			{ id: 10, name: "Vacation Sandals", gender: "female" },
		],
		"hats": [
			{ id: 1, name: "Athletic Cap - Beige", gender: "female" },
			{ id: 2, name: "Athletic Cap - Pink", gender: "male" },
			{ id: 3, name: "Baseball Cap", gender: "male" },
			{
				id: 4, name: "Beach Hat", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 5, name: "Casual Cap", gender: "female" },
			{ id: 6, name: "Hero Cap", gender: "unisex" },
			{ id: 7, name: "Pikachu Cap", gender: "female" },
			{
				id: 8, name: "Sports Cap", gender: "male", forms: [
					{ id: 1, name: "Poison Bee" },
					{ id: 2, name: "Sea Cucumber" },
				]
			},
			{
				id: 9, name: "Sports Cap", gender: "female", forms: [
					{ id: 1, name: "Fruit" },
					{ id: 2, name: "Seed" },
				]
			},
			{
				id: 10, name: "Street Cap", gender: "male", forms: [
					{ id: 1, name: "Long Neck" },
					{ id: 2, name: "Rare Cruel" },
					{ id: 3, name: "Rare Long Neck" },
					{ id: 4, name: "Rare Order" },
					{ id: 5, name: "Rare Scaly" },
					{ id: 6, name: "Rare Thunderbolt" },
				]
			},
			{
				id: 11, name: "Street Cap", gender: "female", forms: [
					{ id: 1, name: "Order" },
					{ id: 2, name: "Scaly" },
					{ id: 3, name: "Thunderbolt" },
				]
			},
			{
				id: 12, name: "Trilby Hat", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Orange" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "Yellow" },
				]
			},
			{
				id: 13, name: "Trilby Hat", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 14, name: "Vacation Hat", gender: "female" },
		],
		"glasses": [
			{
				id: 1, name: "Aviator Shades", gender: "male", forms: [
					{ id: 1, name: "Brown" },
					{ id: 2, name: "Pink" },
				]
			},
			{
				id: 2, name: "Horn-Rimmed Glasses", gender: "male", forms: [
					{ id: 1, name: "Orange" },
					{ id: 2, name: "Pink" },
					{ id: 3, name: "Red" },
					{ id: 4, name: "Yellow" },
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
					{ id: 2, name: "Yellow" },
				]
			},
			{ id: 5, name: "Mirrored Sunglasses - White", gender: "female" },
		],
		"bags": [
			{
				id: 1, name: "Leather Backpack", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Orange" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "Yellow" },
				]
			},
			{
				id: 2, name: "Messenger Bag", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 3, name: "Nylong Shoulder Bag", gender: "female" },
			{
				id: 4, name: "Ruffled Shoulder Bag", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 5, name: "Satchel Bag", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 6, name: "Scout Pack", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Orange" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "Yellow" },
				]
			},
			{
				id: 7, name: "Sporty Backpack", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Orange" },
					{ id: 3, name: "Pink" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "Yellow" },
				]
			},
			{
				id: 8, name: "Sporty Bag", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 9, name: "Vacation Bag", gender: "female" },
		],
		"accessories": [
			{
				id: 1, name: "Flower Barrette", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 2, name: "Gem Barrette - White", gender: "female" },
			{ id: 3, name: "Luran Headband", gender: "female" },
			{ id: 4, name: "Pokemon Center Nurse Cap", gender: "female" },
			{
				id: 5, name: "Satin Bow Headband", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 6, name: "Swea-Star Headband", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
		],
	};

	defineFashionMany(GAME_KEYS, () => buildFashionFor(CATEGORIES, ITEMS_BY_CATEGORY));
})();

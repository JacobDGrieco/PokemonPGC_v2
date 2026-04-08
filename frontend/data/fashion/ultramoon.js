import {
  buildFashionFor,
  defineFashionMany,
  _fashionItem,
} from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["ultramoon"];

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
			{ id: 2, name: "Alola Sea Tank", gender: "unisex" },
			{
				id: 3, name: "Alola Shirt", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 4, name: "Argyle Tee", gender: "male" },
			{
				id: 5, name: "Athletic Tank", gender: "unisex", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Green" },
				]
			},
			{ id: 6, name: "Bone Keeper Tank", gender: "male" },
			{
				id: 7, name: "Casual Striped Tee", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
				]
			},
			{ id: 8, name: "Chatot Tee", gender: "male" },
			{ id: 9, name: "Cobra Tank", gender: "female" },
			{
				id: 10, name: "Collared Shirt", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 11, name: "Collegiate Tank", gender: "unisex" },
			{
				id: 12, name: "Designer Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 13, name: "Flower-Print Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 14, name: "Halter Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 15, name: "Hard Scale Tank", gender: "male" },
			{ id: 16, name: "Iconic Top", gender: "unisex" },
			{ id: 17, name: "Karate GI Jacket", gender: "male" },
			{ id: 18, name: "Kommo-o Breastplate", gender: "male" },
			{ id: 19, name: "Leppa Tee", gender: "male" },
			{ id: 20, name: "Luran Tank", gender: "female" },
			{ id: 21, name: "Luvdisc Tank", gender: "unisex" },
			{ id: 22, name: "Pikachu Shirt", gender: "unisex" },
			{
				id: 23, name: "Pinstripe Collared Shirt", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 24, name: "Plain Tee", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 25, name: "Poke Ball Tee", gender: "unisex" },
			{ id: 26, name: "Pokemon Center Nurse Top", gender: "female" },
			{
				id: 27, name: "Polo Shirt", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 28, name: "Ruffled Blouse", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 29, name: "Ruffled Tank", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 30, name: "Skull Tank", gender: "male" },
			{
				id: 31, name: "Sporty Tank", gender: "unisex", forms: [
					{ id: 1, name: "Fruit" },
					{ id: 2, name: "Jellyfish" },
					{ id: 3, name: "Legendary" },
					{ id: 4, name: "Seed" },
					{ id: 5, name: "Sludge" },
					{ id: 6, name: "Woolly Crab" },
				]
			},
			{
				id: 32, name: "Star-Print Polo", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 33, name: "Striped Halter Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 34, name: "Striped Ruffled Blouse", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 35, name: "Striped V-Neck Tee", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 36, name: "Surfing Tank", gender: "unisex" },
			{
				id: 37, name: "Tank Top", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 38, name: "Trial Guide Tee", gender: "female" },
			{ id: 39, name: "Tropical Tank", gender: "male" },
			{ id: 40, name: "Tropical Tee", gender: "female" },
			{
				id: 41, name: "V-Neck Tee", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 42, name: "Vacation Tank", gender: "female" },
		],
		"bottoms": [
			{ id: 1, name: "Active Shorts", gender: "male", startedGame: true },
			{
				id: 1, name: "Athletic Long Shorts", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Green" },
				]
			},
			{
				id: 1, name: "Athletic Shorts", gender: "female", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Green" },
				]
			},
			{
				id: 3, name: "Bordered Flared Skirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 1, name: "Camo Cargo Shorts", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
				]
			},
			{
				id: 2, name: "Capri Pants", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
					{ id: 6, name: "White" },
				]
			},
			{
				id: 3, name: "Capri Pants", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 3, name: "Casual Shorts", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 3, name: "Cutoff Jeans", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Faded Black" },
					{ id: 3, name: "Light Blue" },
					{ id: 4, name: "Navy Blue" },
				]
			},
			{
				id: 3, name: "Distressed Jeans", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Faded Black" },
					{ id: 3, name: "Light Blue" },
				]
			},
			{
				id: 3, name: "Flower-Print Flared Skirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 3, name: "Frayed Denim Shorts", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Faded Black" },
					{ id: 3, name: "Light Blue" },
				]
			},
			{ id: 1, name: "Karate GI Pants", gender: "male" },
			{ id: 1, name: "Kommo-o Tassets", gender: "male" },
			{ id: 1, name: "Luran Shorts", gender: "female" },
			{ id: 1, name: "Patterned Cargo Shorts - Striped", gender: "male" },
			{
				id: 3, name: "Plaid Miniskirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 3, name: "Plain Cargo Shorts", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 3, name: "Pleated Skirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 3, name: "Pleated Shorts", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 1, name: "Pokemon Center Nurse Skirt", gender: "female" },
			{
				id: 3, name: "Ribbed Capris", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 3, name: "Sporty Long Shorts", gender: "male", forms: [
					{ id: 1, name: "Jellyfish" },
					{ id: 2, name: "Legendary" },
					{ id: 3, name: "Sea Cucumber" },
					{ id: 4, name: "Woolly Crab" },
				]
			},
			{
				id: 3, name: "Sporty Long Shorts", gender: "female", forms: [
					{ id: 1, name: "Fruit" },
					{ id: 2, name: "Jellyfish" },
					{ id: 3, name: "Legendary" },
					{ id: 4, name: "Seed" },
					{ id: 5, name: "Sludge" },
					{ id: 6, name: "Woolly Crab" },
				]
			},
			{ id: 1, name: "Vacation Shorts", gender: "female" },
		],
		"socks": [
			{
				id: 1, name: "Camo Over-the-Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
				]
			},
			{
				id: 2, name: "Crew Socks", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
				]
			},
			{
				id: 3, name: "Crew Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 4, name: "Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 5, name: "Over-the-Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 6, name: "Sporty Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
		],
		"shoes": [
			{
				id: 1, name: "Espadrilles", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Cruel" },
					{ id: 4, name: "Gray" },
					{ id: 5, name: "Green" },
					{ id: 6, name: "Navy Blue" },
					{ id: 7, name: "Order" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Rare Cruel" },
					{ id: 10, name: "Rare Long Neck" },
					{ id: 11, name: "Rare Order" },
					{ id: 12, name: "Rare Scaly" },
					{ id: 13, name: "Rare Thunderbolt" },
					{ id: 14, name: "Scaly" },
					{ id: 15, name: "Thunderbolt" },
					{ id: 16, name: "White" },
				]
			},
			{
				id: 2, name: "Loafers", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
				]
			},
			{
				id: 3, name: "Low-Heeled Sandals", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
				]
			},
			{ id: 4, name: "Low-Top Sneakers - Black", gender: "male" },
			{
				id: 5, name: "Penny Loafers", gender: "male", forms: [
					{ id: 1, name: "Cruel" },
					{ id: 2, name: "Rare Cruel" },
					{ id: 3, name: "Rare Long Neck" },
					{ id: 4, name: "Rare Order" },
					{ id: 5, name: "Rare Scaly" },
					{ id: 6, name: "Rare Thunderbolt" },
				]
			},
			{
				id: 6, name: "Sporty Sneakers", gender: "unisex", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Multi Blue" },
					{ id: 5, name: "Multi Gray" },
					{ id: 6, name: "Multi Green" },
					{ id: 7, name: "Multi Navy Blue" },
					{ id: 8, name: "Multi Purple" },
					{ id: 9, name: "Navy Blue" },
					{ id: 10, name: "Purple" },
					{ id: 11, name: "White" },
				]
			},
			{
				id: 7, name: "Strappy Sandals", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
				]
			},
		],
		"hats": [
			{ id: 1, name: "Athletic Cap - Green", gender: "unisex" },
			{
				id: 2, name: "Beach Hat", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
				]
			},
			{
				id: 3, name: "Sports Cap", gender: "male", forms: [
					{ id: 1, name: "Jellyfish" },
					{ id: 2, name: "Woolly Crab" },
				]
			},
			{
				id: 4, name: "Sports Cap", gender: "female", forms: [
					{ id: 1, name: "Jellyfish" },
					{ id: 2, name: "Legendary" },
					{ id: 3, name: "Woolly Crab" },
				]
			},
			{ id: 5, name: "Street Cap - Cruel", gender: "unisex" },
			{
				id: 6, name: "Trilby Hat", gender: "unisex", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
				]
			},
		],
		"glasses": [
			{
				id: 1, name: "Aviator Shades", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Purple" },
				]
			},
			{
				id: 2, name: "Horn-Rimmed Glasses", gender: "unisex", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
					{ id: 3, name: "Navy Blue" },
					{ id: 4, name: "Purple" },
				]
			},
			{
				id: 3, name: "Mirrored Glasses", gender: "unisex", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
				]
			},
			{
				id: 4, name: "Oversized Sunglasses", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Purple" },
				]
			},
		],
		"bags": [
			{
				id: 1, name: "Leather Backpack", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
				]
			},
			{
				id: 2, name: "Messenger Bag", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
				]
			},
			{
				id: 3, name: "Ruffled Shoulder Bag", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
				]
			},
			{
				id: 4, name: "Satchel Bag", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
				]
			},
			{
				id: 5, name: "Scout Pack", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
				]
			},
			{
				id: 6, name: "Sporty Backpack", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
				]
			},
			{
				id: 7, name: "Sporty Bag", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
				]
			},
		],
		"accessories": [
			{
				id: 1, name: "Flower Barrette", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
					{ id: 3, name: "Navy Blue" },
					{ id: 4, name: "Purple" },
				]
			},
			{ id: 2, name: "Gem Barrette", gender: "female" },
			{
				id: 3, name: "Satin Bow Headband", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
					{ id: 3, name: "Navy Blue" },
					{ id: 4, name: "Purple" },
				]
			},
			{
				id: 4, name: "Sea-Star Headband", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
					{ id: 3, name: "Navy Blue" },
					{ id: 4, name: "Purple" },
				]
			},
		],
	};

	defineFashionMany(GAME_KEYS, () => buildFashionFor(CATEGORIES, ITEMS_BY_CATEGORY));
})();

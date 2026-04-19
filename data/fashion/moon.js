import {
  buildFashionFor,
  defineFashionMany,
  _fashionItem,
} from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["moon"];

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
			{ id: 1, name: "Alola Sea Tank", gender: "unisex" },
			{ id: 2, name: "Argyle Tee", gender: "male" },
			{
				id: 3, name: "Athletic Tank", gender: "male", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Green" },
				]
			},
			{
				id: 4, name: "Athletic Tank", gender: "female", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Green" },
					{ id: 3, name: "Purple" },
				]
			},
			{ id: 5, name: "Bone Keeper Tank", gender: "male" },
			{
				id: 6, name: "Casual Striped Tee", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
				]
			},
			{ id: 7, name: "Chatot Tee", gender: "male" },
			{ id: 8, name: "Cobra Tank", gender: "female" },
			{
				id: 9, name: "Collared Shirt", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 10, name: "Collegiate Tank", gender: "unisex" },
			{
				id: 11, name: "Designer Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 12, name: "Flower-Print Flared Skirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 13, name: "Flower-Print Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 14, name: "Halter Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 15, name: "Hard Scale Tank", gender: "male" },
			{ id: 16, name: "Iconic Top", gender: "unisex" },
			{ id: 17, name: "Leppa Tee", gender: "male" },
			{ id: 18, name: "Luvdisc Tee", gender: "unisex" },
			{
				id: 19, name: "Pinstripe Collared Shirt", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 20, name: "Plain Tee", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 21, name: "Pola-Dot Ruffled Tank", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 22, name: "Polo Shirt", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 23, name: "Ruffled Blouse", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 24, name: "Ruffled Tank", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 25, name: "Skull Tank", gender: "male" },
			{ id: 26, name: "Sporty Shorts - Sludge", gender: "female" },
			{
				id: 27, name: "Sporty Tank", gender: "unisex", forms: [
					{ id: 1, name: "Fruit" },
					{ id: 2, name: "Jellyfish" },
					{ id: 3, name: "Seed" },
					{ id: 4, name: "Sludge" },
					{ id: 5, name: "Woolly Crab" },
				]
			},
			{
				id: 28, name: "Star-Print Polo", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 29, name: "Striped Halter Top", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 30, name: "Striped Ruffled Blouse", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 31, name: "Striped V-Neck Tee", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 32, name: "Surfing Tank", gender: "unisex" },
			{
				id: 33, name: "Tank Top", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 34, name: "V-Neck Tee", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
		],
		"bottoms": [
			{ id: 1, name: "Athletic Long Shorts - Beige", gender: "male" },
			{
				id: 2, name: "Athletic Shorts", gender: "female", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Green" },
				]
			},
			{
				id: 3, name: "Bordered Flared Skirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 4, name: "Camo Cargo Shorts", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
				]
			},
			{
				id: 5, name: "Capri Pants", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 6, name: "Casual Shorts", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 7, name: "Cutoff Jeans", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Faded Black" },
					{ id: 3, name: "Light Blue" },
				]
			},
			{
				id: 8, name: "Distressed Jeans", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Faded Black" },
					{ id: 3, name: "Light Blue" },
				]
			},
			{
				id: 9, name: "Frayed Denim Shorts", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Faded Black" },
					{ id: 3, name: "Light Blue" },
				]
			},
			{ id: 10, name: "Patterned Cargo Shorts - Striped", gender: "male" },
			{
				id: 11, name: "Plaid Miniskirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 12, name: "Plain Cargo Shorts", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 13, name: "Pleated Miniskirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 14, name: "Pleated Shorts", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 15, name: "Ribbed Capris", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 16, name: "Sporty Long Shorts", gender: "male", forms: [
					{ id: 1, name: "Fruit" },
					{ id: 2, name: "Jellyfish" },
					{ id: 3, name: "Legendary" },
					{ id: 4, name: "Seed" },
					{ id: 5, name: "Sludge" },
					{ id: 6, name: "Woolly Crab" },
				]
			},
			{
				id: 17, name: "Sporty Shorts", gender: "female", forms: [
					{ id: 1, name: "Fruit" },
					{ id: 2, name: "Jellyfish" },
					{ id: 3, name: "Legendary" },
					{ id: 4, name: "Seed" },
					{ id: 5, name: "Sludge" },
					{ id: 6, name: "Woolly Crab" },
				]
			},
		],
		"socks": [
			{
				id: 1, name: "Camo Over-the-Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
				]
			},
			{
				id: 2, name: "Crew Socks", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
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
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 5, name: "Over-the-Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 6, name: "Sporty Knee Socks", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
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
					{ id: 4, name: "Green" },
					{ id: 5, name: "Grey" },
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
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 3, name: "Low-Heeled Sandals", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{ id: 4, name: "Low-Tap Sneakers - Black", gender: "female" },
			{
				id: 5, name: "Penny Loafers", gender: "male", forms: [
					{ id: 1, name: "Order" },
					{ id: 2, name: "Scaly" },
					{ id: 3, name: "Thunderbolt" },
				]
			},
			{
				id: 6, name: "Sporty Sneakers", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Gray" },
					{ id: 5, name: "Multi Blue" },
					{ id: 6, name: "Multi Green" },
					{ id: 7, name: "Multi Gray" },
					{ id: 8, name: "Multi Navy Blue" },
					{ id: 9, name: "Multi Purple" },
					{ id: 10, name: "Navy Blue" },
					{ id: 11, name: "Purple" },
					{ id: 12, name: "White" },
				]
			},
			{
				id: 7, name: "Strappy Sandals", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 8, name: "Trekking Shoes", gender: "male", forms: [
					{ id: 1, name: "Cruel" },
					{ id: 2, name: "Thunderbolt" },
				]
			},
		],
		"hats": [
			{
				id: 1, name: "Athletic Cap", gender: "unisex", forms: [
					{ id: 1, name: "Beige" },
					{ id: 1, name: "Green" },
				]
			},
			{
				id: 2, name: "Beach Hat", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 3, name: "Sports Cap", gender: "male", forms: [
					{ id: 1, name: "Legendary" },
					{ id: 3, name: "Seed" },
				]
			},
			{
				id: 4, name: "Sports Cap", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Fruit" },
					{ id: 3, name: "Jellyfish" },
					{ id: 4, name: "Legendary" },
					{ id: 5, name: "Seed" },
					{ id: 6, name: "Woolly Crab" },
				]
			},
			{
				id: 5, name: "Street Cap", gender: "male", forms: [
					{ id: 1, name: "Jellyfish" },
					{ id: 2, name: "Order" },
					{ id: 3, name: "Scaly" },
					{ id: 4, name: "Thunderbolt" },
					{ id: 5, name: "Woolly Crab" },
				]
			},
			{
				id: 6, name: "Street Cap", gender: "female", forms: [
					{ id: 1, name: "Cruel" },
					{ id: 2, name: "Order" },
					{ id: 3, name: "Scaly" },
					{ id: 4, name: "Thunderbolt" },
				]
			},
			{
				id: 7, name: "Trilby Hat", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
		],
		"glasses": [
			{
				id: 1, name: "Aviator Shades", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Gray" },
					{ id: 3, name: "Purple" },
				]
			},
			{
				id: 2, name: "Horn-Rimmed Glasses", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 3, name: "Mirrored Sunglasses", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
				]
			},
			{
				id: 4, name: "Mirrored Sunglasses", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
					{ id: 2, name: "White" },
				]
			},
			{
				id: 5, name: "Oversized Sunglasses", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Grey" },
					{ id: 2, name: "Purple" },
				]
			},
		],
		"bags": [
			{
				id: 1, name: "Leather Backpack", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 2, name: "Messenger Bag", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 3, name: "Ruffled Shoulder Bag", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 4, name: "Satchel Bag", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 5, name: "Scout Pack", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
			{
				id: 6, name: "Sporty Backpack", gender: "male", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
					{ id: 3, name: "Grey" },
					{ id: 4, name: "Navy Blue" },
					{ id: 5, name: "Purple" },
				]
			},
			{
				id: 7, name: "Sporty Bag", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Grey" },
					{ id: 5, name: "Navy Blue" },
					{ id: 6, name: "Purple" },
					{ id: 7, name: "White" },
				]
			},
		],
		"accesories": [
			{
				id: 1, name: "Gem Barrette", gender: "female", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "White" },
				]
			},
		],
	};

	defineFashionMany(GAME_KEYS, () => buildFashionFor(CATEGORIES, ITEMS_BY_CATEGORY));
})();

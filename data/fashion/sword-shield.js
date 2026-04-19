import {
  buildFashionFor,
  defineFashionMany,
  _fashionItem,
} from '../helpers/index.js';

(() => {
	const GAME_KEYS = ["sword", "shield"];

	// local wrapper (binds to helpers.js global)
	const fashionItem = (gameKey, gender, category, name) => _fashionItem(gameKey, gender, category, name);

	const CATEGORIES = [
		{ id: "hats", label: "Hats" },
		{ id: "glasses", label: "Glasses" },
		{ id: "tops", label: "Tops" },
		{ id: "jackets", label: "Jackets" },
		{ id: "dresses", label: "Dresses" },
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
				id: 1, name: "Boater Hat", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 2, name: "Bucket Hat", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 3, name: "Knit Beret", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 4, name: "Knit Beret", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green", startGame: true },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 5, name: "Knit Beret", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray", startGame: true },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 6, name: "Knit Beret", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 7, name: "Scally Cap", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 8, name: "Sport Cap", gender: "unisex", forms: [
					{ id: 1, name: "Challenger Kit" },
					{ id: 2, name: "Iconic Style", extraCredit: true },
					{ id: 2, name: "Leon's Look", extraCredit: true },
					{ id: 3, name: "Bug Type" },
					{ id: 4, name: "Dark Type" },
					{ id: 5, name: "Dragon Type" },
					{ id: 6, name: "Electric Type" },
					{ id: 7, name: "Fairy Type" },
					{ id: 8, name: "Fighting Type" },
					{ id: 9, name: "Fire Type" },
					{ id: 10, name: "Flying Type" },
					{ id: 11, name: "Ghost Type" },
					{ id: 12, name: "Grass Type" },
					{ id: 13, name: "Ground Type" },
					{ id: 14, name: "Ice Type" },
					{ id: 15, name: "Normal Type" },
					{ id: 16, name: "Poison Type" },
					{ id: 17, name: "Psychic Type" },
					{ id: 18, name: "Rock Type" },
					{ id: 19, name: "Steel Type" },
					{ id: 20, name: "Water Type" },
				]
			},
			{
				id: 9, name: "Trapper Hat", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
		],
		"glasses": [
			{
				id: 1, name: "Half-Rim Eyeglasses", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Gold" },
					{ id: 3, name: "Mottled" },
					{ id: 4, name: "Silver" },
				]
			},
			{
				id: 2, name: "Half-Rim Sunglasses", gender: "unisex", forms: [
					{ id: 1, name: "Black/Blue" },
					{ id: 2, name: "Black/Brown" },
					{ id: 3, name: "Black/Gray" },
					{ id: 4, name: "Black/Pink" },
					{ id: 5, name: "Black/Purple" },
					{ id: 6, name: "Black/Yellow" },
					{ id: 7, name: "Gold/Blue" },
					{ id: 8, name: "Gold/Brown" },
					{ id: 9, name: "Gold/Gray" },
					{ id: 10, name: "Gold/Pink" },
					{ id: 11, name: "Gold/Purple" },
					{ id: 12, name: "Gold/Yellow" },
					{ id: 13, name: "Mottled/Blue" },
					{ id: 14, name: "Mottled/Brown" },
					{ id: 15, name: "Mottled/Gray" },
					{ id: 16, name: "Mottled/Pink" },
					{ id: 17, name: "Mottled/Purple" },
					{ id: 18, name: "Mottled/Yellow" },
					{ id: 19, name: "Silver/Blue" },
					{ id: 20, name: "Silver/Brown" },
					{ id: 21, name: "Silver/Gray" },
					{ id: 22, name: "Silver/Pink" },
					{ id: 23, name: "Silver/Purple" },
					{ id: 24, name: "Silver/Yellow" },
				]
			},
			{
				id: 3, name: "Round Eyeglasses", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Metal" },
					{ id: 3, name: "Mottled" },
				]
			},
			{
				id: 4, name: "Round Sunglasses", gender: "unisex", forms: [
					{ id: 1, name: "Black/Black" },
					{ id: 2, name: "Black/Blue" },
					{ id: 3, name: "Black/Red" },
					{ id: 4, name: "Black/Yellow" },
					{ id: 5, name: "Metal/Black" },
					{ id: 6, name: "Metal/Blue" },
					{ id: 7, name: "Metal/Red" },
					{ id: 8, name: "Metal/Yellow" },
					{ id: 9, name: "Mottled/Black" },
					{ id: 10, name: "Mottled/Blue" },
					{ id: 11, name: "Mottled/Red" },
					{ id: 12, name: "Mottled/Yellow" },
				]
			},
			{
				id: 5, name: "Sport Sunglasses", gender: "unisex", forms: [
					{ id: 1, name: "Challenger Kit" },
					{ id: 2, name: "Iconic Style", extraCredit: true },
					{ id: 3, name: "Bug Type" },
					{ id: 4, name: "Dark Type" },
					{ id: 5, name: "Dragon Type" },
					{ id: 6, name: "Electric Type" },
					{ id: 7, name: "Fairy Type" },
					{ id: 8, name: "Fighting Type" },
					{ id: 9, name: "Fire Type" },
					{ id: 10, name: "Flying Type" },
					{ id: 11, name: "Ghost Type" },
					{ id: 12, name: "Grass Type" },
					{ id: 13, name: "Ground Type" },
					{ id: 14, name: "Ice Type" },
					{ id: 15, name: "Normal Type" },
					{ id: 16, name: "Poison Type" },
					{ id: 17, name: "Psychic Type" },
					{ id: 18, name: "Rock Type" },
					{ id: 19, name: "Steel Type" },
					{ id: 20, name: "Water Type" },
				]
			},
			{
				id: 6, name: "Square Eyeglasses", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Navy" },
					{ id: 5, name: "Orange" },
					{ id: 6, name: "Pink" },
					{ id: 7, name: "Purple" },
					{ id: 8, name: "Red" },
					{ id: 9, name: "White" },
					{ id: 10, name: "Yellow" },
				]
			},
			{
				id: 7, name: "Square Sunglasses", gender: "unisex", forms: [
					{ id: 1, name: "Black/Black" },
					{ id: 2, name: "Blue/Black" },
					{ id: 3, name: "Green/Black" },
					{ id: 4, name: "Navy/Black" },
					{ id: 5, name: "Orange/Black" },
					{ id: 6, name: "Pink/Black" },
					{ id: 7, name: "Purple/Black" },
					{ id: 8, name: "Red/Black" },
					{ id: 9, name: "White/Black" },
					{ id: 10, name: "Yellow/Black" },
				]
			},
			{
				id: 8, name: "Wraparound Sunglasses", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Green" },
					{ id: 4, name: "Mottled" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "White" },
				]
			},
		],
		"tops": [
			{
				id: 1, name: "Boatneck Sweatshirt", gender: "unisex", forms: [
					{ id: 1, name: "Eternal Sleep" },
					{ id: 2, name: "Gullet Glam" },
					{ id: 3, name: "Mischief Maker" },
				]
			},
			{
				id: 2, name: "Casual Tee", gender: "unisex", forms: [
					{ id: 1, name: "Arcanine Art" },
					{ id: 2, name: "Astonished Eevee" },
					{ id: 3, name: "Camp Curry" },
					{ id: 4, name: "Dynamax Band" },
					{ id: 5, name: "Great Ball Guy", extraCredit: true },
					{ id: 6, name: "Nasty Plot" },
					{ id: 7, name: "Night Shade" },
					{ id: 8, name: "Pikachu Payback" },
					{ id: 9, name: "Poke Ball Guy", extraCredit: true },
					{ id: 10, name: "Scary Face" },
					{ id: 11, name: "Tumblecube Cute", extraCredit: true },
					{ id: 12, name: "Ultra Ball Guy", extraCredit: true },
					{ id: 13, name: "Urban Smog" },
				]
			},
			{
				id: 3, name: "Faded Sweatshirt", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 4, name: "Loose Top", gender: "unisex", forms: [
					{ id: 1, name: "Luxury Holiday" },
					{ id: 2, name: "Poliwag Pop" },
					{ id: 3, name: "Sea Urchin" },
					{ id: 4, name: "Black" },
					{ id: 5, name: "Blue" },
					{ id: 6, name: "Gray" },
					{ id: 7, name: "Green" },
					{ id: 8, name: "Navy" },
					{ id: 9, name: "Orange" },
					{ id: 10, name: "Pink" },
					{ id: 11, name: "Purple" },
					{ id: 12, name: "Red" },
					{ id: 13, name: "Tan" },
					{ id: 14, name: "White", startGame: true },
					{ id: 15, name: "Yellow" },
				]
			},
			{ id: 5, name: "Sport Sweatshirt - Iconic Style", gender: "unisex" },
			{
				id: 6, name: "Sport Top", gender: "unisex", forms: [
					{ id: 1, name: "Battle Tower" },
					{ id: 2, name: "Challenger Kit" },
					{ id: 3, name: "Ranked Battles" },
					{ id: 4, name: "Reigning Champion" },
					{ id: 5, name: "Bug Type" },
					{ id: 6, name: "Dark Type" },
					{ id: 7, name: "Dragon Type" },
					{ id: 8, name: "Electric Type" },
					{ id: 9, name: "Fairy Type" },
					{ id: 10, name: "Fighting Type" },
					{ id: 11, name: "Fire Type" },
					{ id: 12, name: "Flying Type" },
					{ id: 13, name: "Ghost Type" },
					{ id: 14, name: "Grass Type" },
					{ id: 15, name: "Ground Type" },
					{ id: 16, name: "Ice Type" },
					{ id: 17, name: "Normal Type" },
					{ id: 18, name: "Poison Type" },
					{ id: 19, name: "Psychic Type" },
					{ id: 20, name: "Rock Type" },
					{ id: 21, name: "Steel Type" },
					{ id: 22, name: "Water Type" },
				]
			},
			{
				id: 7, name: "Striped Top", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue", startGame: true },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red", startGame: true },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 8, name: "Three-Fourths Sleeve Button-Front Top", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Candy Stripe" },
					{ id: 3, name: "Maroon" },
					{ id: 4, name: "Paisley Pattern" },
					{ id: 5, name: "White" },
				]
			},
			{
				id: 9, name: "Three-Fourths Sleeve Polo", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red", startGame: true },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 10, name: "Torn Top", gender: "unisex", forms: [
					{ id: 1, name: "Astonished Eevee" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Nasty Plot" },
					{ id: 4, name: "Night Plot" },
					{ id: 5, name: "Night Shade" },
					{ id: 6, name: "Pikachu Payback" },
					{ id: 7, name: "Scary Face" },
					{ id: 8, name: "White" },
				]
			},
		],
		"jackets": [
			{
				id: 1, name: "Fuzzy Pastel Parka", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 2, name: "Hoodie", gender: "unisex", forms: [
					{ id: 1, name: "Sunset City" },
					{ id: 2, name: "The Champ" },
					{ id: 3, name: "Black" },
					{ id: 4, name: "Blue" },
					{ id: 5, name: "Gray" },
					{ id: 6, name: "Gray Greed" },
					{ id: 7, name: "Green" },
					{ id: 8, name: "Navy" },
					{ id: 9, name: "Orange" },
					{ id: 10, name: "Pink" },
					{ id: 11, name: "Purple" },
					{ id: 12, name: "Red" },
					{ id: 13, name: "Tan" },
					{ id: 14, name: "White" },
					{ id: 15, name: "Yellow" },
				]
			},
			{
				id: 3, name: "Knitted Parka", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray", startGame: true },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 4, name: "Motorcycle Jacket", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Caramel" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "White" },
				]
			},
			{ id: 5, name: "Satin Varsity Jacket", gender: "unisex" },
			{
				id: 6, name: "Tracksuit Jacket", gender: "unisex", forms: [
					{ id: 1, name: "Challenger Kit" },
					{ id: 2, name: "Iconic Style", extraCredit: true },
					{ id: 3, name: "Bug Type" },
					{ id: 4, name: "Dark Type" },
					{ id: 5, name: "Dragon Type" },
					{ id: 6, name: "Electric Type" },
					{ id: 7, name: "Fairy Type" },
					{ id: 8, name: "Fighting Type" },
					{ id: 9, name: "Fire Type" },
					{ id: 10, name: "Flying Type" },
					{ id: 11, name: "Ghost Type" },
					{ id: 12, name: "Grass Type" },
					{ id: 13, name: "Ground Type" },
					{ id: 14, name: "Ice Type" },
					{ id: 15, name: "Normal Type" },
					{ id: 16, name: "Poison Type" },
					{ id: 17, name: "Psychic Type" },
					{ id: 18, name: "Rock Type" },
					{ id: 19, name: "Steel Type" },
					{ id: 20, name: "Water Type" },
				]
			},
			{
				id: 7, name: "Varsity Jacket", gender: "unisex", forms: [
					{ id: 1, name: "Blue" },
					{ id: 2, name: "Green" },
					{ id: 3, name: "Red" },
				]
			},
			{
				id: 8, name: "Zippered Parka", gender: "unisex", forms: [
					{ id: 1, name: "Berry Forest" },
					{ id: 2, name: "Cute Clobbering" },
					{ id: 3, name: "Lovely Nightmare" },
				]
			},
		],
		"dresses": [
			{
				id: 1, name: "Pleated Dress", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 2, name: "Simple Shirt Dress", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
		],
		"bags": [
			{
				id: 1, name: "Canvas Rucksack", gender: "female", forms: [
					{ id: 1, name: "Navy" },
					{ id: 2, name: "White" },
					{ id: 3, name: "White/Black" },
					{ id: 4, name: "White/Blue" },
					{ id: 5, name: "White/Red" },
				]
			},
			{
				id: 2, name: "Canvas Travel Bag", gender: "male", forms: [
					{ id: 1, name: "Ball Bonanza" },
					{ id: 2, name: "Leppa Laden" },
					{ id: 3, name: "Logo Lined" },
					{ id: 4, name: "Navy" },
					{ id: 5, name: "White" },
					{ id: 6, name: "White/Black" },
					{ id: 7, name: "White/Blue" },
					{ id: 8, name: "White/Red" },
				]
			},
			{
				id: 3, name: "Frilly Rucksack", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Brown" },
					{ id: 3, name: "Maroon" },
					{ id: 4, name: "Navy" },
					{ id: 5, name: "Sand" },
					{ id: 6, name: "White" },
				]
			},
			{
				id: 4, name: "Leather-Trimmed Bag", gender: "unisex", forms: [
					{ id: 1, name: "Brown", startGame: true },
					{ id: 2, name: "Maroon" },
					{ id: 3, name: "Sand" },
					{ id: 4, name: "White" },
					{ id: 5, name: "White/Black" },
					{ id: 6, name: "White/Brown" },
				]
			},
			{
				id: 5, name: "Plaid Rucksack", gender: "female", forms: [
					{ id: 1, name: "Cream/Green" },
					{ id: 2, name: "Cream/Monotone" },
					{ id: 3, name: "Cream/Navy" },
					{ id: 4, name: "Cream/Pink" },
					{ id: 5, name: "Cream/Red" },
					{ id: 6, name: "Cream/Yellow" },
				]
			},
			{
				id: 6, name: "Plaid Travel Bag", gender: "male", forms: [
					{ id: 1, name: "Cream/Green" },
					{ id: 2, name: "Cream/Monotone" },
					{ id: 3, name: "Cream/Navy" },
					{ id: 4, name: "Cream/Pink" },
					{ id: 5, name: "Cream/Red" },
					{ id: 6, name: "Cream/Yellow" },
				]
			},
			{
				id: 7, name: "Sporty Rucksack", gender: "female", forms: [
					{ id: 1, name: "Challenger Kit" },
					{ id: 2, name: "Iconic Style", extraCredit: true },
					{ id: 3, name: "Bug Type" },
					{ id: 4, name: "Dark Type" },
					{ id: 5, name: "Dragon Type" },
					{ id: 6, name: "Electric Type" },
					{ id: 7, name: "Fairy Type" },
					{ id: 8, name: "Fighting Type" },
					{ id: 9, name: "Fire Type" },
					{ id: 10, name: "Flying Type" },
					{ id: 11, name: "Ghost Type" },
					{ id: 12, name: "Grass Type" },
					{ id: 13, name: "Ground Type" },
					{ id: 14, name: "Ice Type" },
					{ id: 15, name: "Normal Type" },
					{ id: 16, name: "Poison Type" },
					{ id: 17, name: "Psychic Type" },
					{ id: 18, name: "Rock Type" },
					{ id: 19, name: "Steel Type" },
					{ id: 20, name: "Water Type" },
				]
			},
			{
				id: 8, name: "Sporty Travel Bag", gender: "male", forms: [
					{ id: 1, name: "Challenger Kit" },
					{ id: 2, name: "Iconic Style", extraCredit: true },
					{ id: 3, name: "Bug Type" },
					{ id: 4, name: "Dark Type" },
					{ id: 5, name: "Dragon Type" },
					{ id: 6, name: "Electric Type" },
					{ id: 7, name: "Fairy Type" },
					{ id: 8, name: "Fighting Type" },
					{ id: 9, name: "Fire Type" },
					{ id: 10, name: "Flying Type" },
					{ id: 11, name: "Ghost Type" },
					{ id: 12, name: "Grass Type" },
					{ id: 13, name: "Ground Type" },
					{ id: 14, name: "Ice Type" },
					{ id: 15, name: "Normal Type" },
					{ id: 16, name: "Poison Type" },
					{ id: 17, name: "Psychic Type" },
					{ id: 18, name: "Rock Type" },
					{ id: 19, name: "Steel Type" },
					{ id: 20, name: "Water Type" },
				]
			},
			{
				id: 9, name: "Studded Leather Case", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Brilliant Black" },
					{ id: 4, name: "Caramel" },
					{ id: 5, name: "Harsh White" },
					{ id: 6, name: "Red" },
					{ id: 7, name: "White" },
				]
			},
		],
		"gloves": [
			{
				id: 1, name: "Leather Palm Gloves", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Caramel" },
					{ id: 4, name: "Fresh & Blue" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "Red Gas" },
					{ id: 7, name: "Splashy Pink" },
					{ id: 8, name: "White" },
				]
			},
			{
				id: 2, name: "Patterned Gloves", gender: "unisex", forms: [
					{ id: 1, name: "Gullet Glam" },
					{ id: 2, name: "Mischief Maker" },
				]
			},
			{
				id: 3, name: "Plaid Gloves", gender: "unisex", forms: [
					{ id: 1, name: "Green" },
					{ id: 2, name: "Monotone" },
					{ id: 3, name: "Navy" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "Yellow" },
				]
			},
			{
				id: 4, name: "Simple Gloves", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue", startGame: true },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red", startGame: true },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 5, name: "Sport Glove", gender: "unisex", forms: [
					{ id: 1, name: "Battle Tower" },
					{ id: 2, name: "Challenger Kit" },
					{ id: 3, name: "Iconic Kit", extraCredit: true },
					{ id: 4, name: "Ranked Battles" },
					{ id: 5, name: "Reigning Champion" },
					{ id: 6, name: "Bug Type" },
					{ id: 7, name: "Dark Type" },
					{ id: 8, name: "Dragon Type" },
					{ id: 9, name: "Electric Type" },
					{ id: 10, name: "Fairy Type" },
					{ id: 11, name: "Fighting Type" },
					{ id: 12, name: "Fire Type" },
					{ id: 13, name: "Flying Type" },
					{ id: 14, name: "Ghost Type" },
					{ id: 15, name: "Grass Type" },
					{ id: 16, name: "Ground Type" },
					{ id: 17, name: "Ice Type" },
					{ id: 18, name: "Normal Type" },
					{ id: 19, name: "Poison Type" },
					{ id: 20, name: "Psychic Type" },
					{ id: 21, name: "Rock Type" },
					{ id: 22, name: "Steel Type" },
					{ id: 23, name: "Water Type" },
				]
			},
		],
		"bottoms": [
			{
				id: 1, name: "Damaged Denim Shorts", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Faded Black" },
					{ id: 4, name: "Light Blue" },
				]
			},
			{
				id: 2, name: "Denim Trousers", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Faded Black" },
					{ id: 4, name: "Light Blue" },
					{ id: 5, name: "Navy" },
				]
			},
			{
				id: 3, name: "Designer Denim", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Faded Black" },
					{ id: 4, name: "Light Blue" },
					{ id: 5, name: "Navy" },
				]
			},
			{
				id: 4, name: "Leather Trousers", gender: "unisex", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Caramel" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "White" },
				]
			},
			{
				id: 5, name: "Plaid Trousers", gender: "male", forms: [
					{ id: 1, name: "Green" },
					{ id: 2, name: "Monotone" },
					{ id: 3, name: "Navy" },
					{ id: 4, name: "Pink" },
					{ id: 5, name: "Red" },
					{ id: 6, name: "Yellow" },
				]
			},
			{
				id: 6, name: "Pleated Miniskirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 7, name: "Skinny Trousers", gender: "unisex", forms: [
					{ id: 1, name: "Black", startGame: true },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 8, name: "Sport Shorts", gender: "unisex", forms: [
					{ id: 1, name: "Battle Tower" },
					{ id: 2, name: "Challenger Kit" },
					{ id: 3, name: "Ranked Battles" },
					{ id: 4, name: "Reigning Champion" },
					{ id: 5, name: "Bug Type" },
					{ id: 6, name: "Dark Type" },
					{ id: 7, name: "Dragon Type" },
					{ id: 8, name: "Electric Type" },
					{ id: 9, name: "Fairy Type" },
					{ id: 10, name: "Fighting Type" },
					{ id: 11, name: "Fire Type" },
					{ id: 12, name: "Flying Type" },
					{ id: 13, name: "Ghost Type" },
					{ id: 14, name: "Grass Type" },
					{ id: 15, name: "Ground Type" },
					{ id: 16, name: "Ice Type" },
					{ id: 17, name: "Normal Type" },
					{ id: 18, name: "Poison Type" },
					{ id: 19, name: "Psychic Type" },
					{ id: 20, name: "Rock Type" },
					{ id: 21, name: "Steel Type" },
					{ id: 22, name: "Water Type" },
				]
			},
			{
				id: 9, name: "Studded Leather Skirt", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Caramel" },
					{ id: 4, name: "Red" },
					{ id: 5, name: "White" },
				]
			},
			{
				id: 10, name: "Trackie Bottoms", gender: "unisex", forms: [
					{ id: 1, name: "Challenger Kit" },
					{ id: 2, name: "Iconic Style", extraCredit: true },
					{ id: 3, name: "Bug Type" },
					{ id: 4, name: "Dark Type" },
					{ id: 5, name: "Dragon Type" },
					{ id: 6, name: "Electric Type" },
					{ id: 7, name: "Fairy Type" },
					{ id: 8, name: "Fighting Type" },
					{ id: 9, name: "Fire Type" },
					{ id: 10, name: "Flying Type" },
					{ id: 11, name: "Ghost Type" },
					{ id: 12, name: "Grass Type" },
					{ id: 13, name: "Ground Type" },
					{ id: 14, name: "Ice Type" },
					{ id: 15, name: "Normal Type" },
					{ id: 16, name: "Poison Type" },
					{ id: 17, name: "Psychic Type" },
					{ id: 18, name: "Rock Type" },
					{ id: 19, name: "Steel Type" },
					{ id: 20, name: "Water Type" },
				]
			},
		],
		"legwear": [
			{
				id: 1, name: "Compression Tights", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 2, name: "Cropped Leggings", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 3, name: "Designer Denim", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Faded Black" },
					{ id: 4, name: "Light Blue" },
					{ id: 5, name: "Navy" },
				]
			},
			{
				id: 4, name: "Frilly Short Skirt", gender: "female", forms: [
					{ id: 1, name: "Cute Clobbering" },
					{ id: 2, name: "Leppa Laden" },
					{ id: 3, name: "Lovely Nightmare" },
					{ id: 4, name: "Black" },
					{ id: 5, name: "Blue" },
					{ id: 6, name: "Gray" },
					{ id: 7, name: "Green" },
					{ id: 8, name: "Navy" },
					{ id: 9, name: "Orange" },
					{ id: 10, name: "Pink" },
					{ id: 11, name: "Purple" },
					{ id: 12, name: "Red" },
					{ id: 13, name: "Tan" },
					{ id: 14, name: "White" },
					{ id: 15, name: "Yellow" },
				]
			},
			{
				id: 5, name: "High Socks", gender: "unisex", forms: [
					{ id: 1, name: "Black", startGame: true },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White", startGame: true },
					{ id: 12, name: "Yellow" },
				]
			},
			{
				id: 6, name: "Low Crew Socks", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Gray" },
					{ id: 4, name: "Green" },
					{ id: 5, name: "Navy" },
					{ id: 6, name: "Orange" },
					{ id: 7, name: "Pink" },
					{ id: 8, name: "Purple" },
					{ id: 9, name: "Red" },
					{ id: 10, name: "Tan" },
					{ id: 11, name: "White" },
					{ id: 12, name: "Yellow" },
				]
			},
			{ id: 7, name: "Low Crew Socks - Black", gender: "female" },
			{
				id: 8, name: "Patterned Leggings", gender: "unisex", forms: [
					{ id: 1, name: "Fresh & Blue" },
					{ id: 2, name: "Red Gas" },
					{ id: 3, name: "Serious Stripes" },
					{ id: 4, name: "Splashy Pink" },
				]
			},
			{ id: 9, name: "Patterned Tights - Leon's Look", gender: "unisex", extraCredit: true },
			{ id: 10, name: "Sport Compression Tights - Iconic Style", gender: "male" },
			{ id: 11, name: "Sport Cropped Leggings - Iconic Style", gender: "male", extraCredit: true },
			{ id: 12, name: "Sport High Socks - Iconic Style", gender: "male" },
			{ id: 13, name: "Sport Leggings - Iconic Style", gender: "female", extraCredit: true },
			{
				id: 14, name: "Sport Legwear", gender: "unisex", forms: [
					{ id: 1, name: "Battle Tower" },
					{ id: 2, name: "Challenger Kit" },
					{ id: 3, name: "Ranked Battles" },
					{ id: 4, name: "Reigning Champion" },
					{ id: 5, name: "Bug Type" },
					{ id: 6, name: "Dark Type" },
					{ id: 7, name: "Dragon Type" },
					{ id: 8, name: "Electric Type" },
					{ id: 9, name: "Fairy Type" },
					{ id: 10, name: "Fighting Type" },
					{ id: 11, name: "Fire Type" },
					{ id: 12, name: "Flying Type" },
					{ id: 13, name: "Ghost Type" },
					{ id: 14, name: "Grass Type" },
					{ id: 15, name: "Ground Type" },
					{ id: 16, name: "Ice Type" },
					{ id: 17, name: "Normal Type" },
					{ id: 18, name: "Poison Type" },
					{ id: 19, name: "Psychic Type" },
					{ id: 20, name: "Rock Type" },
					{ id: 21, name: "Steel Type" },
					{ id: 22, name: "Water Type" },
				]
			},
			{ id: 15, name: "Sport Low Crew Socks - Iconic Style", gender: "male" },
			{
				id: 16, name: "Thigh-High Socks", gender: "female", forms: [
					{ id: 1, name: "Harlequin Diamonds" },
					{ id: 2, name: "Neon Blue" },
					{ id: 3, name: "Neon Green" },
					{ id: 4, name: "Neon Pink" },
					{ id: 5, name: "Neon Yellow" },
					{ id: 6, name: "Polka Dots" },
				]
			},
			{
				id: 17, name: "Trackie Bottoms", gender: "female", forms: [
					{ id: 1, name: "Challenger Kit" },
					{ id: 2, name: "Fire Type" },
					{ id: 3, name: "Flying Type" },
					{ id: 4, name: "Grass Type" },
					{ id: 5, name: "Ground Type" },
					{ id: 6, name: "Normal Type" },
					{ id: 7, name: "Poison Type" },
					{ id: 8, name: "Water Type" },
				]
			},
			{ id: 18, name: "Trainer Socks", gender: "male", startGame: true },
		],
		"shoes": [
			{
				id: 1, name: "Ankle Boots", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Brown", startGame: true },
					{ id: 3, name: "Sand" },
				]
			},
			{
				id: 2, name: "Casual Trainers", gender: "unisex", forms: [
					{ id: 1, name: "Ball Bonanza" },
					{ id: 2, name: "Berry Forest" },
					{ id: 3, name: "Black" },
					{ id: 4, name: "Blue" },
					{ id: 5, name: "Gray" },
					{ id: 6, name: "Green" },
					{ id: 7, name: "Leppa Laden" },
					{ id: 8, name: "Logo Lined" },
					{ id: 9, name: "Lovely Nightmare" },
					{ id: 10, name: "Navy" },
					{ id: 11, name: "Orange" },
					{ id: 12, name: "Pink" },
					{ id: 13, name: "Purple" },
					{ id: 14, name: "Red" },
					{ id: 15, name: "Tan" },
					{ id: 16, name: "White" },
					{ id: 17, name: "Yellow" },
				]
			},
			{
				id: 3, name: "Chukka Boots", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Brown", startGame: true },
					{ id: 3, name: "Sand" },
				]
			},
			{
				id: 4, name: "Creepers", gender: "male", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Fresh & Blue" },
					{ id: 3, name: "Red Gas" },
					{ id: 4, name: "Splashy Pink" },
					{ id: 5, name: "Tan" },
					{ id: 6, name: "White" },
				]
			},
			{
				id: 5, name: "Creepers", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Caramel" },
					{ id: 3, name: "Fresh & Blue" },
					{ id: 4, name: "Red Gas" },
					{ id: 5, name: "Splashy Pink" },
					{ id: 6, name: "White" },
				]
			},
			{
				id: 6, name: "Fur-Lined Boots", gender: "female", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Brown" },
					{ id: 3, name: "Maroon" },
					{ id: 4, name: "Navy" },
					{ id: 5, name: "Sand" },
					{ id: 6, name: "White" },
				]
			},
			{
				id: 7, name: "Loafers", gender: "unisex", forms: [
					{ id: 1, name: "Barrier Tiles" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Brown" },
					{ id: 4, name: "Punk Star" },
					{ id: 5, name: "Sand" },
					{ id: 6, name: "Trendy Tread" },
					{ id: 7, name: "White" },
					{ id: 8, name: "White/Red" },
				]
			},
			{
				id: 8, name: "Sport High-Tops", gender: "unisex", forms: [
					{ id: 1, name: "Challenger Kit" },
					{ id: 2, name: "Bug Type" },
					{ id: 3, name: "Dark Type" },
					{ id: 4, name: "Dragon Type" },
					{ id: 5, name: "Electric Type" },
					{ id: 6, name: "Fairy Type" },
					{ id: 7, name: "Fighting Type" },
					{ id: 8, name: "Fire Type" },
					{ id: 9, name: "Flying Type" },
					{ id: 10, name: "Ghost Type" },
					{ id: 11, name: "Grass Type" },
					{ id: 12, name: "Ground Type" },
					{ id: 13, name: "Ice Type" },
					{ id: 14, name: "Normal Type" },
					{ id: 15, name: "Poison Type" },
					{ id: 16, name: "Psychic Type" },
					{ id: 17, name: "Rock Type" },
					{ id: 18, name: "Steel Type" },
					{ id: 19, name: "Water Type" },
				]
			},
		]
	};

	defineFashionMany(GAME_KEYS, () => buildFashionFor(CATEGORIES, ITEMS_BY_CATEGORY));
})();

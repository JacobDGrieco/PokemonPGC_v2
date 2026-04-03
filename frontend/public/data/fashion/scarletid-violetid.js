(() => {
	const GAME_KEYS = ["scarletid", "violetid"];

	// local wrapper (binds to helpers.js global)
	const fashionItem = (gameKey, gender, category, name) => _fashionItem(gameKey, gender, category, name);

	const CATEGORIES = [
		{ id: "cases", label: "Rotom Phone Cases" },
		{ id: "uniforms", label: "Uniforms" },
		{ id: "hats", label: "Hats" },
		{ id: "glasses", label: "Glasses" },
		{ id: "bags", label: "Bags" },
		{ id: "gloves", label: "Gloves" },
		{ id: "socks", label: "Socks" },
		{ id: "shoes", label: "Shoes" }
	];

	// Fashion data authoring format:
	// - item.id stays a slug (e.g. "boater")
	// - item.forms[].id is numeric (e.g. 1), and helpers format it to "hats:boater:001"
	const ITEMS_BY_CATEGORY = {
		"cases": [
			{
				id: 1, name: "Blueberry Case", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "White" },
				]
			},
			{ id: 2, name: "Iono Zone" },
			{ id: 3, name: "Sandwich Case" },
			{ id: 4, name: "Surrendering Sunflora" },
			{ id: 5, name: "Team Star" },
		],
		"uniforms": [
			{ id: 1, name: "BB Autumn Uniform", startGame: true },
			{ id: 2, name: "BB Spring Uniform", startGame: true },
			{ id: 3, name: "BB Summer Uniform", startGame: true },
			{ id: 4, name: "BB Winter Uniform", startGame: true },
			{ id: 5, name: "BB Track Suit" },
			{ id: 6, name: "Leauge Club Uniform" },
			{ id: 7, name: "Modified Uniform A" },
			{ id: 8, name: "Modified Uniform B" },
			{ id: 9, name: "Track Suit" },
		],
		"hats": [
			{ id: 1, name: "Ball Guy Helmet" },
			{ id: 2, name: "Clive's Wig" },
			{
				id: 3, name: "Fur Bucket Hat", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Blue" },
					{ id: 4, name: "Brown" },
					{ id: 5, name: "Gray" },
					{ id: 6, name: "Green" },
					{ id: 7, name: "Navy" },
					{ id: 8, name: "Olive" },
					{ id: 9, name: "Orange" },
					{ id: 10, name: "Pink" },
					{ id: 11, name: "Purple" },
					{ id: 12, name: "Red" },
					{ id: 13, name: "White" },
					{ id: 14, name: "Yellow" },
					{ id: 15, name: "I" },
					{ id: 16, name: "II" },
					{ id: 17, name: "III" },
				]
			},
			{
				id: 4, name: "Houndstone Beanie", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Blue" },
					{ id: 4, name: "Brown" },
					{ id: 5, name: "Gray" },
					{ id: 6, name: "Green" },
					{ id: 7, name: "Light Gray" },
					{ id: 8, name: "Navy" },
					{ id: 9, name: "Olive" },
					{ id: 10, name: "Orange" },
					{ id: 11, name: "Pink" },
					{ id: 12, name: "Purple" },
					{ id: 13, name: "Red" },
					{ id: 14, name: "White" },
					{ id: 15, name: "Yellow" },
				]
			},
			{ id: 5, name: "Replica Aqua Suit Helmet" },
			{ id: 6, name: "Replica Expansion Suit Helmet" },
			{ id: 7, name: "Replica Magma Suit Helmet" },
			{
				id: 8, name: "Retro Jet Helmet", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Blue" },
					{ id: 4, name: "Brown" },
					{ id: 5, name: "Gray" },
					{ id: 6, name: "Green" },
					{ id: 7, name: "Navy" },
					{ id: 8, name: "Olive" },
					{ id: 9, name: "Orange" },
					{ id: 10, name: "Pink" },
					{ id: 11, name: "Purple" },
					{ id: 12, name: "Red" },
					{ id: 13, name: "White" },
					{ id: 14, name: "Yellow" },
					{ id: 15, name: "Sandwich Pattern (Black)" },
					{ id: 16, name: "Sandwich Pattern (Pink)" },
					{ id: 17, name: "Sandwich Pattern (Yellow)" },
				]
			},
			{
				id: 9, name: "Stampede Hat", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Blue" },
					{ id: 4, name: "Brown" },
					{ id: 5, name: "Gray" },
					{ id: 6, name: "Green" },
					{ id: 7, name: "Navy" },
					{ id: 8, name: "Olive" },
					{ id: 9, name: "Orange" },
					{ id: 10, name: "Pink" },
					{ id: 11, name: "Purple" },
					{ id: 12, name: "Red" },
					{ id: 13, name: "White" },
					{ id: 14, name: "Yellow" },
					{ id: 15, name: "A" },
					{ id: 16, name: "B" },
					{ id: 17, name: "C" },
				]
			},
			{ id: 10, name: "Team Star Helmet" },
		],
		"glasses": [
			{
				id: 1, name: "Heart Glasses", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Blue" },
					{ id: 4, name: "Brown" },
					{ id: 5, name: "Gray" },
					{ id: 6, name: "Green" },
					{ id: 7, name: "Navy" },
					{ id: 8, name: "Olive" },
					{ id: 9, name: "Orange" },
					{ id: 10, name: "Pink" },
					{ id: 11, name: "Purple" },
					{ id: 12, name: "Red" },
					{ id: 13, name: "White" },
					{ id: 14, name: "Yellow" },
				]
			},
			{
				id: 2, name: "Hexagonal Glasses", forms: [
					{ id: 1, name: "All-Gold" },
					{ id: 2, name: "All-Silver" },
					{ id: 3, name: "Beige" },
					{ id: 4, name: "Black" },
					{ id: 5, name: "Black/Orange" },
					{ id: 6, name: "Blac/Pink" },
					{ id: 7, name: "Blue" },
					{ id: 8, name: "Brown" },
					{ id: 9, name: "Green" },
					{ id: 10, name: "Mottled" },
					{ id: 11, name: "Navy" },
					{ id: 12, name: "Olive" },
					{ id: 13, name: "Orange" },
					{ id: 14, name: "Pink" },
					{ id: 15, name: "Purple" },
					{ id: 16, name: "Red" },
					{ id: 17, name: "White" },
					{ id: 18, name: "Yellow" },
				]
			},
			{ id: 3, name: "Joke Glasses - Sinistcha" },
			{
				id: 4, name: "Polarized Sports Sunglasses", forms: [
					{ id: 1, name: "Black" },
					{ id: 2, name: "Blue" },
					{ id: 3, name: "Sky Blue" },
					{ id: 4, name: "White" },
					{ id: 5, name: "Yellow" },
				]
			},
			{ id: 5, name: "Replica Ultra Glasses" },
			{ id: 6, name: "Team Star Sunglasses" },
		],
		"bags": [
			{ id: 1, name: "BB School Backpack", startGame: true },
			{
				id: 2, name: "Enamel Backpack", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Blue" },
					{ id: 4, name: "Brown" },
					{ id: 5, name: "Gray" },
					{ id: 6, name: "Green" },
					{ id: 7, name: "Navy" },
					{ id: 8, name: "Olive" },
					{ id: 9, name: "Orange" },
					{ id: 10, name: "Pink" },
					{ id: 11, name: "Purple" },
					{ id: 12, name: "Red" },
					{ id: 13, name: "White" },
					{ id: 14, name: "Yellow" },
				]
			},
			{ id: 3, name: "Replica Leader Bag" },
			{
				id: 4, name: "Triangle Backpack", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Blue" },
					{ id: 4, name: "Brown" },
					{ id: 5, name: "Gray" },
					{ id: 6, name: "Green" },
					{ id: 7, name: "Navy" },
					{ id: 8, name: "Olive" },
					{ id: 9, name: "Orange" },
					{ id: 10, name: "Pink" },
					{ id: 11, name: "Purple" },
					{ id: 12, name: "Red" },
					{ id: 13, name: "White" },
					{ id: 14, name: "Yellow" },
					{ id: 15, name: "A" },
					{ id: 16, name: "B" },
					{ id: 17, name: "C" },
					{ id: 18, name: "Pattern I" },
					{ id: 19, name: "Pattern II" },
					{ id: 20, name: "Pattern III" },
				]
			},
		],
		"gloves": [
			{ id: 1, name: "BB School Gloves", startGame: true },
			{ id: 2, name: "Elite Gloves", startGame: true },
			{ id: 3, name: "Team Star Gloves" },
			{
				id: 4, name: "Trainer Gloves", forms: [
					{ id: 1, name: "Bug" },
					{ id: 2, name: "Dark" },
					{ id: 3, name: "Dragon" },
					{ id: 4, name: "Electric" },
					{ id: 5, name: "Fairy" },
					{ id: 6, name: "Fighting" },
					{ id: 7, name: "Fire" },
					{ id: 8, name: "Flying" },
					{ id: 9, name: "Ghost" },
					{ id: 10, name: "Grass" },
					{ id: 11, name: "Ground" },
					{ id: 12, name: "Ice" },
					{ id: 13, name: "Normal" },
					{ id: 14, name: "Poison" },
					{ id: 15, name: "Psychic" },
					{ id: 16, name: "Rock" },
					{ id: 17, name: "Steel" },
					{ id: 18, name: "Water" },
				]
			},
		],
		"socks": [
			{ id: 1, name: "BB School Socks", startGame: true },
			{
				id: 2, name: "Bicolor Tights", forms: [
					{ id: 1, name: "I" },
					{ id: 2, name: "II" },
					{ id: 3, name: "III" },
				]
			},
			{
				id: 3, name: "Printed Tights", forms: [
					{ id: 1, name: "A" },
					{ id: 2, name: "A (2)" },
					{ id: 3, name: "B" },
					{ id: 4, name: "B (2)" },
					{ id: 5, name: "C" },
					{ id: 6, name: "C (2)" },
					{ id: 7, name: "D" },
					{ id: 8, name: "I" },
					{ id: 9, name: "II" },
					{ id: 10, name: "III" },
					{ id: 11, name: "IV" },
				]
			},
		],
		"shoes": [
			{ id: 1, name: "BB School Socks", startGame: true },
			{ id: 2, name: "Ghost Sneakers" },
			{ id: 3, name: "Replica Aether Shoes" },
			{
				id: 4, name: "Running Shoes", forms: [
					{ id: 1, name: "Beige" },
					{ id: 2, name: "Black" },
					{ id: 3, name: "Blue" },
					{ id: 4, name: "Brown" },
					{ id: 5, name: "Gray" },
					{ id: 6, name: "Green" },
					{ id: 7, name: "Navy" },
					{ id: 8, name: "Olive" },
					{ id: 9, name: "Orange" },
					{ id: 10, name: "Pink" },
					{ id: 11, name: "Purple" },
					{ id: 12, name: "Red" },
					{ id: 13, name: "White" },
					{ id: 14, name: "Yellow" },
					{ id: 15, name: "I" },
					{ id: 16, name: "II" },
					{ id: 17, name: "III" },
					{ id: 18, name: "IV" },
				]
			},
			{ id: 5, name: "Team Star Heels" },
		],
	};

	defineFashionMany(GAME_KEYS, () => window.buildFashionFor(CATEGORIES, ITEMS_BY_CATEGORY));
})();

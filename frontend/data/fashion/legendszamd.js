(() => {
	const GAME_KEYS = ["legendszamd"];

	// local wrapper (binds to helpers.js global)
	const fashionItem = (gameKey, gender, category, name) => _fashionItem(gameKey, gender, category, name);

	const CATEGORIES = [
		{ id: "tops", label: "Tops" },
		{ id: "bottoms", label: "Bottoms" },
		{ id: "all-in-one", label: "All-in-One" },
		{ id: "headwear", label: "Headwear" },
		{ id: "eyewear", label: "Eyewear" },
		{ id: "gloves", label: "Gloves" },
		{ id: "legwear", label: "Legwear" },
		{ id: "footwear", label: "Footwear" },
		{ id: "satchels", label: "Satchels" },
	];

	// Fashion data authoring format:
	// - item.id stays a slug (e.g. "boater")
	// - item.forms[].id is numeric (e.g. 1), and helpers format it to "hats:boater:001"
	const ITEMS_BY_CATEGORY = {
		"tops": [
			{
				id: 1, name: "Holo Blouson & Off-Shoulder", forms: [
					{ id: 1, name: "X - Holo Blue / White", startGame: true, },
					{ id: 2, name: "Y - Holo Pink", startGame: true, },
				],
			},
			{
				id: 2, name: "Holo Blouson & V-Neck", forms: [
					{ id: 1, name: "X - Holo Blue / White", startGame: true, },
					{ id: 2, name: "Y - Holo Pink", startGame: true, },
				],
			},
			{
				id: 3, name: "Grisham's Chef Top Set", forms: [
					{ id: 1, name: "Gray / White", },
					{ id: 2, name: "White / Gray", },
				],
			},
		],
		"bottoms": [
			{
				id: 1, name: "Holo Skinny Jeans", forms: [
					{ id: 1, name: "X - Holo Blue", startGame: true, },
					{ id: 2, name: "Y - Holo Pink", startGame: true, },
				],
			},
			{
				id: 2, name: "Holo Wide-Leg Pants", forms: [
					{ id: 1, name: "X - Holo Blue", startGame: true, },
					{ id: 2, name: "Y - Holo Pink", startGame: true, },
				],
			},
			{
				id: 3, name: "Grisham's Aproned Pants", forms: [
					{ id: 1, name: "Light Gray", },
					{ id: 2, name: "White", },
				],
			},
		],
		"all-in-one": [
			{
				id: 1, name: "Canari's Tracksuit Set", forms: [
					{ id: 1, name: "Lemon Yellow", },
					{ id: 2, name: "Dusk Blue", },
				],
			},
			{
				id: 2, name: "Ivor's Gi Set", forms: [
					{ id: 1, name: "Black", },
					{ id: 2, name: "", },
				],
			},
			{
				id: 3, name: "Corbeau's Suit & Tie Set", forms: [
					{ id: 1, name: "Raven Black", },
					{ id: 2, name: "Mauve Gray", },
				],
			},
			{
				id: 4, name: "Jacinthe's Dress", forms: [
					{ id: 1, name: "Lilac", },
					{ id: 2, name: "Shell Pink", },
				],
			},
		],
		"headwear": [
			{
				id: 1, name: "Holo Striped Trilby", forms: [
					{ id: 1, name: "X - Black / Holo Blue", startGame: true, },
					{ id: 2, name: "Y - Black / Holo Pink", startGame: true, },
				]
			},
			{
				id: 2, name: "Jacinthe's Pillbox Hat", forms: [
					{ id: 1, name: "Lilac", },
					{ id: 2, name: "Shell Pink", },
				],
			},
		],
		"eyewear": [
			{
				id: 1, name: "Holo Visor", forms: [
					{ id: 1, name: "X - Holo Blue", startGame: true, },
					{ id: 2, name: "Y - Holo Pink", startGame: true, },
				],
			},
			{
				id: 2, name: "Corbeau's Glasses", forms: [
					{ id: 1, name: "Magenta Drops", },
					{ id: 2, name: "Purple Drops", },
				],
			},
			{
				id: 3, name: "Grisham's Glasses", forms: [
					{ id: 1, name: "White Frames", },
					{ id: 2, name: "Flare Lenses", },
				],
			},
		],
		"gloves": [
			{
				id: 1, name: "Ivor's Training Gloves", forms: [
					{ id: 1, name: "Orange / Black", },
					{ id: 2, name: "", },
				],
			},
			{
				id: 2, name: "Jacinthe's Beribboned Gloves", forms: [
					{ id: 1, name: "Yellow Ribbon", },
					{ id: 2, name: "Pink Ribbon", },
				],
			},
		],
		"legwear": [
			{
				id: 1, name: "Jacinthe's Mesh Tights", forms: [
					{ id: 1, name: "White", },
					{ id: 2, name: "Black", },
				],
			},
		],
		"footwear": [
			{
				id: 1, name: "Holo Mid-Top Sneakers", forms: [
					{ id: 1, name: "X - Holo Blue", startGame: true, },
					{ id: 2, name: "Y - Holo Pink", startGame: true, },
				],
			},
			{
				id: 2, name: "Holo Sock Sneakers", forms: [
					{ id: 1, name: "X - Holo Blue", startGame: true, },
					{ id: 2, name: "Y - Holo Pink", startGame: true, },
				],
			},
			{
				id: 3, name: "Ivor's Geta Sandals", forms: [
					{ id: 1, name: "Black / Orange", },
					{ id: 2, name: "", },
				],
			},
			{
				id: 4, name: "Jacinthe's Bejeweled Pumps", forms: [
					{ id: 1, name: "Lilac", },
					{ id: 2, name: "Shell Pink", },
				],
			},
			{
				id: 5, name: "Grisham's Leather Shoes", forms: [
					{ id: 1, name: "Navy / Black", },
					{ id: 2, name: "Red / White", },
				],
			},
		],
		"satchels": [
			{
				id: 1, name: "Holo Round Satchel", forms: [
					{ id: 1, name: "X - Holo Blue", startGame: true, },
					{ id: 2, name: "Y - Holo Pink", startGame: true, },
				],
			},
			{
				id: 2, name: "Canari's Satchel", forms: [
					{ id: 1, name: "Regular Color", },
					{ id: 2, name: "Shiny Color", },
				],
			},
			{
				id: 3, name: "Ivor's Clasped Satchel", forms: [
					{ id: 1, name: "Regular Color", },
					{ id: 2, name: "", },
				],
			},
			{
				id: 4, name: "Corbeau's Leather Satchel", forms: [
					{ id: 1, name: "Black / Magenta", },
					{ id: 2, name: "Gray / Purple", },
				],
			},
			{
				id: 5, name: "Jacinthe's Bejeweled Satchel", forms: [
					{ id: 1, name: "Lilac", },
					{ id: 2, name: "Shell Pink", },
				],
			},
			{
				id: 6, name: "Grisham's Round Satchel", forms: [
					{ id: 1, name: "Red / Black", },
					{ id: 2, name: "Red / White", },
				],
			},
		],
	};

	defineFashionMany(GAME_KEYS, () => window.buildFashionFor(CATEGORIES, ITEMS_BY_CATEGORY));
})();

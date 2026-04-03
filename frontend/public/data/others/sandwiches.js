// --- Sandwiches ------------------------------------------------------------
(() => {
	const GAME_KEYS = ["scarlet", "violet"];

	const sandwichImg = (tier, name) => _sandwichItem(tier, name);

	// 1) “Taste” forms (SV raid/meal power style)
	const TASTES = ["Normal", "Bitter", "Sweet", "Salty", "Sour", "Spicy"];
	const tasteForms = (imgTier, imgKey) =>
		TASTES.map((t) => ({ name: t, img: sandwichImg(imgTier, imgKey) }));

	// 2) “Tier” forms (Normal/Great/Ultra/Master)
	const tierForms = (imgKey) => ([
		{ name: "Normal", img: sandwichImg("normal", imgKey) },
		{ name: "Great", img: sandwichImg("great", imgKey) },
		{ name: "Ultra", img: sandwichImg("ultra", imgKey) },
		{ name: "Master", img: sandwichImg("master", imgKey) },
	]);

	// authoring wrappers (keep list readable)
	const tasteSandwich = (id, label, imgKey, imgTier = "normal") => ({ id, label, img: sandwichImg(imgTier, imgKey), forms: tasteForms(imgTier, imgKey), });
	const tierSandwich = (id, label, imgKey) => ({ id, label, img: sandwichImg("master", imgKey), forms: tierForms(imgKey), });

	function buildSandwichesFor(gameKey) {
		return [
			tasteSandwich("jambon-beurre", "Jambon-Beurre", "jambon-beurre", "normal"),
			{
				id: 2, label: "Legendary Sandwich", img: sandwichImg("normal", "legendary"), forms: [
					"Bitter", "Sweet", "Salty", "Sour", "Spicy"
				].map((t) => ({ name: t, img: sandwichImg("normal", "legendary"), })),
			},

			// Tier-based ones (Normal/Great/Ultra/Master)
			tierSandwich(3, "Jam Sandwich", "jam"),
			tierSandwich(4, "Peanut Butter Sandwich", "peanut-butter"),
			tierSandwich(5, "Pickle Sandwich", "pickle"),
			tierSandwich(6, "Marmalade Sandwich", "marmalade"),
			tierSandwich(7, "Herbed Sausage Sandwich", "herbed-sausage"),
			tierSandwich(8, "Curry-and-Rice Style Sandwich", "curry-and-rice-style"),
			tierSandwich(9, "Dessert Sandwich", "dessert"),
			tierSandwich(10, "Tropical Sandwich", "tropical"),
			tierSandwich(11, "Avocado Sandwich", "avocado"),
			tierSandwich(12, "Noodle Sandwich", "noodle"),
			tierSandwich(13, "Potato Salad Sandwich", "potato-salad"),
			tierSandwich(14, "Zesty Sandwich", "zesty"),
			tierSandwich(15, "Egg Sandwich", "egg"),
			tierSandwich(16, "Classic Bocadillo", "classic-bocadillo"),
			tierSandwich(17, "Refreshing Sandwich", "refreshing"),
			tierSandwich(18, "BLT Sandwich", "blt"),
			tierSandwich(19, "Fried Fillet Sandwich", "fried-fillet"),
			tierSandwich(20, "Ham Sandwich", "ham"),
			tierSandwich(21, "Cheese Sandwich", "cheese"),
			tierSandwich(22, "Hamburger Patty Sandwich", "hamburger-patty"),
			tierSandwich(23, "Smoky Sandwich", "smoky"),
			tierSandwich(24, "Fruit Sandwich", "fruit"),
			tierSandwich(25, "Variety Sandwich", "variety"),
			tierSandwich(26, "Klawf Claw Sandwich", "klawf-claw"),
			tierSandwich(27, "Sweet Sandwich", "sweet"),
			tierSandwich(28, "Vegetable Sandwich", "vegetable"),
			tierSandwich(29, "Hefty Sandwich", "hefty"),
			tierSandwich(30, "Five-Alarm Sandwich", "five-alarm"),
			tierSandwich(31, "Nouveau Veggie Sandwich", "noveau-veggie"),
			tierSandwich(32, "Spicy-Sweet Sandwich", "spicy-sweet"),
			tierSandwich(33, "Decadent Sandwich", "decadent"),
			tierSandwich(34, "Tofu Sandwich", "tofu"),
			tierSandwich(35, "Curry-and-Noodle Sandwich", "curry-and-noodle"),
			tierSandwich(36, "Tower Sandwich", "tower"),
			tierSandwich(37, "Sushi Sandwich", "sushi"),
		];
	}

	defineSandwichMany(GAME_KEYS, (gameKey) => buildSandwichesFor(gameKey));
})();

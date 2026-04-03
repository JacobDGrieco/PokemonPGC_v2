// --- Curry -----------------------------------------------------------------
(() => {
	const GAME_KEYS = ["sword", "shield"];

	// local wrapper (like fashionItem)
	const curryItem = (folder, name) => _curryItem(folder, name);

	const TASTES = ["Balanced", "Spicy", "Dry", "Sweet", "Bitter", "Sour"];

	// shared forms builder
	const tasteForms = (largeKey) =>
		TASTES.map((t) => ({
			name: t,
			img: curryItem("large", largeKey),
		}));

	// authoring wrapper (keeps the list clean)
	const curry = (id, label, ingredientKey, largeKey = id) => ({ id, label, img: curryItem("ingredients", ingredientKey), forms: tasteForms(largeKey), });

	function buildCurryFor(gameKey) {
		return [
			{ id: "curry", label: "Curry", img: curryItem("player", "curry"), forms: tasteForms("curry"), },
			curry("sausage-curry", "Sausage Curry", "sausages"),
			curry("juicy-curry", "Juicy Curry", "bobs-food-tin"),
			curry("rich-curry", "Rich Curry", "bachs-food-tin"),
			curry("bean-medley-curry", "Bean Medley Curry", "tin-of-beans"),
			curry("toast-curry", "Toast Curry", "bread"),
			curry("pasta-curry", "Pasta Curry", "pasta"),
			curry("mushroom-medley-curry", "Mushroom Medley Curry", "mixed-mushrooms"),
			curry("smoked-tail-curry", "Smoked-Tail Curry", "smoke-poke-tail"),
			curry("leek-curry", "Leek Curry", "large-leek"),
			curry("apple-curry", "Apple Curry", "fancy-apple"),
			curry("bone-curry", "Bone Curry", "brittle-bones"),
			curry("plenty-of-potato-curry", "Plenty-of-Potato Curry", "pack-of-potatoes"),
			curry("herb-medley-curry", "Herb Medley Curry", "pungent-root"),
			curry("salad-curry", "Salad Curry", "salad-mix"),
			curry("fried-food-curry", "Fried-Food Curry", "fried-food"),
			curry("boiled-egg-curry", "Boiled Egg Curry", "boiled-egg"),
			curry("tropical-curry", "Tropical Curry", "fruit-bunch"),
			curry("cheese-covered-curry", "Cheese Covered Curry", "moomoo-cheese"),
			curry("seasoned-curry", "Seasoned Curry", "spice-mix"),
			curry("whippied-cream-curry", "Whipped Cream Curry", "fresh-cream"),
			curry("decorative-curry", "Decorative Curry", "packaged-curry"),
			curry("coconut-curry", "Coconut Curry", "coconut-milk"),
			curry("instant-noodle-curry", "Instant-Noodle Curry", "instant-noodles"),
			curry("burger-steak-curry", "Burger-Steak Curry", "precooked-burger"),
			{ id: "gigantamax-curry", label: "Gigantamax Curry", img: curryItem("large", "gigantamax-curry"), },
		];
	}

	defineCurryMany(GAME_KEYS, (gameKey) => buildCurryFor(gameKey));
})();

/** Runtime-only Mon Info contracts retained after removing the authoring server. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

import {
	getMonInfoFormOptions,
	resolveMonInfoFormForGame,
} from "../src/utils/monInfoForms.js";
import { getMonInfoManifestSpecies } from "../data/mon-info/manifest.js";
import {
	computeTypeDefenseBuckets,
	monInfoTypesForGame,
} from "../src/utils/monInfoTypes.js";
import {
	monInfoAbilitiesForGame,
	monInfoEggStepsForGame,
	monInfoMechanicsForGame,
} from "../src/utils/monInfoProfile.js";
import {
	defaultMonInfoLanguage,
	resolveLocalizedMonInfo,
} from "../src/utils/monInfoLocalization.js";

test("game changes retain supported forms and otherwise use the species default", () => {
	const originalWindow = globalThis.window;
	globalThis.window = {
		DATA: {
			formsCatalog: {
				3: {
					mega: {
						label: "Mega",
						games: ["diamond", "legendsza"],
					},
					male: { label: "Male", games: ["diamond", "sword"] },
					female: {
						label: "Female",
						games: ["diamond", "sword"],
					},
					gigantamax: {
						label: "Gigantamax",
						games: ["sword"],
					},
				},
			},
		},
	};

	try {
		assert.equal(resolveMonInfoFormForGame(3, "diamond", null), "male");
		assert.equal(
			resolveMonInfoFormForGame(3, "sword", "gigantamax"),
			"gigantamax",
		);
		assert.equal(
			resolveMonInfoFormForGame(3, "diamond", "gigantamax"),
			"male",
		);
		assert.equal(resolveMonInfoFormForGame(3, "red", "gigantamax"), "male");
	} finally {
		globalThis.window = originalWindow;
	}
});

test("the generated form manifest exposes every default and omits dangling catalog forms", () => {
	const fullManifest = readJson(
		"data",
		"mon-info",
		"catalog",
		"manifest.json",
	);
	for (const [nationalDexId, species] of Object.entries(
		fullManifest.species,
	)) {
		assert.ok(
			species.forms[species.defaultFormKey],
			`#${nationalDexId} has an invalid default form`,
		);
		assert.ok(getMonInfoManifestSpecies(nationalDexId));
	}

	const ogerpon = getMonInfoManifestSpecies(1017);
	assert.equal(ogerpon.defaultFormKey, "teal-mask");
	assert.ok(ogerpon.forms["teal-mask"]);
	assert.deepEqual(
		getMonInfoFormOptions(1017, "scarlet").map((form) => form.key),
		[
			"teal-mask",
			"cornerstone-mask",
			"hearthflame-mask",
			"wellspring-mask",
		],
	);
	assert.equal(resolveMonInfoFormForGame(1017, "scarlet", null), "teal-mask");
});

test("every catalog form shard matches the manifest and has unique game assignments", () => {
	const fullManifest = readJson(
		"data",
		"mon-info",
		"catalog",
		"manifest.json",
	);
	let formCount = 0;
	let profileCount = 0;
	for (const [nationalDexId, species] of Object.entries(
		fullManifest.species,
	)) {
		for (const [formKey, form] of Object.entries(species.forms)) {
			formCount += 1;
			const shard = readJson(
				"data",
				"mon-info",
				"catalog",
				...form.path.split("/"),
			);
			assert.equal(String(shard.nationalDexId), nationalDexId);
			assert.equal(shard.formKey, formKey);
			profileCount += shard.profiles.length;
			const assignedGames = new Set();
			for (const profile of shard.profiles) {
				for (const gameKey of profile.appGameKeys || []) {
					assert.equal(
						assignedGames.has(gameKey),
						false,
						`Duplicate ${gameKey} assignment in ${form.path}`,
					);
					assignedGames.add(gameKey);
					assert.ok(form.gameKeys.includes(gameKey));
				}
			}
		}
	}
	assert.equal(formCount, fullManifest.formCount);
	assert.equal(profileCount, fullManifest.entryCount);
});

test("historical type rules and profile mechanics follow the selected game", () => {
	assert.equal(monInfoTypesForGame("red").length, 15);
	assert.equal(
		monInfoTypesForGame("black-national").includes("Fairy"),
		false,
	);
	assert.equal(monInfoTypesForGame("x-national").length, 18);
	assert.equal(
		computeTypeDefenseBuckets(["Psychic"], "red").find(
			(row) => row.type === "Ghost",
		).mult,
		0,
	);
	assert.equal(
		computeTypeDefenseBuckets(["Steel"], "black-national").find(
			(row) => row.type === "Dark",
		).mult,
		0.5,
	);

	assert.equal(monInfoMechanicsForGame("red").hasAbilities, false);
	assert.deepEqual(
		monInfoAbilitiesForGame(["Overgrow", "Chlorophyll (Hidden)"], "ruby"),
		["Overgrow"],
	);
	assert.equal(
		monInfoEggStepsForGame({ gameKey: "gold", hatchCounter: 20 }),
		5120,
	);
	assert.equal(
		monInfoEggStepsForGame({ gameKey: "sword", hatchCounter: 20 }),
		2560,
	);
	assert.equal(
		monInfoEggStepsForGame({ gameKey: "legendsarceus", hatchCounter: 20 }),
		null,
	);
});

test("localized Mon Info preserves a Japanese source entry and explicit translations", () => {
	const info = {
		displayName: "Bulbasaur",
		flavor: "Japanese source text",
		localizedNames: { ja: "フシギダネ", fr: "Bulbizarre" },
		localizedFlavor: {
			ja: "Japanese source text",
			fr: "French description",
		},
	};
	assert.equal(defaultMonInfoLanguage(info), "ja");
	assert.deepEqual(resolveLocalizedMonInfo(info, "fr"), {
		languageCode: "fr",
		sourceLanguage: "ja",
		displayName: "Bulbizarre",
		formName: "",
		genus: "",
		flavor: "French description",
		flavorLanguage: "fr",
		hasLocalizedFlavor: true,
	});
});

test("the compact routing manifest stays small and rehydrates catalog paths", () => {
	const compactPath = path.join(
		process.cwd(),
		"data",
		"mon-info",
		"catalog",
		"runtime-manifest.json",
	);
	assert.ok(fs.statSync(compactPath).size < 400_000);
	assert.equal(
		getMonInfoManifestSpecies(3).forms.male.path,
		"0003/male.json",
	);
});

test("the public Pokemon Info route uses the checked-in lazy catalog", () => {
	const appSource = readSource("src", "App.jsx");
	const tierSource = readSource("src", "config", "tiers.js");
	const loaderSource = readSource("data", "mon-info", "_loader.js");
	const manifestSource = readSource("data", "mon-info", "manifest.js");
	const monInfoBridgeSource = readSource("src", "react-bridge", "monInfo.js");
	const monInfoIndexSource = readSource(
		"src",
		"components",
		"content",
		"MonInfoIndexPage.jsx",
	);
	const monInfoPageSource = readSource(
		"src",
		"components",
		"content",
		"MonInfoPage.jsx",
	);
	const monInfoBodySource = readSource(
		"src",
		"components",
		"content",
		"MonInfoBody.jsx",
	);
	const legacyMonInfoSource = readSource("src", "modals", "dex-mon-info.js");
	const runtimeManifest = readJson(
		"data",
		"mon-info",
		"catalog",
		"manifest.json",
	);
	const venusaurMaleShard = readJson(
		"data",
		"mon-info",
		"catalog",
		"0003",
		"male.json",
	);
	const venusaurGigantamaxShard = readJson(
		"data",
		"mon-info",
		"catalog",
		"0003",
		"gigantamax.json",
	);
	const sandshrewKantonianShard = readJson(
		"data",
		"mon-info",
		"catalog",
		"0027",
		"kantonian.json",
	);
	const sandshrewAlolanShard = readJson(
		"data",
		"mon-info",
		"catalog",
		"0027",
		"alolan.json",
	);

	assert.match(
		appSource,
		/path="\/pokemon-info"[\s\S]*<PokemonInfoRoutePage \/>/,
	);
	assert.doesNotMatch(
		appSource,
		/<PlaceholderPage feature="pokemon-info" \/>/,
	);
	assert.match(tierSource, /"pokemon-info": "done"/);
	assert.match(loaderSource, /\.\/catalog\/\*\*\/\*\.json/);
	assert.match(loaderSource, /!\.\/catalog\/runtime-manifest\.json/);
	assert.match(loaderSource, /await importRuntimeShard\(num, formKey\)/);
	assert.match(
		loaderSource,
		/export \{\s*getMonInfoManifestSpecies,\s*resolveRuntimeFormKey,\s*\} from "\.\/manifest\.js"/,
	);
	assert.match(manifestSource, /export function getMonInfoManifestSpecies/);
	assert.match(manifestSource, /runtime-manifest\.json/);
	assert.match(
		monInfoBridgeSource,
		/import \{ getMonInfoManifestSpecies \} from "\.\.\/\.\.\/data\/mon-info\/manifest\.js"/,
	);
	assert.match(
		monInfoBridgeSource,
		/for \(const gameKey of manifestSpecies\?\.gameKeys \|\| \[\]\)/,
	);
	assert.match(monInfoIndexSource, /\[homeDex\]/);
	assert.match(monInfoPageSource, /ensureMonInfoLoaded\(natiId,/);
	assert.match(
		monInfoPageSource,
		/homeHeaderSpriteCandidates = pokemonSpriteCandidates\(\{[\s\S]*?allGames: true/,
	);
	assert.match(monInfoBodySource, /value=\{[\s\S]*?data\.effectiveFormKey/);
	assert.doesNotMatch(monInfoBodySource, /<option value=""><\/option>/);
	assert.match(legacyMonInfoSource, /effectiveFormKey === o\.key/);
	assert.doesNotMatch(legacyMonInfoSource, /<option value=""/);
	assert.match(monInfoBodySource, /monInfoLanguageOptions/);
	assert.match(monInfoBodySource, /className="visually-hidden"/);
	assert.match(legacyMonInfoSource, /escapeHtml\(localizedInfo\.flavor\)/);
	assert.doesNotMatch(
		readSource("src", "history.js"),
		/if \(gk\.startsWith\("red"\).*return "red-blue"/,
	);
	assert.equal(runtimeManifest.species[1].name, "Bulbasaur");
	assert.equal(runtimeManifest.species[1].forms.base.path, "0001/base.json");
	assert.equal(runtimeManifest.species[2].name, "Ivysaur");
	assert.equal(runtimeManifest.species[2].forms.base.path, "0002/base.json");
	assert.equal(runtimeManifest.species[3].defaultFormKey, "male");
	assert.ok(runtimeManifest.species[3].gameKeys.includes("red"));
	assert.ok(runtimeManifest.species[3].gameKeys.includes("swordioa"));
	assert.ok(
		!runtimeManifest.species[3].forms.gigantamax.gameKeys.includes("red"),
	);
	assert.equal(venusaurMaleShard.profiles[0].profileKey, "red-blue");
	assert.ok(
		venusaurMaleShard.profiles[0].flavorByGame.red.includes(
			"The plant blooms",
		),
	);
	assert.ok(
		!venusaurGigantamaxShard.profiles.some(
			(profile) => profile.profileKey === "red-blue",
		),
	);
	assert.equal(sandshrewKantonianShard.profiles[0].profileKey, "red-blue");
	assert.ok(
		!sandshrewAlolanShard.profiles.some(
			(profile) => profile.profileKey === "red-blue",
		),
	);
});

function readSource(...pathParts) {
	return fs.readFileSync(path.join(process.cwd(), ...pathParts), "utf8");
}

function readJson(...pathParts) {
	return JSON.parse(readSource(...pathParts));
}

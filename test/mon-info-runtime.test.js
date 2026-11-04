/** Runtime-only Mon Info contracts retained after removing the authoring server. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

import { resolveMonInfoFormForGame } from "../src/utils/monInfoForms.js";

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
	assert.match(loaderSource, /await importRuntimeShard\(num, formKey\)/);
	assert.match(
		loaderSource,
		/export \{\s*getMonInfoManifestSpecies,\s*resolveRuntimeFormKey,\s*\} from "\.\/manifest\.js"/,
	);
	assert.match(manifestSource, /export function getMonInfoManifestSpecies/);
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

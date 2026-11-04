import assert from "node:assert/strict";
import fs from "node:fs";
import { afterEach, test } from "node:test";

import {
	buildEeveeEvolutionWheel,
	buildEvolutionForest,
	evolutionRequirementItem,
	evolutionRequirementPresentation,
	formatEvolutionRequirement,
	resolveEvolutionTargetForm,
} from "../src/utils/monInfoEvolution.js";
import { renderEvolutionHtml } from "../src/modals/dex-mon-info-render.js";

const slowpokeEvolution = {
	paths: [
		[
			{ id: 79, natiId: 79, name: "Slowpoke" },
			{
				id: 80,
				natiId: 80,
				name: "Slowbro",
				method: "Level",
				value: 37,
			},
		],
		[
			{ id: 79, natiId: 79, name: "Slowpoke" },
			{
				id: 199,
				natiId: 199,
				name: "Slowking",
				method: "Trade",
				value: "Kings Rock",
			},
		],
	],
};

const eeveeEvolution = {
	paths: [
		[buildEeveeStep(), evolvedEeveeStep(134, "Vaporeon", "Water Stone")],
		[buildEeveeStep(), evolvedEeveeStep(135, "Jolteon", "Thunder Stone")],
		[buildEeveeStep(), evolvedEeveeStep(136, "Flareon", "Fire Stone")],
		[
			buildEeveeStep(),
			{
				natiId: 196,
				name: "Espeon",
				method: "Friendship",
				value: "Day",
			},
		],
		[
			buildEeveeStep(),
			{
				natiId: 197,
				name: "Umbreon",
				method: "Friendship",
				value: "Night",
			},
		],
	],
};

function buildEeveeStep() {
	return { natiId: 133, name: "Eevee" };
}

function evolvedEeveeStep(natiId, name, value) {
	return { natiId, name, method: "Use item", value };
}

afterEach(() => {
	delete globalThis.window;
	delete globalThis.__ASSET_BASE_URL__;
});

test("evolution paths merge into one trunk with multiple branches", () => {
	const forest = buildEvolutionForest(slowpokeEvolution);
	assert.equal(forest.length, 1);
	assert.equal(forest[0].step.name, "Slowpoke");
	assert.deepEqual(
		forest[0].children.map((child) => child.step.name),
		["Slowbro", "Slowking"],
	);
});

test("evolution trees omit species that do not exist in the selected game", () => {
	const redForest = buildEvolutionForest(slowpokeEvolution, {
		gameKey: "red",
	});
	assert.equal(redForest.length, 1);
	assert.deepEqual(
		redForest[0].children.map((child) => child.step.name),
		["Slowbro"],
	);
});

test("evolution requirements use readable labels and generation item art", () => {
	globalThis.__ASSET_BASE_URL__ = "https://assets.example.test";
	assert.equal(
		formatEvolutionRequirement({ method: "Trade", value: "Kings Rock" }),
		"Trade with Kings Rock",
	);
	assert.deepEqual(
		evolutionRequirementItem(
			{ method: "Use item", value: "Fire Stone" },
			"red",
		),
		{
			name: "Fire Stone",
			category: "usable-items",
			src: "https://assets.example.test/items/usable-items/gen1-3/fire-stone.png",
		},
	);
	assert.deepEqual(
		evolutionRequirementItem(
			{ method: "Trade", value: "Kings Rock" },
			"gold",
		),
		{
			name: "King's Rock",
			category: "held-items",
			src: "https://assets.example.test/items/held-items/gen1-3/kings-rock.png",
		},
	);
	assert.equal(
		formatEvolutionRequirement({
			method: "Level up near",
			value: "the Moss Rock in Route 20",
		}),
		"Level up near the Moss Rock in Route 20",
	);
	assert.deepEqual(
		evolutionRequirementPresentation(
			{
				method: "Level up near",
				value: "the Moss Rock west of The Heartwood",
				alternatives: [{ method: "Use item", value: "Leaf Stone" }],
			},
			"legendsarceus",
		),
		{
			label: "Level up near the Moss Rock west of The Heartwood",
			detail: "or Use Leaf Stone",
			item: null,
		},
	);
});

test("target forms preserve matching regional identities and explicit forms", () => {
	globalThis.window = {
		DATA: {
			formsCatalog: {
				80: {
					kantonian: { games: ["gold"] },
					galarian: { games: ["sword"] },
				},
			},
		},
	};
	assert.equal(
		resolveEvolutionTargetForm({
			step: { natiId: 80 },
			gameKey: "sword",
			currentFormKey: "galarian",
		}),
		"galarian",
	);
	assert.equal(
		resolveEvolutionTargetForm({
			step: { natiId: 80, formKey: "kantonian" },
			gameKey: "gold",
			currentFormKey: "galarian",
		}),
		"kantonian",
	);
});

test("legacy evolution rendering shares clickable branch and current-node behavior", () => {
	globalThis.window = {
		DATA: {
			formsCatalog: {
				79: { kantonian: { games: ["gold"] } },
				80: { kantonian: { games: ["gold"] } },
				199: { johtonian: { games: ["gold"] } },
			},
		},
	};
	const html = renderEvolutionHtml(slowpokeEvolution, [], {
		gameKey: "gold",
		currentNatiId: 79,
		currentFormKey: "kantonian",
	});

	assert.equal((html.match(/>Slowpoke</g) || []).length, 1);
	assert.match(html, /evolution-connector is-up/);
	assert.match(html, /evolution-connector is-down/);
	assert.match(html, /<strong>Trade<\/strong><small>King's Rock<\/small>/);
	assert.match(html, /items\/held-items\/gen1-3\/kings-rock\.png/);
	assert.match(
		html,
		/class="evolution-node is-current" aria-current="page"[^>]*data-evolution-id="79"/,
	);
	assert.match(html, /data-evolution-id="199"/);
});

test("Gen I Slowpoke renders as one straight evolution without Slowking", () => {
	globalThis.window = {
		DATA: {
			formsCatalog: {
				79: { kantonian: { games: ["red"] } },
				80: { kantonian: { games: ["red"] } },
			},
		},
	};
	const html = renderEvolutionHtml(slowpokeEvolution, [], {
		gameKey: "red",
		currentNatiId: 79,
		currentFormKey: "kantonian",
	});

	assert.match(html, /evolution-connector is-straight/);
	assert.doesNotMatch(html, /evolution-connector is-up/);
	assert.doesNotMatch(html, /data-evolution-id="199"/);
});

test("Eevee uses a radial evolution wheel from Generation II onward", () => {
	const redForest = buildEvolutionForest(eeveeEvolution, { gameKey: "red" });
	assert.equal(buildEeveeEvolutionWheel(redForest), null);

	const goldForest = buildEvolutionForest(eeveeEvolution, {
		gameKey: "gold",
	});
	const wheel = buildEeveeEvolutionWheel(goldForest);
	assert.equal(wheel.root.step.name, "Eevee");
	assert.deepEqual(
		wheel.branches.map((branch) => branch.node.step.name),
		["Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon"],
	);
	assert.equal(wheel.branches.length, 5);

	const goldHtml = renderEvolutionHtml(eeveeEvolution, [], {
		gameKey: "gold",
		currentNatiId: 133,
	});
	assert.match(goldHtml, /class="evolution-wheel"/);
	assert.match(goldHtml, /class="evolution-wheel-node is-center"/);
	assert.match(goldHtml, /data-evolution-id="196"/);
	assert.match(goldHtml, /data-evolution-id="197"/);

	const redHtml = renderEvolutionHtml(eeveeEvolution, [], {
		gameKey: "red",
		currentNatiId: 133,
	});
	assert.doesNotMatch(redHtml, /class="evolution-wheel"/);
	assert.match(redHtml, /class="evolution-forest"/);
});

test("evolution CSS preserves sprite proportions and contains narrow layouts", () => {
	const css = fs.readFileSync("styles/mon-info-evolution.css", "utf8");
	const reactSource = fs.readFileSync(
		"src/components/content/MonInfoBody.jsx",
		"utf8",
	);
	const pageSource = fs.readFileSync(
		"src/components/content/MonInfoPage.jsx",
		"utf8",
	);

	assert.match(
		css,
		/\.evolution-pokemon-icon\s*\{[^}]*object-fit:\s*contain;/s,
	);
	assert.match(css, /\.evolution-tree-scroll\s*\{[^}]*overflow-x:\s*auto;/s);
	assert.match(css, /\.evolution-requirement\s*\{[^}]*text-shadow:/s);
	assert.doesNotMatch(css, /\.evolution-requirement\s*\{[^}]*background:/s);
	assert.match(css, /\.evolution-wheel\s*\{[^}]*position:\s*relative;/s);
	assert.match(css, /\.evolution-wheel-node\s*\{[^}]*position:\s*absolute;/s);
	assert.match(reactSource, /<EvolutionConnector/);
	assert.match(reactSource, /<EeveeEvolutionWheel/);
	assert.match(reactSource, /key=\{presentation\.item\.src\}/);
	assert.doesNotMatch(reactSource, /currentTarget\.hidden = true/);
	assert.match(reactSource, /onNavigate\?\.\(targetId, targetFormKey\)/);
	assert.match(pageSource, /monInfoForm:\s*targetFormKey/);
});

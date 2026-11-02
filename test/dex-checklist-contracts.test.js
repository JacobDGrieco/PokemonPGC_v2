import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
	getDexTaskSyncGameKey,
	isDexToTaskSyncEnabled,
	isTaskToDexSyncEnabled,
	setDexToTaskSyncEnabled,
	setTaskToDexSyncEnabled,
} from "../src/dex-task-sync-settings.js";
import { filterDexEntriesByCriteria } from "../src/modals/dex-search.js";

async function readProjectFile(relativePath) {
	return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("Dex-to-checklist preference is opt-in and shared by one game title", () => {
	const state = {};

	assert.equal(isDexToTaskSyncEnabled(state, "ruby"), false);
	assert.equal(isTaskToDexSyncEnabled(state, "ruby"), true);
	assert.equal(getDexTaskSyncGameKey("ruby-national"), "ruby");
	assert.equal(getDexTaskSyncGameKey("swordct"), "sword");

	assert.equal(setDexToTaskSyncEnabled(state, "ruby-national", true), true);
	assert.equal(isDexToTaskSyncEnabled(state, "ruby"), true);
	assert.equal(isDexToTaskSyncEnabled(state, "ruby-national"), true);

	assert.equal(setTaskToDexSyncEnabled(state, "ruby", false), true);
	assert.equal(isTaskToDexSyncEnabled(state, "ruby-national"), false);
});

test("visible Dex filters combine across categories", () => {
	const dex = [
		{
			id: 26,
			name: "Raichu",
			forms: [{ name: "Alolan Raichu", tags: ["alolan"] }],
		},
		{
			id: 19,
			name: "Rattata",
			forms: [{ name: "Alolan Rattata", tags: ["alolan"] }],
		},
	];
	const statuses = { 26: "caught", 19: "seen" };
	const filtered = filterDexEntriesByCriteria({
		dex,
		query: "",
		filters: {
			status: "complete",
			form: "alolan",
			evolution: "trade",
		},
		store: {},
		gameKey: "sun-alola",
		game: {},
		monInfoForGame: {
			26: { evolution: { method: "trade" } },
			19: { evolution: { method: "level" } },
		},
		effectiveSpeciesStatus: (_store, _gameKey, entry) => statuses[entry.id],
		isCompletedForGame: (_game, status) => status === "caught",
	});

	assert.deepEqual(
		filtered.map((entry) => entry.name),
		["Raichu"],
	);
});

test("an individual regional Dex update propagates through the supplied National index", async () => {
	globalThis.localStorage ??= {
		getItem: () => null,
		setItem: () => {},
		removeItem: () => {},
	};
	globalThis.window ??= {};

	const { applyDexLinksFromDexEntries } =
		await import("../src/modals/dex-sync.js");
	const store = {
		state: { dexModalFor: "ruby" },
		dexStatus: new Map([["ruby", {}]]),
		dexFormsStatus: new Map(),
	};
	const data = {
		dex: {
			ruby: [{ id: 1, natiId: 252, name: "Treecko" }],
			"ruby-national": [{ id: 252, natiId: 252, name: "Treecko" }],
		},
	};
	const nationalIndex = new Map([
		[
			"252",
			[
				{ gameKey: "ruby", id: 1 },
				{ gameKey: "ruby-national", id: 252 },
			],
		],
	]);

	applyDexLinksFromDexEntries({
		gameKey: "ruby",
		changedMap: { 1: "caught" },
		store,
		getNatIndexForGame: () => nationalIndex,
		renderDexGrid: () => {},
		data,
	});

	assert.equal(store.dexStatus.get("ruby-national")[252], "caught");
});

test("one-way Dex links require opt-in while checklist-to-Dex remains authored", async () => {
	const [syncSource, taskSyncSource, modalSource, historySource] =
		await Promise.all([
			readProjectFile("src/sync.js"),
			readProjectFile("src/tasks-sync.js"),
			readProjectFile("src/components/modals/DexModalCompact.jsx"),
			readProjectFile("src/history.js"),
		]);

	assert.match(syncSource, /requiresDexToTaskOptIn = true/);
	assert.match(taskSyncSource, /isDexToTaskSyncEnabled\(state, gameKey\)/);
	assert.match(modalSource, /id="dexTaskSyncToggle"/);
	assert.match(modalSource, /id="dexTaskSyncReconcile"/);
	assert.match(historySource, /dexApi\?\.closeForNavigation/);
});

test("one-way Dex completion adds checklist progress only after opt-in", async () => {
	globalThis.window ??= {};
	window.PPGC ??= {};
	window.DATA = {
		dex: {
			red: [
				{
					id: 144,
					taskSync: [
						{
							id: "red:catching:1:1",
							requiresDexToTaskOptIn: true,
							setOnly: true,
						},
					],
				},
			],
		},
	};
	const task = { id: "red:catching:1:1", done: false };
	const sectionId = "red:catching";
	const testStore = {
		state: { dexToTaskSyncByGame: {} },
		taskProgressById: new Map(),
		taskChoiceById: new Map(),
	};
	window.PPGC._storeRef = testStore;
	window.PPGC._tasksStoreRef = new Map([[sectionId, [task]]]);
	window.PPGC._taskIndexGlobal = new Map();
	window.PPGC._dexSyncIndex = new Map();

	const { applyDexSyncsFromDexEntries } =
		await import("../src/tasks-sync.js");
	applyDexSyncsFromDexEntries("red", { 144: "caught" });
	assert.equal(task.done, false);

	setDexToTaskSyncEnabled(testStore.state, "red", true);
	applyDexSyncsFromDexEntries("red", { 144: "caught" });
	assert.equal(task.done, true);

	applyDexSyncsFromDexEntries("red", { 144: "unknown" });
	assert.equal(task.done, true);
});

test("Checklist-to-Dex preference can pause and resume authored links", async () => {
	globalThis.localStorage ??= {
		getItem: () => null,
		setItem: () => {},
		removeItem: () => {},
	};
	globalThis.window ??= {};
	window.PPGC ??= {};
	window.DATA = {
		dex: { red: [{ id: 25, name: "Pikachu" }] },
	};
	const testStore = {
		state: { taskToDexSyncByGame: { red: false } },
		dexStatus: new Map([["red", {}]]),
		dexFormsStatus: new Map(),
	};
	window.PPGC._storeRef = testStore;
	window.PPGC._tasksStoreRef = new Map();
	window.PPGC._taskIndexGlobal = new Map();
	window.PPGC._dexSyncIndex = new Map();

	const { applySyncsFromTask } = await import("../src/tasks-sync.js");
	const task = { id: "red:catching:25", dexSync: [{ game: "red", id: 25 }] };
	applySyncsFromTask(task, true);
	assert.equal(testStore.dexStatus.get("red")[25], undefined);

	setTaskToDexSyncEnabled(testStore.state, "red", true);
	applySyncsFromTask(task, true);
	assert.equal(testStore.dexStatus.get("red")[25], "caught");
});

test("checklist choice controls and Dex filters retain accessible labels", async () => {
	const [taskSource, dexModalSource, appShellSource, taskStyles] =
		await Promise.all([
			readProjectFile("src/components/tasks/TaskTree.jsx"),
			readProjectFile("src/components/modals/DexModalCompact.jsx"),
			readProjectFile("src/components/shells/AppShell.jsx"),
			readProjectFile("styles/tasks.css"),
		]);

	assert.match(taskSource, /type="radio"/);
	assert.match(taskSource, /checked=\{active\}/);
	assert.match(taskSource, /aria-label=\{text\}/);
	assert.match(taskSource, /title=\{text\}/);
	assert.match(taskSource, /return `Choice \$\{optionIndex \+ 1\}`/);
	assert.match(taskStyles, /> \.task-item\[data-task-done="1"\]/);
	assert.match(taskStyles, /> \.task-item\[data-task-done="0"\]/);
	assert.match(taskStyles, /container:\s*task-choices/);
	assert.match(taskStyles, /@container task-choices/);
	assert.match(
		taskSource,
		/<div className="tiered">[\s\S]*?<TieredValueDisplay/,
	);
	assert.match(dexModalSource, /id="dexFilterStatus"/);
	assert.match(dexModalSource, /id="dexFilterLocation"/);
	assert.match(dexModalSource, /htmlFor="dexSearch"/);
	assert.match(dexModalSource, /htmlFor="dexClearAll"/);
	assert.doesNotMatch(appShellSource, /<main[^>]*aria-live=/s);
	assert.match(appShellSource, /role="status"/);
});

test("dense checklist, distribution, and Dex form layouts stay intrinsic", async () => {
	const [
		taskStyles,
		distributionStyles,
		dexModalSource,
		dexFormSource,
		formStyles,
		accountSource,
		dexModalStyles,
		dexFilterStyles,
	] = await Promise.all([
		readProjectFile("styles/tasks.css"),
		readProjectFile("styles/distributions.css"),
		readProjectFile("src/components/modals/DexModalCompact.jsx"),
		readProjectFile("src/modals/dex-forms.js"),
		readProjectFile("styles/modal-radial.css"),
		readProjectFile("src/components/content/AccountPage.jsx"),
		readProjectFile("styles/modal-dex.css"),
		readProjectFile("styles/modal-dex-filter.css"),
	]);

	assert.match(taskStyles, /\.tiered-slider\s*\{[^}]*min-width:\s*0/s);
	assert.match(taskStyles, /\.tiered-controls\s*\{/);
	assert.match(distributionStyles, /container:\s*distribution-card/);
	assert.match(
		distributionStyles,
		/\.dist-grid\s*\{[^}]*align-items:\s*stretch/s,
	);
	assert.match(distributionStyles, /\.dist-card\s*\{[^}]*height:\s*100%/s);
	assert.match(dexModalSource, /className="dex-header-search-row"/);
	assert.match(dexModalSource, /id="dexFilterSettings"/);
	assert.match(dexModalSource, /id="taskDexSyncToggle"/);
	assert.doesNotMatch(dexModalSource, /id="dexViewToggle"/);
	assert.match(accountSource, /title="Pokédex Layout"/);
	assert.match(dexModalStyles, /--dex-header-control-height:\s*44px/);
	assert.match(
		dexFilterStyles,
		/\.dex-modal-header\s*\{[^}]*z-index:\s*102/s,
	);
	assert.match(
		dexModalStyles,
		/\.dex-search-input,[\s\S]*?\.dex-close-button\s*\{[^}]*height:\s*var\(--dex-header-control-height\)/,
	);
	assert.match(dexFormSource, /dex-form-card/);
	assert.match(dexFormSource, /_dexIdNumber\(mon\.id, mon\.localId\)/);
	assert.match(formStyles, /\.dex-form-card\.is-set/);
});

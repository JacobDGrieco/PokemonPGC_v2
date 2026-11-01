import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
	FEATURE_NAVIGATION,
	FEATURE_ROUTES,
	getFeatureNavigationGroups,
	TIERS,
} from "../src/config/tiers.js";
import { curryPctFor } from "../src/modals/curry.js";
import { sandwichPctFor } from "../src/modals/sandwich.js";
import { stickerPctFor } from "../src/modals/sticker.js";
import {
	hideModalElement,
	showModalElement,
} from "../src/modals/modal-state.js";
import {
	USER_SAVE_RESPONSE_SELECT,
	USER_SAVE_WRITE_SELECT,
} from "../api/_lib/progress.js";

test("navigation routes have one entitlement-derived metadata entry", () => {
	assert.deepEqual(
		FEATURE_NAVIGATION.map(({ key, path }) => [key, path]),
		Object.entries(FEATURE_ROUTES),
	);

	const groupedPages = getFeatureNavigationGroups().flatMap(
		(group) => group.pages,
	);
	assert.deepEqual(groupedPages, FEATURE_NAVIGATION);
});

test("paid supporter cadences share access while Master checkout stays reserved", () => {
	assert.deepEqual(TIERS.great.features, TIERS.ultra.features);
	assert.deepEqual(TIERS.ultra.features, TIERS.master.features);
	assert.equal(TIERS.great.price, "$5/mo");
	assert.equal(TIERS.ultra.price, "$50/yr");
	assert.equal(TIERS.great.isPurchasable, true);
	assert.equal(TIERS.ultra.isPurchasable, true);
	assert.equal(TIERS.master.isPurchasable, false);
});

test("account integration IDs are owned by the shared account control", async () => {
	const accountControlSource = await readFile(
		new URL(
			"../src/components/nav/AccountMenuControl.jsx",
			import.meta.url,
		),
		"utf8",
	);
	const appHeaderSource = await readFile(
		new URL("../src/components/AppHeader.jsx", import.meta.url),
		"utf8",
	);
	const marketingHeaderSource = await readFile(
		new URL("../src/components/nav/MarketingHeader.jsx", import.meta.url),
		"utf8",
	);

	assert.match(accountControlSource, /id="ppgc-account-button"/);
	assert.match(accountControlSource, /id="ppgc-account-menu"/);
	assert.doesNotMatch(appHeaderSource, /id="ppgc-account-button"/);
	assert.doesNotMatch(marketingHeaderSource, /id="ppgc-account-button"/);
});

test("account billing shows customer-facing dates without internal period details", async () => {
	const accountPageSource = await readFile(
		new URL("../src/components/content/AccountPage.jsx", import.meta.url),
		"utf8",
	);

	assert.match(
		accountPageSource,
		/formatDate\(effectiveDetails\.renewalDate\)/,
	);
	assert.doesNotMatch(accountPageSource, /title="Period start"/);
});

test("complimentary access has an owner-only command and non-billing UI", async () => {
	const [packageSource, adminScriptSource, pricingSource, accountSource] =
		await Promise.all([
			readFile(new URL("../package.json", import.meta.url), "utf8"),
			readFile(
				new URL("../scripts/admin-tier-access.mjs", import.meta.url),
				"utf8",
			),
			readFile(
				new URL("../src/pages/PricingPage.jsx", import.meta.url),
				"utf8",
			),
			readFile(
				new URL(
					"../src/components/content/AccountPage.jsx",
					import.meta.url,
				),
				"utf8",
			),
		]);
	const packageJson = JSON.parse(packageSource);

	assert.equal(
		packageJson.scripts["admin:tier-access"],
		"node ./scripts/admin-tier-access.mjs",
	);
	assert.match(adminScriptSource, /--confirm/);
	assert.match(adminScriptSource, /--execute/);
	assert.match(adminScriptSource, /emailVerifiedAt/);
	assert.doesNotMatch(adminScriptSource, /createServer|\.listen\(|fetch\(/);
	assert.match(pricingSource, /No payment is required for this access/);
	assert.match(accountSource, /\(Complimentary\)/);
});

test("collectible adapters preserve independent percentage contracts", () => {
	const originalWindow = globalThis.window;
	globalThis.window = {
		DATA: {
			curry: { sword: [{ id: 1 }] },
			sandwich: { violet: [{ id: 2 }, { id: 3 }] },
			sticker: { brilliantdiamond: [{ id: 4, forms: ["a", "b"] }] },
		},
	};

	const store = {
		curryStatus: new Map([["sword", { 1: true }]]),
		curryFormsStatus: new Map(),
		sandwichStatus: new Map([["violet", { 2: true, 3: false }]]),
		sandwichFormsStatus: new Map(),
		stickerStatus: new Map(),
		stickerFormsStatus: new Map([
			[
				"brilliantdiamond",
				{ 4: { all: false, forms: { a: true, b: false } } },
			],
		]),
	};

	try {
		assert.equal(curryPctFor("sword", store), 100);
		assert.equal(sandwichPctFor("violet", store), 50);
		assert.equal(stickerPctFor("brilliantdiamond", store), 50);
	} finally {
		globalThis.window = originalWindow;
	}
});

test("legacy modal state keeps visibility and accessibility signals synchronized", () => {
	const classes = new Set();
	const attributes = new Map();
	const modalElement = {
		hidden: true,
		classList: {
			add: (name) => classes.add(name),
			remove: (name) => classes.delete(name),
		},
		setAttribute: (name, value) => attributes.set(name, value),
	};

	showModalElement(modalElement);
	assert.equal(modalElement.hidden, false);
	assert.equal(attributes.get("aria-hidden"), "false");
	assert.equal(classes.has("open"), true);

	hideModalElement(modalElement);
	assert.equal(modalElement.hidden, true);
	assert.equal(attributes.get("aria-hidden"), "true");
	assert.equal(classes.has("open"), false);
});

test("progress queries expose only required response fields", () => {
	assert.deepEqual(USER_SAVE_RESPONSE_SELECT, {
		gameKey: true,
		data: true,
		updatedAt: true,
	});
	assert.deepEqual(USER_SAVE_WRITE_SELECT, {
		gameKey: true,
		updatedAt: true,
	});
});

test("production requests use one canonical authentication host", async () => {
	const vercelConfig = JSON.parse(
		await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
	);
	assert.deepEqual(vercelConfig.redirects?.[0], {
		source: "/:path*",
		has: [{ type: "host", value: "pokemonpgc.com" }],
		destination: "https://www.pokemonpgc.com/:path*",
		permanent: true,
	});
});

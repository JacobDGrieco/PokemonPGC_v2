import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readProjectFile(relativePath) {
	return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("mobile navigation exposes and contains the drawer interaction", async () => {
	const [headerSource, shellSource, sidebarSource] = await Promise.all([
		readProjectFile("src/components/AppHeader.jsx"),
		readProjectFile("src/components/shells/AppShell.jsx"),
		readProjectFile("src/components/AppSidebar.jsx"),
	]);

	assert.match(headerSource, /className="mobile-nav-toggle"/);
	assert.match(headerSource, /aria-controls="sidebar"/);
	assert.match(headerSource, /aria-expanded=\{mobileNavOpen\}/);
	assert.match(shellSource, /ResizeObserver/);
	assert.match(shellSource, /event\.key === "Escape"/);
	assert.match(shellSource, /mobileNavTriggerRef\.current\?\.focus/);
	assert.match(sidebarSource, /inert=\{isHidden \? "" : undefined\}/);
	assert.match(sidebarSource, /if \(isMobile\) closeMobileNav\?\.\(\)/);
});

test("mobile CSS removes fixed page overflow and preserves zoom", async () => {
	const [authCss, baseCss, layoutCss] = await Promise.all([
		readProjectFile("styles/auth.css"),
		readProjectFile("styles/base.css"),
		readProjectFile("styles/layout.css"),
	]);

	assert.doesNotMatch(
		authCss,
		/\.account-page\s*\{[^}]*min-width:\s*1300px/s,
	);
	assert.match(authCss, /\.account-page\s*\{[^}]*min-width:\s*0/s);
	assert.match(baseCss, /body\.mobile-ui\s*\{[^}]*touch-action:\s*auto/s);
	assert.match(layoutCss, /\.content\s*\{[^}]*touch-action:\s*auto/s);
	assert.match(layoutCss, /--app-header-h/);
});

test("narrow layouts keep core controls and content available", async () => {
	const [taskCss, dexCss, distributionCss, monInfoCss, pricingSource] =
		await Promise.all([
			readProjectFile("styles/tasks.css"),
			readProjectFile("styles/modal-dex.css"),
			readProjectFile("styles/distributions.css"),
			readProjectFile("styles/mon-info.css"),
			readProjectFile("src/pages/PricingPage.jsx"),
		]);

	assert.match(taskCss, /@media \(max-width: 390px\)/);
	assert.match(dexCss, /@media \(max-width: 360px\)/);
	assert.match(distributionCss, /@media \(max-width: 520px\)/);
	assert.match(monInfoCss, /"identity"\s*"navigation"\s*"game"/);
	assert.match(pricingSource, /Plan feature comparison/);
});

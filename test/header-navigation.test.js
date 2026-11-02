import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readProjectFile(relativePath) {
	return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("app and marketing brands open Checklists", async () => {
	const [appHeaderSource, marketingHeaderSource] = await Promise.all([
		readProjectFile("src/components/AppHeader.jsx"),
		readProjectFile("src/components/nav/MarketingHeader.jsx"),
	]);

	assert.match(appHeaderSource, /to="\/checklists"/);
	assert.match(marketingHeaderSource, /to="\/checklists"/);
	assert.match(appHeaderSource, /aria-label="Open Checklists"/);
	assert.match(marketingHeaderSource, /aria-label="Open Checklists"/);
});

test("centered page navigator keeps Home and entitlement-aware pages available", async () => {
	const [
		headerSource,
		marketingHeaderSource,
		centerNavigationSource,
		navigatorSource,
		layoutCss,
	] = await Promise.all([
		readProjectFile("src/components/AppHeader.jsx"),
		readProjectFile("src/components/nav/MarketingHeader.jsx"),
		readProjectFile("src/components/nav/HeaderPageNavigation.jsx"),
		readProjectFile("src/components/nav/PagesDropdown.jsx"),
		readProjectFile("styles/layout.css"),
	]);

	assert.match(headerSource, /<HeaderPageNavigation \/>/);
	assert.match(marketingHeaderSource, /<HeaderPageNavigation \/>/);
	assert.doesNotMatch(marketingHeaderSource, /showPages/);
	assert.match(centerNavigationSource, /<PagesDropdown \/>/);
	assert.match(navigatorSource, /className={`pages-dropdown-home/);
	assert.match(navigatorSource, /aria-label="Home"/);
	assert.match(navigatorSource, /data-label={page\.label}/);
	assert.match(navigatorSource, /<PageIcon pageKey={page\.key} \/>/);
	assert.match(navigatorSource, /aria-haspopup="menu"/);
	assert.match(navigatorSource, /role="menu"/);
	assert.match(navigatorSource, /role="menuitem"/);
	assert.match(navigatorSource, /isLocked \? "\/pricing" : page\.path/);
	assert.match(navigatorSource, /event\.key !== "Escape"/);
	assert.match(layoutCss, /\.pages-dropdown-menu\.is-open/);
	assert.match(
		layoutCss,
		/\.pages-dropdown-trigger-ball\s*\{[^}]*width:\s*36px/s,
	);
	assert.match(
		layoutCss,
		/\.pages-dropdown-menu\s*\{[^}]*aspect-ratio:\s*2 \/ 1/s,
	);
	assert.match(
		layoutCss,
		/\.pages-dropdown-item\s*\{[^}]*border-radius:\s*50%/s,
	);
	assert.match(layoutCss, /content:\s*attr\(data-label\)/);
	assert.match(layoutCss, /clip-path:/);
	assert.match(layoutCss, /\.pages-dropdown-grid\s*\{[^}]*inset:\s*0/s);
	assert.match(
		layoutCss,
		/\.pages-dropdown-menu\s*\{[^}]*width:\s*min\(440px,/s,
	);
	assert.match(
		layoutCss,
		/\.pages-dropdown-item:nth-child\(1\)\s*\{[^}]*top:\s*39%[^}]*left:\s*16\.2%/s,
	);
	assert.match(
		layoutCss,
		/\.pages-dropdown-item:nth-child\(6\)\s*\{[^}]*top:\s*39%[^}]*left:\s*83\.8%/s,
	);
});

import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

async function readProjectFile(relativePath) {
	return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("homepage keeps the splash hero and exposes the field-guide sections", async () => {
	const homePageSource = await readProjectFile("src/pages/HomePage.jsx");

	assert.match(homePageSource, /className="home-command"/);
	assert.match(homePageSource, /function projectOrbitPoint/);
	assert.match(homePageSource, /home-orbit-ring-back/);
	assert.match(homePageSource, /home-orbit-ring-front/);
	assert.match(homePageSource, /className="home-orbit-ring-base"/);
	assert.match(homePageSource, /className="home-orbit-ring-pulse"/);
	assert.match(homePageSource, /home-flow-card-overlay/);
	assert.match(homePageSource, /yawRadians: \(48 \* Math\.PI\) \/ 180/);
	assert.doesNotMatch(homePageSource, /home-orbit-lines|home-orbit-spark/);
	assert.match(homePageSource, /className="home-scout-strip"/);
	assert.match(homePageSource, /className="home-atlas-steps"/);
	assert.match(homePageSource, /className="home-route-list"/);
	assert.match(homePageSource, /className="home-tier-grid"/);
	assert.doesNotMatch(homePageSource, /className="home-left-stack"/);
	assert.doesNotMatch(
		homePageSource,
		/home-(?:command-kicker|section-tag|route-kicker|rank-label|scout-marker)/,
	);
	assert.match(
		homePageSource,
		/fetchpriority: index === 1 \? "high" : "auto"/,
	);
	assert.doesNotMatch(homePageSource, /fetchPriority=/);
});

test("homepage field guide reflows at tablet, phone, and narrow-phone widths", async () => {
	const homepageCss = await readProjectFile("styles/homepage.css");

	assert.match(homepageCss, /Field-guide homepage sections/);
	assert.doesNotMatch(homepageCss, /stroke-dasharray/);
	assert.doesNotMatch(
		homepageCss,
		/@media \(max-width: 820px\)[\s\S]*?\.home-orbit-ring\s*\{[^}]*display:\s*none/,
	);
	assert.match(homepageCss, /@media \(max-width: 920px\)/);
	assert.match(homepageCss, /@media \(max-width: 700px\)/);
	assert.match(homepageCss, /@media \(max-width: 360px\)/);
	assert.match(
		homepageCss,
		/\.home-command-title\s*\{[^}]*line-height:\s*1\.14;[^}]*letter-spacing:\s*0\.075em;[^}]*-webkit-text-stroke:\s*1px/s,
	);
	assert.match(
		homepageCss,
		/\.home-orbit-flow\s*\{[^}]*transform:\s*translateX\(clamp\(-56px, -3\.5vw, -30px\)\)/s,
	);
	assert.match(
		homepageCss,
		/\.home-flow-image-foreground\s*\{[^}]*mask-image:\s*linear-gradient\(/s,
	);
	assert.match(
		homepageCss,
		/\.home-flow-card-top\s*\{[^}]*display:\s*flex;[^}]*align-items:\s*center;/s,
	);
	assert.match(
		homepageCss,
		/\.home-flow-card-top span\s*\{[^}]*place-items:\s*center;[^}]*line-height:\s*1;/s,
	);
	const sharedOrbitCardWidths = [
		...homepageCss.matchAll(
			/\.home-flow-card-catch,\s*\.home-flow-card-dex,\s*\.home-flow-card-checklist\s*\{[^}]*width:\s*(\d+)px/gs,
		),
	].map((match) => Number(match[1]));
	assert.deepEqual(sharedOrbitCardWidths, [330, 300, 148, 128]);
	assert.match(
		homepageCss,
		/\.home-route-list\s*\{[^}]*grid-template-columns:\s*repeat\(2,/s,
	);
	assert.match(
		homepageCss,
		/@media \(max-width: 920px\)[\s\S]*\.home-route-list\s*\{[^}]*grid-template-columns:\s*28px minmax\(0, 1fr\)/,
	);
	assert.doesNotMatch(
		homepageCss,
		/\.home-feature-layout\s*\{[^}]*min-width:/s,
	);
});

test("homepage responsive hero image variants are available", async () => {
	const imageVariants = [
		"image1-320.avif",
		"image1-320.webp",
		"image1-800.avif",
		"image1-800.webp",
		"image2-320.avif",
		"image2-320.webp",
		"image2-800.avif",
		"image2-800.webp",
		"image3-320.avif",
		"image3-320.webp",
		"image3-578.avif",
		"image3-578.webp",
	];

	for (const imageVariant of imageVariants) {
		const imageStats = await stat(
			new URL(`../public/${imageVariant}`, import.meta.url),
		);
		assert.ok(imageStats.size > 0, `${imageVariant} should not be empty`);
	}
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
	LEGAL_CONTACT_EMAIL,
	LEGAL_OPERATOR,
	LEGAL_VERSION,
	UNOFFICIAL_PROJECT_NOTICE,
} from "../shared/legal.js";

async function readProjectFile(path) {
	return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("public legal identity is versioned and uses the approved business contact", () => {
	assert.equal(LEGAL_OPERATOR, "HeadInTheCloudsHaven LLC");
	assert.equal(LEGAL_CONTACT_EMAIL, "contact@headinthecloudshaven.com");
	assert.equal(LEGAL_VERSION, "2026-11-01");
	assert.match(
		UNOFFICIAL_PROJECT_NOTICE,
		/independent, unofficial, fan-created/i,
	);
	assert.match(
		UNOFFICIAL_PROJECT_NOTICE,
		/not licensed, sponsored, endorsed/i,
	);
	assert.match(
		UNOFFICIAL_PROJECT_NOTICE,
		/operated in partnership with Nintendo/i,
	);
});

test("all public policies are routed through the shared marketing footer", async () => {
	const [appSource, footerSource, shellSource] = await Promise.all([
		readProjectFile("src/App.jsx"),
		readProjectFile("src/components/legal/LegalFooter.jsx"),
		readProjectFile("src/components/shells/MarketingShell.jsx"),
	]);

	for (const route of ["terms", "privacy", "refunds", "copyright"]) {
		assert.match(appSource, new RegExp(`"${route}"`));
		assert.match(footerSource, new RegExp(`/${route}`));
	}
	assert.match(shellSource, /<LegalFooter \/>/);
	assert.match(footerSource, /&copy; 2026/);
});

test("account creation and new checkout fail closed without current legal consent", async () => {
	const [authSource, apiClientSource, subscriptionSource, pricingSource] =
		await Promise.all([
			readProjectFile("api/auth/[action].js"),
			readProjectFile("api.js"),
			readProjectFile("api/subscriptions/[provider]/[action].js"),
			readProjectFile("src/pages/PricingPage.jsx"),
		]);

	assert.match(authSource, /body\?\.legalAccepted !== true/);
	assert.match(authSource, /body\?\.legalVersion/);
	assert.match(apiClientSource, /purchaseAuthorized/);
	assert.match(subscriptionSource, /hasCurrentPurchaseConsent/);
	assert.match(subscriptionSource, /purchaseTermsAcceptedAt/);
	assert.match(pricingSource, /Great renews at \$5 monthly/);
	assert.match(pricingSource, /Refund and Cancellation Policy/);
});

test("legal copy avoids unsupported license and DMCA claims", async () => {
	const legalSource = await readProjectFile("src/pages/LegalPage.jsx");

	assert.match(
		legalSource,
		/does not currently claim or advertise a license/,
	);
	assert.match(legalSource, /not a substitute for a license/);
	assert.match(
		legalSource,
		/not a representation that the[\s\S]*registered a[\s\S]*designated DMCA agent/,
	);
	assert.doesNotMatch(legalSource, /we are licensed by/i);
	assert.doesNotMatch(legalSource, /all use is fair use/i);
});

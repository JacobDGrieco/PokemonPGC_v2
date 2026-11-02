/**
 * Validates local Markdown links and the canonical environment-variable
 * reference. This intentionally checks repository artifacts only; it does not
 * fetch external URLs or inspect populated secret files.
 */
import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const markdownRoots = ["README.md", "docs", "scripts/README.md"];
const requiredEnvironmentVariables = [
	"APP_ORIGIN",
	"ASSET_BASE_URL",
	"AUTH_SECRET",
	"DB_DATABASE_URL",
	"DB_DATABASE_URL_UNPOOLED",
	"GITHUB_TOKEN",
	"PAYPAL_CLIENT_ID",
	"PAYPAL_CLIENT_SECRET",
	"PAYPAL_ENVIRONMENT",
	"PAYPAL_PLAN_GREAT",
	"PAYPAL_PLAN_MASTER",
	"PAYPAL_PLAN_ULTRA",
	"PAYPAL_WEBHOOK_ID",
	"PPGC_API_PORT",
	"R2_ACCESS_KEY_ID",
	"R2_ACCOUNT_ID",
	"R2_BUCKET_NAME",
	"R2_SECRET_ACCESS_KEY",
	"SMTP_FROM_EMAIL",
	"SMTP_FROM_NAME",
	"SMTP_HOST",
	"SMTP_PASS",
	"SMTP_PORT",
	"SMTP_REQUIRE_TLS",
	"SMTP_SECURE",
	"SMTP_USER",
	"STRIPE_PORTAL_CONFIGURATION_ID",
	"STRIPE_PRICE_GREAT",
	"STRIPE_PRICE_MASTER",
	"STRIPE_PRICE_ULTRA",
	"STRIPE_SECRET_KEY",
	"STRIPE_WEBHOOK_SECRET",
	"TURNSTILE_SECRET_KEY",
	"VITE_API_BASE_URL",
	"VITE_ASSET_BASE_URL",
	"VITE_PAYPAL_ENABLED",
	"VITE_STRIPE_ENABLED",
	"VITE_TURNSTILE_SITE_KEY",
];

async function collectMarkdownFiles(targetPath) {
	const absolutePath = path.resolve(repoRoot, targetPath);
	const stat = await fs.stat(absolutePath);
	if (stat.isFile()) return [absolutePath];

	const entries = await fs.readdir(absolutePath, { withFileTypes: true });
	const nestedFiles = await Promise.all(
		entries.map((entry) => {
			const child = path.join(absolutePath, entry.name);
			if (entry.isDirectory())
				return collectMarkdownFiles(path.relative(repoRoot, child));
			return entry.isFile() && entry.name.endsWith(".md") ? [child] : [];
		}),
	);
	return nestedFiles.flat();
}

const markdownFiles = (
	await Promise.all(markdownRoots.map(collectMarkdownFiles))
).flat();
const missingLinks = [];

for (const markdownFile of markdownFiles) {
	const source = await fs.readFile(markdownFile, "utf8");
	for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
		const rawTarget = match[1].trim().replace(/^<|>$/g, "");
		if (
			!rawTarget ||
			rawTarget.startsWith("#") ||
			/^(?:https?:|mailto:)/i.test(rawTarget)
		)
			continue;

		const targetWithoutAnchor = decodeURIComponent(rawTarget.split("#")[0]);
		const resolvedTarget = path.resolve(
			path.dirname(markdownFile),
			targetWithoutAnchor,
		);
		try {
			await fs.access(resolvedTarget);
		} catch {
			missingLinks.push(
				`${path.relative(repoRoot, markdownFile)} -> ${rawTarget}`,
			);
		}
	}
}

const environmentReferencePath = path.resolve(
	repoRoot,
	"docs/environment-variables.md",
);
const environmentReference = await fs.readFile(
	environmentReferencePath,
	"utf8",
);
const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
	(variableName) => !environmentReference.includes(`\`${variableName}\``),
);

if (missingLinks.length || missingEnvironmentVariables.length) {
	if (missingLinks.length) {
		console.error(
			`Missing documentation links:\n${missingLinks.join("\n")}`,
		);
	}
	if (missingEnvironmentVariables.length) {
		console.error(
			`Missing docs/environment-variables.md entries: ${missingEnvironmentVariables.join(", ")}`,
		);
	}
	process.exitCode = 1;
} else {
	console.log(
		`Documentation check passed (${markdownFiles.length} Markdown files, ${requiredEnvironmentVariables.length} environment variables).`,
	);
}

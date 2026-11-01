import assert from "node:assert/strict";
import test from "node:test";

process.env.AUTH_SECRET = "test-only-auth-secret-with-sufficient-length";

const {
	buildAuthActionUrl,
	createRawAuthToken,
	hashAuthToken,
	hashRateLimitIdentity,
	isValidRawAuthToken,
} = await import("../api/_lib/authTokens.js");
const { createSessionToken, verifySessionToken } =
	await import("../api/_lib/auth.js");
const { escapeEmailHtml, getSmtpConfig, renderAuthEmail } =
	await import("../api/_lib/email.js");
const { validateEmail, validatePassword } =
	await import("../api/_lib/validation.js");

test("auth tokens are cryptographically sized, URL safe, and stored as deterministic digests", () => {
	const rawToken = createRawAuthToken();
	assert.equal(isValidRawAuthToken(rawToken), true);
	assert.match(rawToken, /^[A-Za-z0-9_-]+$/);
	assert.equal(hashAuthToken(rawToken).length, 64);
	assert.equal(hashAuthToken(rawToken), hashAuthToken(rawToken));
	assert.notEqual(hashAuthToken(rawToken), rawToken);
	assert.equal(isValidRawAuthToken("too-short"), false);
});

test("auth action links use the canonical origin and encode the token", () => {
	const rawToken = createRawAuthToken();
	const actionUrl = new URL(
		buildAuthActionUrl(
			"https://pokemon.example",
			"/auth/reset-password",
			rawToken,
		),
	);
	assert.equal(actionUrl.origin, "https://pokemon.example");
	assert.equal(actionUrl.pathname, "/auth/reset-password");
	assert.equal(actionUrl.searchParams.get("token"), rawToken);
});

test("email identities are represented by bounded hashes for rate-limit keys", () => {
	const first = hashRateLimitIdentity("trainer@example.com");
	assert.equal(first.length, 24);
	assert.equal(first, hashRateLimitIdentity("trainer@example.com"));
	assert.notEqual(first, hashRateLimitIdentity("other@example.com"));
});

test("SMTP configuration validates ports and requires STARTTLS by default in production", () => {
	const config = getSmtpConfig({
		NODE_ENV: "production",
		SMTP_HOST: "smtp.example.com",
		SMTP_PORT: "587",
		SMTP_USER: "mailer@example.com",
		SMTP_PASS: "secret with spaces",
	});
	assert.equal(config.secure, false);
	assert.equal(config.requireTls, true);
	assert.equal(config.pass, "secret with spaces");
	assert.equal(config.fromEmail, "mailer@example.com");

	assert.throws(
		() =>
			getSmtpConfig({
				SMTP_HOST: "smtp.example.com",
				SMTP_PORT: "70000",
				SMTP_USER: "mailer@example.com",
				SMTP_PASS: "secret",
			}),
		/SMTP_PORT/,
	);
	assert.throws(
		() =>
			getSmtpConfig({
				SMTP_HOST: "smtp.example.com",
				SMTP_PORT: "587",
				SMTP_USER: "not-an-address",
				SMTP_PASS: "secret",
			}),
		/SMTP_FROM_EMAIL/,
	);
	assert.throws(
		() =>
			getSmtpConfig({
				SMTP_HOST: "smtp.example.com",
				SMTP_PORT: "587-extra",
				SMTP_USER: "mailer@example.com",
				SMTP_PASS: "secret",
			}),
		/SMTP_PORT/,
	);
});

test("authentication email templates escape HTML and include a text alternative", () => {
	assert.equal(
		escapeEmailHtml('<script>"x" & y</script>'),
		"&lt;script&gt;&quot;x&quot; &amp; y&lt;/script&gt;",
	);
	const message = renderAuthEmail(
		"reset",
		"https://pokemon.example/reset?token=a&next=<login>",
	);
	assert.match(message.text, /https:\/\/pokemon\.example/);
	assert.doesNotMatch(message.html, /<login>/);
	assert.match(message.html, /&amp;/);
});

test("session cookies carry the version required for all-device revocation", () => {
	const token = createSessionToken({
		id: 42,
		email: "trainer@example.com",
		sessionVersion: 7,
	});
	const payload = verifySessionToken(token);
	assert.equal(payload.userId, 42);
	assert.equal(payload.sessionVersion, 7);
});

test("session signing rejects secrets shorter than 32 bytes", () => {
	const originalSecret = process.env.AUTH_SECRET;
	process.env.AUTH_SECRET = "too-short";
	try {
		assert.throws(
			() =>
				createSessionToken({
					id: 42,
					email: "trainer@example.com",
					sessionVersion: 0,
				}),
			/AUTH_SECRET/,
		);
	} finally {
		process.env.AUTH_SECRET = originalSecret;
	}
});

test("email and password validation preserve password characters", () => {
	assert.deepEqual(validateEmail(" Trainer@Example.COM "), {
		ok: true,
		email: "trainer@example.com",
	});
	assert.deepEqual(validatePassword(" pass word "), {
		ok: true,
		password: " pass word ",
	});
	assert.equal(validateEmail("invalid").ok, false);
	assert.equal(validatePassword("short").ok, false);
});

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
	TURNSTILE_AUTH_ACTIONS,
	evaluateTurnstileResponse,
	getTurnstileAllowedHostnames,
	getTurnstileSecret,
	verifyTurnstileToken,
} from "../api/_lib/turnstile.js";

test("Turnstile uses test credentials only outside production", () => {
	assert.equal(
		getTurnstileSecret({ NODE_ENV: "development" }),
		"1x0000000000000000000000000000000AA",
	);
	assert.equal(getTurnstileSecret({ NODE_ENV: "production" }), "");
	assert.equal(
		getTurnstileSecret({
			NODE_ENV: "production",
			TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
		}),
		"",
	);
	assert.equal(
		getTurnstileSecret({
			NODE_ENV: "production",
			TURNSTILE_SECRET_KEY: "production-secret",
		}),
		"production-secret",
	);
});

test("production Turnstile hostnames come from canonical deployment config", () => {
	assert.deepEqual(
		getTurnstileAllowedHostnames({
			NODE_ENV: "production",
			APP_ORIGIN: "https://www.pokemonpgc.com/path",
			VERCEL_URL: "pokemonpgc-preview.vercel.app",
			VERCEL_PROJECT_PRODUCTION_URL: "www.pokemonpgc.com",
		}),
		["www.pokemonpgc.com", "pokemonpgc-preview.vercel.app"],
	);
	assert.deepEqual(
		getTurnstileAllowedHostnames({ NODE_ENV: "development" }),
		[],
	);
});

test("Turnstile responses require the expected action and hostname", () => {
	const payload = {
		success: true,
		action: TURNSTILE_AUTH_ACTIONS.login,
		hostname: "www.pokemonpgc.com",
	};
	assert.deepEqual(
		evaluateTurnstileResponse(payload, TURNSTILE_AUTH_ACTIONS.login, [
			"www.pokemonpgc.com",
		]),
		{
			valid: true,
			retryable: false,
			reason: "verified",
			hostname: "www.pokemonpgc.com",
		},
	);
	assert.equal(
		evaluateTurnstileResponse(payload, TURNSTILE_AUTH_ACTIONS.signup)
			.reason,
		"action-mismatch",
	);
	assert.equal(
		evaluateTurnstileResponse(payload, TURNSTILE_AUTH_ACTIONS.login, [
			"preview.example.com",
		]).reason,
		"hostname-mismatch",
	);
});

test("Turnstile verification posts the token without exposing the secret", async () => {
	let request = null;
	const verification = await verifyTurnstileToken("one-time-token", {
		expectedAction: TURNSTILE_AUTH_ACTIONS.signup,
		environment: {
			NODE_ENV: "development",
			TURNSTILE_SECRET_KEY: "server-secret",
		},
		fetchImpl: async (url, options) => {
			request = { url, options };
			return {
				ok: true,
				json: async () => ({
					success: true,
					action: TURNSTILE_AUTH_ACTIONS.signup,
					hostname: "localhost",
				}),
			};
		},
	});

	assert.equal(verification.valid, true);
	assert.equal(
		request.url,
		"https://challenges.cloudflare.com/turnstile/v0/siteverify",
	);
	assert.equal(request.options.method, "POST");
	assert.equal(request.options.body.get("response"), "one-time-token");
	assert.equal(request.options.body.get("secret"), "server-secret");
});

test("Turnstile fails closed for missing production config and provider errors", async () => {
	const misconfigured = await verifyTurnstileToken("token", {
		expectedAction: TURNSTILE_AUTH_ACTIONS.login,
		environment: {
			NODE_ENV: "production",
			APP_ORIGIN: "https://www.pokemonpgc.com",
		},
	});
	assert.deepEqual(misconfigured, {
		valid: false,
		retryable: true,
		reason: "misconfigured",
	});

	const unavailable = await verifyTurnstileToken("token", {
		expectedAction: TURNSTILE_AUTH_ACTIONS.login,
		environment: { NODE_ENV: "development" },
		fetchImpl: async () => ({ ok: false }),
	});
	assert.deepEqual(unavailable, {
		valid: false,
		retryable: true,
		reason: "provider-unavailable",
	});
});

test("auth client and server enforce and reset separate Turnstile actions", async () => {
	const [modalSource, widgetSource, authHandlerSource] = await Promise.all([
		readFile(
			new URL("../src/components/modals/AuthModal.jsx", import.meta.url),
			"utf8",
		),
		readFile(
			new URL(
				"../src/components/auth/TurnstileWidget.jsx",
				import.meta.url,
			),
			"utf8",
		),
		readFile(new URL("../api/auth/[action].js", import.meta.url), "utf8"),
	]);

	assert.match(modalSource, /auth_login/);
	assert.match(modalSource, /auth_signup/);
	assert.match(modalSource, /setTurnstileResetKey/);
	assert.doesNotMatch(modalSource, /I am at least 13/);
	assert.match(widgetSource, /turnstile\.reset/);
	assert.match(authHandlerSource, /verifyTurnstileToken/);
	assert.match(authHandlerSource, /TURNSTILE_AUTH_ACTIONS\.login/);
	assert.match(authHandlerSource, /TURNSTILE_AUTH_ACTIONS\.signup/);
});

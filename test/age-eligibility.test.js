import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
	EARLIEST_SUPPORTED_BIRTH_YEAR,
	MIN_ACCOUNT_AGE_YEARS,
	evaluateAccountAge,
} from "../shared/ageEligibility.js";

const NOVEMBER_2026 = new Date("2026-11-15T12:00:00.000Z");

test("month-only age decisions conservatively handle the birthday month", () => {
	assert.equal(MIN_ACCOUNT_AGE_YEARS, 13);
	assert.deepEqual(
		evaluateAccountAge(
			{ birthMonth: "10", birthYear: "2013" },
			NOVEMBER_2026,
		),
		{ valid: true, eligible: true },
	);
	assert.deepEqual(
		evaluateAccountAge(
			{ birthMonth: "11", birthYear: "2013" },
			NOVEMBER_2026,
		),
		{ valid: true, eligible: false },
	);
	assert.deepEqual(
		evaluateAccountAge(
			{ birthMonth: "12", birthYear: "2013" },
			NOVEMBER_2026,
		),
		{ valid: true, eligible: false },
	);
});

test("age decisions reject malformed, future, and implausible answers", () => {
	for (const answer of [
		{},
		{ birthMonth: 0, birthYear: 2000 },
		{ birthMonth: 13, birthYear: 2000 },
		{ birthMonth: 1.5, birthYear: 2000 },
		{ birthMonth: 1, birthYear: 2027 },
		{ birthMonth: 1, birthYear: EARLIEST_SUPPORTED_BIRTH_YEAR - 1 },
	]) {
		assert.deepEqual(evaluateAccountAge(answer, NOVEMBER_2026), {
			valid: false,
			eligible: false,
		});
	}
});

test("signup checks eligibility server-side without adding birth fields to users", async () => {
	const [handlerSource, clientSource, modalSource, schemaSource] =
		await Promise.all([
			readFile(
				new URL("../api/auth/[action].js", import.meta.url),
				"utf8",
			),
			readFile(new URL("../api.js", import.meta.url), "utf8"),
			readFile(
				new URL(
					"../src/components/modals/AuthModal.jsx",
					import.meta.url,
				),
				"utf8",
			),
			readFile(
				new URL("../prisma/schema.prisma", import.meta.url),
				"utf8",
			),
		]);

	const ageCheckIndex = handlerSource.indexOf("evaluateAccountAge({");
	const accountLookupIndex = handlerSource.indexOf(
		"prisma.user.findUnique",
		ageCheckIndex,
	);
	assert.ok(ageCheckIndex >= 0);
	assert.ok(accountLookupIndex > ageCheckIndex);
	assert.match(handlerSource, /ACCOUNT_NOT_ELIGIBLE/);
	assert.match(clientSource, /birthMonth/);
	assert.match(clientSource, /birthYear/);
	assert.match(modalSource, /SIGNUP_STEPS\.AGE/);
	assert.match(modalSource, /does not save your\s+birth month or year/);
	assert.doesNotMatch(modalSource, /localStorage|sessionStorage/);
	assert.doesNotMatch(schemaSource, /\bbirthMonth\b|\bbirthYear\b/);
});

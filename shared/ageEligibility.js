/**
 * Shared public-account age rule. Birth month/year is evaluated transiently
 * and must never be persisted; keeping this logic shared prevents the browser
 * preview and mandatory API decision from drifting apart.
 */
export const MIN_ACCOUNT_AGE_YEARS = 13;
export const EARLIEST_SUPPORTED_BIRTH_YEAR = 1900;

function parseIntegerField(value) {
	const normalizedValue = String(value ?? "").trim();
	if (!/^\d+$/.test(normalizedValue)) return null;
	const parsedValue = Number(normalizedValue);
	return Number.isSafeInteger(parsedValue) ? parsedValue : null;
}

/**
 * Evaluates a neutral month/year answer without retaining it. Since the exact
 * birthday is unknown, the birth month remains ineligible and signup becomes
 * available the following month.
 */
export function evaluateAccountAge(
	{ birthMonth, birthYear } = {},
	now = new Date(),
) {
	const parsedBirthMonth = parseIntegerField(birthMonth);
	const parsedBirthYear = parseIntegerField(birthYear);
	const currentYear = now.getUTCFullYear();
	const currentMonth = now.getUTCMonth() + 1;

	if (
		!Number.isFinite(now.getTime()) ||
		parsedBirthMonth === null ||
		parsedBirthYear === null ||
		parsedBirthMonth < 1 ||
		parsedBirthMonth > 12 ||
		parsedBirthYear < EARLIEST_SUPPORTED_BIRTH_YEAR ||
		parsedBirthYear > currentYear
	) {
		return { valid: false, eligible: false };
	}

	const elapsedMonths =
		(currentYear - parsedBirthYear) * 12 +
		(currentMonth - parsedBirthMonth);
	return {
		valid: true,
		eligible: elapsedMonths > MIN_ACCOUNT_AGE_YEARS * 12,
	};
}

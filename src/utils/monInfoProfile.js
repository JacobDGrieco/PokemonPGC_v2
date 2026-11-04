/** Normalize imported gender-ratio variants without changing stored Mon Info data. */
export function parseMonInfoGenderRatio(value) {
	if (value == null || value === "") return null;
	if (typeof value === "object") {
		const male = value.maleRatio ?? value.male ?? null;
		const female = value.femaleRatio ?? value.female ?? null;
		if (male != null || female != null) {
			return { male: String(male ?? "?"), female: String(female ?? "?") };
		}
	}

	const text = String(value).trim();
	if (!text) return null;
	if (/genderless/i.test(text)) return { text: "Genderless" };

	const maleMatch = text.match(/([\d.]+)\s*%\s*(?:male|♂)/i);
	const femaleMatch = text.match(/([\d.]+)\s*%\s*(?:female|♀)/i);
	if (maleMatch && femaleMatch) {
		return { male: maleMatch[1], female: femaleMatch[1] };
	}
	return { text };
}

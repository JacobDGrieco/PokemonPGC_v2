/**
 * Builds the shared stat-label model used by both Mon Info renderers.
 * Gen I keeps its combined Special stat and EV yield instead of forcing the
 * modern Special Attack and Special Defense shape onto older games.
 */
export const MON_INFO_STAT_LABEL_RADIUS_OFFSET = 16;
export const MON_INFO_STAT_VIEW_BOX = "-42 -40 184 182";

export function buildMonInfoStatSeries(stats, evYield = null) {
	const hasLegacySpecial = stats?.spc != null;
	const order = hasLegacySpecial
		? ["hp", "atk", "def", "spe", "spc"]
		: ["hp", "atk", "def", "spe", "spd", "spa"];
	const labels = hasLegacySpecial
		? ["HP", "Atk", "Def", "Spd", "Spe"]
		: ["HP", "Atk", "Def", "Spe", "SpD", "SpA"];

	return order.map((key, index) => {
		const value = finiteNumber(stats?.[key]);
		const evValue = finiteNumber(evYield?.[key]);
		return {
			key,
			label: labels[index],
			value,
			evValue,
			displayValue:
				evValue !== 0 ? `${value} (${evValue})` : String(value),
		};
	});
}

function finiteNumber(value) {
	const number = Number(value ?? 0);
	return Number.isFinite(number) ? number : 0;
}

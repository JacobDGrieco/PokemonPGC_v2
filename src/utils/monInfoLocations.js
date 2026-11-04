/** Normalize Mon Info encounter locations without discarding source detail. */

function normalizeGameLabels(games) {
	const values = Array.isArray(games) ? games : [games];
	const labels = values.flatMap((value) =>
		String(value || "")
			.split(/\s*\/\s*/)
			.map((label) => label.trim())
			.filter(Boolean),
	);
	return [...new Set(labels)];
}

function parseLevelNotes(notes) {
	const match = String(notes || "").match(
		/^(.*?)(?:,\s*)?Lv\.\s*(\d+)(?:\s*-\s*(\d+))?$/i,
	);
	if (!match) return null;
	const startLevel = Number(match[2]);
	const endLevel = Number(match[3] || match[2]);
	return {
		label: match[1].trim().replace(/,\s*$/, ""),
		startLevel: Math.min(startLevel, endLevel),
		endLevel: Math.max(startLevel, endLevel),
	};
}

function formatLevelNotes(label, levelRanges) {
	const mergedRanges = [...levelRanges]
		.sort(
			(left, right) =>
				left.startLevel - right.startLevel ||
				left.endLevel - right.endLevel,
		)
		.reduce((ranges, currentRange) => {
			const previousRange = ranges.at(-1);
			if (
				previousRange &&
				currentRange.startLevel <= previousRange.endLevel + 1
			) {
				previousRange.endLevel = Math.max(
					previousRange.endLevel,
					currentRange.endLevel,
				);
				return ranges;
			}
			ranges.push({ ...currentRange });
			return ranges;
		}, []);
	const levels = mergedRanges
		.map(({ startLevel, endLevel }) =>
			startLevel === endLevel
				? `${startLevel}`
				: `${startLevel}-${endLevel}`,
		)
		.join(", ");
	return `${label ? `${label}, ` : ""}Lv. ${levels}`;
}

/**
 * Merge adjacent encounter levels within each game before combining versions
 * whose final ranges match. Encounter rates stay in the source payload; they
 * are intentionally excluded because this UI describes where and how a
 * Pokemon is obtained.
 */
export function normalizeMonInfoLocations(locations) {
	if (!Array.isArray(locations)) return [];

	const locationGroups = new Map();
	const stringLocations = [];

	for (const [index, location] of locations.entries()) {
		if (typeof location === "string") {
			if (location.trim()) {
				stringLocations.push({
					firstIndex: index,
					area: "",
					notes: location,
					method: "",
					rate: "",
					gameLabels: [],
				});
			}
			continue;
		}

		const area = String(location?.area || "").trim();
		const notes = String(location?.notes || "").trim();
		const method = String(location?.method || "").trim();
		const rate = String(location?.rate || "").trim();
		const gameLabels = normalizeGameLabels(location?.games);
		if (!area && !notes && !method && !rate) continue;
		const levelNotes = parseLevelNotes(notes);
		const gameScopes = gameLabels.length ? gameLabels : [""];

		for (const gameLabel of gameScopes) {
			const groupKey = JSON.stringify([
				area,
				levelNotes?.label || notes,
				method,
				gameLabel,
				gameLabel || levelNotes ? "" : rate,
			]);
			let group = locationGroups.get(groupKey);
			if (!group) {
				group = {
					firstIndex: index,
					area,
					notes,
					method,
					rate,
					gameLabels: gameLabel ? [gameLabel] : [],
					levelLabel: levelNotes?.label || "",
					levelRanges: [],
				};
				locationGroups.set(groupKey, group);
			}
			if (levelNotes) {
				group.levelRanges.push({
					startLevel: levelNotes.startLevel,
					endLevel: levelNotes.endLevel,
				});
			}
		}
	}

	const perGameLocations = [...locationGroups.values()].map((location) => ({
		...location,
		notes: location.levelRanges.length
			? formatLevelNotes(location.levelLabel, location.levelRanges)
			: location.notes,
	}));
	const combinedLocations = [];
	const combinedLocationIndexes = new Map();

	for (const location of [...stringLocations, ...perGameLocations].sort(
		(left, right) => left.firstIndex - right.firstIndex,
	)) {
		if (!location.gameLabels.length) {
			combinedLocations.push(location);
			continue;
		}
		const combinedKey = JSON.stringify([
			location.area,
			location.notes,
			location.method,
		]);
		const existingIndex = combinedLocationIndexes.get(combinedKey);
		if (existingIndex != null) {
			const existing = combinedLocations[existingIndex];
			existing.gameLabels = [
				...new Set([...existing.gameLabels, ...location.gameLabels]),
			];
			continue;
		}
		combinedLocationIndexes.set(combinedKey, combinedLocations.length);
		combinedLocations.push(location);
	}

	return combinedLocations.map(
		({ firstIndex, area, notes, method, rate, gameLabels = [] }) => ({
			key: `loc-${firstIndex}`,
			area,
			notes,
			extra: gameLabels.length ? gameLabels.join("/") : method || rate,
		}),
	);
}

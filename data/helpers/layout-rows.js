export const P = (parentId) => [parentId];

export const C = (parentId, childId) => [parentId, childId];

export function parentRows(start, end, rowSize = 5) {
	const rows = [];

	for (let parentId = start; parentId <= end; parentId += rowSize) {
		rows.push(
			Array.from(
				{ length: Math.min(rowSize, end - parentId + 1) },
				(_, offset) => P(parentId + offset)
			)
		);
	}

	return rows;
}

export function childRows(parentId, start, end, rowSize = 5) {
	const rows = [];

	for (let childId = start; childId <= end; childId += rowSize) {
		rows.push(
			Array.from(
				{ length: Math.min(rowSize, end - childId + 1) },
				(_, offset) => C(parentId, childId + offset)
			)
		);
	}

	return rows;
}

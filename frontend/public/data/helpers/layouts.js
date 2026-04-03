window.defineLayoutsMany = function defineLayoutsMany(gameKeys, DESKTOP_LAYOUT, COMPACT_LAYOUT) {
	const keys = Array.isArray(gameKeys) ? gameKeys : [gameKeys];

	function buildTaskRowsForGame(gameKey, layout) {
		const out = {};

		for (const [sectionSuffix, rows] of Object.entries(layout || {})) {
			// IMPORTANT:
			// - This key MUST match sec.id used by content.js: "<game>:<section>"
			// - Only the task IDs inside rows get the ":tasks:" segment.
			const sectionKey = `${gameKey}:${sectionSuffix}`;

			out[sectionKey] = (rows || []).map((row) =>
				(row || [])
					.map((ref) => {
						// allow literal tokens like "spacer"
						if (typeof ref === "string") return ref;

						const parentId = ref?.[0];
						const childId = ref?.[1];
						if (parentId == null) return null;

						const taskRoot = `${gameKey}:tasks:${sectionSuffix}:${pad3(parentId)}`;
						return childId == null ? taskRoot : `${taskRoot}:${pad3(childId)}`;
					})
					.filter(Boolean)
			);
		}

		return out;
	}

	for (const gameKey of keys) {
		const desktopLayout = buildTaskRowsForGame(gameKey, DESKTOP_LAYOUT);
		const compactLayout = buildTaskRowsForGame(gameKey, COMPACT_LAYOUT ?? DESKTOP_LAYOUT);

		PPGC.register({
			layoutVariants: {
				desktop: { taskRows: desktopLayout },
				compact: { taskRows: compactLayout },
			},
		});
	}
};
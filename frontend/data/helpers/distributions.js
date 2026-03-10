window.defineDistributionsMany = function (gameKeys, builder) {
	const keys = Array.isArray(gameKeys) ? gameKeys : [gameKeys];

	window.DATA = window.DATA || {};
	window.DATA.distributions = window.DATA.distributions || {};

	for (const gameKey of keys) {
		const prev = window.DATA.distributions[gameKey];
		const prevArr = Array.isArray(prev) ? prev.slice() : [];

		// Build new items (builder can use wrapper fns and/or return functions in fields)
		const built = builder(gameKey, { gameKey });
		const nextArr = Array.isArray(built) ? built : (built ? [built] : []);

		// Next id = (max existing numeric id) + 1
		let nextId = 1;
		for (const d of prevArr) {
			const n = Number(d?.id);
			if (Number.isFinite(n)) nextId = Math.max(nextId, n + 1);
		}

		// Assign ids only when missing
		const normalized = nextArr
			.filter(Boolean)
			.map((d) => {
				const obj = { ...d };
				if (obj.id == null) obj.id = nextId++;
				return obj;
			});

		// Append onto anything already defined for that gameKey (do not overwrite)
		window.DATA.distributions[gameKey] = prevArr.concat(normalized);
	}
};

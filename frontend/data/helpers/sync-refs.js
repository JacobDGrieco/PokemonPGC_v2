window._taskRef = function (id) {
	return { kind: "task", id };
};
window._dexRef = function (game, type, id, form) {
	const base = window._dex(game, type, id, form);
	base.kind = arguments.length === 3 ? "dex" : "dex-form";
	return base;
};
window._fashionRef = function (game, id, category, form) {
	const obj = { kind: "fashion", game, id };
	if (category != null) obj.category = category;
	if (form != null) obj.form = form;
	return obj;
};
function _popSyncOpts(args) {
	const last = args[args.length - 1];
	if (
		last &&
		typeof last === "object" &&
		!Array.isArray(last) &&
		("oneWay" in last) // only the new tag name
	) {
		return args.pop();
	}
	return null;
}
function ensureSyncStore() {
	window.DATA = window.DATA || {};
	window.DATA.syncs = window.DATA.syncs || {};
}
window.defineSyncs = function (game, builder) {
	ensureSyncStore();
	const helpers = {
		taskSync: (id, opts) => {
			const base = _taskRef(id);
			if (opts && typeof opts === "object") Object.assign(base, opts);
			return base;
		},

		regionalSync: (...args) => {
			const opts = _popSyncOpts(args);
			const base = window._dexRef(game, "regional", ...args);
			if (opts) Object.assign(base, opts);
			return base;
		},

		centralKalosSync: (...args) => {
			const opts = _popSyncOpts(args);
			const base = _dexRef(game + "-central", "regional", ...args); // args now won't include opts
			if (opts) Object.assign(base, opts);            // so oneWay lands on the link
			return base;
		},

		coastalKalosSync: (...args) => {
			const opts = _popSyncOpts(args);
			const base = _dexRef(game + "-coastal", "regional", ...args); // args now won't include opts
			if (opts) Object.assign(base, opts);            // so oneWay lands on the link
			return base;
		},

		mountainKalosSync: (...args) => {
			const opts = _popSyncOpts(args);
			const base = _dexRef(game + "-mountain", "regional", ...args); // args now won't include opts
			if (opts) Object.assign(base, opts);            // so oneWay lands on the link
			return base;
		},

		alolaSync: (...args) => {
			const opts = _popSyncOpts(args);
			const base = _dexRef(game + "-alola", "regional", ...args); // args now won't include opts
			if (opts) Object.assign(base, opts);            // so oneWay lands on the link
			return base;
		},

		melemeleSync: (...args) => {
			const opts = _popSyncOpts(args);
			const base = _dexRef(game + "-melemele", "regional", ...args); // args now won't include opts
			if (opts) Object.assign(base, opts);            // so oneWay lands on the link
			return base;
		},

		akalaSync: (...args) => {
			const opts = _popSyncOpts(args);
			const base = _dexRef(game + "-akala", "regional", ...args); // args now won't include opts
			if (opts) Object.assign(base, opts);            // so oneWay lands on the link
			return base;
		},

		ulaulaSync: (...args) => {
			const opts = _popSyncOpts(args);
			const base = _dexRef(game + "-ulaula", "regional", ...args); // args now won't include opts
			if (opts) Object.assign(base, opts);            // so oneWay lands on the link
			return base;
		},

		poniSync: (...args) => {
			const opts = _popSyncOpts(args);
			const base = _dexRef(game + "-poni", "regional", ...args); // args now won't include opts
			if (opts) Object.assign(base, opts);            // so oneWay lands on the link
			return base;
		},

		nationalSync: (...args) => {
			const opts = _popSyncOpts(args);
			const base = _dexRef(game, "national", ...args);
			if (opts) Object.assign(base, opts);
			return base;
		},

		fashionSync: (category, parentId, childIdOrOpts, maybeOpts) => {
			let childId = childIdOrOpts;
			let opts = maybeOpts ?? null;

			// If child slot is actually opts
			if (childIdOrOpts && typeof childIdOrOpts === "object" && !Array.isArray(childIdOrOpts)) {
				opts = childIdOrOpts;
				childId = null;
			}

			const root = `${game}:${category}:${pad3(parentId)}`;
			const id = (childId == null)
				? root
				: `${root}:${pad3(childId)}`;

			const base = _fashionRef(game, id, category);
			if (opts && typeof opts === "object") Object.assign(base, opts);
			return base;
		},

		// cross-game dex refs
		regionalSyncCross: (otherGame, ...args) => {
			const opts = _popSyncOpts(args);
			const base = _dexRef(otherGame, "regional", ...args);
			if (opts) Object.assign(base, opts);
			return base;
		},
	};

	window.DATA.syncs[game] = builder(helpers);
};
window.defineSyncsMany = function (gameKeys, builder) {
	ensureSyncStore();
	const keys = Array.isArray(gameKeys) ? gameKeys : [gameKeys];

	for (const gameKey of keys) {
		// capture whatever was already defined for this gameKey (from earlier calls)
		const prev = window.DATA?.syncs?.[gameKey];

		defineSyncs(gameKey, (helpers) => {
			const prevArr = Array.isArray(prev) ? prev : (prev ? [prev] : []);

			// authoring-time helper: build a taskSync id from section + numeric ids
			const taskSync = (sectionSuffix, parentId, childIdOrOpts, maybeOpts) => {
				let childId = childIdOrOpts;
				let opts = maybeOpts ?? null;

				// if the "child" slot is actually opts
				if (childIdOrOpts && typeof childIdOrOpts === "object" && !Array.isArray(childIdOrOpts)) {
					opts = childIdOrOpts;
					childId = null;
				}

				const root = `${gameKey}:tasks:${sectionSuffix}:${pad3(parentId)}`;
				const id = (childId == null) ? root : `${root}:${pad3(childId)}`;

				return helpers.taskSync(id, opts);
			};

			const eitherTaskSync = (sectionSuffix, parentId, childId, side, maybeOpts) => {
				const root = `${gameKey}:tasks:${sectionSuffix}:${pad3(parentId)}`;
				const id = (childId == null) ? root : `${root}:${pad3(childId)}`;

				let opts = maybeOpts ?? null;
				if (!opts || typeof opts !== "object" || Array.isArray(opts)) opts = {};
				opts = { ...opts, side };

				return helpers.taskSync(id, opts);
			};

			const taskId = (sectionSuffix, parentId, childId) => {
				const root = `${gameKey}:tasks:${sectionSuffix}:${pad3(parentId)}`;
				return (childId == null) ? root : `${root}:${pad3(childId)}`;
			};

			const built = builder(gameKey, { ...helpers, taskSync, eitherTaskSync, taskId });
			const nextArr = Array.isArray(built) ? built : (built ? [built] : []);

			// append new sync sets onto the end of existing ones
			return prevArr.concat(nextArr);
		});
	}
};
export function defineDistributionsMany(gameKeys, builder) {
  const keys = Array.isArray(gameKeys) ? gameKeys : [gameKeys];

  window.DATA = window.DATA || {};
  window.DATA.distributions = window.DATA.distributions || {};

  for (const gameKey of keys) {
    const prev = window.DATA.distributions[gameKey];
    const prevArr = Array.isArray(prev) ? prev.slice() : [];
    const built = builder(gameKey, { gameKey });
    const nextArr = Array.isArray(built) ? built : (built ? [built] : []);

    let nextId = 1;
    for (const d of prevArr) {
      const n = Number(d?.id);
      if (Number.isFinite(n)) nextId = Math.max(nextId, n + 1);
    }

    const normalized = nextArr
      .filter(Boolean)
      .map((d) => {
        const obj = { ...d };
        if (obj.id == null) obj.id = nextId++;
        return obj;
      });

    window.DATA.distributions[gameKey] = prevArr.concat(normalized);
  }
}

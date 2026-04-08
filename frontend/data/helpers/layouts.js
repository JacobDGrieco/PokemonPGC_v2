import { pad3 } from './core.js';

export function defineLayoutsMany(gameKeys, DESKTOP_LAYOUT, COMPACT_LAYOUT) {
  const keys = Array.isArray(gameKeys) ? gameKeys : [gameKeys];

  function buildTaskRowsForGame(gameKey, layout) {
    const out = {};

    for (const [sectionSuffix, rows] of Object.entries(layout || {})) {
      const sectionKey = `${gameKey}:${sectionSuffix}`;
      out[sectionKey] = (rows || []).map((row) =>
        (row || [])
          .map((ref) => {
            if (typeof ref === 'string') return ref;

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
}

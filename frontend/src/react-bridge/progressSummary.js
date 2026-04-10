import { save, store } from '../store.js';
import { dexPctFor } from './modalApi.js';
import { ensureSections, bootstrapTasks, setDescendantsDone } from './taskApi.js';
import { allGamesList, getGameRowsForGen, getSectionAddonPcts, summarizeTasks } from '../progress.js';
import { ensureSyncSetsExpandedForGame } from '../sync.js';
import { getSeedTaskIdsBySection } from '../taskRegistry.js';

function isExtraCreditSection(section) {
  const title = String(section?.title || '').trim().toLowerCase();
  return title === 'distributions' || title === 'extra credit';
}

export function bootstrapTasksForGame(gameKey, currentStore = store) {
  if (!gameKey || !currentStore?.tasksStore) return;
  ensureSyncSetsExpandedForGame(gameKey);
  const sections = ensureSections(gameKey);
  for (const section of sections) {
    bootstrapTasks(section.id, currentStore.tasksStore);
  }
}

export function computeSectionPct(section, gameKey, genKey, currentStore = store) {
  const addon = getSectionAddonPcts(
    section,
    gameKey,
    genKey,
    (a, b) => dexPctFor(a, b, currentStore),
    window.PPGC?.sectionMeters
  );

  let baseDone = 0;
  let baseTotal = 0;

  if (currentStore.tasksStore && currentStore.tasksStore.has(section.id)) {
    const tasksArr = currentStore.tasksStore.get(section.id) || [];
    ({ done: baseDone, total: baseTotal } = summarizeTasks(tasksArr));
  } else {
    const bySection = getSeedTaskIdsBySection();
    const ids = bySection.get(section.id) || [];
    baseTotal = ids.length;

    if (baseTotal) {
      const progress = currentStore.taskProgressById;
      let done = 0;
      for (const id of ids) {
        if (progress && progress.get(String(id))) done += 1;
      }
      baseDone = done;
    }
  }

  const extraDone = addon.reduce((total, pct) => total + Math.max(0, Math.min(100, pct)) / 100, 0);
  const done = baseDone + extraDone;
  const total = baseTotal + addon.length;
  return total > 0 ? (done / total) * 100 : 0;
}

export function buildGenOverview(currentStore = store) {
  const state = currentStore.state || {};
  const startedMap = state.startedGames || {};
  const games = allGamesList();

  const pctCache = currentStore.state.cachedGamePcts || (currentStore.state.cachedGamePcts = {});
  let cacheUpdated = false;

  const gameStats = games.map(({ genKey, game }) => {
    const sections = ensureSections(game.key);

    let pct;
    if (!sections.length) {
      // Gen data not loaded yet — use last-known cached value
      pct = pctCache[game.key] ?? 0;
    } else {
      const baseSections = sections.filter((section) => !isExtraCreditSection(section));
      const extraSections = sections.filter(isExtraCreditSection);

      const basePcts = baseSections.map((section) => computeSectionPct(section, game.key, genKey, currentStore));
      const baseComplete = basePcts.length > 0 && basePcts.every((p) => p >= 100 - 1e-6);
      const baseAvg = basePcts.length ? basePcts.reduce((a, b) => a + b, 0) / basePcts.length : 0;

      if (!baseComplete) {
        pct = Math.min(100, baseAvg);
      } else {
        const extraPcts = extraSections.map((section) => computeSectionPct(section, game.key, genKey, currentStore));
        const extraAvg = extraPcts.length ? extraPcts.reduce((a, b) => a + b, 0) / extraPcts.length : 0;
        pct = 100 + Math.min(100, extraAvg);
      }

      // Update cache so next load shows correct values before data is re-fetched
      if (pctCache[game.key] !== pct) {
        pctCache[game.key] = pct;
        cacheUpdated = true;
      }
    }

    return {
      genKey,
      game,
      pct,
      basePct: Math.min(100, pct),
      extraPct: pct > 100 ? Math.min(pct - 100, 100) : 0,
      isStarted: !!startedMap[game.key],
    };
  });

  if (cacheUpdated) save();

  const aggregateMode = state.gameSummaryAggregateMode === 'started' ? 'started' : 'all';
  const startedStats = gameStats.filter((entry) => entry.isStarted);
  const aggregateStats = aggregateMode === 'started' ? startedStats : gameStats;

  const totalGames = aggregateStats.length;
  const totalKnownGames = games.length;
  const startedCount = startedStats.length;

  let aggBase = 0;
  let aggExtra = 0;
  if (totalGames > 0) {
    for (const stat of aggregateStats) {
      aggBase += stat.isStarted ? stat.basePct : 0;
      aggExtra += stat.isStarted ? stat.extraPct : 0;
    }
    aggBase /= totalGames;
    aggExtra /= totalGames;
  }

  let effectiveExtra = 0;
  let allBaseComplete = false;
  if (totalGames > 0) {
    if (aggregateMode === 'started') {
      allBaseComplete = startedCount > 0 && startedStats.every((stat) => stat.basePct >= 100 - 1e-6);
    } else {
      allBaseComplete = aggregateStats.length > 0 && aggregateStats.every((stat) => stat.isStarted && stat.basePct >= 100 - 1e-6);
    }

    if (allBaseComplete) effectiveExtra = aggExtra;
  }

  return {
    aggregateMode,
    scope: state.gameSummaryScope || 'all',
    totalKnownGames,
    startedCount,
    overallBase: Math.max(0, Math.min(100, aggBase)),
    overallExtra: Math.max(0, Math.min(100, effectiveExtra)),
    overallPct: Math.max(0, Math.min(200, aggBase + effectiveExtra)),
    gameStats,
    visibleGameStats: (state.gameSummaryScope || 'all') === 'started'
      ? gameStats.filter((entry) => entry.isStarted)
      : gameStats,
  };
}

export function buildGameOverview(genKey, currentStore = store) {
  return getGameRowsForGen(genKey).map((row) => row.map((game) => ({
    game,
    sections: ensureSections(game.key).map((section) => ({
      ...section,
      pct: computeSectionPct(section, game.key, genKey, currentStore),
    })),
  })));
}

export function applyGameStartSync(gameKey, started, currentStore = store) {
  if (!gameKey || !window.DATA) return;

  ensureSyncSetsExpandedForGame(gameKey);
  bootstrapTasksForGame(gameKey, currentStore);
  const sections = ensureSections(gameKey);
  for (const section of sections) {
    const tasksArr = currentStore.tasksStore.get(section.id) || [];
    (function walk(items) {
      for (const task of items || []) {
        if (!task || typeof task !== 'object') continue;
        const tags = Array.isArray(task.tags) ? task.tags : [];
        const tagged = task.startGame === true || tags.includes('startGame');
        if (tagged) setDescendantsDone(task, !!started);
        if (Array.isArray(task.children) && task.children.length) walk(task.children);
      }
    })(tasksArr);
  }

  const dexList = (window.DATA.dex && window.DATA.dex[gameKey]) || [];
  if (dexList.length) {
    const speciesMap = currentStore.dexStatus.get(gameKey) || {};
    for (const mon of dexList) {
      if (!mon) continue;
      const tags = Array.isArray(mon.tags) ? mon.tags : [];
      const tagged = mon.startGame === true || tags.includes('startGame');
      if (!tagged) continue;
      if (started) speciesMap[mon.id] = speciesMap[mon.id] || 'caught';
      else delete speciesMap[mon.id];
    }
    currentStore.dexStatus.set(gameKey, speciesMap);
  }

  save();
}

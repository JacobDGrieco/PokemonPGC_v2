import { installUiGlobals } from '../runtime/uiGlobals.js';
import { computeSectionPct } from '../react-bridge/progressSummary.js';
import { ensureSections, bootstrapTasks } from '../react-bridge/taskApi.js';

function bootstrapTasksForGame(gameKey, currentStore = window.store) {
  if (!gameKey || !currentStore?.tasksStore) return;
  const sections = ensureSections(gameKey);
  for (const section of sections) bootstrapTasks(section.id, currentStore.tasksStore);
}

installUiGlobals();

export { bootstrapTasksForGame, computeSectionPct };

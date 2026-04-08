import { ensureSections, buildTaskIndex, buildTaskLayoutGroups, buildTaskLayoutMeta, bootstrapTasks } from "./tasks-bootstrap.js";
import { getTierMetaForTask, getTierSteps, formatTierTooltip, isEitherTask, isTieredTask, setDescendantsDone, getEitherChoice, setEitherChoice, eitherSyncView } from "./tasks-modes.js";
import { unloadSectionTasks, applySyncsFromTask } from "./tasks-sync.js";
import { ensurePpgcRoot } from "./runtime/globals.js";
import { hideTooltip, resolveTaskImageSrcs, attachTooltip, resolveAccentForSection } from "./tasks-visuals.js";
import { renderTaskLayout, renderTaskList, renderTieredControls } from "./tasks-renderers.js";
import { renderEitherHTML, wireEitherUI } from "./tasks-either.js";

const PPGC = ensurePpgcRoot();
let _tooltipsDisabled = false;

export {
  renderTaskLayout,
  renderTaskList,
  renderTieredControls,
  renderEitherHTML,
  wireEitherUI,
  ensureSections,
  buildTaskIndex,
  buildTaskLayoutGroups,
  buildTaskLayoutMeta,
  getTierMetaForTask,
  getTierSteps,
  formatTierTooltip,
  isEitherTask,
  isTieredTask,
  setDescendantsDone,
  getEitherChoice,
  setEitherChoice,
  eitherSyncView,
  bootstrapTasks,
  unloadSectionTasks,
  applySyncsFromTask,
  resolveTaskImageSrcs,
  attachTooltip,
  resolveAccentForSection,
};

PPGC.disableTaskTooltips = function () {
  _tooltipsDisabled = true;
  hideTooltip();
};
PPGC.enableTaskTooltips = function () {
  _tooltipsDisabled = false;
};

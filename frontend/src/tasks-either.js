import { getEitherChoice, setEitherChoice, eitherSyncView } from "./tasks-modes.js";
import { applySyncsFromTask } from "./tasks-sync.js";

export function renderEitherHTML(task) {
  const src = task?.eithers || {};
  const entries = Object.entries(src).filter(([, v]) => v && typeof v === "object");
  if (!entries.length) return "";

  const choice = getEitherChoice(task.id);
  const optsHtml = entries.map(([key, opt]) => {
    const active = choice != null && String(choice) === String(key);
    const disabled = choice != null && !active;
    const rawText = typeof opt?.text === "string" ? opt.text : "";
    const text = rawText.trim();
    const labelHtml = text ? `<span class="small">${text}</span>` : "";
    return `
      <span class="task-either-choice ${active ? "either-active" : ""} ${disabled ? "either-disabled" : ""}"
        data-option-key="${String(key)}"
        role="button"
        tabindex="0">
        <input type="checkbox" class="task-either-cb" data-option-key="${String(key)}"
          ${active ? "checked" : ""} ${disabled ? "disabled" : ""}/>
        ${labelHtml}
      </span>
    `;
  }).join("");

  return `<div class="task-either" data-either="1">${optsHtml}</div>`;
}

export function wireEitherUI(rowOrItemEl, task, sectionId, setTasks, tasksRootRef) {
  const wrap = rowOrItemEl.querySelector('[data-either="1"]');
  if (!wrap) return;

  const shieldFromOuterLabel = (e) => {
    if (!e.target.closest("input.task-either-cb")) e.preventDefault();
  };
  wrap.addEventListener("click", shieldFromOuterLabel, true);

  const getKeyFromEl = (el) => el?.getAttribute("data-option-key");

  const renderChoiceUI = (choice) => {
    task.done = !!choice;
    wrap.querySelectorAll('.task-either-choice[data-option-key]').forEach((chip) => {
      const k = getKeyFromEl(chip);
      const active = choice != null && String(choice) === String(k);
      const disabled = choice != null && !active;
      chip.classList.toggle('either-active', active);
      chip.classList.toggle('either-disabled', disabled);
      const cb = chip.querySelector('input.task-either-cb[data-option-key]');
      if (cb) {
        cb.checked = active;
        cb.disabled = disabled;
      }
    });
  };

  const applyChoice = (newKeyOrNull, opts = {}) => {
    const { init = false } = opts;
    const prev = getEitherChoice(task.id);
    const prevStr = prev == null ? null : String(prev);
    const nextStr = newKeyOrNull == null ? null : String(newKeyOrNull);

    if (prevStr === nextStr) {
      renderChoiceUI(prev);
      return;
    }

    if (!init && prev != null && newKeyOrNull != null && prevStr !== nextStr) {
      applySyncsFromTask(eitherSyncView(task, prev), false);
    }

    setEitherChoice(task.id, newKeyOrNull);
    const choice = getEitherChoice(task.id);
    renderChoiceUI(choice);

    if (init) return;
    setTasks(sectionId, tasksRootRef);
    if (choice != null) applySyncsFromTask(eitherSyncView(task, choice), true);
    window.PPGC?.refreshSectionHeaderPct?.();
  };

  applyChoice(getEitherChoice(task.id), { init: true });

  wrap.addEventListener('click', (e) => {
    const input = e.target.closest('input.task-either-cb');
    const chip = e.target.closest('.task-either-choice[data-option-key]');
    if (!chip || input) return;
    const key = getKeyFromEl(chip);
    const cur = getEitherChoice(task.id);
    if (cur != null && String(cur) === String(key)) applyChoice(null);
    else applyChoice(key);
  });

  wrap.querySelectorAll('input.task-either-cb[data-option-key]').forEach((cb) => {
    cb.addEventListener('change', (e) => {
      const key = e.target.getAttribute('data-option-key');
      const cur = getEitherChoice(task.id);
      if (cur != null && String(cur) === String(key) && !e.target.checked) applyChoice(null);
      else applyChoice(key);
    });
  });
}

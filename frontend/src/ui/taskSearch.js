const TASK_SEARCH_MIN_CHARS = 2;
let taskSearchIndex = null;
let taskSearchWired = false;

function buildTaskSearchIndex() {
  const idx = [];
  const tasksBySection = window.DATA?.tasks || {};
  const gamesByGen = window.DATA?.games || {};
  const sectionsByGame = window.DATA?.sections || {};

  const gameMeta = {};
  for (const [genKey, arr] of Object.entries(gamesByGen)) {
    (arr || []).forEach((g) => {
      if (!g?.key) return;
      gameMeta[g.key] = { label: g.label || g.key, genKey };
    });
  }

  const gameKeyFromSectionId = (sectionId) => (sectionId || '').split('-')[0] || '';

  const walk = (nodes, ctx) => {
    (nodes || []).forEach((task) => {
      if (!task) return;
      idx.push({
        id: task.id || '',
        label: task.label || task.title || task.name || '',
        tooltip: task.tooltip || task.help || task.desc || '',
        gameKey: ctx.gameKey,
        gameLabel: ctx.gameLabel,
        genKey: ctx.genKey,
        sectionId: ctx.sectionId,
        sectionLabel: ctx.sectionLabel,
      });
      if (Array.isArray(task.tasks)) walk(task.tasks, ctx);
      if (Array.isArray(task.children)) walk(task.children, ctx);
      if (Array.isArray(task.options)) walk(task.options, ctx);
    });
  };

  for (const [sectionId, rootTasks] of Object.entries(tasksBySection)) {
    const gameKey = gameKeyFromSectionId(sectionId);
    const gm = gameMeta[gameKey] || { label: gameKey, genKey: null };
    const sectionDefs = sectionsByGame[gameKey] || [];
    const sec = (sectionDefs || []).find((s) => s?.id === sectionId);
    walk(rootTasks, {
      gameKey,
      gameLabel: gm.label,
      genKey: gm.genKey,
      sectionId,
      sectionLabel: sec?.label || sec?.title || sectionId,
    });
  }

  return idx;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderTaskSearchResults(query, resultsEl) {
  if (!resultsEl) return;
  const q = String(query || '').trim().toLowerCase();
  if (q.length < TASK_SEARCH_MIN_CHARS) {
    resultsEl.innerHTML = '';
    resultsEl.hidden = true;
    return;
  }

  if (!taskSearchIndex) taskSearchIndex = buildTaskSearchIndex();

  const hits = taskSearchIndex.filter((entry) => {
    const hay = [entry.label, entry.tooltip, entry.gameLabel, entry.sectionLabel, entry.id]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  }).slice(0, 25);

  if (!hits.length) {
    resultsEl.innerHTML = '<div class="task-search-empty">No matching tasks.</div>';
    resultsEl.hidden = false;
    return;
  }

  resultsEl.innerHTML = hits.map((entry) => `
    <button type="button" class="task-search-hit" data-section-id="${escapeHtml(entry.sectionId)}" data-task-id="${escapeHtml(entry.id)}">
      <strong>${escapeHtml(entry.label || entry.id || 'Untitled task')}</strong>
      <span>${escapeHtml(entry.gameLabel)} · ${escapeHtml(entry.sectionLabel)}</span>
    </button>
  `).join('');
  resultsEl.hidden = false;

  resultsEl.querySelectorAll('.task-search-hit').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sectionId = btn.dataset.sectionId;
      const taskId = btn.dataset.taskId;
      if (!sectionId) return;
      window.PPGC = window.PPGC || {};
      if (typeof window.PPGC.navigateToTask === 'function') {
        window.PPGC.navigateToTask(sectionId, taskId);
      }
      resultsEl.innerHTML = '';
      resultsEl.hidden = true;
    });
  });
}

export function invalidateTaskSearchIndex() {
  taskSearchIndex = null;
}

export function wireGlobalTaskSearch() {
  const input = document.getElementById('taskSearchInput');
  const results = document.getElementById('taskSearchResults');
  if (!input || !results) return;

  if (!taskSearchWired) {
    input.addEventListener('input', () => renderTaskSearchResults(input.value, results));
    input.addEventListener('focus', () => renderTaskSearchResults(input.value, results));
    document.addEventListener('click', (e) => {
      if (!results.contains(e.target) && e.target !== input) {
        results.hidden = true;
      }
    });
    taskSearchWired = true;
  }

  renderTaskSearchResults(input.value, results);
}

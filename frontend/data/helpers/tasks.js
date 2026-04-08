import { pad3 } from './core.js';

export function defineTasksMany(gameKeys, SECTIONS, TASKS_BY_SECTION) {
  const keys = Array.isArray(gameKeys) ? gameKeys : [gameKeys];

  window.DATA = window.DATA || {};
  window.DATA.sections = window.DATA.sections || {};
  window.DATA.tasks = window.DATA.tasks || {};

  for (const gameKey of keys) {
    const prefixSectionId = (sid) => `${gameKey}:${sid}`;
    const taskIdRoot = (sectionSuffix, parentId) => `${gameKey}:tasks:${sectionSuffix}:${pad3(parentId)}`;
    const taskIdChild = (sectionSuffix, parentId, childId) => `${taskIdRoot(sectionSuffix, parentId)}:${pad3(childId)}`;

    function bindGameKeyFn(fn) {
      if (typeof fn !== 'function') return fn;
      return (ctx) => fn({ ...(ctx || {}), gameKey });
    }

    function normalizeEithers(out) {
      const e = out?.eithers;
      if (!e || typeof e !== 'object' || Array.isArray(e)) return;

      const keys = Object.keys(e).filter((k) => e[k] && typeof e[k] === 'object' && !Array.isArray(e[k]));
      const numericKeys = keys.filter((k) => /^\d+$/.test(k));
      const hasLeft = Object.prototype.hasOwnProperty.call(e, 'left');
      const hasRight = Object.prototype.hasOwnProperty.call(e, 'right');

      if (!hasLeft && !hasRight && keys.length === 2 && numericKeys.length === 2) {
        const sorted = numericKeys.map(Number).sort((a, b) => a - b);
        out.eithers = {
          left: e[String(sorted[0])],
          right: e[String(sorted[1])],
        };
        return;
      }

      if ((hasLeft || hasRight) && numericKeys.length) {
        out.eithers = {
          ...(hasLeft ? { left: e.left } : {}),
          ...(hasRight ? { right: e.right } : {}),
        };

        if (!out.eithers.left || !out.eithers.right) {
          const sorted = numericKeys.map(Number).sort((a, b) => a - b);
          if (!out.eithers.left) out.eithers.left = e[String(sorted[0])];
          if (!out.eithers.right) out.eithers.right = e[String(sorted[sorted.length - 1])];
        }
      }
    }

    function mapTask(sectionSuffix, t, parentId = null) {
      const out = { ...t };
      normalizeEithers(out);

      if (out.img) out.img = bindGameKeyFn(out.img);
      if (out.imgS) out.imgS = bindGameKeyFn(out.imgS);

      if (parentId === null) {
        const parent = Number(out.id);
        out.id = taskIdRoot(sectionSuffix, parent);
        parentId = parent;
      } else {
        const child = Number(out.id);
        out.id = taskIdChild(sectionSuffix, parentId, child);
      }

      if (Array.isArray(out.children)) {
        out.children = out.children.map((c) => mapTask(sectionSuffix, c, parentId));
      }

      return out;
    }

    const sections = (SECTIONS || []).map((s) => ({
      id: prefixSectionId(s.id),
      title: s.title,
    }));

    window.DATA.sections[gameKey] = sections;

    for (const [sectionSuffix, arr] of Object.entries(TASKS_BY_SECTION || {})) {
      const sectionId = `${gameKey}:${sectionSuffix}`;
      window.DATA.tasks[sectionId] = (arr || []).map((t) => mapTask(sectionSuffix, t));
    }
  }
}

export function overrideTaskChildText(tasks, parentId, childId, newText) {
  return tasks.map((task) => {
    if (task.id !== parentId) return task;

    return {
      ...task,
      children: task.children.map((child) =>
        child.id === childId
          ? { ...child, text: newText }
          : child
      ),
    };
  });
}

export function overrideTaskChildTexts(tasks, parentId, changes) {
  let out = tasks;
  for (const [childId, newText] of Object.entries(changes)) {
    out = overrideTaskChildText(out, parentId, Number(childId), newText);
  }
  return out;
}

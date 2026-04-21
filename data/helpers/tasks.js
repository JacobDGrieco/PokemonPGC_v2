import { pad3 } from './core.js';

export function injectTasksMany(gameKeys, TASKS_BY_SECTION) {
  const keys = Array.isArray(gameKeys) ? gameKeys : [gameKeys];

  window.DATA = window.DATA || {};
  window.DATA.tasks = window.DATA.tasks || {};

  for (const gameKey of keys) {
    const taskIdRoot = (sectionSuffix, parentId) => `${gameKey}:tasks:${sectionSuffix}:${pad3(parentId)}`;
    const taskIdChild = (sectionSuffix, parentId, childId) => `${taskIdRoot(sectionSuffix, parentId)}:${pad3(childId)}`;

    function bindGameKeyFn(fn) {
      if (typeof fn !== 'function') return fn;
      return (ctx) => fn({ ...(ctx || {}), gameKey });
    }

    function normalizeEithers(out) {
      const e = out?.eithers;
      if (!e || typeof e !== 'object' || Array.isArray(e)) return;
      const ks = Object.keys(e).filter((k) => e[k] && typeof e[k] === 'object' && !Array.isArray(e[k]));
      const numericKeys = ks.filter((k) => /^\d+$/.test(k));
      const hasLeft = Object.prototype.hasOwnProperty.call(e, 'left');
      const hasRight = Object.prototype.hasOwnProperty.call(e, 'right');
      if (!hasLeft && !hasRight && ks.length === 2 && numericKeys.length === 2) {
        const sorted = numericKeys.map(Number).sort((a, b) => a - b);
        out.eithers = { left: e[String(sorted[0])], right: e[String(sorted[1])] };
        return;
      }
      if ((hasLeft || hasRight) && numericKeys.length) {
        out.eithers = { ...(hasLeft ? { left: e.left } : {}), ...(hasRight ? { right: e.right } : {}) };
        if (!out.eithers.left || !out.eithers.right) {
          const sorted = numericKeys.map(Number).sort((a, b) => a - b);
          if (!out.eithers.left) out.eithers.left = e[String(sorted[0])];
          if (!out.eithers.right) out.eithers.right = e[String(sorted[sorted.length - 1])];
        }
      }
    }

    function normalizeMulti(out) {
      const raw = out?.multi;
      if (!Array.isArray(raw) || !raw.length) return;
      out.multi = raw.filter((o) => o && typeof o === 'object').map((o) => {
        const next = { ...o };
        if (next.img) next.img = bindGameKeyFn(next.img);
        if (next.imgS) next.imgS = bindGameKeyFn(next.imgS);
        return next;
      });
    }

    function bindPartySprites(party) {
      if (!Array.isArray(party)) return party;
      return party.map((mon) => mon && typeof mon === 'object'
        ? { ...mon, img: mon.img ? bindGameKeyFn(mon.img) : mon.img }
        : mon
      );
    }

    function mapTask(sectionSuffix, t, parentId = null) {
      const out = { ...t };
      normalizeEithers(out);
      normalizeMulti(out);
      if (out.img) out.img = bindGameKeyFn(out.img);
      if (out.imgS) out.imgS = bindGameKeyFn(out.imgS);
      if (out.party) out.party = bindPartySprites(out.party);
      if (out.rematchParty) out.rematchParty = bindPartySprites(out.rematchParty);
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

    for (const [sectionSuffix, arr] of Object.entries(TASKS_BY_SECTION || {})) {
      const sectionId = `${gameKey}:${sectionSuffix}`;
      window.DATA.tasks[sectionId] = (arr || []).map((t) => mapTask(sectionSuffix, t));
    }
  }
}

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

    function normalizeMulti(out) {
      const raw = out?.multi;
      if (!Array.isArray(raw) || !raw.length) return;

      out.multi = raw
        .filter((option) => option && typeof option === 'object')
        .map((option) => {
          const next = { ...option };
          if (next.img) next.img = bindGameKeyFn(next.img);
          if (next.imgS) next.imgS = bindGameKeyFn(next.imgS);
          return next;
        });
    }

    function bindPartySprites(party) {
      if (!Array.isArray(party)) return party;
      return party.map((mon) => mon && typeof mon === 'object'
        ? { ...mon, img: mon.img ? bindGameKeyFn(mon.img) : mon.img }
        : mon
      );
    }

    function mapTask(sectionSuffix, t, parentId = null) {
      const out = { ...t };
      normalizeEithers(out);
      normalizeMulti(out);

      if (out.img) out.img = bindGameKeyFn(out.img);
      if (out.imgS) out.imgS = bindGameKeyFn(out.imgS);
      if (out.party) out.party = bindPartySprites(out.party);
      if (out.rematchParty) out.rematchParty = bindPartySprites(out.rematchParty);

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

function normalizeTaskOverride(overrides) {
  if (overrides && typeof overrides === 'object' && !Array.isArray(overrides)) {
    return overrides;
  }

  return { text: overrides };
}

function mergeTaskOverride(task, overrides) {
  return {
    ...task,
    ...normalizeTaskOverride(overrides),
  };
}

export function overrideTask(tasks, parentId, overrides, childId = null) {
  return tasks.map((task) => {
    if (task.id !== parentId) return task;

    if (childId === null || childId === undefined) {
      return mergeTaskOverride(task, overrides);
    }

    if (!Array.isArray(task.children)) return task;

    return {
      ...task,
      children: task.children.map((child) =>
        child.id === childId
          ? mergeTaskOverride(child, overrides)
          : child
      ),
    };
  });
}

export function overrideTasks(tasks, parentId, changes) {
  if (
    changes === undefined &&
    parentId &&
    typeof parentId === 'object' &&
    !Array.isArray(parentId)
  ) {
    let out = tasks;

    for (const [nextParentId, nextChanges] of Object.entries(parentId)) {
      out = overrideTasks(out, Number(nextParentId), nextChanges);
    }

    return out;
  }

  if (Array.isArray(parentId)) {
    let out = tasks;

    for (const nextParentId of parentId) {
      out = overrideTasks(out, Number(nextParentId), changes);
    }

    return out;
  }

  let out = tasks;

  for (const [key, overrides] of Object.entries(changes || {})) {
    if (key === 'parent') {
      out = overrideTask(out, parentId, overrides);
      continue;
    }

    out = overrideTask(out, parentId, overrides, Number(key));
  }

  return out;
}

export function overrideTaskChildText(tasks, parentId, childId, newText) {
  return overrideTask(tasks, parentId, { text: newText }, childId);
}

export function overrideTaskChildTexts(tasks, parentId, changes) {
  return overrideTasks(tasks, parentId, changes);
}

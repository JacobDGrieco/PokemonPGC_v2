import { getTierMetaForTask, getTierSteps, formatTierTooltip, isEitherTask, isTieredTask, setDescendantsDone, getEitherChoice, forEachDescendant, _clampInt } from "./tasks-modes.js";
import { buildTaskIndex, buildTaskLayoutGroups } from "./tasks-bootstrap.js";
import { applySyncsFromTask } from "./tasks-sync.js";
import { getAccentColor, resolveAccentForSection, resolveTaskImageSrcs, attachTooltip } from "./tasks-visuals.js";
import { renderEitherHTML, wireEitherUI } from "./tasks-either.js";
import { _ball } from "../data/helpers/images.js";

const TOOLTIP_MARKER_SRC = _ball(4, "poke-ball");

function makeSpacer(height = 12) {
	const el = document.createElement("div");
	el.className = "task-spacer";
	el.style.height = `${height}px`;
	return el;
}

function hasTooltip(task) {
	return typeof task?.tooltip === "string" ? task.tooltip.trim().length > 0 : !!task?.tooltip;
}

function getTooltipMarkerHTML(task) {
	if (!hasTooltip(task)) return "";
	return `<img class="task-tooltip-marker" src="${TOOLTIP_MARKER_SRC}" alt="" aria-hidden="true">`;
}

function getTaskLabelHTML(task) {
	return `<span class="task-item-text-label">${task.text}</span>${getTooltipMarkerHTML(task)}`;
}

function getTaskTooltipHTML(task) {
	const tiered = isTieredTask(task) && Array.isArray(task.tiers);
	if (tiered) {
		const thresholds = formatTierTooltip(task);
		if (task.tooltip) {
			return `<div>${task.tooltip}</div><div style="margin-top:0.05rem;"></div><div>Tiers: ${thresholds}</div>`;
		}
		return `<div><strong>${task.text}</strong></div><div style="margin-top:0.05rem;"></div><div>Tiers: ${thresholds}</div>`;
	}
	if (task.tooltip) return task.tooltip;
	return `<strong>${task.text}</strong>`;
}

export function renderTieredControls(task, cb, accentColor) {
	const wrap = document.createElement("div");
	wrap.className = "tiered";
	const meta = getTierMetaForTask(task);
	const steps = meta.steps;
	const slider = document.createElement("input");
	slider.type = "range";
	slider.min = 0;
	slider.max = steps;
	slider.step = 1;
	slider.value = String(_clampInt(task.currentTier ?? 0, 0, steps));
	slider.className = "tiered-slider";
	const acc = accentColor || getAccentColor();
	try { slider.style.accentColor = acc; } catch { }
	slider.style.setProperty("--tier-accent", acc);

	const pct = document.createElement("div");
	pct.className = "tiered-percent";
	const updatePct = () => {
		const m = getTierMetaForTask(task);
		const localSteps = m.steps;
		const v = localSteps ? _clampInt(task.currentTier ?? 0, 0, localSteps) : 0;
		if (m.mode === "label") {
			pct.textContent = v === 0 ? "—" : (m.values[v - 1] || "—");
			return;
		}
		pct.textContent = `${v}/${localSteps}`;
	};
	updatePct();

	const line = document.createElement("div");
	line.className = "tiered-line";
	line.appendChild(slider);

	const syncDoneFromTier = () => {
		const localSteps = getTierSteps(task);
		task.done = localSteps ? task.currentTier >= localSteps : !!task.done;
		if (cb) cb.checked = !!task.done;
	};
	syncDoneFromTier();

	slider.addEventListener("input", () => {
		task.currentTier = Number(slider.value);
		syncDoneFromTier();
		updatePct();
		wrap.dispatchEvent(new CustomEvent("tiered-input", { bubbles: true }));
	});
	slider.addEventListener("change", () => {
		wrap.dispatchEvent(new CustomEvent("tiered-change", { bubbles: true }));
	});

	wrap._setTierFromDone = () => {
		const localSteps = getTierSteps(task);
		task.currentTier = task.done ? localSteps : 0;
		slider.value = String(task.currentTier);
		updatePct();
	};
	wrap._pctEl = pct;
	wrap._updatePct = updatePct;
	wrap.appendChild(line);
	return wrap;
}

function attachTaskTooltip(node, task) {
	attachTooltip(node, () => getTaskTooltipHTML(task));
	const marker = node.querySelector(".task-tooltip-marker");
	if (marker) attachTooltip(marker, () => getTaskTooltipHTML(task));
}

function wireStandardCheckbox({ task, cb, tieredWrap, index, cbById, setTasks, sectionId, tasksRef }) {
	cb.addEventListener("change", () => {
		const hasKids = Array.isArray(task.children) && task.children.length > 0;
		if (hasKids) setDescendantsDone(task, cb.checked);
		else if (isTieredTask(task)) {
			task.done = cb.checked;
			tieredWrap?._setTierFromDone?.();
		} else task.done = cb.checked;

		forEachDescendant(task, (child) => {
			const childCb = cbById.get(child.id);
			if (childCb) childCb.checked = !!child.done;
		});

		let cur = task;
		while (true) {
			const e = index.get(cur.id) || { parent: null };
			const parent = e.parent;
			if (!parent) break;
			const kids = Array.isArray(parent.children) ? parent.children : [];
			parent.done = kids.length ? kids.every((k) => !!k.done) : !!parent.done;
			const parentCb = cbById.get(parent.id);
			if (parentCb) parentCb.checked = !!parent.done;
			cur = parent;
		}

		setTasks(sectionId, tasksRef);
		applySyncsFromTask(task, cb.checked);
		window.PPGC?.refreshSectionHeaderPct?.();
	});
}

function buildTaskItem(task, sectionId, setTasks, rootTasks, index, cbById) {
	const item = document.createElement("div");
	const entry = index.get(task.id);
	const isSub = !!(entry && entry.parent);
	const hasKids = Array.isArray(task.children) && task.children.length > 0;
	const forceInline = !isSub && !hasKids && task.noCenter === true;
	const hasSlider = isTieredTask(task);
	const isEither = isEitherTask(task);
	const isStandardToggleTask = !isEither && !hasSlider;
	item.className = `task-item ${isSub ? 'is-subtask' : 'is-main'}${!isSub ? (hasKids ? ' has-children' : ' no-children') : ''}${forceInline ? ' force-inline' : ''}${hasSlider ? ' has-slider' : ''}${isStandardToggleTask ? ' task-toggleable' : ''}`;

	const imgSrcs = resolveTaskImageSrcs(task, sectionId);
	const imgsHTML = imgSrcs.map((src) => `<img class="task-item-img" src="${src}" alt="">`).join("");
	const eitherHtml = renderEitherHTML(task);
	const labelHtml = isEither
		? `<div class="small task-item-text task-either-title" data-id="${task.id}">${getTaskLabelHTML(task)}</div><div class="task-either-center">${eitherHtml}</div>`
		: `<input type="checkbox" ${task.done ? 'checked' : ''} /><div class="small task-item-text" data-id="${task.id}">${getTaskLabelHTML(task)}</div>`;

	if (isSub || (!hasKids && !forceInline)) {
		item.innerHTML = `${imgsHTML ? `<div class="task-item-img-wrap${(!isSub && !hasKids) ? '' : ''}">${imgsHTML}</div>` : ''}<label class="task-item-body ${isEither ? 'task-either-wrap' : ''}">${labelHtml}</label>`;
	} else {
		item.innerHTML = `<label class="task-item-body ${isEither ? 'task-either-wrap' : ''}">${labelHtml}${imgsHTML ? `<div class="task-item-img-wrap inline">${imgsHTML}</div>` : ''}</label>`;
	}

	item.querySelectorAll('img.task-item-img').forEach((imgEl) => {
		imgEl.addEventListener('error', () => {
			window.PPGC?.reportMissingAsset?.('taskImages', imgEl.currentSrc || imgEl.src);
			imgEl.remove();
		});
	});

	let cb = item.querySelector('input[type="checkbox"]');
	if (isEither) {
		cb = item.querySelector('input.task-either-cb');
		wireEitherUI(item, task, sectionId, setTasks, rootTasks);
		if (cb) cb.checked = !!getEitherChoice(task.id);
	}
	cbById.set(task.id, cb);

	let tieredWrap = null;
	if (isTieredTask(task)) {
		const accent = resolveAccentForSection(sectionId);
		tieredWrap = renderTieredControls(task, cb, accent);
		const label = item.querySelector('.task-item-body');
		const pctEl = tieredWrap._pctEl;
		if (pctEl) label.appendChild(pctEl);
		label.insertAdjacentElement('afterend', tieredWrap);
		tieredWrap.addEventListener('tiered-input', () => window.PPGC?.refreshSectionHeaderPct?.());
		tieredWrap.addEventListener('tiered-change', () => {
			let cur = task;
			while (true) {
				const e = index.get(cur.id) || { parent: null };
				const parent = e.parent;
				if (!parent) break;
				const kids = Array.isArray(parent.children) ? parent.children : [];
				parent.done = kids.length ? kids.every((k) => !!k.done) : !!parent.done;
				const parentCb = cbById.get(parent.id);
				if (parentCb) parentCb.checked = !!parent.done;
				cur = parent;
			}
			setTasks(sectionId, rootTasks);
			applySyncsFromTask(task, !!task.done);
			window.PPGC?.refreshSectionHeaderPct?.();
		});
	}

	if (!isEither && cb) {
		wireStandardCheckbox({ task, cb, tieredWrap, index, cbById, setTasks, sectionId, tasksRef: rootTasks });
		cb.addEventListener("click", (event) => event.stopPropagation());
		item.addEventListener("click", (event) => {
			if (!isStandardToggleTask) return;
			if (event.target.closest('input, .tiered, .task-either, .task-either-choice')) return;
			event.preventDefault();
			cb.checked = !cb.checked;
			cb.dispatchEvent(new Event("change", { bubbles: true }));
		});
	}

	attachTaskTooltip(item, task);
	return item;
}

export function renderTaskLayout(tasks, sectionId, setTasks, rowsSpec) {
	const rootTasks = tasks;
	const index = buildTaskIndex(rootTasks);
	const cbById = new Map();
	const wrap = document.createElement('div');
	wrap.className = 'task-layout';
	const used = new Set();
	const spacerId = window.DATA?.spacer?.id || 'spacer';
	const { meta: layoutMeta, groups: layoutGroups } = buildTaskLayoutGroups(rowsSpec, index, spacerId);

	const buildRowEl = (row, rowIndex) => {
		const rowEl = document.createElement('div');
		rowEl.className = ['task-row', 'task-inline', ...(layoutMeta[rowIndex]?.rowClasses || [])].join(' ');

		for (const id of row) {
			if (id === spacerId) {
				rowEl.appendChild(makeSpacer());
				continue;
			}
			const entry = index.get(id);
			if (!entry) continue;
			used.add(id);
			rowEl.appendChild(buildTaskItem(entry.task, sectionId, setTasks, rootTasks, index, cbById));
		}
		return rowEl;
	};

	layoutGroups.forEach((group) => {
		if (group.type === 'lineage') {
			const groupEl = document.createElement('div');
			groupEl.className = 'task-group task-group-lineage';
			group.rowIndexes.forEach((rowIndex) => {
				groupEl.appendChild(buildRowEl(rowsSpec[rowIndex], rowIndex));
			});
			wrap.appendChild(groupEl);
			return;
		}

		const [rowIndex] = group.rowIndexes;
		wrap.appendChild(buildRowEl(rowsSpec[rowIndex], rowIndex));
	});

	const leftovers = [];
	(function collect(arr) {
		for (const t of arr || []) {
			if (!used.has(t.id)) leftovers.push(t);
		}
	})(rootTasks);

	if (leftovers.length) {
		const divider = document.createElement('div');
		divider.className = 'small';
		divider.style.opacity = '.7';
		divider.style.margin = '6px 2px';
		divider.textContent = 'More:';
		wrap.appendChild(divider);
		wrap.appendChild(renderTaskList(leftovers, sectionId, setTasks, rootTasks, index, cbById));
	}

	return wrap;
}

export function renderTaskList(tasks, sectionId, setTasks, allTasksRef, indexOpt, cbByIdOpt) {
	const container = document.createElement('div');
	container.className = 'task-list';
	const allRef = allTasksRef || tasks;
	const index = indexOpt || buildTaskIndex(allRef);
	const cbById = cbByIdOpt || new Map();

	tasks.forEach((task) => {
		const row = document.createElement('div');
		const isEither = isEitherTask(task);
		const hasSlider = isTieredTask(task);
		const isStandardToggleTask = !isEither && !hasSlider;
		row.className = `task-row${isStandardToggleTask ? ' task-toggleable' : ''}`;
		row.innerHTML = isEither
			? `<div class="small task-item-text task-either-title" style="width:100%; text-align:center;">${getTaskLabelHTML(task)}</div><div class="task-either-center" style="width:100%;">${renderEitherHTML(task)}</div>`
			: `<input type="checkbox" ${task.done ? 'checked' : ''} /><div class="small task-item-text" style="flex:1">${getTaskLabelHTML(task)}</div>`;

		let cb = row.querySelector('input[type="checkbox"]');
		if (isEither) {
			cb = row.querySelector('input.task-either-cb');
			wireEitherUI(row, task, sectionId, setTasks, allRef);
			if (cb) cb.checked = !!getEitherChoice(task.id);
		} else cbById.set(task.id, cb);

		let tieredWrap = null;
		if (hasSlider) {
			const accent = resolveAccentForSection(sectionId);
			tieredWrap = renderTieredControls(task, cb, accent);
			const labelText = row.querySelector('.small');
			if (tieredWrap._pctEl && labelText?.parentElement) labelText.parentElement.appendChild(tieredWrap._pctEl);
			row.appendChild(tieredWrap);
		}

		if (!isEither && cb) {
			wireStandardCheckbox({ task, cb, tieredWrap, index, cbById, setTasks, sectionId, tasksRef: allRef });
			cb.addEventListener("click", (event) => event.stopPropagation());
			row.addEventListener("click", (event) => {
				if (!isStandardToggleTask) return;
				if (event.target.closest('input, .tiered, .task-either, .task-either-choice')) return;
				event.preventDefault();
				cb.checked = !cb.checked;
				cb.dispatchEvent(new Event("change", { bubbles: true }));
			});
		}

		attachTaskTooltip(row, task);
		container.appendChild(row);
	});
	return container;
}

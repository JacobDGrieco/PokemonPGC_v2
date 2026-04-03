import React, { useEffect, useMemo, useRef, useState } from 'react';
import { save, store } from '../../store.js';
import {
  applySyncsFromTask,
  attachTooltip,
  buildTaskIndex,
  eitherSyncView,
  formatTierTooltip,
  getEitherChoice,
  getTierMetaForTask,
  getTierSteps,
  isEitherTask,
  isTieredTask,
  resolveTaskImageSrcs,
  setDescendantsDone,
  setEitherChoice,
} from '../../react-bridge/taskApi.js';

function recomputeAncestorDone(task, index) {
  let current = task;
  while (true) {
    const entry = index.get(current.id) || { parent: null };
    const parent = entry.parent;
    if (!parent) break;
    const children = Array.isArray(parent.children) ? parent.children : [];
    parent.done = children.length ? children.every((child) => !!child.done) : !!parent.done;
    current = parent;
  }
}

function persistSectionTasks(sectionId, rootTasks) {
  store.tasksStore.set(sectionId, rootTasks);
  save();
}

function useTaskTooltip(task, sectionId) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    attachTooltip(node, () => {
      const tiered = isTieredTask(task) && Array.isArray(task?.tiers);

      if (tiered) {
        const thresholds = formatTierTooltip(task);
        if (task.tooltip) {
          return `
            <div>${task.tooltip}</div>
            <div style="margin-top:0.05rem;"></div>
            <div>Tiers: ${thresholds}</div>
          `;
        }

        return `
          <div><strong>${task.text}</strong></div>
          <div style="margin-top:0.05rem;"></div>
          <div>Tiers: ${thresholds}</div>
        `;
      }

      if (task.tooltip) return task.tooltip;
      return `<strong>${task.text}</strong>`;
    });

    return undefined;
  }, [task, sectionId]);

  return ref;
}

function TaskSpriteList({ task, sectionId }) {
  const [hidden, setHidden] = useState(() => new Set());
  const sources = useMemo(() => resolveTaskImageSrcs(task, sectionId) || [], [task, sectionId]);

  useEffect(() => {
    setHidden(new Set());
  }, [task.id, sectionId, sources.length]);

  const indexedSources = sources
    .map((src, index) => ({ src, index }))
    .filter(({ index }) => !hidden.has(index));

  if (!indexedSources.length) return null;

  return (
    <>
      {indexedSources.map(({ src, index }) => (
        <img
          key={`${task.id}-${index}-${src}`}
          className="task-item-img"
          src={src}
          alt=""
          onError={(event) => {
            window.PPGC?.reportMissingAsset?.('taskImages', event.currentTarget.currentSrc || event.currentTarget.src);
            setHidden((prev) => {
              const next = new Set(prev);
              next.add(index);
              return next;
            });
          }}
        />
      ))}
    </>
  );
}

function EitherChoices({ task, onChange }) {
  const options = Object.entries(task?.eithers || {}).filter(([, value]) => value && typeof value === 'object');
  const choice = getEitherChoice(task.id);

  return (
    <div className="task-either" data-either="1">
      {options.map(([key, option]) => {
        const active = choice != null && String(choice) === String(key);
        const disabled = choice != null && !active;
        const text = option?.text ?? option?.name ?? String(key);

        return (
          <span
            key={`${task.id}-${key}`}
            className={`task-either-choice${active ? ' either-active' : ''}${disabled ? ' either-disabled' : ''}`}
            data-option-key={String(key)}
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onChange(active ? null : key);
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              onChange(active ? null : key);
            }}
          >
            <input
              type="checkbox"
              className="task-either-cb"
              data-option-key={String(key)}
              checked={active}
              disabled={disabled}
              readOnly
            />
            <span className="small">{text}</span>
            <span className="task-either-x">✕</span>
          </span>
        );
      })}
    </div>
  );
}

function TieredControls({ task, sectionId, onInputCommit, onChangeCommit }) {
  const meta = getTierMetaForTask(task);
  const steps = meta.steps;
  const value = Math.max(0, Math.min(Number(task.currentTier ?? 0), steps));
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent')?.trim() || '#6aa0ff';
  const display = meta.mode === 'label' ? (value === 0 ? '—' : meta.values[value - 1] || '—') : `${value}/${steps}`;

  return (
    <>
      <div className="tiered-percent">{display}</div>
      <div className="tiered">
        <div className="tiered-line">
          <input
            type="range"
            min={0}
            max={steps}
            step={1}
            value={value}
            className="tiered-slider"
            style={{ accentColor: accent, '--tier-accent': accent }}
            onInput={(event) => onInputCommit(Number(event.currentTarget.value))}
            onChange={(event) => onChangeCommit(Number(event.currentTarget.value))}
          />
        </div>
      </div>
    </>
  );
}

function TaskItem({ task, sectionId, rootTasks, index, isInline, isSubtask, hasChildren, forceInline, onMutate }) {
  const tooltipRef = useTaskTooltip(task, sectionId);
  const hasSlider = isTieredTask(task);

  const commit = ({ syncTask = null, syncValue = null } = {}) => {
    recomputeAncestorDone(task, index);
    persistSectionTasks(sectionId, rootTasks);
    if (syncTask) applySyncsFromTask(syncTask, syncValue);
    window.PPGC?.refreshSectionHeaderPct?.();
    onMutate?.();
  };

  const handleCheckboxChange = (checked) => {
    if (hasChildren) {
      setDescendantsDone(task, checked);
    } else if (hasSlider) {
      task.done = checked;
      task.currentTier = checked ? getTierSteps(task) : 0;
    } else {
      task.done = checked;
    }

    commit({ syncTask: task, syncValue: checked });
  };

  const handleEitherChange = (nextChoice) => {
    const prevChoice = getEitherChoice(task.id);
    const prevStr = prevChoice == null ? null : String(prevChoice);
    const nextStr = nextChoice == null ? null : String(nextChoice);

    if (prevStr === nextStr) return;

    if (prevChoice != null && nextChoice != null && prevStr !== nextStr) {
      applySyncsFromTask(eitherSyncView(task, prevChoice), false);
    }

    setEitherChoice(task.id, nextChoice);
    task.done = !!nextChoice;

    recomputeAncestorDone(task, index);
    persistSectionTasks(sectionId, rootTasks);
    if (nextChoice != null) {
      applySyncsFromTask(eitherSyncView(task, nextChoice), true);
    }
    window.PPGC?.refreshSectionHeaderPct?.();
    onMutate?.();
  };

  const handleTierInput = (nextTier) => {
    task.currentTier = nextTier;
    task.done = nextTier >= getTierSteps(task);
    recomputeAncestorDone(task, index);
    onMutate?.();
  };

  const handleTierCommit = (nextTier) => {
    task.currentTier = nextTier;
    task.done = nextTier >= getTierSteps(task);
    commit({ syncTask: task, syncValue: !!task.done });
  };

  const itemClassName = [
    'task-item',
    isSubtask ? 'is-subtask' : 'is-main',
    !isSubtask ? (hasChildren ? 'has-children' : 'no-children') : '',
    forceInline ? 'force-inline' : '',
    hasSlider ? 'has-slider' : '',
  ].filter(Boolean).join(' ');

  const bodyClassName = `task-item-body${isEitherTask(task) ? ' task-either-wrap' : ''}`;

  const imageWrap = <div className={`task-item-img-wrap${(!isSubtask && (hasChildren || forceInline)) ? ' inline' : ''}`}><TaskSpriteList task={task} sectionId={sectionId} /></div>;

  const tieredControls = hasSlider ? (
    <TieredControls
      task={task}
      sectionId={sectionId}
      onInputCommit={handleTierInput}
      onChangeCommit={handleTierCommit}
    />
  ) : null;

  const textBlock = isEitherTask(task) ? (
    <>
      <div className="small task-item-text task-either-title" data-id={task.id}>{task.text}</div>
      <div className="task-either-center">
        <EitherChoices task={task} onChange={handleEitherChange} />
      </div>
    </>
  ) : (
    <>
      <input
        type="checkbox"
        checked={!!task.done}
        onChange={(event) => handleCheckboxChange(event.currentTarget.checked)}
      />
      <div className="small task-item-text" data-id={task.id}>{task.text}</div>
    </>
  );

  if (isInline) {
    return (
      <div ref={tooltipRef} className={itemClassName} data-task-id={task.id} id={`task-${task.id}`}>
        {isSubtask || (!hasChildren && !forceInline) ? imageWrap : null}
        <label className={bodyClassName}>
          {textBlock}
          {!isSubtask && (hasChildren || forceInline) ? imageWrap : null}
        </label>
        {tieredControls}
      </div>
    );
  }

  return (
    <div ref={tooltipRef} className="task-row" data-task-id={task.id} id={`task-${task.id}`}>
      {isEitherTask(task) ? (
        <>
          <div className="small task-item-text task-either-title" style={{ width: '100%', textAlign: 'center' }}>{task.text}</div>
          <div className="task-either-center" style={{ width: '100%' }}>
            <EitherChoices task={task} onChange={handleEitherChange} />
          </div>
        </>
      ) : (
        <>
          <input
            type="checkbox"
            checked={!!task.done}
            onChange={(event) => handleCheckboxChange(event.currentTarget.checked)}
          />
          <div className="small" style={{ flex: 1 }}>{task.text}</div>
          {tieredControls}
        </>
      )}
    </div>
  );
}

function TaskList({ tasks, sectionId, rootTasks, index, onMutate }) {
  return (
    <div className="task-list">
      {tasks.map((task) => {
        const entry = index.get(task.id);
        const hasChildren = Array.isArray(task.children) && task.children.length > 0;
        return (
          <TaskItem
            key={task.id}
            task={task}
            sectionId={sectionId}
            rootTasks={rootTasks}
            index={index}
            isInline={false}
            isSubtask={!!entry?.parent}
            hasChildren={hasChildren}
            forceInline={false}
            onMutate={onMutate}
          />
        );
      })}
    </div>
  );
}

function TaskLayout({ tasks, sectionId, rowsSpec, rootTasks, index, onMutate }) {
  const spacerId = window.DATA?.spacer?.id || 'spacer';
  const used = new Set();

  const rows = rowsSpec.map((row, rowIndex) => {
    const includesSubtasks = row.some((id) => !!index.get(id)?.parent);
    return (
      <div key={`${sectionId}-row-${rowIndex}`} className={`task-row task-inline${includesSubtasks ? ' has-subtasks' : ''}`}>
        {row.map((id, itemIndex) => {
          if (id === spacerId) {
            return <div key={`${sectionId}-spacer-${rowIndex}-${itemIndex}`} className="task-spacer" style={{ height: 12 }} />;
          }

          const entry = index.get(id);
          if (!entry) return null;
          used.add(id);
          const task = entry.task;
          const isSubtask = !!entry.parent;
          const hasChildren = Array.isArray(task.children) && task.children.length > 0;
          const forceInline = !isSubtask && !hasChildren && task.noCenter === true;

          return (
            <TaskItem
              key={task.id}
              task={task}
              sectionId={sectionId}
              rootTasks={rootTasks}
              index={index}
              isInline={true}
              isSubtask={isSubtask}
              hasChildren={hasChildren}
              forceInline={forceInline}
              onMutate={onMutate}
            />
          );
        })}
      </div>
    );
  });

  const leftovers = tasks.filter((task) => !used.has(task.id));

  return (
    <div className="task-layout">
      {rows}
      {leftovers.length ? (
        <>
          <div className="small" style={{ opacity: '.7', margin: '6px 2px' }}>More:</div>
          <TaskList tasks={leftovers} sectionId={sectionId} rootTasks={rootTasks} index={index} onMutate={onMutate} />
        </>
      ) : null}
    </div>
  );
}

export function TaskTree({ sectionId, refreshKey = 0, onMutate }) {
  const [localVersion, setLocalVersion] = useState(0);
  const tasks = store.tasksStore.get(sectionId) || [];
  const layoutRows = window.DATA?.layout?.taskRows?.[sectionId] || null;

  const index = useMemo(() => buildTaskIndex(tasks), [sectionId, refreshKey, localVersion, tasks]);

  const handleMutate = () => {
    setLocalVersion((value) => value + 1);
    onMutate?.();
  };

  if (Array.isArray(layoutRows) && layoutRows.length) {
    return (
      <div className="section-task-mount">
        <TaskLayout tasks={tasks} sectionId={sectionId} rowsSpec={layoutRows} rootTasks={tasks} index={index} onMutate={handleMutate} />
      </div>
    );
  }

  return (
    <div className="section-task-mount">
      <TaskList tasks={tasks} sectionId={sectionId} rootTasks={tasks} index={index} onMutate={handleMutate} />
    </div>
  );
}

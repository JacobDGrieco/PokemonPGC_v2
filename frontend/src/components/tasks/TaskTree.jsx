import React, { useEffect, useMemo, useRef, useState } from 'react';
import { save, store } from '../../store.js';
import { _ball } from '../../../data/helpers/images.js';
import {
	applySyncsFromTask,
	attachTooltip,
	buildTaskLayoutGroups,
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

const TOOLTIP_MARKER_SRC = _ball(4, 'poke-ball');

function hasTooltip(task) {
	return typeof task?.tooltip === 'string' ? task.tooltip.trim().length > 0 : !!task?.tooltip;
}

function getTaskTooltipHtml(task) {
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
}

function TaskLabel({ task, className = '', style, dataId }) {
	const markerRef = useRef(null);

	useEffect(() => {
		if (!hasTooltip(task) || !markerRef.current) return undefined;
		attachTooltip(markerRef.current, () => getTaskTooltipHtml(task));
		return undefined;
	}, [task]);

	return (
		<div className={className} style={style} data-id={dataId}>
			<span className="task-item-text-label">{task.text}</span>
			{hasTooltip(task) ? <img ref={markerRef} className="task-tooltip-marker" src={TOOLTIP_MARKER_SRC} alt="" aria-hidden="true" /> : null}
		</div>
	);
}

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

		attachTooltip(node, () => getTaskTooltipHtml(task));

		return undefined;
	}, [task, sectionId]);

	return ref;
}

function TaskSpriteList({ task, sectionId }) {
	const [hidden, setHidden] = useState(() => new Set());
	const sources = resolveTaskImageSrcs(task, sectionId) || [];

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
				const rawText = typeof option?.text === 'string' ? option.text : '';
				const text = rawText.trim();

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
						{text ? <span className="small">{text}</span> : null}
					</span>
				);
			})}
		</div>
	);
}

function TieredControls({ task, onInputCommit, onChangeCommit }) {
	const meta = getTierMetaForTask(task);
	const steps = meta.steps;
	const value = Math.max(0, Math.min(Number(task.currentTier ?? 0), steps));
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
	const isEither = isEitherTask(task);
	const isStandardToggleTask = !isEither && !hasSlider;

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
		commit({ syncTask: task, syncValue: nextTier > 0 });
	};

	const handleItemClick = (event) => {
		if (!isStandardToggleTask) return;
		if (event.target.closest('input, .tiered, .task-either, .task-either-choice')) return;
		event.preventDefault();
		handleCheckboxChange(!task.done);
	};

	const itemClassName = [
		'task-item',
		isSubtask ? 'is-subtask' : 'is-main',
		!isSubtask ? (hasChildren ? 'has-children' : 'no-children') : '',
		forceInline ? 'force-inline' : '',
		hasSlider ? 'has-slider' : '',
		isStandardToggleTask ? 'task-toggleable' : '',
	].filter(Boolean).join(' ');

	const bodyClassName = `task-item-body${isEither ? ' task-either-wrap' : ''}`;

	const imageWrap = <div className={`task-item-img-wrap${(!isSubtask && (hasChildren || forceInline)) ? ' inline' : ''}`}><TaskSpriteList task={task} sectionId={sectionId} /></div>;

	const tieredControls = hasSlider ? (
		<TieredControls
			task={task}
			onInputCommit={handleTierInput}
			onChangeCommit={handleTierCommit}
		/>
	) : null;

	const textBlock = isEither ? (
		<>
			<TaskLabel task={task} className="small task-item-text task-either-title" dataId={task.id} />
			<div className="task-either-center">
				<EitherChoices task={task} onChange={handleEitherChange} />
			</div>
		</>
	) : (
		<>
			<input
				type="checkbox"
				checked={!!task.done}
				onClick={(event) => event.stopPropagation()}
				onChange={(event) => handleCheckboxChange(event.currentTarget.checked)}
			/>
			<TaskLabel task={task} className="small task-item-text" dataId={task.id} />
		</>
	);

	if (isInline) {
		return (
			<div ref={tooltipRef} className={itemClassName} data-task-id={task.id} id={`task-${task.id}`} onClick={handleItemClick}>
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
		<div ref={tooltipRef} className={`task-row${isStandardToggleTask ? ' task-toggleable' : ''}`} data-task-id={task.id} id={`task-${task.id}`} onClick={handleItemClick}>
			{isEither ? (
				<>
					<TaskLabel task={task} className="small task-item-text task-either-title" style={{ width: '100%', textAlign: 'center' }} />
					<div className="task-either-center" style={{ width: '100%' }}>
						<EitherChoices task={task} onChange={handleEitherChange} />
					</div>
				</>
			) : (
				<>
					<input
						type="checkbox"
						checked={!!task.done}
						onClick={(event) => event.stopPropagation()}
						onChange={(event) => handleCheckboxChange(event.currentTarget.checked)}
					/>
					<TaskLabel task={task} className="small task-item-text" style={{ flex: 1 }} />
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
	const { meta: layoutMeta, groups: layoutGroups } = useMemo(
		() => buildTaskLayoutGroups(rowsSpec, index, spacerId),
		[rowsSpec, index, spacerId],
	);

	const renderRow = (row, rowIndex) => {
		const rowMeta = layoutMeta[rowIndex] || null;
		const rowClassName = ['task-row', 'task-inline', ...(rowMeta?.rowClasses || [])].join(' ');
		return (
			<div key={`${sectionId}-row-${rowIndex}`} className={rowClassName}>
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
	};

	const rows = layoutGroups.map((group, groupIndex) => {
		if (group.type === 'lineage') {
			return (
				<div key={`${sectionId}-group-${groupIndex}`} className="task-group task-group-lineage">
					{group.rowIndexes.map((rowIndex) => renderRow(rowsSpec[rowIndex], rowIndex))}
				</div>
			);
		}

		const [rowIndex] = group.rowIndexes;
		return renderRow(rowsSpec[rowIndex], rowIndex);
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

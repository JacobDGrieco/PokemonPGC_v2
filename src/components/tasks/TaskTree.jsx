import React, { useEffect, useMemo, useRef, useState } from "react";
import { save, store } from "../../store.js";
import { _ball, _keyItem } from "../../../data/helpers/images.js";
import {
	applySyncsFromTask,
	attachTooltip,
	buildTaskLayoutGroups,
	buildTaskIndex,
	eitherSyncView,
	formatTierTooltip,
	getDefaultEitherChoice,
	getEitherChoice,
	getMultiOptions,
	getTierMetaForTask,
	getTierSteps,
	isEitherTask,
	isMultiTask,
	isTieredTask,
	resolveTaskImageSrcs,
	setDescendantsDone,
	setEitherChoice,
	setMultiOptionDone,
} from "../../react-bridge/taskApi.js";
import { BattleCard } from "./BattleCard.jsx";
import { useSubscription } from "../../hooks/useSubscription.js";

const TOOLTIP_MARKER_SRC = _ball(4, "poke-ball");

function hasTooltip(task) {
	return typeof task?.tooltip === "string"
		? task.tooltip.trim().length > 0
		: !!task?.tooltip;
}

function shouldShowTierTooltip(task) {
	const meta = getTierMetaForTask(task);
	if (meta.mode === "label") return false;
	const nums = Array.isArray(meta.values)
		? meta.values.filter((value) => Number.isFinite(value))
		: [];
	if (nums.length < 2) return false;
	const diffs = [];
	for (let index = 1; index < nums.length; index += 1)
		diffs.push(nums[index] - nums[index - 1]);
	return !diffs.every((diff) => diff === 1);
}

function getTaskTooltipHtml(task) {
	const tiered = isTieredTask(task) && Array.isArray(task?.tiers);

	if (tiered) {
		const thresholds = shouldShowTierTooltip(task)
			? formatTierTooltip(task)
			: "";
		if (task.tooltip) {
			return `
            <div>${task.tooltip}</div>
            ${thresholds ? `<div style="margin-top:0.05rem;"></div><div>Tiers: ${thresholds}</div>` : ""}
          `;
		}

		return `
            <div><strong>${task.text}</strong></div>
            ${thresholds ? `<div style="margin-top:0.05rem;"></div><div>Tiers: ${thresholds}</div>` : ""}
          `;
	}

	if (task.tooltip) return task.tooltip;
	return `<strong>${task.text}</strong>`;
}

function TaskLabel({
	task,
	className = "",
	style,
	dataId,
	showTooltip = true,
}) {
	const markerRef = useRef(null);

	useEffect(() => {
		if (!showTooltip || !hasTooltip(task) || !markerRef.current)
			return undefined;
		attachTooltip(markerRef.current, () => getTaskTooltipHtml(task));
		return undefined;
	}, [task, showTooltip]);

	return (
		<div className={className} style={style} data-id={dataId}>
			<span className="task-item-text-label">{task.text}</span>
			{showTooltip && hasTooltip(task) ? (
				<img
					ref={markerRef}
					className="task-tooltip-marker"
					src={TOOLTIP_MARKER_SRC}
					alt=""
					aria-hidden="true"
				/>
			) : null}
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
		parent.done = children.length
			? children.every((child) => !!child.done)
			: !!parent.done;
		current = parent;
	}
}

function persistSectionTasks(sectionId, rootTasks) {
	store.tasksStore.set(sectionId, rootTasks);
	save();
}

function syncEitherChoicesInTree(task, checked) {
	const changes = [];

	const visit = (node) => {
		if (!node) return;

		if (isEitherTask(node)) {
			const prevChoice = getEitherChoice(node.id);
			const nextChoice = checked
				? (prevChoice ?? getDefaultEitherChoice(node))
				: null;
			const prevStr = prevChoice == null ? null : String(prevChoice);
			const nextStr = nextChoice == null ? null : String(nextChoice);

			node.done = !!nextChoice;

			if (prevStr !== nextStr) {
				setEitherChoice(node.id, nextChoice);
				changes.push({ task: node, prevChoice, nextChoice });
			}
		}

		for (const child of Array.isArray(node.children) ? node.children : [])
			visit(child);
	};

	visit(task);
	return changes;
}

function applyEitherChoiceSyncChanges(changes) {
	for (const { task, prevChoice, nextChoice } of changes) {
		const prevStr = prevChoice == null ? null : String(prevChoice);
		const nextStr = nextChoice == null ? null : String(nextChoice);
		if (prevStr === nextStr) continue;
		if (prevChoice != null)
			applySyncsFromTask(eitherSyncView(task, prevChoice), false);
		if (nextChoice != null)
			applySyncsFromTask(eitherSyncView(task, nextChoice), true);
	}
}

function useTaskTooltip(task, sectionId, enabled) {
	const ref = useRef(null);

	useEffect(() => {
		if (!enabled) return undefined;
		const node = ref.current;
		if (!node) return undefined;

		attachTooltip(node, () => getTaskTooltipHtml(task));

		return undefined;
	}, [task, sectionId, enabled]);

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
						window.PPGC?.reportMissingAsset?.(
							"taskImages",
							event.currentTarget.currentSrc ||
								event.currentTarget.src,
						);
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

function getEitherOptions(task) {
	const src = task?.eithers;
	if (!src || typeof src !== "object") return [];

	const left =
		src.left && typeof src.left === "object" ? ["left", src.left] : null;
	const right =
		src.right && typeof src.right === "object"
			? ["right", src.right]
			: null;
	if (left || right) return [left, right].filter(Boolean);

	return Object.entries(src).filter(
		([, value]) => value && typeof value === "object",
	);
}

function getEitherOptionLabel(task, option, optionIndex, optionCount) {
	const authoredLabel =
		typeof option?.text === "string" ? option.text.trim() : "";
	if (authoredLabel) return authoredLabel;

	const titleParts = String(task?.text || "")
		.split(/\s*\/\s*/)
		.map((part) => part.trim())
		.filter(Boolean);
	if (titleParts.length === optionCount) return titleParts[optionIndex];
	return `Choice ${optionIndex + 1}`;
}

function EitherChoices({ task, onChange }) {
	const options = getEitherOptions(task);
	const choice = getEitherChoice(task.id);

	return (
		<fieldset
			className={`task-either${options.length >= 3 ? " task-either-many" : ""}`}
			data-either="1"
			style={{ "--task-choice-count": options.length }}
		>
			<legend className="visually-hidden">
				{task.text || "Choose one option"}
			</legend>
			{options.map(([key, option], optionIndex) => {
				const active = choice != null && String(choice) === String(key);
				const text = getEitherOptionLabel(
					task,
					option,
					optionIndex,
					options.length,
				);

				return (
					<label
						key={`${task.id}-${key}`}
						className={`task-either-choice${active ? " either-active" : ""}`}
						data-option-key={String(key)}
						title={text}
					>
						<input
							type="radio"
							name={`task-choice-${task.id}`}
							value={String(key)}
							checked={active}
							aria-label={text}
							onClick={(event) => {
								event.stopPropagation();
								if (!active) return;
								event.preventDefault();
								onChange(null);
							}}
							onChange={(event) => {
								event.stopPropagation();
								if (event.currentTarget.checked) onChange(key);
							}}
						/>
						<span className="small">{text}</span>
					</label>
				);
			})}
		</fieldset>
	);
}

function MultiChoices({ task, onToggle }) {
	const options = getMultiOptions(task);

	return (
		<div className="task-multi" data-multi="1">
			{options.map((option) => {
				const key = String(option.id);
				const active = !!option.done;
				const rawText =
					typeof option?.text === "string" ? option.text : "";
				const text = rawText.trim();

				return (
					<label
						key={`${task.id}-${key}`}
						className={`task-multi-option${active ? " is-checked" : ""}`}
						data-option-key={key}
						onClick={(event) => {
							event.stopPropagation();
						}}
					>
						<input
							type="checkbox"
							className="task-multi-cb"
							data-option-key={key}
							checked={active}
							onClick={(event) => event.stopPropagation()}
							onChange={(event) => {
								event.stopPropagation();
								onToggle(key, event.currentTarget.checked);
							}}
						/>
						{text ? <span className="small">{text}</span> : null}
					</label>
				);
			})}
		</div>
	);
}

function clampTierValue(value, steps) {
	const max = Math.max(0, Number(steps) || 0);
	const numeric = Number(value);
	if (!Number.isFinite(numeric)) return 0;
	return Math.min(max, Math.max(0, Math.round(numeric)));
}

function shouldRenderTierInput(meta) {
	return meta.mode === "number" && meta.steps > 10;
}

function TieredValueDisplay({
	task,
	className = "",
	onInputCommit,
	onChangeCommit,
}) {
	const meta = getTierMetaForTask(task);
	const steps = meta.steps;
	const value = clampTierValue(task.currentTier ?? 0, steps);
	const display =
		meta.mode === "label"
			? value === 0
				? "-"
				: meta.values[value - 1] || "-"
			: `${value}/${steps}`;
	const showInput = shouldRenderTierInput(meta);

	return (
		<div className={`small tiered-value ${className}`.trim()}>
			{showInput ? (
				<>
					<input
						type="number"
						min={0}
						max={steps}
						step={1}
						value={value}
						className="tiered-input"
						aria-label={`${task.text} progress`}
						onClick={(event) => event.stopPropagation()}
						onInput={(event) =>
							onInputCommit(Number(event.currentTarget.value))
						}
						onChange={(event) =>
							onChangeCommit(Number(event.currentTarget.value))
						}
					/>
					<span className="tiered-value-text">/{steps}</span>
				</>
			) : (
				<span className="tiered-value-text">{display}</span>
			)}
		</div>
	);
}

function TieredControls({ task, onInputCommit, onChangeCommit }) {
	const meta = getTierMetaForTask(task);
	const steps = meta.steps;
	const value = clampTierValue(task.currentTier ?? 0, steps);

	return (
		<div className="tiered-controls">
			<div className="tiered">
				<div className="tiered-line">
					<input
						type="range"
						min={0}
						max={steps}
						step={1}
						value={value}
						className="tiered-slider"
						onInput={(event) =>
							onInputCommit(Number(event.currentTarget.value))
						}
						onChange={(event) =>
							onChangeCommit(Number(event.currentTarget.value))
						}
					/>
				</div>
			</div>
			<TieredValueDisplay
				task={task}
				onInputCommit={onInputCommit}
				onChangeCommit={onChangeCommit}
			/>
		</div>
	);
}

function TaskItem({
	task,
	sectionId,
	rootTasks,
	index,
	isInline,
	isSubtask,
	hasChildren,
	forceInline,
	onMutate,
}) {
	const { hasFeature } = useSubscription();
	const canUseTooltips = hasFeature("tooltips");
	const canUseBattleCards = hasFeature("battle-cards");
	const tooltipRef = useTaskTooltip(task, sectionId, canUseTooltips);
	const hasSlider = isTieredTask(task);
	const isEither = isEitherTask(task);
	const isMulti = isMultiTask(task);
	const isStandardToggleTask = !isEither && !isMulti && !hasSlider;
	const noCenterSlider = forceInline && hasSlider;
	const hasBattleCard = Array.isArray(task.party) && task.party.length > 0;
	const hasRematchCard =
		Array.isArray(task.rematchParty) && task.rematchParty.length > 0;
	const [openCard, setOpenCard] = useState(null);
	const battleBtnRef = useRef(null);
	const rematchBtnRef = useRef(null);

	const commit = ({ syncTask = null, syncValue = null } = {}) => {
		recomputeAncestorDone(task, index);
		persistSectionTasks(sectionId, rootTasks);
		if (syncTask) applySyncsFromTask(syncTask, syncValue);
		window.PPGC?.refreshSectionHeaderPct?.();
		onMutate?.();
	};

	const handleCheckboxChange = (checked) => {
		const eitherChoiceChanges = hasChildren
			? syncEitherChoicesInTree(task, checked)
			: [];

		if (hasChildren) {
			setDescendantsDone(task, checked);
		} else if (hasSlider) {
			task.done = checked;
			task.currentTier = checked ? getTierSteps(task) : 0;
		} else {
			task.done = checked;
		}

		commit({ syncTask: task, syncValue: checked });
		applyEitherChoiceSyncChanges(eitherChoiceChanges);
		window.PPGC?.announceStatus?.(
			`${task.text || "Task"} marked ${checked ? "complete" : "incomplete"}.`,
		);
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
		window.PPGC?.announceStatus?.(
			nextChoice == null
				? `${task.text || "Choice"} cleared.`
				: `${task.text || "Choice"} updated.`,
		);
	};

	const handleMultiToggle = (optionKey, checked) => {
		setMultiOptionDone(task, optionKey, checked);
		commit({ syncTask: task, syncValue: !!task.done });
		window.PPGC?.announceStatus?.(`${task.text || "Task"} updated.`);
	};

	const handleTierInput = (nextTier) => {
		const clamped = clampTierValue(nextTier, getTierSteps(task));
		task.currentTier = clamped;
		task.done = clamped >= getTierSteps(task);
		recomputeAncestorDone(task, index);
		onMutate?.();
	};

	const handleTierCommit = (nextTier) => {
		const clamped = clampTierValue(nextTier, getTierSteps(task));
		task.currentTier = clamped;
		task.done = clamped >= getTierSteps(task);
		commit({ syncTask: task, syncValue: clamped > 0 });
		window.PPGC?.announceStatus?.(
			`${task.text || "Task"} progress set to ${clamped} of ${getTierSteps(task)}.`,
		);
	};

	const handleItemClick = (event) => {
		if (!isStandardToggleTask) return;
		if (
			event.target.closest(
				"input, .tiered, .task-either, .task-either-choice, .task-multi, .task-multi-option, .battle-card-btn",
			)
		)
			return;
		event.preventDefault();
		handleCheckboxChange(!task.done);
	};

	const itemClassName = [
		"task-item",
		isSubtask ? "is-subtask" : "is-main",
		!isSubtask ? (hasChildren ? "has-children" : "no-children") : "",
		forceInline ? "force-inline" : "",
		hasSlider ? "has-slider" : "",
		isMulti ? "task-multi-host" : "",
		isStandardToggleTask ? "task-toggleable" : "",
	]
		.filter(Boolean)
		.join(" ");

	const bodyClassName = `task-item-body${isEither || isMulti ? " task-either-wrap" : ""}`;

	const imageWrap = (
		<div
			className={`task-item-img-wrap${!isSubtask && (hasChildren || forceInline) ? " inline" : ""}`}
		>
			<TaskSpriteList task={task} sectionId={sectionId} />
		</div>
	);

	const tieredControls = hasSlider ? (
		<TieredControls
			task={task}
			onInputCommit={handleTierInput}
			onChangeCommit={handleTierCommit}
		/>
	) : null;

	const textBlock = isEither ? (
		<>
			<TaskLabel
				task={task}
				className="small task-item-text task-either-title"
				dataId={task.id}
				showTooltip={canUseTooltips}
			/>
			<div className="task-either-center">
				<EitherChoices task={task} onChange={handleEitherChange} />
			</div>
		</>
	) : isMulti ? (
		<>
			<TaskLabel
				task={task}
				className="small task-item-text task-either-title"
				dataId={task.id}
				showTooltip={canUseTooltips}
			/>
			<div className="task-either-center">
				<MultiChoices task={task} onToggle={handleMultiToggle} />
			</div>
		</>
	) : (
		<>
			<input
				type="checkbox"
				checked={!!task.done}
				onClick={(event) => event.stopPropagation()}
				onChange={(event) =>
					handleCheckboxChange(event.currentTarget.checked)
				}
			/>
			<TaskLabel
				task={task}
				className="small task-item-text"
				dataId={task.id}
				showTooltip={canUseTooltips}
			/>
		</>
	);

	if (isInline) {
		return (
			<div
				ref={tooltipRef}
				className={`${itemClassName}${noCenterSlider ? " no-center-slider" : ""}`}
				data-task-id={task.id}
				data-task-done={task.done ? "1" : "0"}
				id={`task-${task.id}`}
				onClick={handleItemClick}
			>
				{isSubtask || (!hasChildren && !forceInline) ? imageWrap : null}
				{isEither || isMulti ? (
					<div className={bodyClassName}>
						{textBlock}
						{!isSubtask && (hasChildren || forceInline)
							? imageWrap
							: null}
					</div>
				) : (
					<label className={bodyClassName}>
						{textBlock}
						{!isSubtask && (hasChildren || forceInline)
							? imageWrap
							: null}
					</label>
				)}
				{tieredControls}
				{canUseBattleCards && (hasBattleCard || hasRematchCard) && (
					<div className="battle-card-btns">
						{hasBattleCard && (
							<>
								<button
									ref={battleBtnRef}
									className="battle-card-btn"
									title="View party"
									onClick={(e) => {
										e.stopPropagation();
										setOpenCard(
											openCard === "party"
												? null
												: "party",
										);
									}}
								>
									⚔
								</button>
								{openCard === "party" && (
									<BattleCard
										party={task.party}
										reward={task.reward}
										anchorRef={battleBtnRef}
										onClose={() => setOpenCard(null)}
									/>
								)}
							</>
						)}
						{hasRematchCard && (
							<>
								<button
									ref={rematchBtnRef}
									className="battle-card-btn battle-card-btn-rematch"
									title="View rematch party"
									onClick={(e) => {
										e.stopPropagation();
										setOpenCard(
											openCard === "rematch"
												? null
												: "rematch",
										);
									}}
								>
									<img
										src={_keyItem(
											"brilliantdiamond",
											"vs-seeker",
										)}
										alt="VS Seeker"
									/>
								</button>
								{openCard === "rematch" && (
									<BattleCard
										party={task.rematchParty}
										reward={task.rematchReward}
										anchorRef={rematchBtnRef}
										onClose={() => setOpenCard(null)}
									/>
								)}
							</>
						)}
					</div>
				)}
			</div>
		);
	}

	return (
		<div
			ref={tooltipRef}
			className={`task-row${isMulti ? " task-multi-host" : ""}${isStandardToggleTask ? " task-toggleable" : ""}`}
			data-task-id={task.id}
			data-task-done={task.done ? "1" : "0"}
			id={`task-${task.id}`}
			onClick={handleItemClick}
		>
			{isEither ? (
				<>
					<TaskLabel
						task={task}
						className="small task-item-text task-either-title"
						style={{ width: "100%", textAlign: "center" }}
						showTooltip={canUseTooltips}
					/>
					<div
						className="task-either-center"
						style={{ width: "100%" }}
					>
						<EitherChoices
							task={task}
							onChange={handleEitherChange}
						/>
					</div>
				</>
			) : isMulti ? (
				<>
					<TaskLabel
						task={task}
						className="small task-item-text task-either-title"
						style={{ width: "100%", textAlign: "center" }}
						showTooltip={canUseTooltips}
					/>
					<div
						className="task-either-center"
						style={{ width: "100%" }}
					>
						<MultiChoices
							task={task}
							onToggle={handleMultiToggle}
						/>
					</div>
				</>
			) : (
				<>
					<input
						type="checkbox"
						checked={!!task.done}
						onClick={(event) => event.stopPropagation()}
						onChange={(event) =>
							handleCheckboxChange(event.currentTarget.checked)
						}
					/>
					<TaskLabel
						task={task}
						className="small task-item-text"
						style={{ flex: 1 }}
						showTooltip={canUseTooltips}
					/>
					{tieredControls}
					{canUseBattleCards && (hasBattleCard || hasRematchCard) && (
						<div className="battle-card-btns">
							{hasBattleCard && (
								<>
									<button
										ref={battleBtnRef}
										className="battle-card-btn"
										title="View party"
										onClick={(e) => {
											e.stopPropagation();
											setOpenCard(
												openCard === "party"
													? null
													: "party",
											);
										}}
									>
										⚔
									</button>
									{openCard === "party" && (
										<BattleCard
											party={task.party}
											reward={task.reward}
											anchorRef={battleBtnRef}
											onClose={() => setOpenCard(null)}
										/>
									)}
								</>
							)}
							{hasRematchCard && (
								<>
									<button
										ref={rematchBtnRef}
										className="battle-card-btn battle-card-btn-rematch"
										title="View rematch party"
										onClick={(e) => {
											e.stopPropagation();
											setOpenCard(
												openCard === "rematch"
													? null
													: "rematch",
											);
										}}
									>
										<img
											src={_keyItem(4, "vs-recorder")}
											alt="VS Recorder"
										/>
									</button>
									{openCard === "rematch" && (
										<BattleCard
											party={task.rematchParty}
											reward={task.rematchReward}
											anchorRef={rematchBtnRef}
											onClose={() => setOpenCard(null)}
										/>
									)}
								</>
							)}
						</div>
					)}
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
				const hasChildren =
					Array.isArray(task.children) && task.children.length > 0;
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

function TaskLayout({
	tasks,
	sectionId,
	rowsSpec,
	rootTasks,
	index,
	onMutate,
}) {
	const spacerId = window.DATA?.spacer?.id || "spacer";
	const used = new Set();
	const { meta: layoutMeta, groups: layoutGroups } = useMemo(
		() => buildTaskLayoutGroups(rowsSpec, index, spacerId),
		[rowsSpec, index, spacerId],
	);

	const renderRow = (row, rowIndex) => {
		const rowMeta = layoutMeta[rowIndex] || null;
		const rowClassName = [
			"task-row",
			"task-inline",
			...(rowMeta?.rowClasses || []),
		].join(" ");
		return (
			<div key={`${sectionId}-row-${rowIndex}`} className={rowClassName}>
				{row.map((id, itemIndex) => {
					if (id === spacerId) {
						return (
							<div
								key={`${sectionId}-spacer-${rowIndex}-${itemIndex}`}
								className="task-spacer"
								style={{ height: 12 }}
							/>
						);
					}

					const entry = index.get(id);
					if (!entry) return null;
					used.add(id);
					const task = entry.task;
					const isSubtask = !!entry.parent;
					const hasChildren =
						Array.isArray(task.children) &&
						task.children.length > 0;
					const forceInline =
						!isSubtask && !hasChildren && task.noCenter === true;

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
		if (group.type === "lineage") {
			return (
				<div
					key={`${sectionId}-group-${groupIndex}`}
					className="task-group task-group-lineage"
				>
					{group.rowIndexes.map((rowIndex) =>
						renderRow(rowsSpec[rowIndex], rowIndex),
					)}
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
					<div
						className="small"
						style={{ opacity: ".7", margin: "6px 2px" }}
					>
						More:
					</div>
					<TaskList
						tasks={leftovers}
						sectionId={sectionId}
						rootTasks={rootTasks}
						index={index}
						onMutate={onMutate}
					/>
				</>
			) : null}
		</div>
	);
}

export function TaskTree({ sectionId, refreshKey = 0, onMutate }) {
	const [localVersion, setLocalVersion] = useState(0);
	const tasks = store.tasksStore.get(sectionId) || [];
	const layoutRows = window.DATA?.layout?.taskRows?.[sectionId] || null;

	const index = useMemo(
		() => buildTaskIndex(tasks),
		[sectionId, refreshKey, localVersion, tasks],
	);

	const handleMutate = () => {
		setLocalVersion((value) => value + 1);
		onMutate?.();
	};

	if (Array.isArray(layoutRows) && layoutRows.length) {
		return (
			<div className="section-task-mount">
				<TaskLayout
					tasks={tasks}
					sectionId={sectionId}
					rowsSpec={layoutRows}
					rootTasks={tasks}
					index={index}
					onMutate={handleMutate}
				/>
			</div>
		);
	}

	return (
		<div className="section-task-mount">
			<TaskList
				tasks={tasks}
				sectionId={sectionId}
				rootTasks={tasks}
				index={index}
				onMutate={handleMutate}
			/>
		</div>
	);
}

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { assetPath } from "../../utils/assetPath.js";

function formatReward(reward) {
	if (reward == null) return null;
	if (typeof reward === "number") return `₽${reward}`;
	return String(reward);
}

function TypeIcon({ type }) {
	const slug =
		type.toLowerCase() === "poison" ? "posion" : type.toLowerCase();
	return (
		<img
			className="battle-card-type-icon"
			src={assetPath(`typings/${slug}.png`)}
			alt={type}
			title={type}
		/>
	);
}

function MoveCategoryIcon({ category }) {
	return (
		<img
			className="battle-card-move-cat"
			src={assetPath(`move-types/${category}-4.png`)}
			alt={category}
			title={category}
		/>
	);
}

function MonSlot({ mon }) {
	const [spriteError, setSpriteError] = useState(false);
	const spriteSrc = typeof mon.img === "function" ? mon.img({}) : mon.img;

	return (
		<div className="battle-card-mon">
			<div className="battle-card-mon-sprite-container">
				{!spriteError && spriteSrc && (
					<img
						className="battle-card-mon-sprite"
						src={spriteSrc}
						alt={mon.name}
						onError={() => setSpriteError(true)}
					/>
				)}
			</div>
			<div className="battle-card-mon-header">
				<div className="battle-card-mon-info">
					<span className="battle-card-mon-species">{mon.name}</span>
					<span className="battle-card-mon-level">
						Lv.{mon.level}
					</span>
				</div>
				<div className="battle-card-types">
					{mon.types.map((type) => (
						<TypeIcon key={type} type={type} />
					))}
				</div>
			</div>
			{mon.moves && mon.moves.length > 0 && (
				<div className="battle-card-moves">
					{mon.moves.map((move, i) => (
						<div key={i} className="battle-card-move">
							<MoveCategoryIcon category={move.category} />
							<span className="battle-card-move-name">
								{move.name}
							</span>
							<TypeIcon type={move.type} />
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export function BattleCard({ party, reward, anchorRef, onClose }) {
	const cardRef = useRef(null);
	const closeButtonRef = useRef(null);
	const [pos, setPos] = useState(null);
	const [isCompact, setIsCompact] = useState(
		() =>
			window.matchMedia("(max-width: 700px), (max-height: 520px)")
				.matches,
	);

	useEffect(() => {
		const media = window.matchMedia(
			"(max-width: 700px), (max-height: 520px)",
		);
		const sync = () => setIsCompact(media.matches);
		sync();
		media.addEventListener("change", sync);
		return () => media.removeEventListener("change", sync);
	}, []);

	useLayoutEffect(() => {
		if (isCompact) {
			setPos({});
			return;
		}

		const anchor = anchorRef.current;
		const card = cardRef.current;
		if (!anchor || !card) return;

		const anchorRect = anchor.getBoundingClientRect();
		const cardHeight = card.offsetHeight;
		const cardWidth = card.offsetWidth;
		const spaceBelow = window.innerHeight - anchorRect.bottom;

		const unclampedTop =
			spaceBelow >= cardHeight + 8
				? anchorRect.bottom + window.scrollY + 8
				: anchorRect.top + window.scrollY - cardHeight - 8;
		const top = Math.max(
			window.scrollY + 8,
			Math.min(
				unclampedTop,
				window.scrollY + window.innerHeight - cardHeight - 8,
			),
		);

		const left = Math.max(
			8,
			Math.min(anchorRect.left, window.innerWidth - cardWidth - 8),
		);

		setPos({ top, left });
	}, [anchorRef, isCompact]);

	const onCloseRef = useRef(onClose);
	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		const handlePointerDown = (e) => {
			if (
				cardRef.current &&
				!cardRef.current.contains(e.target) &&
				anchorRef.current &&
				!anchorRef.current.contains(e.target)
			) {
				onCloseRef.current();
			}
		};
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onCloseRef.current();
		};
		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [anchorRef]);

	useEffect(() => {
		if (!isCompact) return undefined;
		const anchor = anchorRef.current;
		const focusFrame = window.requestAnimationFrame(() =>
			closeButtonRef.current?.focus(),
		);
		return () => {
			window.cancelAnimationFrame(focusFrame);
			window.requestAnimationFrame(() => anchor?.focus());
		};
	}, [anchorRef, isCompact]);

	const rewardText = formatReward(reward);
	const cardStyle =
		pos && !isCompact
			? {
					position: "absolute",
					top: pos.top,
					left: pos.left,
					zIndex: 9999,
				}
			: {
					position: "absolute",
					opacity: 0,
					transform: "translateY(-4px)",
					pointerEvents: "none",
					zIndex: 9999,
				};

	return ReactDOM.createPortal(
		<>
			{isCompact && (
				<button
					type="button"
					className="battle-card-scrim"
					aria-label="Close battle details"
					onClick={() => onCloseRef.current()}
				/>
			)}
			<div
				ref={cardRef}
				className={`battle-card${pos ? " battle-card-visible" : ""}${isCompact ? " battle-card-sheet" : ""}`}
				style={cardStyle}
				onClick={(e) => e.stopPropagation()}
				role={isCompact ? "dialog" : undefined}
				aria-modal={isCompact ? "true" : undefined}
				aria-label="Battle details"
			>
				{isCompact && (
					<button
						ref={closeButtonRef}
						type="button"
						className="battle-card-close"
						aria-label="Close battle details"
						onClick={() => onCloseRef.current()}
					>
						Ã—
					</button>
				)}
				{rewardText && (
					<div className="battle-card-reward">
						Reward: {rewardText}
					</div>
				)}
				<div
					className="battle-card-party"
					data-party-size={party.length}
				>
					{party.map((mon, i) => (
						<MonSlot key={i} mon={mon} />
					))}
				</div>
			</div>
		</>,
		document.body,
	);
}

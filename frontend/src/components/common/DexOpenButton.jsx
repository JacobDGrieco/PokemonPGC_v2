import React, { useEffect, useMemo, useState } from 'react';
import { getDexButtonIconSrc } from '../../../data/helpers/dex-button-icons.js';
import { subscribeToPpgcUiSync, getPpgcUiSnapshot } from '../../react-bridge/storeBridge.js';

function isDexOpenForGame(snapshotState, gameKey) {
	const current = snapshotState?.dexModalFor;
	if (!current || !gameKey) return false;
	return String(current).startsWith(`${String(gameKey)}-`) || String(current) === String(gameKey);
}

export function DexOpenButton({ gameKey, genKey, onOpen }) {
	const [isHovered, setIsHovered] = useState(false);
	const [isOpen, setIsOpen] = useState(() => isDexOpenForGame(getPpgcUiSnapshot()?.state, gameKey));

	useEffect(() => {
		setIsOpen(isDexOpenForGame(getPpgcUiSnapshot()?.state, gameKey));
		return subscribeToPpgcUiSync((snapshot) => {
			const nextIsOpen = isDexOpenForGame(snapshot?.state, gameKey);
			setIsOpen(nextIsOpen);
			if (!nextIsOpen) {
				setIsHovered(false);
			}
		});
	}, [gameKey]);

	const iconState = isOpen || isHovered ? 'open' : 'close';
	const iconSrc = useMemo(() => getDexButtonIconSrc(gameKey, iconState), [gameKey, iconState]);
	const iconAlt = isOpen ? 'Open' : 'Closed';

	return (
		<button
			className={`button section-dex-button${isOpen ? ' is-open' : ''}${isHovered && !isOpen ? ' is-hovered' : ''}`}
			aria-label="Open Dex"
			aria-pressed={isOpen ? 'true' : 'false'}
			type="button"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onFocus={() => setIsHovered(true)}
			onBlur={() => setIsHovered(false)}
			onClick={() => {
				setIsHovered(false);
				onOpen?.(gameKey, genKey);
			}}
		>
			<img src={iconSrc} alt={iconAlt} draggable="false" />
		</button>
	);
}

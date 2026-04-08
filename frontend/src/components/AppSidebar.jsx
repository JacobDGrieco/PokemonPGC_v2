import React from 'react';
import { _assetPath } from '../utils/assetPath.js';
import { store } from '../store.js';
import { ensureSections } from '../react-bridge/taskApi.js';
import { usePpgcSnapshot } from '../react-bridge/usePpgcSnapshot.js';
import { navigateToState } from '../react-bridge/navigation.js';
import { getVisibleSections } from '../utils/sectionVisibility.js';

function makeSidebarItems(state) {
	const level = state?.level || 'gen';

	if (level === 'gen') {
		return (window.DATA?.tabs || []).map((tab) => ({
			key: tab.key,
			label: tab.label,
			active: false,
			onClick: () => navigateToState({ level: 'game', genKey: tab.key, gameKey: null, sectionId: null }),
		}));
	}

	if (level === 'game') {
		return (window.DATA?.games?.[state.genKey] || []).map((game) => ({
			key: game.key,
			label: game.label,
			active: state.gameKey === game.key,
			badge: store.isGameStarted?.(game.key) ? 'Started' : null,
			icon: _assetPath(`game-icons/${game.key}.png`),
			onClick: async () => {
				try {
					await window.PPGC?.ensureGenDataLoadedForGame?.(game.key);
					const sections = getVisibleSections(game.key, ensureSections);
					navigateToState({
						level: 'section',
						genKey: state.genKey,
						gameKey: game.key,
						sectionId: sections?.[0]?.id || null,
					});
				} catch {
					navigateToState({ level: 'game', genKey: state.genKey, gameKey: null, sectionId: null });
				}
			},
		}));
	}

	if (level === 'section') {
		return getVisibleSections(state.gameKey, ensureSections).map((section) => ({
			key: section.id,
			label: section.title,
			active: state.sectionId === section.id,
			onClick: () => navigateToState({
				level: 'section',
				genKey: state.genKey,
				gameKey: state.gameKey,
				sectionId: section.id,
			}),
		}));
	}

	if (level === 'tools' || level === 'moninfo') {
		return [{
			key: 'info',
			label: 'Pokémon Info Index',
			active: level === 'tools',
			onClick: () => navigateToState({
				level: 'tools',
				toolsKey: 'info',
				genKey: null,
				gameKey: null,
				sectionId: null,
				monInfoId: null,
				monInfoGameKey: null,
				monInfoForm: null,
			}),
		}];
	}

	if (level === 'account') {
		return [
			{ key: 'general', label: 'General', active: (state.accountTab || 'general') === 'general', onClick: () => navigateToState({ level: 'account', accountTab: 'general', genKey: null, gameKey: null, sectionId: null }) },
			{ key: 'backup', label: 'Backups & Import', active: state.accountTab === 'backup', onClick: () => navigateToState({ level: 'account', accountTab: 'backup', genKey: null, gameKey: null, sectionId: null }) },
			{ key: 'import', label: 'Save Data Import', active: state.accountTab === 'import', onClick: () => navigateToState({ level: 'account', accountTab: 'import', genKey: null, gameKey: null, sectionId: null }) },
		];
	}

	return [];
}

function getSidebarTitle(state) {
	const level = state?.level || 'gen';
	if (level === 'game') return (window.DATA?.tabs || []).find((tab) => tab.key === state.genKey)?.label || 'Games';
	if (level === 'section') return (window.DATA?.games?.[state.genKey] || []).find((game) => game.key === state.gameKey)?.label || 'Sections';
	if (level === 'tools' || level === 'moninfo') return 'Info/Tools';
	if (level === 'account') return 'Account';
	return 'Generations';
}

function canGoBack(state) {
	return ['game', 'section', 'tools', 'moninfo', 'account'].includes(state?.level);
}

function handleBack(state) {
	if (state?.level === 'section' && state?.genKey) {
		navigateToState({ level: 'game', genKey: state.genKey, gameKey: null, sectionId: null });
	} else if (state?.level === 'game') {
		navigateToState({ level: 'gen', genKey: null, gameKey: null, sectionId: null });
	} else if (state?.level === 'moninfo') {
		navigateToState({ level: 'tools', toolsKey: 'info', genKey: null, gameKey: null, sectionId: null, monInfoId: null });
	} else if (state?.level === 'tools' || state?.level === 'account') {
		navigateToState({ level: 'gen', genKey: null, gameKey: null, sectionId: null });
	}
}

export function AppSidebar({ isMobile, mobileNavOpen, closeMobileNav }) {
	const snapshot = usePpgcSnapshot();
	const state = snapshot?.state || store.state;
	const items = makeSidebarItems(state);
	const isHidden = isMobile ? !mobileNavOpen : !!state?.sidebarCollapsed;

	const runSidebarAction = (callback) => {
		callback?.();
	};

	return (
		<aside id="sidebar" className="sidebar" aria-label="Explorer" aria-hidden={isHidden ? 'true' : 'false'} data-level={state?.level || 'gen'}>
			<div className="sidebar-header react-sidebar-header">
				<button id="navBack" className="back-btn" aria-label="Go back" disabled={!canGoBack(state)} onClick={() => runSidebarAction(() => handleBack(state))}>
					←
				</button>
				<div id="navTitle" className="sidebar-title">{getSidebarTitle(state)}</div>
			</div>

			<div
				id="sideList"
				className="dir-list react-dir-list"
				data-item-count={items.length}
				data-compact-icons={items.length >= 5 ? 'true' : 'false'}
			>
				{items.map((item) => (
					<button key={item.key} type="button" className={`dir-item react-dir-item ${item.active ? 'active' : ''}`} onClick={() => runSidebarAction(item.onClick)}>
						<div className="label">
							{item.icon ? <span className="icon game-icon" style={{ backgroundImage: `url('${item.icon}')` }} /> : <span className="icon" />}
							<span className="text">{item.label}</span>
							{item.badge ? <span className="chip chip-started">{item.badge}</span> : null}
						</div>
						<div>›</div>
					</button>
				))}
			</div>
		</aside>
	);
}

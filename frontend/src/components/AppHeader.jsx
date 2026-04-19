import React, { useEffect, useRef, useState } from 'react';
import { store } from '../store.js';
import { navigateToState } from '../react-bridge/navigation.js';
import { Link, useLocation } from 'react-router-dom';
import { PagesDropdown } from './nav/PagesDropdown.jsx';
import { wireGlobalTaskSearch } from '../ui/taskSearch.js';

export function AppHeader({ isMobile, mobileNavOpen }) {
	const location = useLocation();
	const isChecklistsPage = location.pathname === '/checklists';
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
	const inputRef = useRef(null);
	const handleAccountClick = () => {
		if (!window.PPGC?.currentUser) {
			window.PPGC?.openAuthModal?.('login');
			return;
		}

		const currentState = window.PPGC?._storeRef?.state || store.state;
		if (currentState?.level && currentState.level !== 'account') {
			window.PPGC._lastNonAccountState = { ...currentState };
		}

		navigateToState({
			level: 'account',
			genKey: null,
			gameKey: null,
			sectionId: null,
			accountTab: 'general',
			monInfoId: null,
			monInfoGameKey: null,
			monInfoForm: null,
		});
	};

	useEffect(() => {
		document.body.classList.toggle('mobile-ui', isMobile);
		document.body.classList.toggle('mobile-nav-open', isMobile && mobileNavOpen);
		wireGlobalTaskSearch();
	}, [isMobile, mobileNavOpen]);

	useEffect(() => {
		if (!isMobile) {
			setMobileSearchOpen(false);
			return;
		}
		if (mobileSearchOpen) {
			window.requestAnimationFrame(() => inputRef.current?.focus());
		}
	}, [isMobile, mobileSearchOpen]);

	return (
		<header className="app-header">
			<div className="header-left">
				<div className="header-brand">
					<Link to="/" className="marketing-brand">
						<img src="/cloud-ball.png" alt="" className="brand-icon" />
						PokémonPGC
					</Link>
					<button
						type="button"
						className={`mobile-search-toggle ${mobileSearchOpen ? 'is-open' : ''}`}
						aria-label="Search tasks"
						aria-expanded={mobileSearchOpen ? 'true' : 'false'}
						onClick={() => setMobileSearchOpen((value) => !value)}
					>
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<circle cx="11" cy="11" r="6.5" />
							<path d="M16 16l5 5" />
						</svg>
					</button>
				</div>

				<PagesDropdown />
			</div>

			{isChecklistsPage && (
				<div className={`task-search-wrap ${isMobile ? 'task-search-mobile' : ''} ${mobileSearchOpen ? 'is-mobile-open' : ''}`}>
					<input
						ref={inputRef}
						id="taskSearchInput"
						className="task-search-input"
						type="search"
						placeholder="Search tasks…"
						autoComplete="off"
						autoCorrect="off"
						autoCapitalize="off"
						spellCheck="false"
						data-gramm="false"
						data-lpignore="true"
						data-1p-ignore="true"
						data-form-type="other"
					/>
					<div id="taskSearchResults" className="task-search-results" />
				</div>
			)}

			<div className="header-account">
				<button
					id="ppgc-account-button"
					type="button"
					aria-haspopup="dialog"
					aria-controls="ppgc-auth-overlay"
					title="Log in / Sign up"
					onClick={handleAccountClick}
				>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M12 11.5c1.93 0 3.5-1.79 3.5-4s-1.57-4-3.5-4-3.5 1.79-3.5 4 1.57 4 3.5 4zm0 2c-2.76 0-5.5 1.57-5.5 3.5V19h11v-2c0-1.93-2.74-3.5-5.5-3.5z" />
					</svg>
				</button>
				<div id="ppgc-account-menu" className="ppgc-account-menu" hidden>
					<button type="button" data-action="settings">Account settings</button>
					<button type="button" data-action="logout">Log out</button>
				</div>
			</div>

			<div className="breadcrumbs" id="crumbs" style={{ display: 'none' }} />
		</header>
	);
}

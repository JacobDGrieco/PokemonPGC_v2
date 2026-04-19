import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSubscription } from '../../hooks/useSubscription.js';
import { TIER_ORDER } from '../../config/tiers.js';

const PAGE_GROUPS = [
	{
		tier: 'free',
		label: 'Free',
		pages: [
			{ key: 'checklists', label: 'Checklists', path: '/checklists' },
		],
	},
	{
		tier: 'great',
		label: 'Great ($2)',
		pages: [
			{ key: 'pokemon-info', label: 'Pokémon Info', path: '/pokemon-info' },
		],
	},
	{
		tier: 'ultra',
		label: 'Ultra ($5)',
		pages: [
			{ key: 'guides', label: 'Guides', path: '/guides' },
			{ key: 'tools', label: 'Tools', path: '/tools' },
			{ key: 'global-stats', label: 'Global Stats', path: '/global-stats' },
		],
	},
	{
		tier: 'master',
		label: 'Master ($10)',
		pages: [
			{ key: 'model-viewer', label: 'Model Viewer', path: '/model-viewer' },
		],
	},
];

export function PagesDropdown() {
	const [open, setOpen] = useState(false);
	const { tierKey } = useSubscription();
	const location = useLocation();
	const navigate = useNavigate();
	const ref = useRef(null);

	useEffect(() => {
		const handleOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener('mousedown', handleOutside);
		return () => document.removeEventListener('mousedown', handleOutside);
	}, []);

	// Close on route change
	useEffect(() => { setOpen(false); }, [location.pathname]);

	return (
		<div className="pages-dropdown" ref={ref}>
			<button
				type="button"
				className={`pages-dropdown-trigger ${open ? 'is-open' : ''}`}
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-haspopup="true"
			>
				Pages ▾
			</button>

			{open && (
				<div className="pages-dropdown-menu">
					{PAGE_GROUPS.map((group) => {
						const groupRank = TIER_ORDER.indexOf(group.tier);
						const userRank = TIER_ORDER.indexOf(tierKey);
						const groupLocked = userRank < groupRank;

						return (
							<div key={group.tier} className="pages-dropdown-group">
								<div className="pages-dropdown-group-label">
									{group.label}
								</div>
								{group.pages.map((page) => {
									const isActive = location.pathname === page.path;
									const isLocked = groupLocked;
									return (
										<button
											key={page.key}
											type="button"
											className={`pages-dropdown-item${isActive ? ' is-active' : ''}${isLocked ? ' is-locked' : ''}`}
											onClick={() => navigate(isLocked ? '/pricing' : page.path)}
										>
											{isLocked && <span className="pages-dropdown-lock" aria-hidden="true">🔒</span>}
											{page.label}
										</button>
									);
								})}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

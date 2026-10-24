import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSubscription } from "../../hooks/useSubscription.js";
import { getFeatureNavigationGroups, TIER_ORDER } from "../../config/tiers.js";

const PAGE_GROUPS = getFeatureNavigationGroups();

export function PagesDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const { tierKey } = useSubscription();
	const location = useLocation();
	const navigate = useNavigate();
	const dropdownRef = useRef(null);
	const triggerRef = useRef(null);

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};
		const handleKeyDown = (event) => {
			if (event.key !== "Escape") return;
			setIsOpen(false);
			triggerRef.current?.focus();
		};
		document.addEventListener("pointerdown", handleOutsideClick);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("pointerdown", handleOutsideClick);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	useEffect(() => {
		setIsOpen(false);
	}, [location.pathname]);

	return (
		<div className="pages-dropdown" ref={dropdownRef}>
			<button
				ref={triggerRef}
				type="button"
				className={`pages-dropdown-trigger ${isOpen ? "is-open" : ""}`}
				onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
				aria-expanded={isOpen}
				aria-haspopup="menu"
				aria-controls="pages-dropdown-menu"
			>
				Pages ▾
			</button>

			{isOpen && (
				<div id="pages-dropdown-menu" className="pages-dropdown-menu">
					{PAGE_GROUPS.map((group) => {
						const groupRank = TIER_ORDER.indexOf(group.tier);
						const userRank = TIER_ORDER.indexOf(tierKey);
						const isGroupLocked = userRank < groupRank;

						return (
							<div
								key={group.tier}
								className="pages-dropdown-group"
							>
								<div className="pages-dropdown-group-label">
									{group.label}
								</div>
								{group.pages.map((page) => {
									const isActive =
										location.pathname === page.path;
									return (
										<button
											key={page.key}
											type="button"
											className={`pages-dropdown-item${isActive ? " is-active" : ""}${isGroupLocked ? " is-locked" : ""}`}
											onClick={() =>
												navigate(
													isGroupLocked
														? "/pricing"
														: page.path,
												)
											}
										>
											{isGroupLocked && (
												<span
													className="pages-dropdown-lock"
													aria-hidden="true"
												>
													🔒
												</span>
											)}
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

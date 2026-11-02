import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSubscription } from "../../hooks/useSubscription.js";
import { getFeatureNavigationGroups, TIER_ORDER } from "../../config/tiers.js";

const PAGE_GROUPS = getFeatureNavigationGroups();
const PAGE_DESTINATIONS = PAGE_GROUPS.flatMap((group) =>
	group.pages.map((page) => ({
		...page,
		accessLabel: group.label,
		accessTier: group.tier,
	})),
);

function PageIcon({ pageKey }) {
	switch (pageKey) {
		case "checklists":
			return (
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<rect x="5" y="4" width="14" height="17" rx="2" />
					<path d="M9 4V2.8h6V4M8.5 12l2.2 2.2 4.8-5" />
				</svg>
			);
		case "pokemon-info":
			return (
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<circle cx="12" cy="12" r="9" />
					<circle cx="12" cy="9" r="2.5" />
					<path d="M7.5 18c.8-3 2.3-4.5 4.5-4.5s3.7 1.5 4.5 4.5" />
				</svg>
			);
		case "guides":
			return (
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M4 5.5c3.2-.8 5.8-.2 8 1.8v12c-2.2-2-4.8-2.6-8-1.8v-12Z" />
					<path d="M20 5.5c-3.2-.8-5.8-.2-8 1.8v12c2.2-2 4.8-2.6 8-1.8v-12Z" />
				</svg>
			);
		case "tools":
			return (
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M14.5 6.4a4 4 0 0 0-5.2 5.2L3.8 17a2 2 0 1 0 2.8 2.8l5.5-5.5a4 4 0 0 0 5.2-5.2l-2.5 2.5-2.3-2.3 2-2.9Z" />
				</svg>
			);
		case "global-stats":
			return (
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="M4 20V10h4v10M10 20V4h4v16M16 20v-7h4v7M3 20h18" />
				</svg>
			);
		case "model-viewer":
			return (
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<path d="m12 2.8 8 4.6v9.2l-8 4.6-8-4.6V7.4l8-4.6Z" />
					<path d="m4.3 7.6 7.7 4.5 7.7-4.5M12 12.1v8.7" />
				</svg>
			);
		default:
			return (
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<circle cx="12" cy="12" r="8" />
				</svg>
			);
	}
}

/**
 * Opens the entitlement-aware page navigator from the centered Poke Ball.
 * Locked destinations remain discoverable and route to Pricing, matching the
 * previous dropdown contract.
 */
export function PagesDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const { tierKey } = useSubscription();
	const location = useLocation();
	const navigate = useNavigate();
	const dropdownRef = useRef(null);
	const menuRef = useRef(null);
	const triggerRef = useRef(null);
	const pendingFocusIndexRef = useRef(null);

	const focusMenuItem = useCallback((index) => {
		const menuItems =
			menuRef.current?.querySelectorAll('[role="menuitem"]');
		menuItems?.[index]?.focus();
	}, []);

	const openMenu = useCallback((focusIndex = 0) => {
		pendingFocusIndexRef.current = focusIndex;
		setIsOpen(true);
	}, []);

	const closeMenu = useCallback(({ restoreFocus = false } = {}) => {
		pendingFocusIndexRef.current = null;
		setIsOpen(false);
		if (restoreFocus) {
			window.requestAnimationFrame(() => triggerRef.current?.focus());
		}
	}, []);

	useEffect(() => {
		if (!isOpen || pendingFocusIndexRef.current === null) return undefined;

		const focusFrame = window.requestAnimationFrame(() => {
			focusMenuItem(pendingFocusIndexRef.current);
			pendingFocusIndexRef.current = null;
		});
		return () => window.cancelAnimationFrame(focusFrame);
	}, [focusMenuItem, isOpen]);

	useEffect(() => {
		if (!isOpen) return undefined;

		const handleOutsideClick = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				closeMenu();
			}
		};
		const handleKeyDown = (event) => {
			if (event.key !== "Escape") return;
			event.preventDefault();
			closeMenu({ restoreFocus: true });
		};
		document.addEventListener("pointerdown", handleOutsideClick);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("pointerdown", handleOutsideClick);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [closeMenu, isOpen]);

	useEffect(() => {
		setIsOpen(false);
	}, [location.pathname]);

	const handleMenuKeyDown = (event) => {
		const menuItems = Array.from(
			menuRef.current?.querySelectorAll('[role="menuitem"]') ?? [],
		);
		const currentIndex = menuItems.indexOf(document.activeElement);
		if (currentIndex < 0) return;

		const lastIndex = menuItems.length - 1;
		let nextIndex = currentIndex;
		switch (event.key) {
			case "ArrowRight":
				nextIndex =
					currentIndex === 0 || currentIndex === lastIndex
						? 1
						: currentIndex + 1;
				break;
			case "ArrowLeft":
				nextIndex = currentIndex <= 1 ? lastIndex : currentIndex - 1;
				break;
			case "ArrowDown":
				nextIndex = currentIndex === 0 ? 3 : currentIndex;
				break;
			case "ArrowUp":
				nextIndex = 0;
				break;
			case "Home":
				nextIndex = 0;
				break;
			case "End":
				nextIndex = lastIndex;
				break;
			default:
				return;
		}

		event.preventDefault();
		menuItems[nextIndex]?.focus();
	};

	const userRank = TIER_ORDER.indexOf(tierKey);

	return (
		<div
			className="pages-dropdown"
			ref={dropdownRef}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget))
					closeMenu();
			}}
		>
			<button
				ref={triggerRef}
				type="button"
				className={`pages-dropdown-trigger ${isOpen ? "is-open" : ""}`}
				onClick={() => (isOpen ? closeMenu() : openMenu(0))}
				onKeyDown={(event) => {
					if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
						return;
					}
					event.preventDefault();
					openMenu(
						event.key === "ArrowUp" ? PAGE_DESTINATIONS.length : 0,
					);
				}}
				aria-label={
					isOpen ? "Close page navigator" : "Open page navigator"
				}
				aria-expanded={isOpen}
				aria-haspopup="menu"
				aria-controls="pages-dropdown-menu"
			>
				<span
					className="pages-dropdown-trigger-ball"
					aria-hidden="true"
				>
					<span className="pages-dropdown-trigger-center" />
				</span>
			</button>

			<div
				ref={menuRef}
				id="pages-dropdown-menu"
				className={`pages-dropdown-menu ${isOpen ? "is-open" : ""}`}
				role="menu"
				aria-label="Pages"
				aria-hidden={!isOpen}
				inert={isOpen ? undefined : ""}
				onKeyDown={handleMenuKeyDown}
			>
				<Link
					to="/"
					className={`pages-dropdown-home${location.pathname === "/" ? " is-active" : ""}`}
					role="menuitem"
					tabIndex={-1}
					aria-label="Home"
					aria-current={
						location.pathname === "/" ? "page" : undefined
					}
					data-label="Home"
					title="Home"
					onClick={() => closeMenu()}
				>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M3.5 11.2 12 4l8.5 7.2" />
						<path d="M5.8 10.2V20h12.4v-9.8M9.5 20v-5.8h5V20" />
					</svg>
				</Link>
				<div className="pages-dropdown-grid">
					{PAGE_DESTINATIONS.map((page) => {
						const isActive = location.pathname === page.path;
						const groupRank = TIER_ORDER.indexOf(page.accessTier);
						const isLocked = userRank < groupRank;

						return (
							<button
								key={page.key}
								type="button"
								role="menuitem"
								tabIndex={-1}
								className={`pages-dropdown-item${isActive ? " is-active" : ""}${isLocked ? " is-locked" : ""}`}
								aria-current={isActive ? "page" : undefined}
								data-label={page.label}
								title={page.label}
								aria-label={
									isLocked
										? `${page.label}, requires ${page.accessLabel}`
										: page.label
								}
								onClick={() => {
									closeMenu();
									navigate(isLocked ? "/pricing" : page.path);
								}}
							>
								<PageIcon pageKey={page.key} />
								{isLocked && (
									<span
										className="pages-dropdown-lock"
										aria-hidden="true"
									>
										<svg viewBox="0 0 24 24">
											<rect
												x="5"
												y="10"
												width="14"
												height="10"
												rx="2"
											/>
											<path d="M8 10V7a4 4 0 0 1 8 0v3" />
										</svg>
									</span>
								)}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

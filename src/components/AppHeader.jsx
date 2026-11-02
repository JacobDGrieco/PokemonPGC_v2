import React, { useEffect, useRef, useState } from "react";
import { store } from "../store.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HeaderPageNavigation } from "./nav/HeaderPageNavigation.jsx";
import { wireGlobalTaskSearch } from "../ui/taskSearch.js";
import { buildAccountRoute } from "../utils/accountRoute.js";
import { AccountMenuControl } from "./nav/AccountMenuControl.jsx";

export function AppHeader({
	headerRef,
	isMobile,
	mobileNavOpen,
	setMobileNavOpen,
	mobileNavTriggerRef,
	canOpenNavigation,
}) {
	const location = useLocation();
	const navigate = useNavigate();
	const isChecklistsPage = location.pathname === "/checklists";
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
	const inputRef = useRef(null);
	const handleAuthenticatedAccountClick = () => {
		const currentState = window.PPGC?._storeRef?.state || store.state;
		if (currentState?.level && currentState.level !== "account") {
			window.PPGC._lastNonAccountState = { ...currentState };
		}

		navigate(buildAccountRoute("general"));
	};

	useEffect(() => {
		wireGlobalTaskSearch();
	}, []);

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
		<header ref={headerRef} className="app-header">
			<div className="header-left">
				{canOpenNavigation && (
					<button
						ref={mobileNavTriggerRef}
						type="button"
						className="mobile-nav-toggle"
						aria-label={
							mobileNavOpen
								? "Close checklist navigation"
								: "Open checklist navigation"
						}
						aria-controls="sidebar"
						aria-expanded={mobileNavOpen}
						onClick={() => setMobileNavOpen?.((isOpen) => !isOpen)}
					>
						<span aria-hidden="true" />
						<span aria-hidden="true" />
						<span aria-hidden="true" />
					</button>
				)}
				<div className="header-brand">
					<Link
						to="/checklists"
						className="marketing-brand"
						aria-label="Open Checklists"
					>
						<img
							src="/cloud-ball-48.webp"
							srcSet="/cloud-ball-48.webp 1x, /cloud-ball-96.webp 2x"
							alt=""
							className="brand-icon"
							width="24"
							height="24"
						/>
						PokémonPGC
					</Link>
					{isChecklistsPage && (
						<button
							type="button"
							className={`mobile-search-toggle ${mobileSearchOpen ? "is-open" : ""}`}
							aria-label="Search tasks"
							aria-expanded={mobileSearchOpen ? "true" : "false"}
							onClick={() =>
								setMobileSearchOpen((value) => !value)
							}
						>
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<circle cx="11" cy="11" r="6.5" />
								<path d="M16 16l5 5" />
							</svg>
						</button>
					)}
				</div>
			</div>

			<HeaderPageNavigation />

			<div className="header-actions">
				{isChecklistsPage && (
					<div
						className={`task-search-wrap ${isMobile ? "task-search-mobile" : ""} ${mobileSearchOpen ? "is-mobile-open" : ""}`}
					>
						<label
							className="visually-hidden"
							htmlFor="taskSearchInput"
						>
							Search checklist tasks
						</label>
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
						<div
							id="taskSearchResults"
							className="task-search-results"
						/>
					</div>
				)}

				<AccountMenuControl
					onAuthenticatedClick={handleAuthenticatedAccountClick}
				/>
			</div>

			<div
				className="breadcrumbs"
				id="crumbs"
				style={{ display: "none" }}
			/>
		</header>
	);
}

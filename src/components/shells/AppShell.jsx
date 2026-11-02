import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { store } from "../../store.js";
import { AppHeader } from "../AppHeader.jsx";
import { AppSidebar } from "../AppSidebar.jsx";
import { AppModals } from "../AppModals.jsx";
import { ReactContentRouter } from "../content/ReactContentRouter.jsx";
import { usePpgcSnapshot } from "../../react-bridge/usePpgcSnapshot.js";

export function AppShell({ children, routeLevelOverride = null }) {
	const snapshot = usePpgcSnapshot();
	const routeLevel =
		routeLevelOverride ||
		snapshot?.state?.level ||
		store.state?.level ||
		"gen";
	const [isMobile, setIsMobile] = useState(
		() => window.matchMedia("(max-width: 900px)").matches,
	);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const [headerHeight, setHeaderHeight] = useState(56);
	const [announcement, setAnnouncement] = useState({ id: 0, message: "" });
	const headerRef = useRef(null);
	const mobileNavTriggerRef = useRef(null);
	const sidebarRef = useRef(null);
	const wasMobileNavOpenRef = useRef(false);

	useEffect(() => {
		window.PPGC = window.PPGC || {};
		const announceStatus = (message) => {
			const text = String(message || "").trim();
			if (!text) return;
			setAnnouncement({ id: Date.now(), message: text });
		};
		window.PPGC.announceStatus = announceStatus;
		return () => {
			if (window.PPGC?.announceStatus === announceStatus)
				delete window.PPGC.announceStatus;
		};
	}, []);

	useEffect(() => {
		const media = window.matchMedia("(max-width: 900px)");
		const sync = () => {
			const nextIsMobile = media.matches;
			setIsMobile(nextIsMobile);
			if (!nextIsMobile) setMobileNavOpen(false);
		};
		sync();
		media.addEventListener("change", sync);
		return () => media.removeEventListener("change", sync);
	}, []);

	useLayoutEffect(() => {
		const header = headerRef.current;
		if (!header) return undefined;

		const updateHeaderHeight = () =>
			setHeaderHeight(Math.ceil(header.getBoundingClientRect().height));
		updateHeaderHeight();

		const observer = new ResizeObserver(updateHeaderHeight);
		observer.observe(header);
		return () => observer.disconnect();
	}, []);

	const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

	useEffect(() => {
		document.body.classList.toggle("mobile-ui", isMobile);
		document.body.classList.toggle(
			"mobile-nav-open",
			isMobile && mobileNavOpen,
		);

		return () => {
			document.body.classList.remove("mobile-ui", "mobile-nav-open");
		};
	}, [isMobile, mobileNavOpen]);

	useEffect(() => {
		const isOpen = isMobile && mobileNavOpen;
		if (!isOpen) {
			if (wasMobileNavOpenRef.current) {
				window.requestAnimationFrame(() =>
					mobileNavTriggerRef.current?.focus(),
				);
			}
			wasMobileNavOpenRef.current = false;
			return undefined;
		}

		wasMobileNavOpenRef.current = true;
		const sidebar = sidebarRef.current;
		const focusableSelector =
			'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
		const focusFrame = window.requestAnimationFrame(() => {
			sidebar?.querySelector(focusableSelector)?.focus();
		});
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				closeMobileNav();
				return;
			}
			if (event.key !== "Tab" || !sidebar) return;

			const focusableElements = Array.from(
				sidebar.querySelectorAll(focusableSelector),
			);
			if (!focusableElements.length) return;
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];
			if (
				event.shiftKey &&
				(document.activeElement === firstElement ||
					!sidebar.contains(document.activeElement))
			) {
				event.preventDefault();
				lastElement.focus();
			} else if (
				!event.shiftKey &&
				(document.activeElement === lastElement ||
					!sidebar.contains(document.activeElement))
			) {
				event.preventDefault();
				firstElement.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			window.cancelAnimationFrame(focusFrame);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [closeMobileNav, isMobile, mobileNavOpen]);

	const isDesktopCollapsed = !!store.state?.sidebarCollapsed;
	const isMobileNavOpen = isMobile && mobileNavOpen;

	return (
		<div
			className="app-shell"
			style={{ "--app-header-h": `${headerHeight}px` }}
			data-task-density={
				store.state?.taskDensity === "comfortable"
					? "comfortable"
					: "compact"
			}
		>
			<AppHeader
				headerRef={headerRef}
				isMobile={isMobile}
				mobileNavOpen={mobileNavOpen}
				setMobileNavOpen={setMobileNavOpen}
				mobileNavTriggerRef={mobileNavTriggerRef}
				canOpenNavigation={routeLevel !== "account"}
			/>
			<div
				key={announcement.id}
				className="visually-hidden"
				role="status"
				aria-live="polite"
				aria-atomic="true"
			>
				{announcement.message}
			</div>
			<div className="app" data-route-level={routeLevel}>
				<AppSidebar
					sidebarRef={sidebarRef}
					isMobile={isMobile}
					mobileNavOpen={mobileNavOpen}
					setMobileNavOpen={setMobileNavOpen}
					closeMobileNav={closeMobileNav}
				/>
				<button
					type="button"
					className="app-scrim"
					aria-label="Close navigation"
					aria-hidden={isMobileNavOpen ? "false" : "true"}
					tabIndex={isMobileNavOpen ? 0 : -1}
					onClick={closeMobileNav}
				/>
				<main
					id="content"
					className="content"
					inert={isMobileNavOpen ? "" : undefined}
					aria-hidden={isMobileNavOpen ? "true" : undefined}
					onClick={() => {
						if (isMobile && mobileNavOpen) closeMobileNav();
					}}
					data-sidebar-collapsed={
						!isMobile && isDesktopCollapsed ? "true" : "false"
					}
				>
					{children ?? <ReactContentRouter />}
				</main>
			</div>
			<AppModals />
		</div>
	);
}

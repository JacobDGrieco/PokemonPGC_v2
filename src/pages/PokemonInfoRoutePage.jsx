/**
 * Initializes the legacy navigation state for the dedicated Pokemon Info URL,
 * then returns control to the shared app shell and content router.
 */
import { useEffect, useState } from "react";
import { AppShell } from "../components/shells/AppShell.jsx";
import { navigateToToolsInfo } from "../react-bridge/navigation.js";
import { usePpgcSnapshot } from "../react-bridge/usePpgcSnapshot.js";

export function PokemonInfoRoutePage() {
	const snapshot = usePpgcSnapshot();
	const level = snapshot?.state?.level;
	const [hasInitializedRoute, setHasInitializedRoute] = useState(
		() => level === "tools" || level === "moninfo",
	);

	useEffect(() => {
		if (hasInitializedRoute) return undefined;
		let isCancelled = false;
		let retryId = null;

		const initializeRoute = () => {
			if (isCancelled) return;
			if (window.PPGC?.navigateToState) {
				navigateToToolsInfo();
				return;
			}
			retryId = window.setTimeout(initializeRoute, 50);
		};
		initializeRoute();

		return () => {
			isCancelled = true;
			if (retryId != null) window.clearTimeout(retryId);
		};
	}, [hasInitializedRoute]);

	useEffect(() => {
		if (level === "tools" || level === "moninfo") {
			setHasInitializedRoute(true);
		}
	}, [level]);

	return (
		<AppShell
			routeLevelOverride={level === "moninfo" ? "moninfo" : "tools"}
		>
			{hasInitializedRoute ? undefined : (
				<div className="react-loading-state">Loading Pokemon Info…</div>
			)}
		</AppShell>
	);
}

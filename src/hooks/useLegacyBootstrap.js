import { useEffect } from "react";

/** Load the imperative runtime immediately for app routes and during idle time for marketing. */
export function useLegacyBootstrap({ immediate = false } = {}) {
	useEffect(() => {
		let cancelled = false;

		async function boot() {
			if (window.__PPGC_LEGACY_BOOTSTRAPPED__ || cancelled) return;
			window.__PPGC_LEGACY_BOOTSTRAPPED__ = true;

			try {
				await import("../index.js");
			} catch (error) {
				console.error("Legacy bootstrap failed:", error);
			}
		}

		let timeoutId = null;
		let idleCallbackId = null;
		if (immediate || typeof window.requestIdleCallback !== "function") {
			timeoutId = window.setTimeout(boot, immediate ? 0 : 250);
		} else {
			idleCallbackId = window.requestIdleCallback(boot, {
				timeout: 1500,
			});
		}

		return () => {
			cancelled = true;
			if (timeoutId != null) window.clearTimeout(timeoutId);
			if (idleCallbackId != null)
				window.cancelIdleCallback(idleCallbackId);
		};
	}, [immediate]);
}

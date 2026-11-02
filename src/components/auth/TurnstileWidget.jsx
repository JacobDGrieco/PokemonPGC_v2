import React, { useEffect, useRef, useState } from "react";

const TURNSTILE_SCRIPT_ID = "ppgc-turnstile-script";
const TURNSTILE_SCRIPT_URL =
	"https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";
let turnstileScriptPromise = null;

function isLocalHostname(hostname) {
	return ["localhost", "127.0.0.1", "0.0.0.0"].includes(hostname);
}

export function getTurnstileSiteKey() {
	const configuredKey = String(
		import.meta.env.VITE_TURNSTILE_SITE_KEY || "",
	).trim();
	if (configuredKey) return configuredKey;
	if (
		typeof window !== "undefined" &&
		isLocalHostname(window.location.hostname)
	) {
		return TURNSTILE_TEST_SITE_KEY;
	}
	return "";
}

function loadTurnstileScript() {
	if (globalThis.turnstile) return Promise.resolve(globalThis.turnstile);
	if (turnstileScriptPromise) return turnstileScriptPromise;

	turnstileScriptPromise = new Promise((resolve, reject) => {
		let script = document.getElementById(TURNSTILE_SCRIPT_ID);
		const isNewScript = !script;
		const handleLoad = () => {
			if (globalThis.turnstile) {
				resolve(globalThis.turnstile);
			} else {
				script.remove();
				turnstileScriptPromise = null;
				reject(new Error("Turnstile API did not initialize."));
			}
		};
		const handleError = () => {
			script.remove();
			turnstileScriptPromise = null;
			reject(new Error("Turnstile API could not be loaded."));
		};

		if (isNewScript) {
			script = document.createElement("script");
			script.id = TURNSTILE_SCRIPT_ID;
			script.src = TURNSTILE_SCRIPT_URL;
			script.defer = true;
		}
		script.addEventListener("load", handleLoad, { once: true });
		script.addEventListener("error", handleError, { once: true });
		if (isNewScript) document.head.appendChild(script);
	});

	return turnstileScriptPromise;
}

/**
 * Explicitly rendered widget for the dynamic auth modal. Tokens are surfaced
 * only to the owning form and reset after every server attempt.
 */
export function TurnstileWidget({ action, onTokenChange, resetKey }) {
	const containerRef = useRef(null);
	const widgetIdRef = useRef(null);
	const onTokenChangeRef = useRef(onTokenChange);
	const [state, setState] = useState("loading");
	const siteKey = getTurnstileSiteKey();

	useEffect(() => {
		onTokenChangeRef.current = onTokenChange;
	}, [onTokenChange]);

	useEffect(() => {
		let isDisposed = false;
		let renderedWidgetId = null;
		onTokenChangeRef.current("");
		setState("loading");

		if (!siteKey) {
			setState("unavailable");
			return undefined;
		}

		loadTurnstileScript()
			.then((turnstile) => {
				if (isDisposed || !containerRef.current) return;
				renderedWidgetId = turnstile.render(containerRef.current, {
					sitekey: siteKey,
					action,
					theme: "auto",
					size: "flexible",
					appearance: "interaction-only",
					callback: (token) => {
						setState("verified");
						onTokenChangeRef.current(String(token || ""));
					},
					"expired-callback": () => {
						setState("expired");
						onTokenChangeRef.current("");
					},
					"timeout-callback": () => {
						setState("expired");
						onTokenChangeRef.current("");
					},
					"error-callback": () => {
						setState("error");
						onTokenChangeRef.current("");
					},
				});
				widgetIdRef.current = renderedWidgetId;
			})
			.catch(() => {
				if (!isDisposed) setState("error");
			});

		return () => {
			isDisposed = true;
			if (renderedWidgetId != null && globalThis.turnstile) {
				globalThis.turnstile.remove(renderedWidgetId);
			}
			widgetIdRef.current = null;
		};
	}, [action, siteKey]);

	useEffect(() => {
		if (widgetIdRef.current == null || !globalThis.turnstile) return;
		globalThis.turnstile.reset(widgetIdRef.current);
		onTokenChangeRef.current("");
		setState("loading");
	}, [resetKey]);

	const statusMessage =
		state === "unavailable"
			? "Bot verification is not configured for this site."
			: state === "error"
				? "Bot verification could not load. Refresh and try again."
				: state === "expired"
					? "Bot verification expired. Complete it again."
					: state === "verified"
						? "Bot verification complete."
						: "Checking this browser…";

	return (
		<div className="ppgc-turnstile">
			<div ref={containerRef} className="ppgc-turnstile-widget" />
			<p
				className={`ppgc-turnstile-status is-${state}`}
				role={
					state === "error" || state === "unavailable"
						? "alert"
						: "status"
				}
				aria-live="polite"
			>
				{statusMessage}
			</p>
		</div>
	);
}

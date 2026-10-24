/** Development-only diagnostics that are removed from production execution. */
export function debugLog(...messages) {
	if (import.meta.env.DEV) console.log(...messages);
}

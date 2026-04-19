export const ACCOUNT_TABS = ['general', 'subscription', 'backup', 'import'];

export function normalizeAccountTab(tab) {
	const value = String(tab || '').trim().toLowerCase();
	return ACCOUNT_TABS.includes(value) ? value : 'general';
}

export function buildAccountRoute(tab = 'general') {
	return `/account/${encodeURIComponent(normalizeAccountTab(tab))}`;
}

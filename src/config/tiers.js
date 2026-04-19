// Ordered from lowest to highest
export const TIER_ORDER = ['free', 'great', 'ultra', 'master'];

export const TIERS = {
	free: {
		key: 'free',
		label: 'Free',
		price: '$0',
		features: ['checklists'],
	},
	great: {
		key: 'great',
		label: 'Great',
		price: '$2/mo',
		features: ['checklists', 'pokemon-info', 'tooltips', 'battle-cards'],
	},
	ultra: {
		key: 'ultra',
		label: 'Ultra',
		price: '$5/mo',
		features: [
			'checklists', 'pokemon-info', 'tooltips', 'battle-cards',
			'guides', 'tools', 'global-stats',
		],
	},
	master: {
		key: 'master',
		label: 'Master',
		price: '$10/mo',
		features: [
			'checklists', 'pokemon-info', 'tooltips', 'battle-cards',
			'guides', 'tools', 'global-stats',
			'model-viewer', 'save-importing',
		],
	},
};

// Status of each feature for the pricing table
export const FEATURE_STATUS = {
	checklists: 'done',
	tooltips: 'wip',
	'battle-cards': 'planned',
	'pokemon-info': 'wip',
	guides: 'planned',
	tools: 'planned',
	'global-stats': 'planned',
	'model-viewer': 'wip',
	'save-importing': 'wip',
};

export const FEATURE_LABELS = {
	checklists: 'Checklists',
	tooltips: 'Tooltips',
	'battle-cards': 'Battle Cards',
	'pokemon-info': 'Pokémon Info',
	guides: 'Guides',
	tools: 'Tools',
	'global-stats': 'Global Stats',
	'model-viewer': 'Model Viewer',
	'save-importing': 'Save Importing',
};

// Features that have their own route
export const FEATURE_ROUTES = {
	checklists: '/checklists',
	'pokemon-info': '/pokemon-info',
	guides: '/guides',
	tools: '/tools',
	'global-stats': '/global-stats',
	'model-viewer': '/model-viewer',
};

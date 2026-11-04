// Ordered from lowest to highest
export const TIER_ORDER = ["free", "great", "ultra", "master"];

const SUPPORTER_FEATURES = Object.freeze([
	"checklists",
	"pokemon-info",
	"tooltips",
	"battle-cards",
	"guides",
	"tools",
	"global-stats",
	"model-viewer",
	"save-importing",
]);

export const TIERS = {
	free: {
		key: "free",
		label: "Free",
		price: "$0",
		isPurchasable: false,
		features: ["checklists"],
		marketingBenefits: [
			"Core game checklists",
			"Local progress tracking",
			"No payment required",
		],
	},
	great: {
		key: "great",
		label: "Great",
		price: "$5/mo",
		isPurchasable: true,
		features: SUPPORTER_FEATURES,
		marketingBenefits: [
			"Full supporter access",
			"Monthly billing",
			"New features as they release",
		],
	},
	ultra: {
		key: "ultra",
		label: "Ultra",
		price: "$50/yr",
		isPurchasable: true,
		features: SUPPORTER_FEATURES,
		marketingBenefits: [
			"Full supporter access",
			"Annual billing",
			"Two months free",
		],
	},
	master: {
		key: "master",
		label: "Master",
		price: "$100 lifetime",
		isPurchasable: false,
		availabilityMessage: "Will enable when more features are implemented.",
		features: SUPPORTER_FEATURES,
		marketingBenefits: [
			"Lifetime supporter option",
			"Reserved for a later release",
			"More features required before launch",
		],
	},
};

// Status of each feature for the pricing table
export const FEATURE_STATUS = {
	checklists: "done",
	tooltips: "wip",
	"battle-cards": "planned",
	"pokemon-info": "done",
	guides: "planned",
	tools: "planned",
	"global-stats": "planned",
	"model-viewer": "wip",
	"save-importing": "wip",
};

export const FEATURE_LABELS = {
	checklists: "Checklists",
	tooltips: "Tooltips",
	"battle-cards": "Battle Cards",
	"pokemon-info": "Pokémon Info",
	guides: "Guides",
	tools: "Tools",
	"global-stats": "Global Stats",
	"model-viewer": "Model Viewer",
	"save-importing": "Save Importing",
};

// Features that have their own route
export const FEATURE_ROUTES = {
	checklists: "/checklists",
	"pokemon-info": "/pokemon-info",
	guides: "/guides",
	tools: "/tools",
	"global-stats": "/global-stats",
	"model-viewer": "/model-viewer",
};

/**
 * Navigation metadata is derived from entitlements so route menus and
 * marketing surfaces cannot drift from the tiers that unlock them.
 */
export const FEATURE_NAVIGATION = Object.freeze(
	TIER_ORDER.flatMap((tierKey) =>
		TIERS[tierKey].features
			.filter((featureKey) => FEATURE_ROUTES[featureKey])
			.filter(
				(featureKey) =>
					!TIER_ORDER.slice(0, TIER_ORDER.indexOf(tierKey)).some(
						(earlierTierKey) =>
							TIERS[earlierTierKey].features.includes(featureKey),
					),
			)
			.map((featureKey) => ({
				key: featureKey,
				label: FEATURE_LABELS[featureKey],
				path: FEATURE_ROUTES[featureKey],
				minTier: tierKey,
			})),
	),
);

export function getFeatureNavigationGroups() {
	return TIER_ORDER.map((tierKey) => {
		const tier = TIERS[tierKey];
		const priceLabel =
			tier.price === "$0"
				? ""
				: ` (${tier.price.replace(/\/(?:mo|yr)$/, "")})`;
		return {
			tier: tierKey,
			label: `${tier.label}${priceLabel}`,
			pages: FEATURE_NAVIGATION.filter(
				(feature) => feature.minTier === tierKey,
			),
		};
	}).filter((group) => group.pages.length > 0);
}

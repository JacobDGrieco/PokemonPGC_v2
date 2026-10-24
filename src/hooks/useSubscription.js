import { useState, useEffect } from "react";
import { TIERS, TIER_ORDER } from "../config/tiers.js";

function getCurrentTierKey() {
	const user = window.PPGC?.currentUser;
	if (!user) return "free";
	return TIER_ORDER.includes(user.tier) ? user.tier : "free";
}

export function useSubscription() {
	const [tierKey, setTierKey] = useState(getCurrentTierKey);
	const [user, setUser] = useState(() => window.PPGC?.currentUser || null);

	useEffect(() => {
		const refresh = () => {
			setUser(window.PPGC?.currentUser || null);
			setTierKey(getCurrentTierKey());
		};
		window.addEventListener("ppgc:auth:changed", refresh);
		return () => window.removeEventListener("ppgc:auth:changed", refresh);
	}, []);

	const tier = TIERS[tierKey] ?? TIERS.free;

	function hasFeature(featureKey) {
		return tier.features.includes(featureKey);
	}

	function tierRank(key) {
		return TIER_ORDER.indexOf(key);
	}

	function meetsMinTier(minTierKey) {
		return tierRank(tierKey) >= tierRank(minTierKey);
	}

	return { tierKey, tier, user, hasFeature, meetsMinTier };
}

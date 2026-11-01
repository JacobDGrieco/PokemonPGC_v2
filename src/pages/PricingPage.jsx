import React, { useEffect, useState } from "react";
import {
	changeStripeSubscriptionPlan,
	createPayPalSubscription,
	createStripeCheckoutSession,
	createStripePortalSession,
	getSubscriptionDetails,
} from "../../api.js";
import {
	TIERS,
	FEATURE_STATUS,
	FEATURE_LABELS,
	TIER_ORDER,
} from "../config/tiers.js";
import { PAYMENT_PROVIDER_AVAILABILITY } from "../config/paymentProviders.js";
import { useSubscription } from "../hooks/useSubscription.js";
import { FaStripeS, FaPaypal } from "react-icons/fa";
import "../../styles/pricing.css";

const TIER_KEYS = ["free", "great", "ultra", "master"];

const TIER_TAGLINES = {
	free: "Start here",
	great: "Monthly supporter",
	ultra: "Annual supporter",
	master: "Coming later",
};

const ALL_FEATURES = [
	"checklists",
	"tooltips",
	"battle-cards",
	"pokemon-info",
	"guides",
	"tools",
	"global-stats",
	"model-viewer",
	"save-importing",
];

const STATUS_DISPLAY = {
	done: { label: "Done", className: "status-done" },
	wip: { label: "WIP", className: "status-wip" },
	planned: { label: "Planned", className: "status-planned" },
};

function syncAuthenticatedUser(user) {
	if (!user) return;
	window.PPGC = window.PPGC || {};
	window.PPGC.currentUser = user;
	window.PPGC?.setAccountButtonIcon?.(user.icon || "default");
	window.PPGC?.api?.setApiCurrentUser?.(user);
	window.dispatchEvent(new CustomEvent("ppgc:auth:changed"));
}

function formatPlanChangeDate(value) {
	if (!value) return "the end of the current paid period";
	return new Date(value).toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function formatComplimentaryExpiration(value) {
	return value ? formatPlanChangeDate(value) : "does not expire";
}

export function PricingPage() {
	const { tierKey, user } = useSubscription();
	const [busyAction, setBusyAction] = useState("");
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const [stripeDetails, setStripeDetails] = useState(null);

	const hasPaidPlan = tierKey !== "free";
	const complimentaryAccess = user?.complimentaryAccess || null;
	const tierRank = TIER_ORDER.indexOf(tierKey);
	const pendingTier = stripeDetails?.pendingTier || null;

	useEffect(() => {
		let cancelled = false;
		if (user?.subscriptionProvider !== "stripe") {
			setStripeDetails(null);
			return undefined;
		}

		getSubscriptionDetails("stripe")
			.then((response) => {
				if (!cancelled) setStripeDetails(response?.details || null);
			})
			.catch((loadError) => {
				if (!cancelled) {
					setError(
						loadError?.message ||
							"Failed to load current plan details.",
					);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [user?.id, user?.subscriptionProvider, tierKey]);

	async function runAction(actionKey, fn) {
		setBusyAction(actionKey);
		setError("");
		setNotice("");

		try {
			await fn();
		} catch (err) {
			setError(err?.message || "Something went wrong.");
		} finally {
			setBusyAction("");
		}
	}

	async function handleStripeCheckout(nextTierKey) {
		if (!user) {
			window.PPGC?.openAuthModal?.("login");
			return;
		}

		await runAction(`stripe:${nextTierKey}`, async () => {
			const result = await createStripeCheckoutSession(nextTierKey);
			if (!result?.url) {
				throw new Error("Stripe did not return a checkout URL.");
			}
			window.location.assign(result.url);
		});
	}

	async function handlePayPalCheckout(nextTierKey) {
		if (!user) {
			window.PPGC?.openAuthModal?.("login");
			return;
		}

		await runAction(`paypal:${nextTierKey}`, async () => {
			const result = await createPayPalSubscription(nextTierKey);
			if (!result?.url) {
				throw new Error("PayPal did not return an approval URL.");
			}
			if (result.subscriptionId) {
				sessionStorage.setItem(
					"ppgc:paypal:pending-subscription",
					JSON.stringify({
						subscriptionId: result.subscriptionId,
						tier: nextTierKey,
					}),
				);
			}
			window.location.assign(result.url);
		});
	}

	async function handleStripePlanChange(nextTierKey) {
		const isCancelingScheduledChange =
			nextTierKey === tierKey && !!pendingTier;
		const isDowngrade = TIER_ORDER.indexOf(nextTierKey) < tierRank;
		if (
			isCancelingScheduledChange &&
			!window.confirm(
				`Keep ${TIERS[tierKey].label} and cancel the scheduled change to ${TIERS[pendingTier].label}?`,
			)
		) {
			return;
		}
		if (
			isDowngrade &&
			!window.confirm(
				`Schedule ${TIERS[nextTierKey].label} for the end of the current paid period? You will keep ${TIERS[tierKey].label} until then.`,
			)
		) {
			return;
		}

		await runAction(`stripe:change:${nextTierKey}`, async () => {
			const result = await changeStripeSubscriptionPlan(nextTierKey);
			if (result?.url) {
				window.location.assign(result.url);
				return;
			}
			if (result?.user) syncAuthenticatedUser(result.user);
			if (result?.details) setStripeDetails(result.details);

			if (result?.changeType === "scheduled-downgrade") {
				setNotice(
					`${TIERS[nextTierKey].label} is scheduled for ${formatPlanChangeDate(result.details?.pendingChangeDate)}.`,
				);
			} else if (result?.changeType === "scheduled-change-canceled") {
				setNotice(`You will remain on ${TIERS[tierKey].label}.`);
			} else {
				setNotice(`Your plan is now ${TIERS[nextTierKey].label}.`);
			}
		});
	}

	async function handleStripePortal() {
		await runAction("stripe:portal", async () => {
			const result = await createStripePortalSession();
			if (!result?.url) {
				throw new Error("Stripe did not return a portal URL.");
			}
			window.location.assign(result.url);
		});
	}

	function renderSubscribeCell(key) {
		const isCurrent = key === tierKey;
		const actionDisabled = busyAction !== "";

		if (isCurrent) {
			if (complimentaryAccess) {
				return (
					<span className="pricing-plan-pill">Current access</span>
				);
			}
			if (hasPaidPlan && user?.subscriptionProvider === "stripe") {
				return (
					<button
						type="button"
						className="pricing-plan-pill pricing-current-plan-action"
						disabled={actionDisabled}
						aria-label="Cancel plan in Stripe"
						onClick={handleStripePortal}
					>
						{busyAction === "stripe:portal" ? (
							"Loading..."
						) : (
							<>
								<span className="pricing-current-plan-label">
									Current plan
								</span>
								<span className="pricing-cancel-plan-label">
									Cancel plan
								</span>
							</>
						)}
					</button>
				);
			}
			return <span className="pricing-plan-pill">Current plan</span>;
		}
		if (complimentaryAccess) {
			return <span className="pricing-free-label">Granted access</span>;
		}
		if (key !== "free" && !TIERS[key].isPurchasable) {
			return <span className="pricing-free-label">Coming later</span>;
		}

		if (hasPaidPlan) {
			if (user?.subscriptionProvider === "stripe") {
				if (pendingTier === key) {
					return (
						<button
							type="button"
							className="pricing-action-btn"
							disabled={actionDisabled}
							onClick={() => handleStripePlanChange(tierKey)}
						>
							{busyAction === `stripe:change:${tierKey}`
								? "Updating..."
								: "Cancel downgrade"}
						</button>
					);
				}
				const isUpgrade = TIER_ORDER.indexOf(key) > tierRank;
				return (
					<button
						type="button"
						className="pricing-action-btn"
						disabled={actionDisabled}
						onClick={() => handleStripePlanChange(key)}
					>
						{busyAction === `stripe:change:${key}`
							? "Updating..."
							: isUpgrade
								? "Upgrade now"
								: "Downgrade"}
					</button>
				);
			}
			return (
				<span className="pricing-free-label">Manage PayPal first</span>
			);
		}
		if (key === "free") {
			return <span className="pricing-free-label">-</span>;
		}
		if (
			!PAYMENT_PROVIDER_AVAILABILITY.stripe &&
			!PAYMENT_PROVIDER_AVAILABILITY.paypal
		) {
			return (
				<span className="pricing-free-label">Checkout unavailable</span>
			);
		}

		return (
			<div className="pricing-payment-btns">
				{PAYMENT_PROVIDER_AVAILABILITY.stripe ? (
					<button
						type="button"
						className="pricing-pay-btn pricing-pay-stripe"
						disabled={actionDisabled}
						aria-label={`Subscribe to ${TIERS[key].label} with Stripe`}
						onClick={() => handleStripeCheckout(key)}
					>
						{busyAction === `stripe:${key}` ? (
							"Loading..."
						) : (
							<FaStripeS />
						)}
					</button>
				) : null}
				{PAYMENT_PROVIDER_AVAILABILITY.paypal ? (
					<button
						type="button"
						className="pricing-pay-btn pricing-pay-paypal"
						disabled={actionDisabled}
						aria-label={`Subscribe to ${TIERS[key].label} with PayPal`}
						onClick={() => handlePayPalCheckout(key)}
					>
						{busyAction === `paypal:${key}` ? (
							"Loading..."
						) : (
							<FaPaypal />
						)}
					</button>
				) : null}
			</div>
		);
	}

	return (
		<div className="pricing-page">
			<h1 className="pricing-title">League Membership</h1>
			<div className="pricing-tier-cards">
				{TIER_KEYS.map((key) => {
					const tier = TIERS[key];
					const isCurrent = key === tierKey;
					const isUnavailable =
						!isCurrent && key !== "free" && !tier.isPurchasable;
					return (
						<div
							key={key}
							className={`pricing-tier-card${isCurrent ? " is-current" : ""}${isUnavailable ? " is-unavailable" : ""}`}
							data-tier={key}
							aria-disabled={isUnavailable || undefined}
						>
							<div className="ptc-ball" data-ball={key} />
							<div className="ptc-name">{tier.label}</div>
							<div className="ptc-tagline">
								{TIER_TAGLINES[key]}
							</div>
							<div className="ptc-price">{tier.price}</div>
							{isCurrent ? (
								<div className="ptc-badge">Your rank</div>
							) : null}
							{isUnavailable ? (
								<div className="ptc-unavailable-overlay">
									<strong>Coming later</strong>
									<span>{tier.availabilityMessage}</span>
								</div>
							) : null}
						</div>
					);
				})}
			</div>

			<div className="pricing-wip-banner">
				<strong>Still in development</strong>
				<p>
					PokemonPGC is actively growing. Some features listed here
					aren't fully shipped yet — subscribing now supports
					development and unlocks things as they release.
				</p>
			</div>
			<p className="pricing-payment-note">
				Checkout and payment details are handled by the selected payment
				provider. PokemonPGC never receives your card or wallet
				credentials.
			</p>
			{complimentaryAccess ? (
				<div className="pricing-alert pricing-alert--success">
					Your {TIERS[complimentaryAccess.tier]?.label || tierKey}{" "}
					access is complimentary and{" "}
					{formatComplimentaryExpiration(
						complimentaryAccess.expiresAt,
					)}
					. No payment is required for this access.
				</div>
			) : null}
			{pendingTier ? (
				<div className="pricing-alert pricing-alert--success">
					Your {TIERS[pendingTier].label} plan starts on{" "}
					{formatPlanChangeDate(stripeDetails?.pendingChangeDate)}.
					You keep {TIERS[tierKey].label} until then.
				</div>
			) : null}

			{error ? (
				<div className="pricing-alert pricing-alert--error">
					{error}
				</div>
			) : null}
			{notice ? (
				<div className="pricing-alert pricing-alert--success">
					{notice}
				</div>
			) : null}

			<p id="pricing-table-hint" className="pricing-table-hint">
				Swipe or scroll horizontally to compare every plan.
			</p>
			<div
				className="pricing-table-wrap"
				tabIndex={0}
				role="region"
				aria-label="Plan feature comparison"
				aria-describedby="pricing-table-hint"
			>
				<table className="pricing-table">
					<thead>
						<tr>
							<th className="pricing-feature-col">Feature</th>
							<th className="pricing-status-col">Status</th>
							{TIER_KEYS.map((key) => (
								<th
									key={key}
									className={`pricing-tier-col${key === tierKey ? " is-current" : ""}${key !== "free" && !TIERS[key].isPurchasable ? " is-unavailable" : ""}`}
								>
									<span className="pricing-tier-name">
										{TIERS[key].label}
									</span>
									<span className="pricing-tier-tagline">
										{TIER_TAGLINES[key]}
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr className="pricing-row pricing-row--price">
							<td>
								<strong>Price</strong>
							</td>
							<td />
							{TIER_KEYS.map((key) => (
								<td
									key={key}
									className={`pricing-tier-cell${key === tierKey ? " is-current" : ""}${key !== "free" && !TIERS[key].isPurchasable ? " is-unavailable" : ""}`}
								>
									<strong>{TIERS[key].price}</strong>
								</td>
							))}
						</tr>

						<tr className="pricing-row pricing-row--subscribe">
							<td>
								<strong>Subscribe</strong>
							</td>
							<td />
							{TIER_KEYS.map((key) => (
								<td
									key={key}
									className={`pricing-tier-cell${key === tierKey ? " is-current" : ""}${key !== "free" && !TIERS[key].isPurchasable ? " is-unavailable" : ""}`}
								>
									{renderSubscribeCell(key)}
								</td>
							))}
						</tr>

						{ALL_FEATURES.map((feature) => {
							const status = FEATURE_STATUS[feature] ?? "planned";
							const statusDisplay =
								STATUS_DISPLAY[status] ??
								STATUS_DISPLAY.planned;
							return (
								<tr key={feature} className="pricing-row">
									<td>
										{FEATURE_LABELS[feature] ?? feature}
									</td>
									<td>
										<span
											className={`pricing-status ${statusDisplay.className}`}
										>
											{statusDisplay.label}
										</span>
									</td>
									{TIER_KEYS.map((key) => {
										const included =
											TIERS[key].features.includes(
												feature,
											);
										return (
											<td
												key={key}
												className={`pricing-tier-cell${key === tierKey ? " is-current" : ""}${key !== "free" && !TIERS[key].isPurchasable ? " is-unavailable" : ""}`}
											>
												{included ? (
													<span className="pricing-check">
														✓
													</span>
												) : null}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

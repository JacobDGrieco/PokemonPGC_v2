import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	cancelPayPalSubscription,
	createPayPalSubscription,
	createStripeCheckoutSession,
	createStripePortalSession,
} from '../../api.js';
import { TIERS, FEATURE_STATUS, FEATURE_LABELS, TIER_ORDER } from '../config/tiers.js';
import { useSubscription } from '../hooks/useSubscription.js';

const TIER_KEYS = ['free', 'great', 'ultra', 'master'];

const TIER_TAGLINES = {
	free: 'Start here',
	great: 'Jump in',
	ultra: 'Go deep',
	master: 'Full access',
};

const ALL_FEATURES = [
	'checklists',
	'tooltips',
	'battle-cards',
	'pokemon-info',
	'guides',
	'tools',
	'global-stats',
	'model-viewer',
	'save-importing',
];

const STATUS_DISPLAY = {
	done: { label: 'Done', className: 'status-done' },
	wip: { label: 'WIP', className: 'status-wip' },
	planned: { label: 'Planned', className: 'status-planned' },
};

function getProviderMeta(user) {
	if (user?.subscriptionProvider === 'stripe') {
		return {
			label: 'Stripe',
			canManage: true,
			canCancel: false,
		};
	}

	if (user?.subscriptionProvider === 'paypal') {
		return {
			label: 'PayPal',
			canManage: false,
			canCancel: true,
		};
	}

	return {
		label: null,
		canManage: false,
		canCancel: false,
	};
}

export function PricingPage() {
	const { tierKey, user } = useSubscription();
	const [busyAction, setBusyAction] = useState('');
	const [error, setError] = useState('');
	const [notice, setNotice] = useState('');

	const providerMeta = useMemo(() => getProviderMeta(user), [user]);
	const hasPaidPlan = tierKey !== 'free';
	const tierRank = TIER_ORDER.indexOf(tierKey);

	async function runAction(actionKey, fn) {
		setBusyAction(actionKey);
		setError('');
		setNotice('');

		try {
			await fn();
		} catch (err) {
			setError(err?.message || 'Something went wrong.');
		} finally {
			setBusyAction('');
		}
	}

	async function handleStripeCheckout(nextTierKey) {
		if (!user) {
			window.PPGC?.openAuthModal?.('login');
			return;
		}

		await runAction(`stripe:${nextTierKey}`, async () => {
			const result = await createStripeCheckoutSession(nextTierKey);
			if (!result?.url) {
				throw new Error('Stripe did not return a checkout URL.');
			}
			window.location.assign(result.url);
		});
	}

	async function handlePayPalCheckout(nextTierKey) {
		if (!user) {
			window.PPGC?.openAuthModal?.('login');
			return;
		}

		await runAction(`paypal:${nextTierKey}`, async () => {
			const result = await createPayPalSubscription(nextTierKey);
			if (!result?.url) {
				throw new Error('PayPal did not return an approval URL.');
			}
			window.location.assign(result.url);
		});
	}

	async function handleStripePortal() {
		await runAction('stripe:portal', async () => {
			const result = await createStripePortalSession();
			if (!result?.url) {
				throw new Error('Stripe did not return a portal URL.');
			}
			window.location.assign(result.url);
		});
	}

	async function handlePayPalCancel() {
		await runAction('paypal:cancel', async () => {
			const result = await cancelPayPalSubscription();
			if (result?.user) {
				window.PPGC = window.PPGC || {};
				window.PPGC.currentUser = result.user;
				window.PPGC?.setAccountButtonIcon?.(result.user.icon || 'default');
				window.PPGC?.api?.setApiCurrentUser?.(result.user);
				window.dispatchEvent(new CustomEvent('ppgc:auth:changed'));
			}
			setNotice('Your PayPal subscription has been canceled.');
		});
	}

	function renderSubscribeCell(key) {
		if (key === 'free') {
			return <span className="pricing-free-label">-</span>;
		}

		const isCurrent = key === tierKey;
		const actionDisabled = busyAction !== '';
		const lockedByExistingPlan = hasPaidPlan;
		const isLowerOrCurrentTier = tierRank >= 0 && TIER_ORDER.indexOf(key) <= tierRank;

		if (isCurrent) {
			return <span className="pricing-plan-pill">Current plan</span>;
		}

		if (lockedByExistingPlan) {
			return <span className="pricing-free-label">{isLowerOrCurrentTier ? 'Included' : 'Use billing tools below'}</span>;
		}

		return (
			<div className="pricing-payment-btns">
				<button
					type="button"
					className="pricing-pay-btn pricing-pay-stripe"
					disabled={actionDisabled}
					onClick={() => handleStripeCheckout(key)}
				>
					{busyAction === `stripe:${key}` ? 'Loading...' : 'Stripe'}
				</button>
				<button
					type="button"
					className="pricing-pay-btn pricing-pay-paypal"
					disabled={actionDisabled}
					onClick={() => handlePayPalCheckout(key)}
				>
					{busyAction === `paypal:${key}` ? 'Loading...' : 'PayPal'}
				</button>
			</div>
		);
	}

	return (
		<div className="pricing-page">
			<div className="pricing-tier-cards">
				{TIER_KEYS.map((key) => {
					const tier = TIERS[key];
					const isCurrent = key === tierKey;
					return (
						<div
							key={key}
							className={`pricing-tier-card${isCurrent ? ' is-current' : ''}`}
							data-tier={key}
						>
							<div className="ptc-ball" data-ball={key} />
							<div className="ptc-name">{tier.label}</div>
							<div className="ptc-tagline">{TIER_TAGLINES[key]}</div>
							<div className="ptc-price">{tier.price}</div>
							{isCurrent ? <div className="ptc-badge">Your rank</div> : null}
						</div>
					);
				})}
			</div>

			<div className="pricing-wip-banner">
				<strong>Still in development</strong>
				<p>
					PokemonPGC is actively growing. Some features listed here aren't fully shipped yet —
					subscribing now supports development and unlocks things as they release.
				</p>
			</div>

			<h1 className="pricing-title">League Membership</h1>

			{user ? (
				<div className="pricing-account-banner">
					<div>
						<strong>{TIERS[tierKey]?.label || 'Free'} rank</strong>
						<p>
							{hasPaidPlan
								? `Billed through ${providerMeta.label || 'a payment provider'}.`
								: 'Upgrade your rank with Stripe or PayPal.'}
						</p>
					</div>
					<div className="pricing-account-actions">
						{providerMeta.canManage ? (
							<button
								type="button"
								className="pricing-action-btn"
								disabled={busyAction !== ''}
								onClick={handleStripePortal}
							>
								{busyAction === 'stripe:portal' ? 'Loading...' : 'Manage billing'}
							</button>
						) : null}
						{providerMeta.canCancel ? (
							<button
								type="button"
								className="pricing-action-btn pricing-action-btn--danger"
								disabled={busyAction !== ''}
								onClick={handlePayPalCancel}
							>
								{busyAction === 'paypal:cancel' ? 'Canceling...' : 'Cancel PayPal'}
							</button>
						) : null}
					</div>
				</div>
			) : (
				<div className="pricing-inline-note">
					Sign in before subscribing so the payment links to your trainer account automatically.
				</div>
			)}

			{error ? <div className="pricing-alert pricing-alert--error">{error}</div> : null}
			{notice ? <div className="pricing-alert pricing-alert--success">{notice}</div> : null}

			<div className="pricing-table-wrap">
				<table className="pricing-table">
					<thead>
						<tr>
							<th className="pricing-feature-col">Feature</th>
							<th className="pricing-status-col">Status</th>
							{TIER_KEYS.map((key) => (
								<th key={key} className={`pricing-tier-col${key === tierKey ? ' is-current' : ''}`}>
									<span className="pricing-tier-name">{TIERS[key].label}</span>
									<span className="pricing-tier-tagline">{TIER_TAGLINES[key]}</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr className="pricing-row pricing-row--price">
							<td><strong>Price</strong></td>
							<td />
							{TIER_KEYS.map((key) => (
								<td key={key} className={`pricing-tier-cell${key === tierKey ? ' is-current' : ''}`}>
									<strong>{TIERS[key].price}</strong>
								</td>
							))}
						</tr>

						<tr className="pricing-row pricing-row--subscribe">
							<td><strong>Subscribe</strong></td>
							<td />
							{TIER_KEYS.map((key) => (
								<td key={key} className={`pricing-tier-cell${key === tierKey ? ' is-current' : ''}`}>
									{renderSubscribeCell(key)}
								</td>
							))}
						</tr>

						{ALL_FEATURES.map((feature) => {
							const status = FEATURE_STATUS[feature] ?? 'planned';
							const statusDisplay = STATUS_DISPLAY[status] ?? STATUS_DISPLAY.planned;
							return (
								<tr key={feature} className="pricing-row">
									<td>{FEATURE_LABELS[feature] ?? feature}</td>
									<td>
										<span className={`pricing-status ${statusDisplay.className}`}>
											{statusDisplay.label}
										</span>
									</td>
									{TIER_KEYS.map((key) => {
										const included = TIERS[key].features.includes(feature);
										return (
											<td
												key={key}
												className={`pricing-tier-cell${key === tierKey ? ' is-current' : ''}`}
											>
												{included ? <span className="pricing-check">✓</span> : null}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<div className="pricing-back">
				<Link to="/">Back to Home</Link>
			</div>
		</div>
	);
}

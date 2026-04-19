import React from 'react';
import { Link } from 'react-router-dom';
import { TIERS, FEATURE_STATUS, FEATURE_LABELS } from '../config/tiers.js';
import { useSubscription } from '../hooks/useSubscription.js';

const TIER_KEYS = ['free', 'great', 'ultra', 'master'];

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
	done: { label: '✅ Done', className: 'status-done' },
	wip: { label: '🚧 WIP', className: 'status-wip' },
	planned: { label: '⏳ Planned', className: 'status-planned' },
};

export function PricingPage() {
	const { tierKey } = useSubscription();

	return (
		<div className="pricing-page">
			<div className="pricing-wip-banner">
				<strong>🚧 Work In Progress</strong>
				<p>
					PokémonPGC is still in active development. Some features listed here may not be
					fully implemented yet. Subscribing to a higher tier helps support development and
					unlocks features as they are released — thank you!
				</p>
			</div>

			<h1 className="pricing-title">Plans & Pricing</h1>

			<div className="pricing-table-wrap">
				<table className="pricing-table">
					<thead>
						<tr>
							<th className="pricing-feature-col">Feature</th>
							<th className="pricing-status-col">Status</th>
							{TIER_KEYS.map((key) => (
								<th key={key} className={`pricing-tier-col${key === tierKey ? ' is-current' : ''}`}>
									{TIERS[key].label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{/* Price row */}
						<tr className="pricing-row pricing-row--price">
							<td><strong>Price</strong></td>
							<td />
							{TIER_KEYS.map((key) => (
								<td key={key} className={`pricing-tier-cell${key === tierKey ? ' is-current' : ''}`}>
									<strong>{TIERS[key].price}</strong>
								</td>
							))}
						</tr>

						{/* Subscribe row */}
						<tr className="pricing-row pricing-row--subscribe">
							<td><strong>Subscribe</strong></td>
							<td />
							{TIER_KEYS.map((key) => (
								<td key={key} className={`pricing-tier-cell${key === tierKey ? ' is-current' : ''}`}>
									{key === 'free' ? (
										<span className="pricing-free-label">—</span>
									) : (
										<div className="pricing-payment-btns">
											<button type="button" className="pricing-pay-btn pricing-pay-stripe" disabled>
												Stripe
											</button>
											<button type="button" className="pricing-pay-btn pricing-pay-paypal" disabled>
												PayPal
											</button>
										</div>
									)}
								</td>
							))}
						</tr>

						{/* Feature rows */}
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
				<Link to="/">← Back to Home</Link>
			</div>
		</div>
	);
}

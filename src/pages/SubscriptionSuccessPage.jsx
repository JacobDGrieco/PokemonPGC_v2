import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, verifyPayPalSubscription } from '../../api.js';

function readSearch(locationSearch) {
	const params = new URLSearchParams(locationSearch);
	return {
		provider: (params.get('provider') || '').toLowerCase(),
		tier: (params.get('tier') || '').toLowerCase(),
		subscriptionId: params.get('subscription_id') || params.get('ba_token') || '',
	};
}

async function syncClientUser(user) {
	if (!user) return null;
	window.PPGC = window.PPGC || {};
	window.PPGC.currentUser = user;
	window.PPGC?.setAccountButtonIcon?.(user.icon || 'default');
	window.PPGC?.api?.setApiCurrentUser?.(user);
	window.dispatchEvent(new CustomEvent('ppgc:auth:changed'));
	return user;
}

async function refreshFromServer() {
	if (typeof window.PPGC?.refreshCurrentUser === 'function') {
		return window.PPGC.refreshCurrentUser();
	}

	const response = await getCurrentUser();
	if (response?.user) {
		await syncClientUser(response.user);
		return response.user;
	}

	return null;
}

export function SubscriptionSuccessPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const details = useMemo(() => readSearch(location.search), [location.search]);
	const [phase, setPhase] = useState('working');
	const [message, setMessage] = useState('Finalizing your subscription...');
	const [error, setError] = useState('');

	useEffect(() => {
		let cancelled = false;

		async function run() {
			try {
				if (!window.PPGC?.currentUser) {
					window.PPGC?.openAuthModal?.('login');
				}

				if (details.provider === 'paypal') {
					if (!details.subscriptionId || !details.tier) {
						throw new Error('Missing PayPal subscription confirmation details.');
					}
					setMessage('Verifying your PayPal subscription...');
					const result = await verifyPayPalSubscription(details.subscriptionId, details.tier);
					if (cancelled) return;
					if (result?.user) {
						await syncClientUser(result.user);
					}
				}

				setMessage('Refreshing your account...');
				let matchedTier = false;
				for (let attempt = 0; attempt < 8; attempt += 1) {
					const user = await refreshFromServer();
					if (cancelled) return;
					if (!details.tier || user?.tier === details.tier) {
						matchedTier = true;
						break;
					}
					await new Promise((resolve) => window.setTimeout(resolve, 1500));
				}

				if (!cancelled) {
					setPhase('done');
					setMessage(matchedTier
						? 'Your subscription is active.'
						: 'Your payment went through. Account access should update shortly after the webhook finishes.');
				}
			} catch (err) {
				if (cancelled) return;
				setPhase('error');
				setError(err?.message || 'We could not confirm the subscription yet.');
			}
		}

		run();
		return () => {
			cancelled = true;
		};
	}, [details.provider, details.subscriptionId, details.tier]);

	return (
		<div className="pricing-page pricing-page--success">
			<div className="pricing-success-card">
				<div className="pricing-success-eyebrow">Subscription</div>
				<h1 className="pricing-title">
					{phase === 'done' ? 'Payment complete' : phase === 'error' ? 'Confirmation needed' : 'Finishing checkout'}
				</h1>
				<p className="pricing-success-copy">
					{phase === 'error' ? error : message}
				</p>

				<div className="pricing-success-actions">
					{phase === 'done' ? (
						<button type="button" className="pricing-action-btn" onClick={() => navigate('/pricing', { replace: true })}>
							Back to pricing
						</button>
					) : null}
					<Link to="/checklists" className="pricing-action-link">Go to app</Link>
				</div>
			</div>
		</div>
	);
}

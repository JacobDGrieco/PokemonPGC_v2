import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { getCurrentUser, verifyPayPalSubscription, verifyStripeCheckoutSession } from '../../api.js';

function readSearch(locationSearch) {
	const params = new URLSearchParams(locationSearch);
	let pendingPayPal = null;
	try {
		pendingPayPal = JSON.parse(sessionStorage.getItem('ppgc:paypal:pending-subscription') || 'null');
	} catch {
		pendingPayPal = null;
	}
	const tier = (params.get('tier') || '').toLowerCase();
	return {
		provider: (params.get('provider') || '').toLowerCase(),
		tier,
		sessionId: params.get('session_id') || '',
		subscriptionId: params.get('subscription_id')
			|| params.get('ba_token')
			|| (pendingPayPal?.tier === tier ? pendingPayPal.subscriptionId : '')
			|| '',
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
		if (phase !== 'done') return;

		const colors = ['#e31c23', '#ffffff', '#3b5dc9', '#f5c644', '#9b5fb5'];
		confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });

		const t = setTimeout(() => {
			confetti({ particleCount: 55, spread: 50, angle: 60, origin: { x: 0.1, y: 0.65 }, colors });
			confetti({ particleCount: 55, spread: 50, angle: 120, origin: { x: 0.9, y: 0.65 }, colors });
		}, 320);

		return () => clearTimeout(t);
	}, [phase]);

	useEffect(() => {
		let cancelled = false;

		async function run() {
			try {
				if (details.provider !== 'stripe' && details.provider !== 'paypal') {
					throw new Error('The payment provider confirmation is missing or invalid.');
				}
				if (!details.tier) {
					throw new Error('The subscription tier confirmation is missing.');
				}

				setMessage('Refreshing your account...');
				const initialUser = await refreshFromServer();
				if (cancelled) return;
				if (!initialUser) {
					window.PPGC?.openAuthModal?.('login');
					throw new Error('Your session could not be restored after checkout. Please log in again to finish syncing your subscription.');
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
					sessionStorage.removeItem('ppgc:paypal:pending-subscription');
				}

				if (details.provider === 'stripe') {
					if (!details.sessionId || !details.tier) {
						throw new Error('Missing Stripe checkout confirmation details.');
					}
					setMessage('Verifying your Stripe subscription...');
					const result = await verifyStripeCheckoutSession(details.sessionId, details.tier);
					if (cancelled) return;
					if (result?.user) {
						await syncClientUser(result.user);
					}
				}

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

				if (!matchedTier) {
					throw new Error('The provider has not confirmed an active subscription for this account yet.');
				}
				if (!cancelled) {
					setPhase('done');
					setMessage('Your rank is active. Welcome to the league.');
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
	}, [details.provider, details.sessionId, details.subscriptionId, details.tier]);

	return (
		<div className="pricing-page pricing-page--success">
			<div className="pricing-success-card">
				<div className="pricing-success-eyebrow">League Rank</div>
				<h1 className="pricing-title">
					{phase === 'done' ? 'Rank unlocked' : phase === 'error' ? 'Confirmation needed' : 'Activating rank'}
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

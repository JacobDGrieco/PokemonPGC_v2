import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { resetPassword, verifyEmail } from '../../api.js';

function getToken(search) {
	return new URLSearchParams(search).get('token') || '';
}

export function AuthActionPage({ action }) {
	const location = useLocation();
	const token = useMemo(() => getToken(location.search), [location.search]);
	const [password, setPassword] = useState('');
	const [confirmation, setConfirmation] = useState('');
	const [phase, setPhase] = useState('idle');
	const [message, setMessage] = useState('');
	const isVerify = action === 'verify-email';
	const isWorking = phase === 'working';
	const isDone = phase === 'done';

	async function handleVerify() {
		if (!token || isWorking) return;
		setPhase('working');
		setMessage('Verifying your email...');
		try {
			const response = await verifyEmail(token);
			if (response?.error) throw new Error(response.error);
			setPhase('done');
			setMessage(response?.message || 'Email verified. You can now log in.');
		} catch (error) {
			setPhase('error');
			setMessage(error?.message || 'Email verification could not be completed.');
		}
	}

	async function handleReset(event) {
		event.preventDefault();
		if (!token || isWorking) return;
		if (password !== confirmation) {
			setPhase('error');
			setMessage('The passwords do not match.');
			return;
		}

		setPhase('working');
		setMessage('Updating your password...');
		try {
			const response = await resetPassword(token, password);
			if (response?.error) throw new Error(response.error);
			setPassword('');
			setConfirmation('');
			setPhase('done');
			setMessage(response?.message || 'Password updated. You can now log in.');
		} catch (error) {
			setPhase('error');
			setMessage(error?.message || 'Password reset could not be completed.');
		}
	}

	function openLogin() {
		window.PPGC?.openAuthModal?.('login');
	}

	return (
		<main className="auth-action-page">
			<section className="auth-action-card" aria-labelledby="auth-action-title">
				<div className="auth-action-eyebrow">PokemonPGC Account</div>
				<h1 id="auth-action-title">{isVerify ? 'Verify your email' : 'Choose a new password'}</h1>
				<p className="auth-action-copy">
					{isVerify
						? 'Confirm this address before your account can log in, sync progress, or subscribe.'
						: 'Use a unique password between 8 and 128 characters. Finishing the reset signs out every existing session.'}
				</p>

				{!token ? (
					<div className="auth-action-status error" role="alert">This link is missing its security token.</div>
				) : null}

				{isVerify && token && !isDone ? (
					<button type="button" className="auth-action-primary" disabled={isWorking} onClick={handleVerify}>
						{isWorking ? 'Verifying...' : 'Verify email'}
					</button>
				) : null}

				{!isVerify && token && !isDone ? (
					<form className="auth-action-form" onSubmit={handleReset}>
						<label>
							<span>New password</span>
							<input
								type="password"
								autoComplete="new-password"
								minLength="8"
								maxLength="128"
								required
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
						</label>
						<label>
							<span>Confirm new password</span>
							<input
								type="password"
								autoComplete="new-password"
								minLength="8"
								maxLength="128"
								required
								value={confirmation}
								onChange={(event) => setConfirmation(event.target.value)}
							/>
						</label>
						<button type="submit" className="auth-action-primary" disabled={isWorking}>
							{isWorking ? 'Updating...' : 'Update password'}
						</button>
					</form>
				) : null}

				{message ? (
					<div className={`auth-action-status${phase === 'error' ? ' error' : ''}`} role={phase === 'error' ? 'alert' : 'status'}>
						{message}
					</div>
				) : null}

				<div className="auth-action-links">
					{isDone ? <button type="button" onClick={openLogin}>Log in</button> : null}
					<Link to="/">Back to home</Link>
				</div>
			</section>
		</main>
	);
}

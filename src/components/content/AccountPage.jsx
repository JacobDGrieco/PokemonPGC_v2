import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { _assetPath } from '../../utils/assetPath.js';
import {
	cancelPayPalSubscription,
	createStripePortalSession,
	getSubscriptionDetails,
} from '../../../api.js';
import { save, store } from '../../store.js';
import { TIERS } from '../../config/tiers.js';
import { useSubscription } from '../../hooks/useSubscription.js';
import {
	backupAllNow,
	chooseBackupFolder,
	getAutoBackupsEnabled,
	importAllFromFolder,
	isBackupFolderGranted,
	setAutoBackupsEnabled,
} from '../../persistence.js';
import { buildAccountRoute } from '../../utils/accountRoute.js';

const SUPPORTED_SAVE_IMPORT_GAMES = new Set(['red']);
const DEFAULT_ICONS = [
	{ key: 'default', label: 'Poke Ball' },
	{ key: 'great', label: 'Great Ball' },
	{ key: 'ultra', label: 'Ultra Ball' },
];
const ACCOUNT_TABS = [
	{ key: 'general', label: 'General' },
	{ key: 'subscription', label: 'Subscription' },
	{ key: 'backup', label: 'Site Data Backup' },
	{ key: 'import', label: 'Save Data Import' },
];

function formatTs(ts) {
	if (!ts) return 'never';
	try {
		return new Date(ts).toLocaleString();
	} catch {
		return ts;
	}
}

function formatDate(value) {
	if (!value) return 'Not available';
	try {
		return new Date(value).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	} catch {
		return value;
	}
}

function formatDateTime(value) {
	if (!value) return 'Not available';
	try {
		return new Date(value).toLocaleString();
	} catch {
		return value;
	}
}

function formatStatus(value) {
	if (!value) return 'None';
	return String(value)
		.replace(/[_-]+/g, ' ')
		.toLowerCase()
		.replace(/\b\w/g, (match) => match.toUpperCase());
}

function AccountTabNav({ activeTab }) {
	const navigate = useNavigate();

	return (
		<nav className="account-tab-nav" aria-label="Account sections">
			{ACCOUNT_TABS.map((tab) => {
				const active = activeTab === tab.key;
				return (
					<button
						key={tab.key}
						type="button"
						className={`account-tab-pill ${active ? 'active' : ''}`}
						aria-pressed={active ? 'true' : 'false'}
						onClick={() => {
							if (active) return;
							navigate(buildAccountRoute(tab.key));
						}}
					>
						<span className="account-tab-pill-title">{tab.label}</span>
					</button>
				);
			})}
		</nav>
	);
}

function AccountSidebar({ activeTab, onReturnToChecklist }) {
	const { tierKey, user } = useSubscription();
	const plan = TIERS[tierKey] || TIERS.free;
	const email = user?.email || 'Guest account';
	const providerLabel = user?.subscriptionProvider
		? formatStatus(user.subscriptionProvider)
		: 'No billing provider';
	const statusLabel = user ? 'Signed in' : 'Guest';
	const currentIcon = user?.icon || 'default';
	const customIcon = String(currentIcon || '').startsWith('data:image/');

	return (
		<aside className="account-sidebar">
			<section className="account-sidebar-card account-sidebar-nav-card">
				<div className="account-sidebar-section-label">Sections</div>
				<AccountTabNav activeTab={activeTab} />
			</section>
		</aside>
	);
}

function SettingRow({ title, subtext, control, children }) {
	return (
		<div className="settings-row">
			<div className="settings-copy">
				<div className="settings-title">{title}</div>
				{subtext ? <div className="settings-subtext">{subtext}</div> : null}
			</div>
			<div className="settings-control">
				{control}
				{children}
			</div>
		</div>
	);
}

function SegmentedControl({ value, onChange, options, ariaLabel }) {
	return (
		<div className="settings-segmented" role="radiogroup" aria-label={ariaLabel}>
			{options.map((option) => {
				const active = value === option.value;
				return (
					<button
						key={option.value}
						type="button"
						className={`settings-segment ${active ? 'active' : ''}`}
						aria-pressed={active ? 'true' : 'false'}
						onClick={() => {
							if (!active) onChange(option.value);
						}}
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}

function AccountIconPreview({ icon, label, selected, onClick, upload = false }) {
	const isCustom = String(icon || '').startsWith('data:image/');

	return (
		<button
			type="button"
			className={`account-avatar-option ${selected ? 'selected' : ''} ${upload ? 'upload' : ''}`}
			onClick={onClick}
			title={label}
		>
			<span className={`account-avatar-chip ${isCustom ? 'custom' : ''}`} data-icon={isCustom ? 'custom' : icon || 'default'}>
				{isCustom ? <img src={icon} alt="" /> : null}
				{upload ? <span className="account-avatar-plus">+</span> : null}
			</span>
			<span className="account-avatar-label">{label}</span>
		</button>
	);
}

function GeneralTab() {
	const [, forceRefresh] = useState(0);
	const currentUser = window.PPGC?.currentUser || null;
	const signedIn = !!currentUser;
	const currentIcon = currentUser?.icon || 'default';
	const aggregateMode = store.state.gameSummaryAggregateMode === 'started' ? 'started' : 'all';
	const dexSpriteMode = store.state.dexSpriteMode === 'animated' ? 'animated' : 'static';
	const gen1SpriteMode = store.state.gen1SpriteMode === 'color' ? 'color' : 'bw';
	const gen1RegionMode = store.state.gen1RegionMode === 'jp' ? 'jp' : 'rf';
	const taskDensity = store.state.taskDensity === 'comfortable' ? 'comfortable' : 'compact';
	const customIconInputRef = useRef(null);

	useEffect(() => {
		const refresh = () => forceRefresh((n) => n + 1);
		window.addEventListener('ppgc:auth:changed', refresh);
		return () => {
			window.removeEventListener('ppgc:auth:changed', refresh);
		};
	}, []);

	function commitRender() {
		save();
		window.PPGC?.renderDexGridIfOpen?.();
		window.PPGC?.renderAll?.();
		forceRefresh((n) => n + 1);
	}

	function setStateValue(key, value) {
		store.state[key] = value;
		commitRender();
	}

	async function handleIconChange(icon) {
		window.PPGC?.setAccountButtonIcon?.(icon);

		if (!currentUser || !window.PPGC?.api?.updateMe) {
			forceRefresh((n) => n + 1);
			return;
		}

		try {
			const res = await window.PPGC.api.updateMe({ icon });
			if (res?.user) {
				window.PPGC.currentUser = res.user;
				window.PPGC?.setAccountButtonIcon?.(res.user.icon || 'default');
			}
		} catch (err) {
			console.debug('[account] failed to update icon:', err);
		} finally {
			forceRefresh((n) => n + 1);
		}
	}

	function handleCustomIconPick() {
		if (!signedIn) return;
		customIconInputRef.current?.click();
	}

	function handleCustomIconFile(event) {
		const file = event.target.files?.[0];
		event.target.value = '';
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			window.alert('Please choose an image file.');
			return;
		}

		const reader = new FileReader();
		reader.onload = async () => {
			const result = typeof reader.result === 'string' ? reader.result : '';
			if (!result.startsWith('data:image/')) {
				window.alert('That image format could not be used.');
				return;
			}
			if (result.length > 250_000) {
				window.alert('That icon is too large. Try a smaller square image.');
				return;
			}
			await handleIconChange(result);
		};
		reader.readAsDataURL(file);
	}

	return (
		<div className="settings-shell">
			<section className="settings-panel settings-panel-profile">
				<div className="settings-panel-head">
					<div>
						<div className="settings-eyebrow">Account</div>
						<h2>Profile & Preferences</h2>
						<p className="settings-lead">Everything visual and personal lives here, so the checklist feels like yours without crowding the rest of the app.</p>
					</div>
				</div>

				<div className="settings-account-strip">
					<div className="settings-account-meta">
						<div className="settings-meta-label">Email</div>
						<div className="settings-meta-value">{currentUser?.email || '(not signed in)'}</div>
					</div>
					<div className="settings-account-actions">
						{signedIn ? (
							<button
								className="ghost"
								type="button"
								id="accountLogoutBtn"
								onClick={() => window.PPGC?.handleLogout?.()}
							>
								{signedIn ? 'Log Out' : 'Log in / Sign up'}
							</button>
						) : null}
					</div>
				</div>
			</section>

			<section className="settings-panel">
				<div className="settings-section-head">
					<h3>Avatar</h3>
					<p>Pick a built-in ball or upload your own image for the account button.</p>
				</div>

				<div className="account-avatar-grid">
					{DEFAULT_ICONS.map((icon) => (
						<AccountIconPreview
							key={icon.key}
							icon={icon.key}
							label={icon.label}
							selected={currentIcon === icon.key}
							onClick={() => handleIconChange(icon.key)}
						/>
					))}

					<AccountIconPreview
						icon={String(currentIcon || '').startsWith('data:image/') ? currentIcon : null}
						label={signedIn ? 'Upload icon' : 'Upload icon'}
						selected={String(currentIcon || '').startsWith('data:image/')}
						onClick={handleCustomIconPick}
						upload
					/>
				</div>

				<div className="settings-subtext settings-subtext-inline">
					{signedIn
						? 'Custom icons are saved to your account. Smaller square images work best.'
						: 'Sign in to save a custom icon to your account.'}
				</div>

				<input
					ref={customIconInputRef}
					type="file"
					accept="image/png,image/jpeg,image/webp,image/gif"
					hidden
					onChange={handleCustomIconFile}
				/>
			</section>

			<section className="settings-panel">
				<div className="settings-section-head">
					<h3>Display</h3>
				</div>

				<SettingRow
					title="Overall Game Progress"
					subtext="Choose whether the all-games header bar calculates based on every game or only games you have marked as started."
					control={(
						<SegmentedControl
							ariaLabel="Overall game progress scope"
							value={aggregateMode}
							onChange={(value) => setStateValue('gameSummaryAggregateMode', value)}
							options={[
								{ label: 'All games', value: 'all' },
								{ label: 'Started only', value: 'started' },
							]}
						/>
					)}
				/>

				<SettingRow
					title="Gen 1 Colored Sprites"
					subtext="Swap between monochrome and colored artwork for Red, Blue, and Yellow task and dex sprites."
					control={(
						<SegmentedControl
							ariaLabel="Gen 1 color style"
							value={gen1SpriteMode}
							onChange={(value) => {
								store.state.gen1SpriteMode = value === 'color' ? 'color' : 'bw';
								window.PPGC = window.PPGC || {};
								window.PPGC.gen1SpriteColor = value === 'color';
								commitRender();
							}}
							options={[
								{ label: 'B/W', value: 'bw' },
								{ label: 'Color', value: 'color' },
							]}
						/>
					)}
				/>

				<SettingRow
					title="Gen 1 NPC Sprites"
					subtext="Choose between the international Red/Blue set and the Japanese Red/Green-style set for compatible Gen 1 sprites."
					control={(
						<SegmentedControl
							ariaLabel="Gen 1 sprite set"
							value={gen1RegionMode}
							onChange={(value) => setStateValue('gen1RegionMode', value === 'jp' ? 'jp' : 'rf')}
							options={[
								{ label: 'RF', value: 'rf' },
								{ label: 'JP', value: 'jp' },
							]}
						/>
					)}
				/>

				<SettingRow
					title="Pokédex Sprite Motion"
					subtext="Use static images or animated sprites for Gen 5 sprites"
					control={(
						<SegmentedControl
							ariaLabel="Pokedex sprite motion"
							value={dexSpriteMode}
							onChange={(value) => setStateValue('dexSpriteMode', value === 'animated' ? 'animated' : 'static')}
							options={[
								{ label: 'Static', value: 'static' },
								{ label: 'Animated', value: 'animated' },
							]}
						/>
					)}
				/>
				<SettingRow
					title="Mobile Task Density"
					subtext="Compact keeps three tasks per row on phones. Comfortable gives each task more room."
					control={(
						<SegmentedControl
							ariaLabel="Mobile task density"
							value={taskDensity}
							onChange={(value) => setStateValue('taskDensity', value === 'comfortable' ? 'comfortable' : 'compact')}
							options={[
								{ label: 'Compact', value: 'compact' },
								{ label: 'Comfortable', value: 'comfortable' },
							]}
						/>
					)}
				/>
			</section>
		</div>
	);
}

function SubscriptionTab() {
	const { tierKey, user } = useSubscription();
	const [details, setDetails] = useState(null);
	const [loading, setLoading] = useState(false);
	const [busyAction, setBusyAction] = useState('');
	const [error, setError] = useState('');
	const [notice, setNotice] = useState('');

	useEffect(() => {
		let cancelled = false;

		async function loadDetails() {
			setError('');
			setNotice('');

			if (!user?.subscriptionProvider) {
				setDetails(null);
				return;
			}

			setLoading(true);
			try {
				const response = await getSubscriptionDetails(user.subscriptionProvider);
				if (!cancelled) setDetails(response?.details || null);
			} catch (err) {
				if (!cancelled) {
					setDetails(null);
					setError(err?.message || 'Failed to load subscription details.');
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		loadDetails();

		const refresh = () => {
			loadDetails();
		};
		window.addEventListener('ppgc:auth:changed', refresh);
		return () => {
			cancelled = true;
			window.removeEventListener('ppgc:auth:changed', refresh);
		};
	}, [user?.id, user?.subscriptionProvider]);

	async function handleStripePortal() {
		setBusyAction('stripe:portal');
		setError('');
		setNotice('');
		try {
			const result = await createStripePortalSession();
			if (!result?.url) throw new Error('Stripe did not return a portal URL.');
			window.location.assign(result.url);
		} catch (err) {
			setError(err?.message || 'Failed to open billing portal.');
		} finally {
			setBusyAction('');
		}
	}

	async function handlePayPalCancel() {
		setBusyAction('paypal:cancel');
		setError('');
		setNotice('');
		try {
			const result = await cancelPayPalSubscription();
			if (result?.user) {
				window.PPGC = window.PPGC || {};
				window.PPGC.currentUser = result.user;
				window.PPGC?.setAccountButtonIcon?.(result.user.icon || 'default');
				window.PPGC?.api?.setApiCurrentUser?.(result.user);
				window.dispatchEvent(new CustomEvent('ppgc:auth:changed'));
			}
			setNotice('Your PayPal subscription has been canceled.');
		} catch (err) {
			setError(err?.message || 'Failed to cancel PayPal subscription.');
		} finally {
			setBusyAction('');
		}
	}

	const effectiveDetails = details || {
		provider: user?.subscriptionProvider || null,
		tier: tierKey,
		status: user?.subscriptionStatus || null,
		renewalDate: null,
		currentPeriodStart: null,
		cancelAt: null,
		canceledAt: null,
		trialEnd: null,
		cancelAtPeriodEnd: false,
		subscriptionId: null,
		customerId: null,
		priceId: null,
		interval: null,
	};
	const plan = TIERS[effectiveDetails.tier] || TIERS.free;
	const hasProvider = !!effectiveDetails.provider;
	const isSignedIn = !!user;

	return (
		<div className="settings-shell">
			<section className="settings-panel settings-panel-profile">
				<div className="settings-panel-head">
					<div>
						<div className="settings-eyebrow">Subscription</div>
						<h2>Plan & Billing</h2>
						<p className="settings-lead">See your current tier, renewal timing, and billing provider details without leaving the account page.</p>
					</div>
				</div>

				<div className="settings-account-strip">
					<div className="settings-account-meta">
						<div className="settings-meta-label">Current tier</div>
						<div className="settings-meta-value">{plan.label}</div>
					</div>
					<div className="settings-account-actions">
						{hasProvider && effectiveDetails.provider === 'stripe' ? (
							<button
								className="primary"
								type="button"
								disabled={busyAction !== ''}
								onClick={handleStripePortal}
							>
								{busyAction === 'stripe:portal' ? 'Loading...' : 'Manage billing'}
							</button>
						) : null}
						{hasProvider && effectiveDetails.provider === 'paypal' ? (
							<button
								className="ghost account-subscription-danger"
								type="button"
								disabled={busyAction !== ''}
								onClick={handlePayPalCancel}
							>
								{busyAction === 'paypal:cancel' ? 'Canceling...' : 'Cancel PayPal'}
							</button>
						) : null}
						{!hasProvider ? (
							<button
								className="primary"
								type="button"
								onClick={() => window.location.assign('/pricing')}
							>
								View plans
							</button>
						) : null}
					</div>
				</div>
			</section>

			{error ? <section className="settings-panel account-subscription-alert account-subscription-alert-error">{error}</section> : null}
			{notice ? <section className="settings-panel account-subscription-alert account-subscription-alert-success">{notice}</section> : null}

			<section className="settings-panel">
				<div className="settings-section-head">
					<h3>Subscription details</h3>
					<p>Provider metadata and lifecycle dates for your current billing setup.</p>
				</div>

				<div className="account-subscription-list">
					<SettingRow title="Plan" subtext="The plan currently attached to your account." control={<span className="account-subscription-inline-value">{plan.label} ({plan.price})</span>} />
					<SettingRow title="Renewal date" subtext="When the next billing cycle is expected to begin." control={<span className="account-subscription-inline-value">{formatDateTime(effectiveDetails.renewalDate)}</span>} />
					<SettingRow title="Period start" subtext="The start of the current paid period when the provider exposes it." control={<span className="account-subscription-inline-value">{formatDateTime(effectiveDetails.currentPeriodStart)}</span>} />
				</div>
			</section>

			{!isSignedIn ? (
				<section className="settings-panel">
					<div className="settings-section-head">
						<h3>Sign in required</h3>
						<p>Log in to see and manage subscription data for your account.</p>
					</div>
				</section>
			) : null}
		</div>
	);
}

function BackupTab() {
	const [granted, setGranted] = useState(false);
	const [lastBackupTs, setLastBackupTs] = useState(localStorage.getItem('ppgc_last_backup_ts'));
	const [lastBackupGame, setLastBackupGame] = useState(localStorage.getItem('ppgc_last_backup_game') || '');
	const [autoEnabled, setAutoEnabledState] = useState(getAutoBackupsEnabled());
	const [busy, setBusy] = useState('');

	useEffect(() => {
		async function refreshStatus() {
			const nextGranted = await isBackupFolderGranted();
			setGranted(!!nextGranted);
			setLastBackupTs(localStorage.getItem('ppgc_last_backup_ts'));
			setLastBackupGame(localStorage.getItem('ppgc_last_backup_game') || '');
			setAutoEnabledState(getAutoBackupsEnabled());
		}
		refreshStatus();
		window.addEventListener('ppgc:backup:done', refreshStatus);
		return () => window.removeEventListener('ppgc:backup:done', refreshStatus);
	}, []);

	const gameLabel = useMemo(() => {
		if (window.PPGC?.resolveGameLabel) return window.PPGC.resolveGameLabel(lastBackupGame);
		return lastBackupGame || 'Unknown game';
	}, [lastBackupGame]);

	async function runAction(kind, fn) {
		setBusy(kind);
		try {
			await fn();
		} catch (err) {
			console.debug(`[backup] ${kind} failed:`, err);
		} finally {
			setBusy('');
			setGranted(await isBackupFolderGranted());
			setLastBackupTs(localStorage.getItem('ppgc_last_backup_ts'));
			setLastBackupGame(localStorage.getItem('ppgc_last_backup_game') || '');
			setAutoEnabledState(getAutoBackupsEnabled());
		}
	}

	return (
		<div className="settings-shell">
			<section className="settings-panel" id="account-section-backup">
				<div className="settings-section-head">
					<h3>Backups &amp; Import</h3>
					<p>Keep a manual backup folder around for portable restores and one-click imports.</p>
				</div>

				<div className="account-backup-panel">
					<div className="backup-row backup-row-main">
						<div className="backup-main-left">
							<span className={`dot ${granted ? 'ok' : ''}`} id="account-backup-dot" title={granted ? 'Backups will run silently' : 'No backup folder chosen'} />
							<div className="backup-main-labels">
								<div className="backup-main-title">Manual backup / import</div>
								<div className="backup-main-hint">
									Choose a folder once, then back up or restore whenever you want a portable copy of everything.
								</div>
							</div>
						</div>
						<div className="backup-main-actions">
							<button
								id="account-backup-now"
								className="primary"
								disabled={busy !== ''}
								onClick={() => runAction('backup', backupAllNow)}
							>
								{busy === 'backup' ? 'Backing up all...' : 'Backup'}
							</button>
							<button
								id="account-import-now"
								disabled={busy !== ''}
								onClick={() => runAction('import', importAllFromFolder)}
							>
								{busy === 'import' ? 'Importing all...' : 'Import'}
							</button>
						</div>
					</div>

					<div className="backup-row backup-row-auto">
						<div className="backup-auto-labels">
							<div className="backup-auto-title">Automatic folder backups</div>
							<div className="backup-auto-hint">
								Periodically writes your progress to the chosen backup folder in the background.
							</div>
						</div>
						<label className="switch" id="account-auto" title="Toggle automatic backups">
							<input
								type="checkbox"
								id="account-auto-toggle"
								checked={autoEnabled}
								onChange={(event) => {
									setAutoBackupsEnabled(event.target.checked);
									setAutoEnabledState(event.target.checked);
								}}
							/>
							<span className="slider" aria-hidden="true" />
							<span className="sr">Auto Backup</span>
						</label>
					</div>

					<div className="backup-row backup-row-folder">
						<div className="backup-folder-labels">
							<div className="backup-folder-title">Backup folder</div>
							<div className="backup-folder-hint">
								Change where local JSON backups are written.
							</div>
						</div>
						<button
							id="account-backup-folder"
							disabled={busy !== ''}
							onClick={() => runAction('folder', chooseBackupFolder)}
						>
							{granted ? 'Change Folder' : 'Choose Folder'}
						</button>
					</div>

					<div className="backup-row backup-row-meta">
						<span className="meta" id="account-backup-meta">
							{lastBackupTs ? `Last: ${formatTs(lastBackupTs)} - ${gameLabel}` : 'Last: never'}
						</span>
					</div>
				</div>
			</section>

			<section className="settings-panel">
				<div className="settings-section-head">
					<h3>What this is for</h3>
					<p>These tools stay focused on backup and restore workflows, not checklist browsing.</p>
				</div>

				<SettingRow
					title="Manual exports"
					subtext="Create a full snapshot of your local progress whenever you want a portable copy."
					control={<span className="account-subscription-inline-value">{granted ? 'Ready' : 'Needs folder'}</span>}
				/>
				<SettingRow
					title="Folder monitoring"
					subtext="Automatic backups only write files to the folder you approve."
					control={<span className="account-subscription-inline-value">{autoEnabled ? 'Enabled' : 'Disabled'}</span>}
				/>
			</section>
		</div>
	);
}

function SaveImportTab() {
	const tabs = window.DATA?.tabs || [];
	const gamesByGen = window.DATA?.games || {};
	const [busyGame, setBusyGame] = useState('');

	async function handleImport(gameKey, label) {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.sav';
		input.style.display = 'none';

		input.addEventListener('change', async () => {
			const file = input.files && input.files[0];
			if (!file) {
				input.remove();
				return;
			}

			if (!file.name.toLowerCase().endsWith('.sav')) {
				alert('Please select a .sav file for now (others coming later).');
				input.remove();
				return;
			}

			setBusyGame(gameKey);
			try {
				const result = await window.PPGC.api.uploadSaveFileForImport(gameKey, file);
				const tasksFromSave = result.tasks || {};
				const taskIndex = window.PPGC?._taskIndexGlobal || new Map();
				const changes = [];

				for (const [taskId, newValueRaw] of Object.entries(tasksFromSave)) {
					const newValue = !!newValueRaw;
					let currentValue = false;
					let taskLabel = taskId;
					const hit = taskIndex?.get?.(taskId);
					if (hit?.task) {
						currentValue = !!hit.task.done;
						taskLabel = hit.task.text || taskLabel;
					}
					if (currentValue !== newValue) changes.push({ id: taskId, label: taskLabel, from: currentValue, to: newValue });
				}

				if (!changes.length) {
					alert([
						`Game: ${result.gameKey || gameKey}`,
						`File size: ${result.size || file.size} bytes`,
						'',
						'No changes needed - your current progress already matches this save (for the bits we know about).',
					].join('\n'));
					return;
				}

				const previewLines = [
					`Game: ${result.gameKey || gameKey}`,
					`File size: ${result.size || file.size} bytes`,
					'',
					'The following tasks will be updated:\n',
				];

				for (const change of changes) {
					previewLines.push(
						`* ${change.label}`,
						`    ${change.from ? '[x] complete' : '[ ] incomplete'}  ->  ${change.to ? '[x] complete' : '[ ] incomplete'}`,
						''
					);
				}

				const confirmed = window.confirm(previewLines.join('\n'));
				if (!confirmed) return;

				if (typeof window.PPGC?.setTaskCheckedById !== 'function') {
					alert("Could not apply changes: task helper is not available yet. Try visiting the game's page once so tasks are loaded, then re-run the import.");
					return;
				}

				for (const change of changes) {
					window.PPGC.setTaskCheckedById(change.id, change.to);
				}

				alert(`Save data imported for ${label}. Your tasks have been updated!`);
			} catch (err) {
				console.error('[save-import] failed:', err);
				alert(err.message || 'Failed to upload or parse save file.');
			} finally {
				setBusyGame('');
				input.remove();
			}
		});

		document.body.appendChild(input);
		input.click();
	}

	return (
		<div className="settings-shell">
			<section className="settings-panel" id="account-section-import">
				<div className="settings-section-head">
					<h3>Save Data Import</h3>
					<p>Upload a supported save file and preview every task change before anything is applied.</p>
				</div>

				<div className="account-import-grid">
					{tabs.map((tab) => {
						const games = gamesByGen[tab.key] || [];
						if (!games.length) return null;
						return (
							<section key={tab.key} className="account-import-gen">
								<h4 className="account-import-gen-title">{tab.label || tab.key}</h4>
								<div className="account-import-games-row">
									{games.map((game) => {
										const isSupported = SUPPORTED_SAVE_IMPORT_GAMES.has(game.key);
										return (
											<article key={game.key} className="account-import-game" data-game-key={game.key} data-gen-key={tab.key}>
												<div
													className="account-import-game-art"
													style={{ backgroundImage: `url('${_assetPath(`game-icons/${game.key}.png`)}')` }}
													aria-hidden="true"
												/>
												<div className="account-import-game-title">{game.label}</div>
												<button
													type="button"
													className={`account-import-btn${isSupported ? '' : ' is-wip'}`}
													data-game-key={game.key}
													data-gen-key={tab.key}
													disabled={!isSupported || busyGame === game.key}
													title={isSupported ? 'Import a .sav file' : 'Save data import for this game is still a work in progress.'}
													onClick={() => isSupported && handleImport(game.key, game.label)}
												>
													{!isSupported ? 'WIP' : busyGame === game.key ? 'Uploading...' : 'Import'}
												</button>
											</article>
										);
									})}
								</div>
							</section>
						);
					})}
				</div>
			</section>
		</div>
	);
}

export function AccountPage({ activeTab = store.state.accountTab || 'general' }) {
	const navigate = useNavigate();
	const handleReturnToChecklist = () => {
		const fallbackState = window.PPGC?._lastNonAccountState;
		if (fallbackState?.level) {
			Object.assign(store.state, fallbackState);
			save();
			navigate('/checklists');
			return;
		}
		Object.assign(store.state, {
			level: 'gen',
			genKey: null,
			gameKey: null,
			sectionId: null,
			monInfoId: null,
			monInfoGameKey: null,
			monInfoForm: null,
		});
		save();
		navigate('/checklists');
	};

	return (
		<div className="account-page">
			<header className="account-page-header">
				<div>
					<div className="account-page-eyebrow">Account</div>
					<h2>Settings & Billing</h2>
					<p className="account-page-lead">A dedicated account workspace for profile settings, subscriptions, backups, and imports.</p>
				</div>
			</header>

			<div className="account-workspace">
				<AccountSidebar activeTab={activeTab} onReturnToChecklist={handleReturnToChecklist} />
				<div className="account-main">
					{activeTab === 'general' ? <GeneralTab /> : null}
					{activeTab === 'subscription' ? <SubscriptionTab /> : null}
					{activeTab === 'backup' ? <BackupTab /> : null}
					{activeTab === 'import' ? <SaveImportTab /> : null}
				</div>
			</div>
		</div>
	);
}

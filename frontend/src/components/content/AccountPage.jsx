import React, { useEffect, useMemo, useRef, useState } from 'react';
import { _assetPath } from '../../utils/assetPath.js';
import { save, store } from '../../store.js';
import {
	backupAllNow,
	chooseBackupFolder,
	getAutoBackupsEnabled,
	importAllFromFolder,
	isBackupFolderGranted,
	setAutoBackupsEnabled,
} from '../../persistence.js';

const SUPPORTED_SAVE_IMPORT_GAMES = new Set(['red']);
const DEFAULT_ICONS = [
	{ key: 'default', label: 'Poke Ball' },
	{ key: 'great', label: 'Great Ball' },
	{ key: 'ultra', label: 'Ultra Ball' },
];

function formatTs(ts) {
	if (!ts) return 'never';
	try {
		return new Date(ts).toLocaleString();
	} catch {
		return ts;
	}
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
					<div className="settings-profile-pill">
						<div className="settings-profile-label">Status</div>
						<div className={`settings-profile-value ${signedIn ? 'online' : 'guest'}`}>{signedIn ? 'Signed in' : 'Guest'}</div>
					</div>
				</div>

				<div className="settings-account-strip">
					<div className="settings-account-meta">
						<div className="settings-meta-label">Email</div>
						<div className="settings-meta-value">{currentUser?.email || '(not signed in)'}</div>
					</div>
					<div className="settings-account-actions">
						<button
							className="primary"
							type="button"
							id="accountLoginBtn"
							onClick={() => {
								if (window.PPGC?.openAuthModal) window.PPGC.openAuthModal('login');
								else {
									const overlay = document.getElementById('ppgc-auth-overlay');
									if (overlay) overlay.hidden = false;
								}
							}}
						>
							{signedIn ? 'Switch account' : 'Log in / Sign up'}
						</button>
						{signedIn ? (
							<button
								className="ghost"
								type="button"
								id="accountLogoutBtn"
								onClick={() => window.PPGC?.handleLogout?.()}
							>
								Log out
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
					<p>Tune how the checklist presents progress and sprites without affecting the underlying data.</p>
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
			</section>
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
		<section className="card account-section" id="account-section-backup">
			<div className="card-hd">
				<h2>Backups &amp; Import</h2>
				<p className="small">
					Keep a manual backup folder around for belt-and-suspenders safety, even if most of your day-to-day saving happens in the app.
				</p>
			</div>
			<div className="card-bd">
				<div className="account-backup-panel">
					<div className="backup-row backup-row-main">
						<div className="backup-main-left">
							<span className={`dot ${granted ? 'ok' : ''}`} id="account-backup-dot" title={granted ? 'Backups will run silently' : 'No backup folder chosen'} />
							<div className="backup-main-labels">
								<div className="backup-main-title">Manual backup / import</div>
								<div className="backup-main-hint small">
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
								{busy === 'backup' ? 'Backing up all…' : 'Backup'}
							</button>
							<button
								id="account-import-now"
								disabled={busy !== ''}
								onClick={() => runAction('import', importAllFromFolder)}
							>
								{busy === 'import' ? 'Importing all…' : 'Import'}
							</button>
						</div>
					</div>

					<div className="backup-row backup-row-auto">
						<div className="backup-auto-labels">
							<div className="backup-auto-title">Automatic folder backups</div>
							<div className="backup-auto-hint small">
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
							<div className="backup-folder-hint small">
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
							{lastBackupTs ? `Last: ${formatTs(lastBackupTs)} — ${gameLabel}` : 'Last: never'}
						</span>
					</div>
				</div>
			</div>
		</section>
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
						'No changes needed — your current progress already matches this save (for the bits we know about).',
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
						`• ${change.label}`,
						`    ${change.from ? '✓ complete' : '○ incomplete'}  →  ${change.to ? '✓ complete' : '○ incomplete'}`,
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
		<section className="card account-section" id="account-section-import">
			<div className="card-hd">
				<h2>Save Data Import</h2>
				<p className="small">
					Upload a supported save file and preview every task change before anything is applied.
				</p>
			</div>
			<div className="card-bd">
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
													className={`button account-import-btn${isSupported ? '' : ' is-wip'}`}
													data-game-key={game.key}
													data-gen-key={tab.key}
													disabled={!isSupported || busyGame === game.key}
													title={isSupported ? 'Import a .sav file' : 'Save data import for this game is still a work in progress.'}
													onClick={() => isSupported && handleImport(game.key, game.label)}
												>
													{!isSupported ? 'WIP' : busyGame === game.key ? 'Uploading…' : 'Import'}
												</button>
											</article>
										);
									})}
								</div>
							</section>
						);
					})}
				</div>
			</div>
		</section>
	);
}

export function AccountPage() {
	const activeTab = store.state.accountTab || 'general';

	return (
		<div className="account-page react-content-card">
			<div className="account-layout">
				<div className="account-main">
					{activeTab === 'general' ? <GeneralTab /> : null}
					{activeTab === 'backup' ? <BackupTab /> : null}
					{activeTab === 'import' ? <SaveImportTab /> : null}
				</div>
			</div>
		</div>
	);
}

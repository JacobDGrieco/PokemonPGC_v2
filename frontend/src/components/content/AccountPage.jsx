import React, { useEffect, useMemo, useState } from 'react';
import { save, store } from '../../store.js';
import { navigateToState } from '../../react-bridge/navigation.js';
import {
  backupAllNow,
  chooseBackupFolder,
  getAutoBackupsEnabled,
  importAllFromFolder,
  isBackupFolderGranted,
  setAutoBackupsEnabled,
} from '../../persistence.js';

const ACCOUNT_TABS = [
  { key: 'general', label: 'General' },
  { key: 'backup', label: 'Backups & Import' },
  { key: 'import', label: 'Save Data Import' },
];

const SUPPORTED_SAVE_IMPORT_GAMES = new Set(['red']);

function setAccountTab(tab) {
  navigateToState({
    level: 'account',
    accountTab: tab,
    genKey: null,
    gameKey: null,
    sectionId: null,
  });
}

function GeneralTab() {
  const [, forceRefresh] = useState(0);
  const currentUser = window.PPGC?.currentUser || null;
  const signedIn = !!currentUser;
  const currentIcon = currentUser?.icon || 'default';
  const aggregateMode = store.state.gameSummaryAggregateMode === 'started' ? 'started' : 'all';
  const dexSpriteMode = store.state.dexSpriteMode === 'animated' ? 'animated' : 'static';

  useEffect(() => {
    const refresh = () => forceRefresh((n) => n + 1);
    window.addEventListener('ppgc:auth:changed', refresh);
    return () => window.removeEventListener('ppgc:auth:changed', refresh);
  }, []);

  async function handleIconChange(icon) {
    const accBtn = document.getElementById('ppgc-account-button');
    if (accBtn) accBtn.dataset.icon = icon;

    if (!currentUser || !window.PPGC?.api?.updateMe) {
      forceRefresh((n) => n + 1);
      return;
    }

    try {
      const res = await window.PPGC.api.updateMe({ icon });
      if (res?.user) window.PPGC.currentUser = res.user;
    } catch (err) {
      console.debug('[account] failed to update icon (ignored):', err);
    } finally {
      forceRefresh((n) => n + 1);
    }
  }

  return (
    <section className="card account-section" id="account-section-general">
      <div className="card-hd">
        <h2>Account</h2>
      </div>
      <div className="card-bd">
        <div className="account-meta" id="accountMeta">
          <div><strong>Email:</strong> {currentUser?.email || '(not signed in)'}</div>
          <div><strong>Status:</strong> {signedIn ? 'Signed in' : 'Guest'}</div>
        </div>

        <div className="account-actions">
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

        <div className="account-icon-picker">
          <h3>Poké Ball icon</h3>
          <div className="account-icon-grid">
            {[
              { key: 'default', label: 'Poké Ball', emoji: '⚪' },
              { key: 'great', label: 'Great Ball', emoji: '🔵' },
              { key: 'ultra', label: 'Ultra Ball', emoji: '🟡' },
            ].map((icon) => (
              <button
                key={icon.key}
                type="button"
                className={`account-icon-option ${currentIcon === icon.key ? 'selected' : ''}`}
                data-icon={icon.key}
                title={icon.label}
                onClick={() => handleIconChange(icon.key)}
              >
                <span>{icon.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="account-preferences">
          <h3>Preferences</h3>
          <div className="account-pref-block">
            <div className="account-pref-title">Overall game progress bar</div>
            <p className="small">
              Controls how the gold bar at the top of <strong>Game Summary — All Games</strong> is calculated.
            </p>
            <div className="account-pref-options">
              <label>
                <input
                  type="radio"
                  name="gameSummaryMode"
                  value="all"
                  checked={aggregateMode === 'all'}
                  onChange={() => {
                    store.state.gameSummaryAggregateMode = 'all';
                    save();
                    window.PPGC?.renderAll?.();
                  }}
                />
                Use all games
              </label>
              <label>
                <input
                  type="radio"
                  name="gameSummaryMode"
                  value="started"
                  checked={aggregateMode === 'started'}
                  onChange={() => {
                    store.state.gameSummaryAggregateMode = 'started';
                    save();
                    window.PPGC?.renderAll?.();
                  }}
                />
                Use started games only
              </label>
            </div>
          </div>

          <div className="account-pref-block">
            <div className="account-pref-title">Pokédex sprites (Gen 5+)</div>
            <p className="small">
              Choose between static sprites (PNG) and animated sprites (WebM). Animated sprites only apply for games from <strong>Black/White</strong> onward.
            </p>
            <div className="account-pref-options">
              <label className="small" htmlFor="account-dex-sprite-mode" style={{ display: 'block', marginBottom: 6 }}>
                Sprite mode
              </label>
              <select
                id="account-dex-sprite-mode"
                className="flag-select"
                style={{ minWidth: 220 }}
                value={dexSpriteMode}
                onChange={(event) => {
                  store.state.dexSpriteMode = event.target.value === 'animated' ? 'animated' : 'static';
                  save();
                  window.PPGC?.renderDexGridIfOpen?.();
                  window.PPGC?.renderAll?.();
                }}
              >
                <option value="static">Static (PNG)</option>
                <option value="animated">Animated (WebM)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatTs(ts) {
  if (!ts) return 'never';
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
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
          Uses the same backup folder and settings as before: choose a folder once, then run manual backup/import as needed.
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
                  Click <strong>Backup</strong> to save.<br />
                  Click <strong>Import</strong> to restore from folder.
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
              <div className="backup-auto-title">Automatic backups</div>
              <div className="backup-auto-hint small">
                When enabled, the app will periodically back up to your chosen folder.
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
                Choose or change the folder that backups are written to.
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
          Choose a supported game and upload a <code>.sav</code> file. We’ll preview all task changes before applying them.
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
          <div className="account-tab-row">
            {ACCOUNT_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`button ${activeTab === tab.key ? 'primary' : ''}`}
                onClick={() => setAccountTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'general' ? <GeneralTab /> : null}
          {activeTab === 'backup' ? <BackupTab /> : null}
          {activeTab === 'import' ? <SaveImportTab /> : null}
        </div>
      </div>
    </div>
  );
}

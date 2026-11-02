import React from "react";
import { ModalShell } from "./ModalShell.jsx";
import { ModalCloseButton } from "./ModalCloseButton.jsx";

export function DexModalCompact() {
	return (
		<ModalShell id="modal" className="modal" hidden>
			<div
				className="sheet"
				role="dialog"
				aria-modal="true"
				aria-labelledby="modalTitle"
			>
				<header className="dex-modal-header">
					<div className="dex-header-title-group">
						<h2
							id="modalTitle"
							className="dex-modal-fallback-title"
						>
							Pokédex
						</h2>
						<div id="dexScopeMount" className="dex-scope-mount" />
					</div>
					<div className="dex-header-search-row">
						<label className="visually-hidden" htmlFor="dexSearch">
							Search Pokédex
						</label>
						<input
							id="dexSearch"
							className="flag-select dex-search-input"
							type="text"
							placeholder="Search name or number"
							autoComplete="off"
							autoCorrect="off"
							autoCapitalize="off"
							spellCheck="false"
							data-gramm="false"
							data-lpignore="true"
							data-1p-ignore="true"
							data-form-type="other"
						/>
						<details
							id="dexFilterSettings"
							className="dex-filter-settings"
						>
							<summary>
								Filters
								<span id="dexFilterCount" hidden />
							</summary>
							<div className="dex-filter-panel">
								<label>
									<span>Status</span>
									<select id="dexFilterStatus" />
								</label>
								<label>
									<span>Form</span>
									<select id="dexFilterForm" />
								</label>
								<label>
									<span>Species</span>
									<select id="dexFilterSpecies" />
								</label>
								<label>
									<span>Type</span>
									<select id="dexFilterType" />
								</label>
								<label>
									<span>Evolution</span>
									<select id="dexFilterEvolution" />
								</label>
								<label>
									<span>Stage</span>
									<select id="dexFilterStage" />
								</label>
								<label className="dex-filter-location">
									<span>Location contains</span>
									<input
										id="dexFilterLocation"
										type="search"
									/>
								</label>
								<button
									id="dexFilterClear"
									className="button dex-filter-clear"
									type="button"
								>
									Clear filters
								</button>
							</div>
						</details>
						<label
							className="visually-hidden"
							htmlFor="dexClearAll"
						>
							Set every entry to a status
						</label>
						<select
							id="dexClearAll"
							className="flag-select dex-bulk-select"
							aria-label="Set all entries to status"
						>
							<option value="">Set all…</option>
						</select>
						<details className="dex-sync-settings">
							<summary>Sync</summary>
							<div className="dex-sync-settings-panel">
								<label
									className="dex-sync-toggle"
									htmlFor="taskDexSyncToggle"
								>
									<input
										id="taskDexSyncToggle"
										type="checkbox"
									/>
									<span>Checklist → Dex</span>
								</label>
								<label
									className="dex-sync-toggle"
									htmlFor="dexTaskSyncToggle"
								>
									<input
										id="dexTaskSyncToggle"
										type="checkbox"
									/>
									<span>Dex → Checklist</span>
								</label>
								<p id="dexTaskSyncDescription">
									Checklist updates are enabled by default.
									Dex entries only complete linked encounter
									tasks when the reverse option is enabled.
								</p>
								<button
									id="dexTaskSyncReconcile"
									className="button dex-sync-reconcile"
									type="button"
									disabled
								>
									Apply current Caught entries
								</button>
							</div>
						</details>
						<ModalCloseButton
							id="modalClose"
							className="button dex-close-button"
							label="Close Pokédex"
						/>
					</div>
				</header>
				<div
					id="dexStatusMessage"
					className="visually-hidden"
					role="status"
					aria-live="polite"
					aria-atomic="true"
				/>
				<div className="body">
					<div id="dexGrid" className="grid" role="list" />
				</div>
			</div>
		</ModalShell>
	);
}

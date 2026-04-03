import { save } from "../store.js";
import { registerKeywordSectionMeter } from "./helpers.js";

function _getGameMedals(gameKey) {
	const m = window.DATA?.medals?.[gameKey];
	return m?.sections || [];
}

function _key(sectionId, medalId) {
	return `${sectionId}:${medalId}`;
}

function _getRec(store, gameKey) {
	if (!store.medalStatus) store.medalStatus = new Map();
	return store.medalStatus.get(gameKey) || {};
}

function _setRec(store, gameKey, rec) {
	if (!store.medalStatus) store.medalStatus = new Map();
	store.medalStatus.set(gameKey, rec);
}

function _isChecked(store, gameKey, sectionId, medalId) {
	const rec = _getRec(store, gameKey);
	return !!rec[_key(sectionId, medalId)];
}

function _setChecked(store, gameKey, sectionId, medalId, checked) {
	const rec = { ..._getRec(store, gameKey) };
	rec[_key(sectionId, medalId)] = !!checked;
	_setRec(store, gameKey, rec);
}

function _sectionProgress(store, gameKey, section) {
	const items = section.items || [];
	const total = items.length;
	let done = 0;
	for (const it of items) {
		if (_isChecked(store, gameKey, section.id, it.id)) done++;
	}
	return { done, total, pct: total ? (done / total) * 100 : 0 };
}

export function medalsPctForGame(gameKey, store) {
	const secs = _getGameMedals(gameKey);
	let done = 0;
	let total = 0;
	for (const sec of secs) {
		const p = _sectionProgress(store, gameKey, sec);
		done += p.done;
		total += p.total;
	}
	return total ? (done / total) * 100 : 0;
}

// Progress ring support when a section is tagged/keyworded "medals"
registerKeywordSectionMeter({
	keyword: "medals",
	pctFn(gameKey, store) {
		return medalsPctForGame(gameKey, store);
	},
	flagProp: "__ppgcMedalsMeter",
	exposeName: "medalsPctForGame",
});

export function medalsSectionCardFor(gameKey, genKey, sectionId, store) {
	const game = (window.DATA.games?.[genKey] || []).find((g) => g.key === gameKey);
	const sec = _getGameMedals(gameKey).find((s) => s.id === sectionId);
	if (!sec) return document.createTextNode("");

	const p = _sectionProgress(store, gameKey, sec);
	const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;

	const card = document.createElement("section");
	card.className = "card";
	card.style.setProperty("--accent", game?.color || "#7fd2ff");

	const key = `${gameKey}:${sectionId}`;
	card.setAttribute("data-medals-section-summary", key);

	card.innerHTML = `
		<div class="card-hd">
			<h3>${sec.label || sec.id} — <span class="small">${game?.label || gameKey}</span></h3>
			<div>
				<button class="button" data-open-medals-section>Open ${sec.label || "Medals"}</button>
			</div>
		</div>
		<div class="card-bd">
			<div class="small" data-medals-section-summary-text>${p.done} / ${p.total} (${pct}%)</div>
			<div class="progress">
				<span class="base" data-medals-section-summary-bar style="width:${pct}%"></span>
			</div>
		</div>
	`;

	card.querySelector("[data-open-medals-section]")?.addEventListener("click", () => {
		window.PPGC?.medalsApi?.openMedalsModal(gameKey, genKey, sectionId);
	});

	return card;
}

export function wireMedalsModal(store, els) {
	const {
		medalsModal,
		medalsModalClose,
		medalsSelectAll,
		medalsClearAll,
		medalsGrid,
		medalsModalTitle,
		medalsSearch,
	} = els;

	const state = {
		gameKey: null,
		genKey: null,
		query: "",
		sectionId: null,
	};

	const refreshSummaryCard = (gameKey) => {
		const host = document.querySelector(`[data-medals-summary="${gameKey}"]`);
		if (!host) return;

		const secs = _getGameMedals(gameKey);
		let done = 0;
		let total = 0;
		for (const sec of secs) {
			const p = _sectionProgress(store, gameKey, sec);
			done += p.done;
			total += p.total;
		}
		const pct = total ? Math.round((done / total) * 100) : 0;

		const txt = host.querySelector("[data-medals-summary-text]");
		const bar = host.querySelector("[data-medals-summary-bar]");
		if (txt) txt.textContent = `${done} / ${total} (${pct}%)`;
		if (bar) bar.style.width = `${pct}%`;
	};

	const refreshSectionHeader = () => {
		// same pattern used in fashion.js: update current section header bar + %
		window.PPGC?.refreshSectionHeaderPct?.();
	};

	const getFiltered = () => {
		const q = (state.query || "").trim().toLowerCase();
		let secs = _getGameMedals(state.gameKey);

		// ✅ scope to one section (fashion category style)
		if (state.sectionId) {
			secs = secs.filter((s) => s.id === state.sectionId);
		}

		if (!q) return secs;

		return secs
			.map((sec) => {
				const items = (sec.items || []).filter((it) => {
					const hay = `${it.name || ""} ${it.num || ""}`.toLowerCase();
					return hay.includes(q);
				});
				return { ...sec, items };
			})
			.filter((sec) => (sec.items || []).length > 0);
	};

	medalsGrid?.classList.add("grid");
	const render = () => {
		if (!medalsGrid) return;

		// ✅ Match fashion behavior: the actual modal grid node is the grid container
		medalsGrid.classList.add("grid");
		medalsGrid.innerHTML = "";

		const secs = getFiltered();

		for (const sec of secs) {
			for (const it of sec.items || []) {
				const card = document.createElement("article");
				card.className = "card";

				const url =
					typeof it.img === "function"
						? it.img({ gameKey: state.gameKey, genKey: state.genKey })
						: (it.img ? String(it.img) : "");

				card.innerHTML = `
					<div class="thumb">
						<div class="name" title="${it.id}">
							#${String(it.num ?? it.id).padStart(3, "0")}
						</div>

						${url
						? `<img
									class="sprite"
									alt="${it.name}"
									src="${url}"
									loading="lazy"
									style="width:132px;height:132px;object-fit:contain;"
								/>`
						: `<div style="opacity:.5;">No image</div>`
					}
					</div>

					<div class="card-bd">
         			<div class="name" title="${it.name}" data-id="${it.id}">${it.name}</div>

						<div class="row">
							<label class="small" style="display:inline-flex;gap:8px;align-items:center;">
								<input type="checkbox" data-medal-check="${sec.id}:${it.id}" />
								<span>Earned</span>
							</label>
						</div>
					</div>
				`;

				const chk = card.querySelector(
					`[data-medal-check="${sec.id}:${it.id}"]`
				);

				if (chk instanceof HTMLInputElement) {
					chk.checked = _isChecked(store, state.gameKey, sec.id, it.id);

					chk.addEventListener("change", () => {
						_setChecked(store, state.gameKey, sec.id, it.id, chk.checked);
						save();

						// keep everything else in sync
						refreshSummaryCard?.(state.gameKey);
						refreshSectionHeader();
					});
				}

				medalsGrid.appendChild(card);
			}
		}
	};


	const setAllVisible = (checked) => {
		const secs = getFiltered();
		for (const sec of secs) {
			for (const it of sec.items || []) {
				_setChecked(store, state.gameKey, sec.id, it.id, checked);
			}
		}
		save();
		render();
		refreshSummaryCard(state.gameKey);
		refreshSectionHeader();
	};

	function closeMedalsModal() {
		const returnEl = medalsModal.__returnFocusEl;

		// If focus is inside the modal, remove it first
		if (document.activeElement && medalsModal.contains(document.activeElement)) {
			document.activeElement.blur?.();
		}

		// Restore focus to opener (or safe fallback)
		if (returnEl && typeof returnEl.focus === "function") {
			returnEl.focus({ preventScroll: true });
		} else {
			document.querySelector("#content")?.focus?.({ preventScroll: true });
		}

		// NOW it is safe to hide the modal
		medalsModal.classList.remove("open");
		medalsModal.setAttribute("aria-hidden", "true");
	}

	medalsSelectAll?.addEventListener("click", () => setAllVisible(true));
	medalsClearAll?.addEventListener("click", () => setAllVisible(false));
	medalsModalClose?.addEventListener("click", closeMedalsModal);

	if (medalsSearch instanceof HTMLInputElement) {
		medalsSearch.addEventListener("input", () => {
			state.query = medalsSearch.value || "";
			render();
		});
	}

	function openMedalsModal(gameKey, genKey, sectionId = null) {
		state.gameKey = gameKey;
		state.genKey = genKey;
		state.query = "";
		state.sectionId = sectionId;
		if (medalsSearch instanceof HTMLInputElement) medalsSearch.value = "";

		if (medalsModalTitle) {
			const game = (window.DATA.games?.[genKey] || []).find((g) => g.key === gameKey);
			const sec = sectionId ? _getGameMedals(gameKey).find((s) => s.id === sectionId) : null;

			medalsModalTitle.textContent = sec
				? `${game?.label || gameKey} — ${sec.label || sec.id}`
				: `${game?.label || gameKey} — Medals`;
		}

		medalsModal.__returnFocusEl = document.activeElement;
		medalsModal?.classList.add("open");
		medalsModal.setAttribute("aria-hidden", "false");
		render();
	}

	return { openMedalsModal, renderMedalsGridIfOpen: render };
}

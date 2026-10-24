/**
 * Configuration-driven adapter for curry, sandwich, and sticker collections.
 *
 * Persisted map names and `data-*` attributes are passed through unchanged;
 * this module only centralizes behavior that was previously copied three times.
 */
import { getGameColor } from "./modal.js";
import { getGameCollection, registerKeywordSectionMeter } from "./helpers.js";
import {
	collectibleItemProgress,
	collectiblePctFor,
	ensureStatusMap,
	getCollectibleFormsNode,
	setCollectibleFormsNode,
	updateCollectibleSectionHeader,
} from "./collectibles-core.js";
import { openCollectibleForms } from "./collectibles-forms.js";

export function createCollectibleAdapter({
	kind,
	statusMapName,
	formsMapName,
	meterFlagProperty,
	percentageExportName,
	scaleMode,
	formsImageWidth,
	singleItemActionLabel,
}) {
	const getStatusMap = (store, gameKey) =>
		ensureStatusMap(store, statusMapName, gameKey);
	const getFormsNode = (store, gameKey, itemId) =>
		getCollectibleFormsNode(store, formsMapName, gameKey, itemId);
	const setFormsNode = (store, gameKey, itemId, node) =>
		setCollectibleFormsNode(store, formsMapName, gameKey, itemId, node);
	const getItemProgress = (store, gameKey, item) =>
		collectibleItemProgress(store, {
			statusMapName,
			formsMapName,
			gameKey,
			item,
		});

	const percentageFor = (gameKey, store) =>
		collectiblePctFor(gameKey, store, getGameCollection(kind, gameKey), {
			statusMapName,
			formsMapName,
		});

	registerKeywordSectionMeter({
		keyword: kind,
		flagProp: meterFlagProperty,
		exposeName: percentageExportName,
		pctFn: percentageFor,
	});

	const updateSectionHeader = (gameKey) =>
		updateCollectibleSectionHeader(gameKey, percentageFor);

	const openForms = (store, gameKey, genKey, item) =>
		openCollectibleForms({
			store,
			gameKey,
			genKey,
			item,
			kind,
			scaleMode,
			imgWidth: formsImageWidth,
			getFormsNode,
			setFormsNode,
			onHeaderUpdate: updateSectionHeader,
		});

	const renderCardsFor = (gameKey, genKey, store) => {
		const items = getGameCollection(kind, gameKey);
		if (!items.length) return null;

		const grid = document.createElement("div");
		grid.id = `${kind}Grid`;
		grid.className = "grid";
		const accent = getGameColor(gameKey, genKey);

		for (const item of items) {
			if (!item) continue;
			const hasForms = Array.isArray(item.forms) && item.forms.length > 0;
			const itemKey = String(item.id);
			const { done, total } = getItemProgress(store, gameKey, item);
			const card = document.createElement("article");
			card.className = "card card--forms-footer";
			card.style.setProperty("--accent", accent);
			card.dataset[`${kind}Id`] = itemKey;

			const label =
				item.label ||
				item.name ||
				`${kind[0].toUpperCase()}${kind.slice(1)} #${item.id}`;
			card.innerHTML = `
				${item.img ? `<div class="thumb"><img loading="lazy" alt="${label}" src="${item.img}"></div>` : ""}
				<div class="card-bd">
					<div class="name" title="${label}" data-id="${item.id}">${label}</div>
					<div class="row forms-row collectible-card-actions">
						${
							hasForms
								? `<button class="forms-launch" type="button" data-open-${kind}-forms="${itemKey}">
									<span class="dot"></span><span>Forms</span>
									<span class="pill count" data-${kind}-count="${itemKey}">${done}/${total}</span>
								</button>`
								: `<label class="small collectible-card-checkbox">
									<input type="checkbox" data-${kind}-main="${itemKey}" ${done > 0 ? "checked" : ""}>
									<span>${singleItemActionLabel}</span>
								</label>`
						}
					</div>
				</div>`;

			if (!hasForms) {
				const checkbox = card.querySelector(
					`[data-${kind}-main="${itemKey}"]`,
				);
				if (checkbox instanceof HTMLInputElement) {
					checkbox.addEventListener("change", () => {
						const statusMap = getStatusMap(store, gameKey);
						statusMap[itemKey] = checkbox.checked;
						store[statusMapName].set(gameKey, statusMap);
						store.save?.();
						updateSectionHeader(gameKey);
					});
				}
			} else {
				card.querySelector(
					`[data-open-${kind}-forms="${itemKey}"]`,
				)?.addEventListener("click", (event) => {
					event.stopPropagation();
					event.preventDefault();
					openForms(store, gameKey, genKey, item);
				});
			}

			grid.appendChild(card);
		}

		return grid;
	};

	return { percentageFor, renderCardsFor };
}

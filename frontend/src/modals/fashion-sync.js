import { save } from "../store.js";
import { getGameFashion, getFormsNode, setFormsNode } from "./fashion-core.js";

export function createApplyFashionSyncForItem(store, { updateFashionSummaryCard, refreshSectionHeader }) {
	return function applyFashionSyncForItem(gameKey, categoryId, item, checked) {
		try {
			const links = Array.isArray(item.fashionSync) ? item.fashionSync : typeof item.fashionSync === "string" || typeof item.fashionSync === "number" ? [item.fashionSync] : [];
			if (!links.length) return;
			const cats = getGameFashion(gameKey);
			if (!cats.length) return;
			const touchedCats = new Set();
			const setSimpleItem = (catId, targetItem) => {
				let gameMap = store.fashionStatus.get(gameKey);
				if (!gameMap) { gameMap = new Map(); store.fashionStatus.set(gameKey, gameMap); }
				const rec = gameMap.get(catId) || {};
				rec[targetItem.id] = !!checked;
				gameMap.set(catId, rec);
				touchedCats.add(catId);
				const mainChk = document.querySelector(`[data-fashion-main="${gameKey}:${catId}:${targetItem.id}"]`);
				if (mainChk instanceof HTMLInputElement) mainChk.checked = !!checked;
			};
			const setFormsItem = (catId, targetItem) => {
				const { obj } = getFormsNode(store, gameKey, catId, targetItem.id);
				const forms = targetItem.forms || [];
				obj.forms = obj.forms || {};
				for (const f of forms) {
					const name = typeof f === "string" ? f : f?.name;
					if (!name) continue;
					obj.forms[name] = !!checked;
				}
				obj.all = !!checked;
				setFormsNode(store, gameKey, catId, targetItem.id, obj);
				touchedCats.add(catId);
				const mainChk = document.querySelector(`[data-fashion-main="${gameKey}:${catId}:${targetItem.id}"]`);
				if (mainChk instanceof HTMLInputElement) mainChk.checked = !!obj.all;
			};
			const visitTarget = (link) => {
				if (!link) return;
				let targetCatId = null;
				let targetId = null;
				if (typeof link === "object") { targetCatId = link.categoryId || link.category || link.dexType; targetId = link.id; }
				else targetId = link;
				if (!targetId) return;
				const targetIdStr = String(targetId);
				const candidates = [];
				if (targetCatId) {
					const cat = cats.find((c) => c.id === targetCatId);
					if (!cat) return;
					for (const it2 of cat.items || []) if (String(it2.id) === targetIdStr) candidates.push({ catId: cat.id, item: it2 });
				} else {
					for (const cat of cats) for (const it2 of cat.items || []) if (String(it2.id) === targetIdStr) candidates.push({ catId: cat.id, item: it2 });
				}
				for (const { catId, item: hit } of candidates) {
					const hasForms = Array.isArray(hit.forms) && hit.forms.length > 0;
					if (hasForms) setFormsItem(catId, hit); else setSimpleItem(catId, hit);
				}
			};
			for (const link of links) {
				if (!checked && (link?.oneWay === true || link?.sink === true || link?.sinkOnly === true)) continue;
				visitTarget(link);
			}
			save();
			for (const catId of touchedCats) updateFashionSummaryCard(gameKey, catId);
			refreshSectionHeader();
		} catch (e) {
			console.error("applyFashionSyncForItem error:", e);
		}
	};
}

export function resolveFashionImg(imgLike, gameKey) {
	if (!imgLike) return "";
	if (typeof imgLike === "function") {
		try { return imgLike({ gameKey }) || ""; }
		catch (e) { console.warn("Fashion img resolver failed:", e); return ""; }
	}
	return String(imgLike);
}

const DEFAULT_OVERSCAN_PX = 640;

/**
 * Stop media before a virtual card is detached. Clearing the source prevents
 * offscreen animated sprites from continuing to decode after their card leaves
 * the viewport.
 */
function stopSlotMedia(slot) {
	if (!slot?.querySelectorAll) return;
	for (const video of slot.querySelectorAll("video")) {
		video.pause?.();
		video.removeAttribute("src");
		video.load?.();
	}
}

/**
 * Render lightweight grid slots and mount full cards only near the scroll root.
 * Slots preserve the complete scroll range while bounding expensive card and
 * media nodes to the viewport plus a small overscan area.
 */
export function createDexVirtualGrid({
	dexGrid,
	items,
	buildCard,
	root = null,
	isCurrent = () => true,
	observerFactory = null,
	overscanPx = DEFAULT_OVERSCAN_PX,
}) {
	const ownerDocument = dexGrid.ownerDocument || document;
	const fragment = ownerDocument.createDocumentFragment();
	const slots = items.map((item, index) => {
		const slot = ownerDocument.createElement("div");
		slot.className = "dex-virtual-slot";
		if (item?.forms?.length && item?.research?.length) {
			slot.classList.add("dex-virtual-slot--dual-actions");
		}
		slot.dataset.dexVirtualIndex = String(index);
		slot.setAttribute("aria-hidden", "true");
		fragment.appendChild(slot);
		return slot;
	});

	dexGrid.classList.add("dex-grid--virtualized");
	dexGrid.appendChild(fragment);

	let isDisposed = false;
	const mountSlot = (slot) => {
		if (isDisposed || !isCurrent() || slot.firstElementChild) return;
		const index = Number(slot.dataset.dexVirtualIndex);
		const item = items[index];
		if (!item) return;
		const card = buildCard(item);
		if (isDisposed || !isCurrent()) {
			stopSlotMedia(card);
			return;
		}
		slot.replaceChildren(card);
		slot.removeAttribute("aria-hidden");
	};

	const unmountSlot = (slot) => {
		if (!slot.firstElementChild) return;
		// A focused select or button must not disappear during keyboard use.
		if (slot.contains(ownerDocument.activeElement)) return;
		stopSlotMedia(slot);
		slot.replaceChildren();
		slot.setAttribute("aria-hidden", "true");
	};

	const defaultView = ownerDocument.defaultView || globalThis;
	const canObserve =
		observerFactory ||
		typeof defaultView.IntersectionObserver === "function";
	let observer = null;

	if (canObserve) {
		const onIntersection = (entries) => {
			if (isDisposed || !isCurrent()) return;
			for (const entry of entries) {
				if (entry.isIntersecting || entry.intersectionRatio > 0) {
					mountSlot(entry.target);
				} else {
					unmountSlot(entry.target);
				}
			}
		};
		const options = {
			root,
			rootMargin: `${Math.max(0, overscanPx)}px 0px`,
			threshold: 0,
		};
		observer = observerFactory
			? observerFactory(onIntersection, options)
			: new defaultView.IntersectionObserver(onIntersection, options);
		for (const slot of slots) observer.observe(slot);
	} else {
		// Preserve full functionality in older or test environments without IO.
		for (const slot of slots) mountSlot(slot);
	}

	return {
		slots,
		dispose() {
			if (isDisposed) return;
			isDisposed = true;
			observer?.disconnect();
			for (const slot of slots) {
				stopSlotMedia(slot);
				slot.replaceChildren();
			}
		},
	};
}

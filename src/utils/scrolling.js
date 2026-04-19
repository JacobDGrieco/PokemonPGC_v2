function scrollNodeToTop(node) {
	if (!node) return;
	try {
		if (typeof node.scrollTo === "function") {
			node.scrollTo({ top: 0, left: 0, behavior: "auto" });
			return;
		}
	} catch { }

	try {
		node.scrollTop = 0;
	} catch { }

	try {
		node.scrollLeft = 0;
	} catch { }
}

export function resetScrollWithin(root, { includeRoot = true } = {}) {
	if (!root) return;

	const seen = new Set();
	const visit = (node) => {
		if (!node || seen.has(node)) return;
		seen.add(node);
		scrollNodeToTop(node);
	};

	if (includeRoot) visit(root);
	if (typeof root.querySelectorAll === "function") {
		root.querySelectorAll("*").forEach(visit);
	}
}

export function resetAppContentScroll() {
	scrollNodeToTop(window);
	scrollNodeToTop(document.scrollingElement);
	scrollNodeToTop(document.documentElement);
	scrollNodeToTop(document.body);
	scrollNodeToTop(document.getElementById("content"));
	scrollNodeToTop(document.getElementById("legacy-content-root"));
}

export function scheduleAppContentScrollReset() {
	window.requestAnimationFrame(() => {
		resetAppContentScroll();
	});
}

export function scrollElementToTop(node) {
	scrollNodeToTop(node);
}

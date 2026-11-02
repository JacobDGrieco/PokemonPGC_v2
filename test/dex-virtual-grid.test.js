import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createDexVirtualGrid } from "../src/modals/dex-virtual-grid.js";

class FakeClassList {
	values = new Set();

	add(...names) {
		for (const name of names) this.values.add(name);
	}
}

class FakeElement {
	constructor(ownerDocument, tagName = "div") {
		this.ownerDocument = ownerDocument;
		this.tagName = tagName.toUpperCase();
		this.children = [];
		this.dataset = {};
		this.attributes = new Map();
		this.classList = new FakeClassList();
		this.className = "";
	}

	appendChild(node) {
		if (node.isFragment) {
			this.children.push(...node.children);
			return node;
		}
		this.children.push(node);
		return node;
	}

	replaceChildren(...nodes) {
		this.children = nodes;
	}

	get firstElementChild() {
		return this.children[0] || null;
	}

	setAttribute(name, value) {
		this.attributes.set(name, String(value));
	}

	removeAttribute(name) {
		this.attributes.delete(name);
	}

	contains(node) {
		if (this === node) return true;
		return this.children.some((child) => child.contains?.(node));
	}

	querySelectorAll(selector) {
		const matches = [];
		for (const child of this.children) {
			if (selector === "video" && child.tagName === "VIDEO") {
				matches.push(child);
			}
			matches.push(...(child.querySelectorAll?.(selector) || []));
		}
		return matches;
	}
}

class FakeDocument {
	constructor() {
		this.activeElement = null;
		this.defaultView = {};
	}

	createElement(tagName) {
		return new FakeElement(this, tagName);
	}

	createDocumentFragment() {
		return {
			isFragment: true,
			children: [],
			appendChild(node) {
				this.children.push(node);
			},
		};
	}
}

function makeVideo(document) {
	const video = document.createElement("video");
	video.setAttribute("src", "/sprite.webm");
	video.pauseCount = 0;
	video.loadCount = 0;
	video.pause = () => {
		video.pauseCount += 1;
	};
	video.load = () => {
		video.loadCount += 1;
	};
	return video;
}

test("Dex virtual grid mounts only intersecting cards and releases video", () => {
	const document = new FakeDocument();
	const dexGrid = document.createElement("section");
	const root = document.createElement("div");
	let intersectionCallback;
	let observerOptions;
	let didDisconnect = false;
	const observed = [];
	let buildCount = 0;
	let mountedVideo;

	const virtualGrid = createDexVirtualGrid({
		dexGrid,
		items: [{ id: 1 }, { id: 2, forms: [{}], research: [{}] }, { id: 3 }],
		root,
		buildCard: (item) => {
			buildCount += 1;
			const card = document.createElement("article");
			card.dataset.id = String(item.id);
			mountedVideo = makeVideo(document);
			card.appendChild(mountedVideo);
			return card;
		},
		observerFactory: (callback, options) => {
			intersectionCallback = callback;
			observerOptions = options;
			return {
				observe: (slot) => observed.push(slot),
				disconnect: () => {
					didDisconnect = true;
				},
			};
		},
	});

	assert.equal(virtualGrid.slots.length, 3);
	assert.equal(observed.length, 3);
	assert.equal(buildCount, 0);
	assert.equal(observerOptions.root, root);
	assert.equal(observerOptions.rootMargin, "640px 0px");

	intersectionCallback([
		{
			target: virtualGrid.slots[1],
			isIntersecting: true,
			intersectionRatio: 1,
		},
	]);
	assert.equal(buildCount, 1);
	assert.equal(virtualGrid.slots[1].firstElementChild.dataset.id, "2");
	assert.equal(virtualGrid.slots[1].attributes.has("aria-hidden"), false);
	assert.equal(
		virtualGrid.slots[1].classList.values.has(
			"dex-virtual-slot--dual-actions",
		),
		true,
	);

	intersectionCallback([
		{
			target: virtualGrid.slots[1],
			isIntersecting: false,
			intersectionRatio: 0,
		},
	]);
	assert.equal(virtualGrid.slots[1].firstElementChild, null);
	assert.equal(mountedVideo.pauseCount, 1);
	assert.equal(mountedVideo.loadCount, 1);
	assert.equal(mountedVideo.attributes.has("src"), false);

	virtualGrid.dispose();
	assert.equal(didDisconnect, true);
});

test("Dex virtual grid keeps a focused card mounted", () => {
	const document = new FakeDocument();
	const dexGrid = document.createElement("section");
	let intersectionCallback;
	const virtualGrid = createDexVirtualGrid({
		dexGrid,
		items: [{ id: 1 }],
		buildCard: () => document.createElement("article"),
		observerFactory: (callback) => {
			intersectionCallback = callback;
			return { observe() {}, disconnect() {} };
		},
	});

	const [slot] = virtualGrid.slots;
	intersectionCallback([
		{ target: slot, isIntersecting: true, intersectionRatio: 1 },
	]);
	document.activeElement = slot.firstElementChild;
	intersectionCallback([
		{ target: slot, isIntersecting: false, intersectionRatio: 0 },
	]);

	assert.notEqual(slot.firstElementChild, null);
});

test("Dex virtual grid bounds full cards for a large result set", () => {
	const document = new FakeDocument();
	const dexGrid = document.createElement("section");
	let intersectionCallback;
	let buildCount = 0;
	const items = Array.from({ length: 1025 }, (_, index) => ({
		id: index + 1,
	}));
	const virtualGrid = createDexVirtualGrid({
		dexGrid,
		items,
		buildCard: () => {
			buildCount += 1;
			return document.createElement("article");
		},
		observerFactory: (callback) => {
			intersectionCallback = callback;
			return { observe() {}, disconnect() {} };
		},
	});

	intersectionCallback(
		virtualGrid.slots.slice(400, 432).map((slot) => ({
			target: slot,
			isIntersecting: true,
			intersectionRatio: 1,
		})),
	);

	assert.equal(virtualGrid.slots.length, 1025);
	assert.equal(buildCount, 32);
	assert.equal(
		virtualGrid.slots.filter((slot) => slot.firstElementChild).length,
		32,
	);
});

test("Dex virtual grid preserves functionality without IntersectionObserver", () => {
	const document = new FakeDocument();
	const dexGrid = document.createElement("section");
	let buildCount = 0;
	const virtualGrid = createDexVirtualGrid({
		dexGrid,
		items: [{ id: 1 }, { id: 2 }],
		buildCard: () => {
			buildCount += 1;
			return document.createElement("article");
		},
	});

	assert.equal(buildCount, 2);
	assert.ok(virtualGrid.slots.every((slot) => slot.firstElementChild));

	virtualGrid.dispose();
	assert.ok(virtualGrid.slots.every((slot) => !slot.firstElementChild));
});

test("Dex renderer uses virtualization and stable intrinsic dimensions", async () => {
	const [gridSource, modalSource, cardStyles, modalStyles] =
		await Promise.all([
			readFile(
				new URL("../src/modals/dex-grid.js", import.meta.url),
				"utf8",
			),
			readFile(new URL("../src/modals/dex.js", import.meta.url), "utf8"),
			readFile(new URL("../styles/cards.css", import.meta.url), "utf8"),
			readFile(
				new URL("../styles/modal-dex.css", import.meta.url),
				"utf8",
			),
		]);

	assert.match(gridSource, /createDexVirtualGrid/);
	assert.doesNotMatch(gridSource, /BATCH_SIZE/);
	assert.doesNotMatch(modalSource, /ensureMonInfoLoaded/);
	assert.match(modalSource, /disposeDexCards\(dexGrid, \{ clear: true \}\)/);
	assert.match(cardStyles, /contain-intrinsic-size:\s*190px 260px/);
	assert.match(modalStyles, /contain-intrinsic-size:\s*640px 76px/);
	assert.match(modalStyles, /\.dex-virtual-slot\s*\{/);
});

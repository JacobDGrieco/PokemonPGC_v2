import * as THREE from "three";

const __ppgcManifestCache = new Map();
const __ppgcTexManifestCache = new Map();

export function dirname(url) {
	const i = url.lastIndexOf("/");
	return i >= 0 ? url.slice(0, i + 1) : "";
}

// utils.js
export function basename(url) {
	const i = String(url || "").lastIndexOf("/");
	return i >= 0 ? url.slice(i + 1) : String(url || "");
}

export function stripExt(name) {
	return String(name || "").replace(/\.[^.]+$/, "");
}

export async function loadTexManifestForDir(texDir) {
	const manifestUrl = `${String(texDir || "")}textures.json`;
	if (__ppgcManifestCache.has(manifestUrl)) return __ppgcManifestCache.get(manifestUrl);

	let set = null;
	try {
		const res = await fetch(manifestUrl, { cache: "no-store" });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const arr = await res.json();
		if (!Array.isArray(arr)) throw new Error("textures.json is not an array");

		const norm = (x) => {
			const s = String(x || "");
			const i = Math.max(s.lastIndexOf("/"), s.lastIndexOf("\\"));
			const file = i >= 0 ? s.slice(i + 1) : s;
			return file.trim().toLowerCase();
		};

		set = new Set(arr.map(norm));
	} catch (e) {
		console.warn("[PPGC] Failed to load textures.json:", manifestUrl, e);
		set = new Set();
	}

	__ppgcManifestCache.set(manifestUrl, set);
	return set;
}

export async function loadTexManifestForGlb(glbUrl) {
	// ALWAYS assume:
	// glb:  .../models/0130/0130-f.glb   (or 0130.glb)
	// dir:  .../models/0130/
	// dex:  0130
	// man:  .../models/0130/0130/textures.json

	const dir = dirname(glbUrl);
	const fileStem = stripExt(basename(glbUrl));

	// Pull the first 4 digits from the filename (works for 0130, 0130-f, 0130_mega, etc.)
	const m = String(fileStem).match(/(\d{4})/);
	const dex = m ? m[1] : fileStem; // fallback (shouldn't happen)

	const manifestUrl = `${dir}${dex}/textures.json`;

	if (__ppgcManifestCache.has(manifestUrl)) return __ppgcManifestCache.get(manifestUrl);

	let set = null;
	try {
		const res = await fetch(manifestUrl, { cache: "no-store" });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const arr = await res.json();

		if (!Array.isArray(arr)) throw new Error("textures.json is not an array");
		const norm = (x) => {
			const s = String(x || "");
			// If manifest accidentally includes paths, strip to filename
			const i = Math.max(s.lastIndexOf("/"), s.lastIndexOf("\\"));
			const file = i >= 0 ? s.slice(i + 1) : s;
			return file.trim().toLowerCase();
		};

		set = new Set(arr.map(norm));
	} catch (e) {
		console.warn("[PPGC] Failed to load textures.json:", manifestUrl, e);
		set = new Set(); // empty => nothing loads (no probing)
	}

	__ppgcManifestCache.set(manifestUrl, set);
	return set;
}

// --- texture manifest support ---
// If present, this lets us avoid noisy 404 probes entirely.
export async function loadTextureManifest(texDir) {
	const dir = String(texDir || "");
	if (!dir) return null;

	if (__ppgcTexManifestCache.has(dir)) return __ppgcTexManifestCache.get(dir);

	let list = null;
	try {
		const res = await fetch(dir + "textures.json", { cache: "no-store" });
		if (res.ok) {
			const data = await res.json();
			if (Array.isArray(data)) list = data.map(String);
		}
	} catch {
		// ignore
	}

	__ppgcTexManifestCache.set(dir, list);
	return list;
}

export function loadTexture(loader, url, { srgb = false } = {}) {
	return new Promise((resolve, reject) => {
		loader.load(
			url,
			(tex) => {
				// glTF-style orientation expectations
				tex.flipY = false;

				// three r152+ uses colorSpace
				if (srgb && "colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;

				// IMPORTANT: Blender defaults to repeat; Three defaults to clamp.
				// If UVs go outside 0..1 (common for these), clamp makes the texture look "mapped wrong".
				tex.wrapS = THREE.RepeatWrapping;
				tex.wrapT = THREE.RepeatWrapping;
				tex.repeat.set(1, 1);

				tex.needsUpdate = true;

				resolve(tex);
			},
			undefined,
			reject
		);
	});
}

// try a list of filenames and take the first that exists+loads
export async function loadFirstTexture(loader, candidates, opts, manifestSet /* Set<string> | null */) {
	const list = Array.isArray(candidates) ? candidates : [];

	for (const url of list) {
		// ✅ Only load if it's in textures.json
		if (manifestSet) {
			const file = basename(url).trim().toLowerCase();
			if (!manifestSet.has(file)) continue;
		}

		try {
			return await loadTexture(loader, url, opts);
		} catch (_) {
			// ignore and continue
		}
	}
	return null;
}

export function swapUvChannelsIfNeeded(mesh, stem) {
	if (!mesh?.geometry?.attributes) return;

	// Only do this for body_b for now (your reported problem)
	if (stem !== "body_b" && stem !== "smoke") return;

	const g = mesh.geometry;
	const uv = g.getAttribute("uv");
	const uv2 = g.getAttribute("uv2");

	// If uv2 exists, try using it as the primary UVs.
	// This fixes the classic "mapped totally wrong" symptom.
	if (uv2) {
		if (uv) {
			// swap
			g.setAttribute("uv", uv2);
			g.setAttribute("uv2", uv);
		} else {
			// copy uv2 -> uv
			g.setAttribute("uv", uv2);
		}
		g.attributes.uv.needsUpdate = true;
		if (g.attributes.uv2) g.attributes.uv2.needsUpdate = true;
	}
}

export function logUvRangeOnce(mesh, stem) {
	if (stem !== "body_b") return;
	if (mesh.userData.__uvRangeLogged) return;
	mesh.userData.__uvRangeLogged = true;

	const g = mesh.geometry;
	const uv = g?.getAttribute?.("uv");
	if (!uv) return;

	let minU = Infinity, minV = Infinity, maxU = -Infinity, maxV = -Infinity;
	for (let i = 0; i < uv.count; i++) {
		const u = uv.getX(i), v = uv.getY(i);
		if (u < minU) minU = u;
		if (v < minV) minV = v;
		if (u > maxU) maxU = u;
		if (v > maxV) maxV = v;
	}
}

export function isEyeStem(stem) {
	return /^eye(\d+)?$/i.test(String(stem || ""));
}

export async function applyGenericTextureSetToScene(root3d, opts) {
	const {
		glbUrl,
		variant,
		eyeShaderMats,
		stemForMaterial,          // (matName) => stem | null
		buildCandidatesForStem,   // (texDir, stem) => { alb:[], nrm:[], lym:[], ao:[], rgn:[], mtl:[], msk:[], iris:[] }
		makeEyeMaterial,          // ({ matName, tex, glbUrl }) => THREE.Material
		makeBodyMaterial,         // ({ matName, tex, glbUrl, stem }) => THREE.Material
		postProcessMesh,          // optional: (mesh, stem) => void
	} = opts;

	const dir = dirname(glbUrl);
	const glbStem = stripExt(basename(glbUrl));
	const texDir = `${dir}${glbStem}/`;
	const manifestSet = await loadTexManifestForDir(texDir);
	const loader = new THREE.TextureLoader();

	const texManifest = opts.textureManifest || (await loadTextureManifest(texDir));
	const hasFile = texManifest
		? (name) => texManifest.includes(name)
		: null;

	// cache by stem/piece so we don't reload for multiple meshes/materials
	const cache = new Map();
	async function getTexSet(stem) {
		if (cache.has(stem)) return cache.get(stem);

		const cand = buildCandidatesForStem(texDir, stem);

		if (hasFile) {
			for (const k of Object.keys(cand)) {
				cand[k] = (cand[k] || []).filter((fullUrl) => {
					// fullUrl is like `${dir}body_a_alb.png`
					const file = basename(fullUrl);
					return hasFile(file);
				});
			}
		}

		const tex = {
			alb: await loadFirstTexture(loader, cand.alb || [], { srgb: true }, manifestSet),
			nrm: await loadFirstTexture(loader, cand.nrm || [], {}, manifestSet),
			lym: await loadFirstTexture(loader, cand.lym || [], {}, manifestSet),
			ao: await loadFirstTexture(loader, cand.ao || [], {}, manifestSet),
			rgn: await loadFirstTexture(loader, cand.rgn || [], {}, manifestSet),
			mtl: await loadFirstTexture(loader, cand.mtl || [], {}, manifestSet),
			msk: await loadFirstTexture(loader, cand.msk || [], {}, manifestSet),
			iris: await loadFirstTexture(loader, cand.iris || [], {}, manifestSet),
			emi: await loadFirstTexture(loader, cand.emi || [], {}, manifestSet),
		};

		cache.set(stem, tex);
		return tex;
	}

	// Build per-mesh replacement tasks (ScVi style) :contentReference[oaicite:6]{index=6}
	const jobs = new Map();

	root3d.traverse((o) => {
		if (!o?.isMesh) return;

		const mats = Array.isArray(o.material) ? o.material : [o.material];
		const tasks = mats.map((oldMat) => (async () => {
			const matName = oldMat?.name || "";
			const stem = stemForMaterial(matName);
			if (!stem) return oldMat;
			const tex = await getTexSet(stem);

			if (stem === "LIris" || stem === "RIris") {
				const g = o.geometry;
				const uv = g?.getAttribute?.("uv");
				const uv2 = g?.getAttribute?.("uv2");

				const range = (attr) => {
					if (!attr) return null;
					let minU = Infinity, minV = Infinity, maxU = -Infinity, maxV = -Infinity;
					for (let i = 0; i < attr.count; i++) {
						const u = attr.getX(i), v = attr.getY(i);
						if (u < minU) minU = u;
						if (v < minV) minV = v;
						if (u > maxU) maxU = u;
						if (v > maxV) maxV = v;
					}
					return { minU, minV, maxU, maxV };
				};

				console.log("[IRIS MESH]", {
					matName,
					stem,
					mesh: o.name,
					uv: range(uv),
					uv2: range(uv2),
					hasTex: !!tex?.alb,
					tex: tex?.alb?.image?.src,
				});
			}

			if (isEyeStem(stem)) {
				const eyeMat = makeEyeMaterial({ matName, tex, glbUrl });
				eyeShaderMats?.push?.(eyeMat);
				return eyeMat;
			}

			const bodyMat = makeBodyMaterial({ matName, tex, glbUrl, stem, variant });

			if (postProcessMesh) postProcessMesh(o, stem);

			return bodyMat;
		})());

		jobs.set(o.uuid, { mesh: o, tasks });
	});

	for (const { mesh, tasks } of jobs.values()) {
		const out = await Promise.all(tasks);
		mesh.material = out.length === 1 ? out[0] : out;
	}
}

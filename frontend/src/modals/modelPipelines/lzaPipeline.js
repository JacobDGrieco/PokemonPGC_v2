// lzaPipeline.js (DROP-IN, matches new scviPipeline folder-resolution behavior)
import * as THREE from "three";
import {
	dirname,
	basename,
	stripExt,
	loadTextureManifest,
	applyGenericTextureSetToScene,
	swapUvChannelsIfNeeded,
	logUvRangeOnce,
} from "./utils.js";
import { getModelKeyFromGlbUrl, getEyeParamsForModel, getBodyTintForModel } from "./eyes.js";
import { makePokemonBodyMaterial, makePokemonEyeMaterial } from "./materials.js";

function stemForMaterial(matName) {
	const raw = String(matName || "");
	const n = raw
		.toLowerCase()
		.trim()
		.replace(/[_\-.]+/g, " ")
		.replace(/\s+/g, " ");

	// eyes
	if (n.includes("eye") || n.includes("leye") || n.includes("reye") || n.includes("l eye") || n.includes("r eye"))
		return "eye";

	// body A/B (prefer lettered first)
	if (n.includes("body a")) return "body_a";
	if (n.includes("body b")) return "body_b";

	// common fallbacks
	if (n === "body" || n.startsWith("body ")) return "body";

	// if we can't confidently map it, let generic fallback behavior handle it
	return null;
}

function deriveBellyTintFromBase(baseLinear) {
	const warm = new THREE.Color(1.0, 0.95, 0.8);
	return baseLinear.clone().lerp(warm, 0.75);
}

export async function applyLegendsZATextureSetToScene(root3d, { glbUrl, variant, texDir, eyeShaderMats }) {
	const modelKey = getModelKeyFromGlbUrl(glbUrl);
	if (!modelKey) throw new Error("LZA: could not parse model id from glbUrl: " + glbUrl);

	const isShiny = String(variant || "").toLowerCase() === "shiny";

	// ------------------------------------------------------------
	// ✅ NEW: resolve LZA texture dir based on the actual GLB filename
	//
	// model.glb           => <baseDir>/<natiId>/
	// 0025-a.glb (form)   => <baseDir>/<stem>/
	// ------------------------------------------------------------
	const baseDir = dirname(glbUrl); // .../models/0025/
	const file = basename(glbUrl); // model.glb OR 0025-a.glb
	const stem = stripExt(file); // model OR 0025-a
	const natiId = String(Number(modelKey)).padStart(4, "0");

	let effectiveTexDir = texDir;

	if (!effectiveTexDir) {
		if (stem.toLowerCase() === "model") {
			effectiveTexDir = `${baseDir}${natiId}/`; // .../models/0025/0025/
		} else {
			effectiveTexDir = `${baseDir}${stem}/`; // .../models/0025/0025-a/
		}
	}

	// Shiny prefers *_rare.png for basecolor if it exists (same folder)
	const albSuffixes = isShiny
		? ["_rare.png", "_alb.png", "_col.png", "_basecolor.png"]
		: ["_alb.png", "_col.png", "_basecolor.png"];

	return applyGenericTextureSetToScene(root3d, {
		glbUrl,
		variant,
		eyeShaderMats,

		// ✅ IMPORTANT: load the manifest from the *resolved* folder
		textureManifest: effectiveTexDir ? await loadTextureManifest(effectiveTexDir) : null,

		stemForMaterial,

		buildCandidatesForStem: (texDirIgnored, stem) => {
			const dir = effectiveTexDir; // always use resolved folder

			const aliases = (() => {
				const s = String(stem || "").toLowerCase();

				// keep these a bit permissive in case meshes are named differently
				if (s === "body_a") return ["body_a", "body"];
				if (s === "body_b") return ["body_b", "body2"];
				if (s === "eye") return ["eye", "eye2"];
				if (s === "body") return ["body", "body_a"];

				return [s];
			})();

			const mk = (suffixes) => aliases.flatMap((a) => suffixes.map((sf) => `${dir}${a}${sf}`));

			// Eyes in LZA typically only need alb/nrm/lym (no rgn/mtl/ao in many cases)
			if (String(stem).toLowerCase() === "eye") {
				return {
					alb: mk(albSuffixes),
					nrm: mk(["_nrm.png", "_nor.png", "_normal.png"]),
					lym: mk(["_lym.png"]),
					ao: [],
					rgn: [],
					mtl: [],
					msk: [],
				};
			}

			return {
				alb: mk(albSuffixes),
				nrm: mk(["_nrm.png", "_nor.png", "_normal.png"]),
				lym: mk(["_lym.png"]),
				ao: mk(["_ao.png"]),
				rgn: mk(["_rgn.png"]),
				mtl: mk(["_mtl.png"]),
				msk: [],
			};
		},

		makeEyeMaterial: ({ matName, tex, glbUrl }) => {
			const params = getEyeParamsForModel(glbUrl);
			const irisColor = new THREE.Color(params.iris);
			irisColor.convertSRGBToLinear();

			return makePokemonEyeMaterial({
				name: matName || "Eye",
				alb: tex.alb,
				lym: tex.lym,
				msk: null,
				irisTex: null,
				irisColor,
				pupilColor: new THREE.Color(params.pupil),
				pupilCenter: params.pupilCenter,
				pupilRadius: params.pupilRadius,
				pupilFeather: params.pupilFeather,
			});
		},

		makeBodyMaterial: ({ matName, tex, stem, glbUrl }) => {
			const tintA = getBodyTintForModel(glbUrl);
			const tintB = deriveBellyTintFromBase(tintA);

			const bodyMat = makePokemonBodyMaterial({
				name: matName || stem,
				alb: tex.alb,
				nrm: tex.nrm,
				rgn: tex.rgn,
				mtl: tex.mtl,
				ao: tex.ao,
				emi: null,

				// LZA-specific extras used by your material builder
				lym: tex.lym,
				tintA,
				tintB,
			});

			bodyMat.color?.set?.(0xffffff);
			bodyMat.vertexColors = false;

			return bodyMat;
		},

		postProcessMesh: (mesh, stem) => {
			swapUvChannelsIfNeeded(mesh, stem);
			logUvRangeOnce(mesh, glbUrl);
		},
	});
}

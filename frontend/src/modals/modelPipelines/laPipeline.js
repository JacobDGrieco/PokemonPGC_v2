// laPipeline.js (DROP-IN, adds scvi-style resolved texture folder behavior)
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

// Map PLA/LA material names to your texture stems
function plaStemForMaterial(matName) {
	const n = String(matName || "").toLowerCase();

	if (n.includes("bodya") || n.includes("body_a")) return "body_a";
	if (n.includes("bodyb") || n.includes("body_b")) return "body_b";

	// eyes
	if (n.includes("leye") || n.includes("l_eye") || n === "eye_l") return "eye";
	if (n.includes("reye") || n.includes("r_eye") || n === "eye_r") return "eye";
	if (n.includes("eye")) return "eye";

	return null;
}

function deriveBellyTintFromBase(baseLinear) {
	const warm = new THREE.Color(1.0, 0.95, 0.8);
	return baseLinear.clone().lerp(warm, 0.75);
}

export async function applyLegendsArceusTextureSetToScene(root3d, { glbUrl, variant, texDir, eyeShaderMats }) {
	const modelKey = getModelKeyFromGlbUrl(glbUrl);
	if (!modelKey) throw new Error("LA: could not parse model id from glbUrl: " + glbUrl);

	// ------------------------------------------------------------
	// ✅ NEW: resolve LA texture dir based on the actual GLB filename
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

	return applyGenericTextureSetToScene(root3d, {
		glbUrl,
		variant,
		eyeShaderMats,

		// ✅ IMPORTANT: load the manifest from the *resolved* folder
		textureManifest: effectiveTexDir ? await loadTextureManifest(effectiveTexDir) : null,

		// (optional) if applyGenericTextureSetToScene still uses probing in some cases,
		// keep a sane probe relative path that exists for LA dumps:
		probeRelPath: "body_a_alb.png",

		stemForMaterial: plaStemForMaterial,

		buildCandidatesForStem: (texDirIgnored, stem) => {
			const dir = effectiveTexDir;

			// PLA/LA: eyes typically only have alb/nrm/lym in your dump
			if (stem === "eye") {
				return {
					alb: [`${dir}${stem}_alb.png`],
					nrm: [`${dir}${stem}_nrm.png`],
					lym: [`${dir}${stem}_lym.png`],
					ao: [],
					rgn: [],
					mtl: [],
					msk: [],
					iris: [],
				};
			}

			return {
				alb: [`${dir}${stem}_alb.png`],
				nrm: [`${dir}${stem}_nrm.png`],
				lym: [`${dir}${stem}_lym.png`],
				ao: [`${dir}${stem}_ao.png`],
				rgn: [`${dir}${stem}_rgn.png`],
				mtl: [`${dir}${stem}_mtl.png`],
				msk: [],
				iris: [],
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
			const tintA = getBodyTintForModel(glbUrl); // linear
			const tintB = deriveBellyTintFromBase(tintA); // linear

			const bodyMat = makePokemonBodyMaterial({
				name: matName || stem,
				alb: tex.alb,
				nrm: tex.nrm,
				rgn: tex.rgn,
				mtl: tex.mtl,
				ao: tex.ao,
				emi: null,

				lym: tex.lym,
				tintA,
				tintB,
			});

			// “color puke” prevention
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

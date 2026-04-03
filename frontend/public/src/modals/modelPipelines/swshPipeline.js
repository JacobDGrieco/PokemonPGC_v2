// swshPipeline.js (DROP-IN, matches new scviPipeline folder-resolution behavior)
import * as THREE from "three";
import {
	dirname,
	basename,
	stripExt,
	loadTextureManifest,
	applyGenericTextureSetToScene,
} from "./utils.js";
import { getModelKeyFromGlbUrl, getEyeParamsForModel } from "./eyes.js";
import { makePokemonEyeMaterial, makePokemonBodyMaterial } from "./materials.js";

// Map GLB material names -> SwSh “piece”
function swshStemForMaterial(matName) {
	const low = String(matName || "").toLowerCase();

	// body pieces
	if (low.includes("bodya") || low.includes("body a") || low === "body_a") return "BodyA";
	if (low.includes("bodyb") || low.includes("body b") || low === "body_b") return "BodyB";

	// treat any eye-ish mat as eye
	if (low.includes("eye") || low === "l_eye" || low === "r_eye") return "eye";

	return null;
}

export async function applySwordShieldTextureSetToScene(root3d, { glbUrl, variant, texDir, eyeShaderMats }) {
	const modelKey = getModelKeyFromGlbUrl(glbUrl);
	if (!modelKey) throw new Error("SwSh: could not parse model id from glbUrl: " + glbUrl);

	// ------------------------------------------------------------
	// ✅ NEW: resolve SwSh texture dir based on the actual GLB filename
	//
	// model.glb           => <baseDir>/<natiId>/
	// 0025-a.glb (form)   => <baseDir>/<stem>/
	// ------------------------------------------------------------
	const baseDir = dirname(glbUrl); // .../models/0025/
	const file = basename(glbUrl);  // model.glb OR 0025-a.glb
	const stem = stripExt(file);    // model OR 0025-a
	const natiId = String(Number(modelKey)).padStart(4, "0");

	let effectiveTexDir = texDir;

	if (!effectiveTexDir) {
		if (stem.toLowerCase() === "model") {
			effectiveTexDir = `${baseDir}${natiId}/`; // .../models/0025/0025/
		} else {
			effectiveTexDir = `${baseDir}${stem}/`;   // .../models/0025/0025-a/
		}
	}

	return applyGenericTextureSetToScene(root3d, {
		glbUrl,
		variant,
		eyeShaderMats,

		// ✅ IMPORTANT: load the manifest from the *resolved* folder
		textureManifest: effectiveTexDir ? await loadTextureManifest(effectiveTexDir) : null,

		stemForMaterial: swshStemForMaterial,

		buildCandidatesForStem: (texDirIgnored, stem) => {
			const dir = effectiveTexDir;

			if (stem === "eye") {
				// Eye uses Eye_col + Iris_lyc (optional)
				return {
					alb: [`${dir}Eye_col.png`],
					nrm: [`${dir}Eye_nor.png`],
					ao: [`${dir}Eye_amb.png`],
					// stash emissive in mtl slot if you have Eye_emi (usually you won't)
					mtl: [`${dir}Eye_emi.png`],
					iris: [`${dir}Iris_lyc.png`],
					lym: [],
					rgn: [],
					msk: [],
				};
			}

			// Body pieces
			return {
				alb: [`${dir}${stem}_col.png`],
				nrm: [`${dir}${stem}_nor.png`],
				ao: [`${dir}${stem}_amb.png`],
				// stash emissive in mtl slot
				mtl: [`${dir}${stem}_emi.png`],
				lym: [],
				rgn: [],
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
				lym: null,
				msk: null,
				irisTex: tex.iris || null,
				irisColor,
				pupilColor: new THREE.Color(params.pupil),
				pupilCenter: params.pupilCenter,
				pupilRadius: params.pupilRadius,
				pupilFeather: params.pupilFeather,
			});
		},

		makeBodyMaterial: ({ matName, tex, stem }) => {
			// SwSh: ao comes from *_amb; emissive comes from *_emi (stored in tex.mtl)
			const bodyMat = makePokemonBodyMaterial({
				name: matName || stem,
				alb: tex.alb,
				nrm: tex.nrm,
				rgn: null,
				mtl: null,
				ao: tex.ao,
				emi: tex.mtl || null,
			});

			// SwSh “color puke” prevention
			bodyMat.color?.set?.(0xffffff);
			bodyMat.vertexColors = false;
			bodyMat.emissive?.set?.(0x000000);
			bodyMat.emissiveIntensity = 1.0;

			if (bodyMat.normalMap && bodyMat.normalScale?.set) {
				bodyMat.normalScale.set(0.35, 0.35);
			}

			return bodyMat;
		},
	});
}

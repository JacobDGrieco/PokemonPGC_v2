// src/ui/modals/modelPipelines/lgpePipeline.js
import { applyGenericTextureSetToScene, swapUvChannelsIfNeeded } from "./utils.js";
import * as THREE from "three";

// Basic suffix guesses (keep small; no probing happens anyway — manifest gates loading)
function isEyeStem(stem) {
	return /^Eye[12]$/.test(stem);
}

function isIrisStem(stem) {
	return stem === "LIris" || stem === "RIris" || stem === "Iris1" || stem === "Iris2";
}

function stemForMaterial(matName) {
	const n = String(matName || "").toLowerCase();

	if (n.includes("bodyainc") || n.includes("body_ainc") || n.includes("body ainc")) return "BodyAInc";
	if (n.includes("bodybinc") || n.includes("body_binc") || n.includes("body binc")) return "BodyBInc";
	if (n.includes("bodycinc") || n.includes("body_cinc") || n.includes("body cinc")) return "BodyCInc";
	if (n.includes("bodyinc") || n.includes("body_inc") || n.includes("body inc")) return "Pokabu_Tail00Env";
	if (n.includes("pokabu tail00")) return "Pokabu_Tail00Env";
	if (n.includes("pokabu tail01")) return "Pokabu_Tail01Inc";
	if (n.includes("neolantinc")) return "NeolantInc";

	if (/\bbody\s*a\b/.test(n) || n.includes("bodya") || n.includes("body_a")) return "BodyA1";
	if (/\bbody\s*b\b/.test(n) || n.includes("bodyb") || n.includes("body_b")) return "BodyB1";
	if (n.includes("tosakinto") || n.includes("keikouo")) return "BodyB1";
	if (/\bbody\s*c\b/.test(n) || n.includes("bodyc") || n.includes("body_c")) return "BodyC1";

	if (n.includes("left") && n.includes("eye")) return "Eye1";
	if (n.includes("right") && n.includes("eye")) return "Eye2";
	if (n.includes("eye1")) return "Eye1";
	if (n.includes("eye2")) return "Eye2";
	if (n.includes("aeye") || n.includes("eyea")) return "EyeA1";
	if (n.includes("beye") || n.includes("eyeb")) return "EyeB1";
	if (n.includes("ceye") || n.includes("eyec")) return "EyeC1";
	if (n.includes("deye") || n.includes("eyed")) return "EyeD1";
	if (n.includes("eye") || n.includes("bug")) return "Eye1";

	if (n.includes("liris")) return "Iris1";
	if (n.includes("riris")) return "Iris2";

	if (n.includes("amouth")) return "MouthA1";
	if (n.includes("bmouth")) return "MouthB1";
	if (n.includes("cmouth")) return "MouthC1";
	if (n.includes("mouth")) return "Mouth1";


	if (n.includes("firecorea")) return "FireCoreA1";
	if (n.includes("firecoreb1")) return "FireCoreB1";
	if (n.includes("firecoreb2")) return "FireCoreB2";
	if (n.includes("firegeoma")) return "FireGeomA";
	if (n.includes("firestena")) return "FireStenA";
	if (n.includes("firestenb")) return "FireStenMask";
	if (n.includes("fire")) return "FireCoreA1";

	if (n.includes("beto")) return "Beto1";
	if (n.includes("chonchienon")) return "ChonchieEnv";
	if (n.includes("sacapdp20")) return "SaCapDP20"; 		// Pikachu Caps

	return "Body1";
}


// Simple “slap it on” materials (no toon, no special packing)
function makeSimpleMaterial({ name, tex, transparent = false }) {
	const mat = new THREE.MeshLambertMaterial({
		name,
		map: tex.alb || null,
		transparent,
		depthWrite: !transparent,
		alphaTest: transparent ? 0.02 : 0.0,
	});

	if (mat.map) mat.map.flipY = false;

	mat.skinning = true;
	return mat;
}

function makeIrisMaterial({ name, tex }) {
	const mat = new THREE.MeshBasicMaterial({
		name,
		map: tex.alb || null,
		transparent: true,
		opacity: 1,
		depthTest: true,
		depthWrite: false,
		side: THREE.DoubleSide,

		// ✅ key: treat iris like an overlay "ink"
		blending: THREE.NormalBlending,
	});

	// ✅ do NOT alphaTest (it can nuke soft alpha and make it vanish)
	mat.alphaTest = 0.0;

	if (mat.map) {
		mat.map.flipY = false;

		// keep clamp (fine)
		mat.map.wrapS = THREE.ClampToEdgeWrapping;
		mat.map.wrapT = THREE.ClampToEdgeWrapping;

		// ✅ very important for soft-edge sprites
		mat.map.premultiplyAlpha = true;

		mat.map.needsUpdate = true;
	}

	// push forward to avoid z-fighting
	mat.polygonOffset = true;
	mat.polygonOffsetFactor = -2;
	mat.polygonOffsetUnits = -2;

	mat.skinning = true;
	return mat;
}

export async function apply3DSTextureSetToScene(root3d, { glbUrl, variant, eyeShaderMats } = {}) {
	// We intentionally ignore variant for LGPE right now — you’re just “slapping textures on”.
	return applyGenericTextureSetToScene(root3d, {
		glbUrl,
		variant,
		eyeShaderMats,

		stemForMaterial,

		buildCandidatesForStem: (texDir, stem) => {
			const s = String(stem || "");

			const nrm =
				(s === "Body1") ? [`${texDir}BodyNor.png`] :
					(s === "BodyA1") ? [`${texDir}BodyANor.png`] :
						(s === "BodyB1") ? [`${texDir}BodyBNor.png`] :
							(s === "BodyC1") ? [`${texDir}BodyCNor.png`] :
								(s === "Eye1" || s === "Eye2") ? [`${texDir}EyeNor.png`] :
									(s === "SaCapDP20") ? [`${texDir}SaCapDPNor.png`] :
										[];

			const msk =
				(s === "BodyB1") ? [`${texDir}BodyBMask.png`] :
					(s === "BodyC1") ? [`${texDir}BodyCMask.png`] :
						(s === "FireCoreA1") ? [`${texDir}FireStenA1.png`] :
							(s === "FireCoreB1") ? [`${texDir}FireStenB1.png`] :
								(s === "FireGeomA") ? [`${texDir}FireSGeomA.png`] :
									(s === "FireStenA") ? [`${texDir}FireStenA.png`] :
										(s === "FireStenMask") ? [`${texDir}FireStenMask.png`] :
											(s === "Pokabu_Tail00Env") ? [`${texDir}Pokabu_Tail00Env.png`] :
												(s === "Pokabu_Tail01Inc") ? [`${texDir}Pokabu_Tail01Inc.png`] :
													[];

			const iris =
				(s === "Iris1") ? [`${texDir}Iris1.png`] :
					(s === "Iris2") ? [`${texDir}Iris2.png`] :
						[];

			const alb = [`${texDir}${s}.png`];

			return {
				alb,
				nrm,
				msk,
				ao: [],
				lym: [],
				rgn: [],
				mtl: [],
				iris,
			};
		},

		// “eye” gets a transparent material so eyelashes/holes don’t look wrong
		makeEyeMaterial: ({ matName, tex }) => {
			// 3DS eyes are baked textures. No shader. No iris rebuild.
			// Use transparency only if you actually need it (often you don't).
			const mat = makeSimpleMaterial({ name: matName || "Eye", tex, transparent: false });
			if (mat.normalMap && tex.nrm) mat.normalMap = tex.nrm;
			return mat;
		},

		makeBodyMaterial: ({ matName, tex, stem }) => {
			if (isIrisStem(stem)) {
				return makeIrisMaterial({ name: matName || stem, tex });
			}

			const lower = String(matName || "").toLowerCase();

			// Fire: use stencil as alpha
			if (lower.includes("fire")) {
				const mat = makeSimpleMaterial({ name: matName || stem, tex, transparent: !!tex.msk });

				if (tex.msk) {
					mat.alphaMap = tex.msk;
					mat.depthTest = true;
					mat.depthWrite = false;
					mat.transparent = true;
					mat.alphaTest = 0.001;
					if (mat.alphaMap) mat.alphaMap.flipY = false;
					mat.needsUpdate = true;
				}
				return mat;
			}

			// Everything else (Body)
			return makeSimpleMaterial({ name: matName || stem, tex, transparent: false });
		},

		// no UV swapping / special handling yet
		postProcessMesh: (mesh, stem) => {
			if (stem === "Iris1" || stem === "Iris2") {
				// force swap regardless of utils.js stem gating
				const g = mesh.geometry;
				const uv = g?.getAttribute?.("uv");
				const uv2 = g?.getAttribute?.("uv2");
				if (uv2) {
					if (uv) {
						g.setAttribute("uv", uv2);
						g.setAttribute("uv2", uv);
					} else {
						g.setAttribute("uv", uv2);
					}
					g.attributes.uv.needsUpdate = true;
					if (g.attributes.uv2) g.attributes.uv2.needsUpdate = true;
				}

				mesh.renderOrder = 10;
			}
		},
	});
}

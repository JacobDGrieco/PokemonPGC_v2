// src/ui/modals/modelPipelines/lgpePipeline.js
import * as THREE from "three";
import { applyGenericTextureSetToScene } from "./utils.js";

function stemForMaterial(matName) {
	const raw = String(matName || "");

	// Normalize common suffix patterns:
	// - BodyA00, BodyB01, BodyCInc00
	// - BodyA_00, BodyA.001, etc.
	const cleaned = raw
		.replace(/(\.?\d+)+$/g, "")   // strips ".001" or trailing digits
		.replace(/[_\s-]\d+$/g, "")   // strips "_00" or " 01" etc.
		.trim();

	// Prefer explicit token extraction (most reliable).
	// IMPORTANT: BodyCInc must come before BodyC.
	const m = cleaned.match(/\b(BodyAInc|BodyBInc|BodyCInc|BodyA|BodyB|BodyC|EyeA|EyeB|EyeC|Eye|Mouth|Beto|Fire)\b/i);
	if (m) {
		const k = m[1];
		return k[0].toUpperCase() + k.slice(1);
	}

	const n = cleaned.toLowerCase();

	// Fallback heuristics (also keep BodyCInc before BodyC)
	if (n.includes("bodyainc") || n.includes("body_ainc") || n.includes("body ainc")) return "BodyAInc";
	if (n.includes("bodybinc") || n.includes("body_binc") || n.includes("body binc")) return "BodyBInc";
	if (n.includes("bodycinc") || n.includes("body_cinc") || n.includes("body cinc")) return "BodyCInc";

	if (n.includes("bodya") || n.includes("body_a") || n.includes("body a")) return "BodyA";
	if (n.includes("bodyb") || n.includes("body_b") || n.includes("body b")) return "BodyB";
	if (n.includes("bodyc") || n.includes("body_c") || n.includes("body c")) return "BodyC";
	if (n.includes("body")) return "Body";

	if (n.includes("eyea") || n.includes("eye_a") || n.includes("eye a")) return "EyeA";
	if (n.includes("eyeb") || n.includes("eye_b") || n.includes("eye b")) return "EyeB";
	if (n.includes("eyec") || n.includes("eye_c") || n.includes("eye b")) return "EyeC";
	if (n.includes("eyed") || n.includes("eye_d") || n.includes("eye d")) return "EyeD";
	if (n.includes("eye") || n.includes("bug")) return "Eye";

	if (n.includes("moutha") || n.includes("mouth_a") || n.includes("mouth a")) return "MouthA";
	if (n.includes("mouthb") || n.includes("mouth_b") || n.includes("mouth b")) return "MouthB";
	if (n.includes("mouth")) return "Mouth";

	if (n.includes("beto")) return "Beto";
	if (n.includes("fire")) return "Fire";

	return "Body";
}

// Simple “slap it on” materials (no toon, no special packing)
function makeSimpleMaterial({ name, tex, transparent = false }) {
	const mat = new THREE.MeshStandardMaterial({
		name,
		map: tex.alb || null,
		aoMap: tex.ao || null,
		emissiveMap: tex.emi || null,
		emissive: tex.emi ? new THREE.Color(1, 1, 1) : new THREE.Color(0, 0, 0),
		emissiveIntensity: tex.emi ? 1.0 : 0.0,
		roughness: 0.85,
		metalness: 0.0,
		transparent,
		depthWrite: !transparent,
		alphaTest: 0.0,
	});

	if (mat.map) mat.map.flipY = false;
	if (mat.aoMap) mat.aoMap.flipY = false;
	if (mat.emissiveMap) mat.emissiveMap.flipY = false;

	mat.skinning = true;
	return mat;
}

function makeFireMaterial({ name, tex }) {
	const mat = new THREE.MeshBasicMaterial({
		name,
		color: 0xffa54a,           // warm orange (tweak if you want)
		alphaMap: tex.msk || null, // ✅ mask drives opacity
		transparent: true,
		opacity: 1.0,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		side: THREE.DoubleSide,
	});

	if (mat.alphaMap) mat.alphaMap.flipY = false;

	// ✅ remove "sharp" cutout edges
	mat.alphaTest = 0.0;

	mat.skinning = true;
	return mat;
}

export async function applyLGPETextureSetToScene(root3d, { glbUrl, variant, eyeShaderMats } = {}) {
	// We intentionally ignore variant for LGPE right now — you’re just “slapping textures on”.
	return applyGenericTextureSetToScene(root3d, {
		glbUrl,
		variant,
		eyeShaderMats,

		stemForMaterial,

		buildCandidatesForStem: (texDir, stem) => {
			const s = String(stem || "");
			const isFire = s === "Fire";
			if (isFire) {
				return {
					alb: [],
					nrm: [],
					ao: [],
					lym: [],
					rgn: [],
					mtl: [],
					msk: [
						`${texDir}FireCoreA1_msk.png`,
						`${texDir}FireCoreA2_msk.png`,
						`${texDir}FireStenA1_msk.png`,
						`${texDir}FireStenA2_msk.png`,
						`${texDir}FireStenAMask_msk.png`,
					],
					emi: [],
					iris: [],
				};
			}

			// ✅ Generic “Inc” detection: BodyAInc / BodyBInc / BodyCInc
			const isInc = /Inc$/i.test(s);
			const base = isInc ? s.replace(/Inc$/i, "") : s;

			return {
				// Albedo always from the stem itself (BodyBInc_col.png etc.)
				alb: [`${texDir}${s}_col.png`, `${texDir}${s}_col_rare.png`],

				nrm: [],

				// ✅ Inc sets often don’t have their own _amb; fall back to the base body’s amb
				ao: isInc
					? [`${texDir}${s}_amb.png`, `${texDir}${base}_amb.png`]
					: [`${texDir}${s}_amb.png`],

				// ✅ Some Inc sets have emissive (you showed BodyBInc_emi.png)
				emi: isInc
					? [`${texDir}${s}_emi.png`, `${texDir}${base}_emi.png`]
					: [`${texDir}${s}_emi.png`],

				lym: [],
				rgn: [],
				mtl: [],
				msk: [],
				iris: [],
			};
		},

		// “eye” gets a transparent material so eyelashes/holes don’t look wrong
		makeEyeMaterial: ({ matName, tex }) => {
			return makeSimpleMaterial({ name: matName || "Eye", tex, transparent: true });
		},

		makeBodyMaterial: ({ matName, tex, stem }) => {
			if (stem === "Fire") {
				return makeFireMaterial({ name: matName || "Fire", tex });
			}
			return makeSimpleMaterial({ name: matName || stem, tex, transparent: false });
		},

		// no UV swapping / special handling yet
		postProcessMesh: (mesh, stem) => {
			// optional: some LGPE meshes might need DoubleSide
			// if (mesh.name.toLowerCase().includes("wing")) mesh.material.side = THREE.DoubleSide;
		},
	});
}

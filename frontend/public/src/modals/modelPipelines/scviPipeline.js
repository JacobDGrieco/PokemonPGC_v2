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
import { getModelKeyFromGlbUrl, getEyeParamsForModel } from "./eyes.js";
import { makePokemonEyeMaterial, makePokemonBodyMaterial, makePokemonSmokeMaterial } from "./materials.js";

const albSuffixes = [
	"_alb.png",
	"_alb_rare.png",
	"_rare.png",
	"_dif.png",
	"_diff.png",
	"_diffuse.png",
	"_col.png",
	"_basecolor.png",
	"_albedo.png",
];

function stemForMaterial(matName) {
	const raw = String(matName || "");
	const n = raw
		.toLowerCase()
		.trim()
		.replace(/[_\-.]+/g, " ")   // treat _, -, . like spaces
		.replace(/\s+/g, " ");     // normalize whitespace

	// --- eyes ---
	// covers: "left eye", "right eye", "Left_Eye", etc
	if (n.includes("eye")) return "eye";
	if (n.includes("smoke")) return "smoke";

	// --- body A/B substring checks FIRST ---
	// covers: "Body A", "Body A 00", "Body_A.001", etc
	if (n.includes("body a")) return "body_a";
	if (n.includes("body b")) return "body_b";
	if (n.includes("body c")) return "body_c";
	if (n.includes("body d")) return "body_d";
	if (n.includes("body e")) return "body_e";
	if (n.includes("body f")) return "body_f";

	// --- numbered bodies ---
	// covers: "body 01", "body 02", "body.01", "Body_02", etc
	if (n.includes("body")) {
		const m = n.match(/body\s*(\d+)/);
		const idx = m ? parseInt(m[1], 10) : NaN;

		if (idx === 1) return "body";    // body_*.png
		if (idx === 2) return "body2";   // body2_*.png
	}

	// --- FINAL fallback: generic body ---
	// (keep this LAST so it doesn't catch "body a 00" etc)
	if (n === "body" || n.startsWith("body ")) return "body";

	// last resort: collapse spaces so "body2" stays usable
	return n.replace(/\s+/g, "");
}

export async function applyPokemonTextureSetToScene(root3d, { glbUrl, variant, texDir, eyeShaderMats }) {
	const modelKey = getModelKeyFromGlbUrl(glbUrl);
	if (!modelKey) throw new Error("ScVi: could not parse model id from glbUrl: " + glbUrl);

	return applyGenericTextureSetToScene(root3d, {
		glbUrl, variant, eyeShaderMats, stemForMaterial,

		buildCandidatesForStem: (texDir, stem) => {
			// ✅ Try multiple filename stems for each material stem.
			// This handles cases like:
			//   material: body_a  -> textures: body_*.png
			//   material: body_b  -> textures: body2_*.png
			//   material: eye     -> textures: eye_*.png (and sometimes eye2_*.png)
			const aliases = (() => {
				const s = String(stem || "").toLowerCase();

				if (s === "body_a") return ["body_a", "body"];
				if (s === "body_b") return ["body_b", "body2"];

				if (s === "eye") return ["eye", "eye2"];
				if (s === "smoke") return ["smoke", "body"];

				return [s];
			})();

			const mk = (suffixes) =>
				aliases.flatMap(a => suffixes.map(sf => `${texDir}${a}${sf}`));

			return {
				alb: mk(albSuffixes),
				nrm: mk(["_nrm.png", "_nor.png", "_normal.png"]),
				lym: mk(["_lym.png"]),
				ao: mk(["_ao.png"]),
				rgn: mk(["_rgn.png"]),
				mtl: mk(["_mtl.png"]),
				msk: [
					`${texDir}body_msk.png`,
					...mk(["_msk.png"]),
				],
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
				msk: tex.msk,
				irisTex: null,
				irisColor,
				pupilColor: new THREE.Color(params.pupil),
				pupilCenter: params.pupilCenter,
				pupilRadius: params.pupilRadius,
				pupilFeather: params.pupilFeather,
			});
		},

		makeBodyMaterial: ({ matName, tex, stem }) => {
			if (stem === "smoke") {
				return makePokemonSmokeMaterial({
					name: matName || stem,
					msk: tex.msk,
					noise: tex.lym,
					tint: new THREE.Color(1, 1, 1),
					speed: 0.10,
					noiseScale: 3.25,
					alphaCut: 0.03,
					blending: THREE.NormalBlending,
				});
			}

			return makePokemonBodyMaterial({
				name: matName || stem,
				alb: tex.alb,
				nrm: tex.nrm,
				rgn: tex.rgn,
				mtl: tex.mtl,
				ao: tex.ao,
				emi: null,
			});
		},

		postProcessMesh: (mesh, stem) => {
			swapUvChannelsIfNeeded(mesh, stem);
			if (stem === "smoke") mesh.renderOrder = 2;

			if (mesh.name.toLowerCase().includes("wing")) {
				const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
				for (const m of mats) if (m) m.side = THREE.DoubleSide;
			}

			logUvRangeOnce(mesh, glbUrl);
		},
	});
}
import * as THREE from "three";
import { detectModelPipeline } from "./modelPipelines/registy.js";
import { apply3DSTextureSetToScene } from "./modelPipelines/3dsPipeline.js";
import { applyLGPETextureSetToScene } from "./modelPipelines/lgpePipeline.js";
import { applySwordShieldTextureSetToScene } from "./modelPipelines/swshPipeline.js";
import { applyLegendsArceusTextureSetToScene } from "./modelPipelines/laPipeline.js";
import { applyPokemonTextureSetToScene } from "./modelPipelines/scviPipeline.js";
import { applyLegendsZATextureSetToScene } from "./modelPipelines/lzaPipeline.js";

export async function resolveModelGlbUrl(inputUrl) {
	if (/\.(glb|gltf)$/i.test(inputUrl)) return inputUrl;
	return inputUrl + ".glb";
}

export async function applyModelViewerPipeline({
	scene,
	renderer,
	glbUrl,
	variant,
	eyeShaderMats,
	lighting,
	setStatus,
}) {
	const pipelineRaw = detectModelPipeline(glbUrl);
	const pipeline = String(pipelineRaw || "").toLowerCase();

	try {
		if (pipeline === "3ds") {
			renderer.toneMapping = THREE.NoToneMapping;
			renderer.toneMappingExposure = 1.0;
			renderer.physicallyCorrectLights = false;
			lighting.amb.intensity = 0.85;
			lighting.hemi.intensity = 0.55;
			lighting.key.intensity = 0.85;
			lighting.fill.intensity = 0.35;
			lighting.cornerBL.intensity = 0.0;
			lighting.cornerBR.intensity = 0.0;
			lighting.top.intensity = 0.25;
			await apply3DSTextureSetToScene(scene, { glbUrl, variant, eyeShaderMats: null });
		} else if (pipeline === "lgpe") {
			await applyLGPETextureSetToScene(scene, { glbUrl, variant, eyeShaderMats });
		} else if (pipeline === "swsh") {
			await applySwordShieldTextureSetToScene(scene, { glbUrl, variant, eyeShaderMats });
		} else if (pipeline === "la") {
			await applyLegendsArceusTextureSetToScene(scene, { glbUrl, variant, eyeShaderMats });
		} else if (pipeline === "scvi") {
			await applyPokemonTextureSetToScene(scene, { glbUrl, variant, eyeShaderMats });
		} else if (pipeline === "lza") {
			await applyLegendsZATextureSetToScene(scene, { glbUrl, variant, eyeShaderMats });
		} else {
			console.log("[modelViewer] bypassing custom textures for:", glbUrl);
		}
	} catch (e) {
		console.error("[modelViewer] Pipeline failed:", pipeline, glbUrl, e);
		setStatus(`Pipeline failed (${pipeline}). See console.`);
	}

	return pipeline;
}

export function collectSmokeShaderMats(scene, smokeShaderMats) {
	smokeShaderMats.length = 0;
	scene.traverse((o) => {
		if (!o?.isMesh) return;
		const mats = Array.isArray(o.material) ? o.material : [o.material];
		for (const m of mats) {
			if (m?.userData?.ppgcSmoke && m.uniforms?.uTime) smokeShaderMats.push(m);
		}
	});
}

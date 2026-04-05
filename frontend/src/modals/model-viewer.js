// src/ui/modals/modelViewerModal.js
// Requires: three (THREE), GLTFLoader, OrbitControls
// You can adapt imports depending on your build setup.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { resolveVariantModelUrl } from "./modelPipelines/registy.js";
import { applyModelViewerPipeline, collectSmokeShaderMats, resolveModelGlbUrl } from "./model-viewer-loader.js";
import { buildAnimDisplayNames, findPreferredAnimIndex } from "./model-viewer-anim.js";
import { createModelViewerRoot, getModelViewerElements } from "./model-viewer-dom.js";
import { prettyMeshName, prettyMatName, updateToggleAllButton } from "./model-viewer-assets.js";
import { makeRigVisualizerForSkinnedMesh } from "./model-viewer-rig.js";
import { pickBestWebmMime, downloadBlob, downloadDataUrl } from "./model-viewer-recording-utils.js";
import { createAnimationController } from "./model-viewer-animation.js";
import { createViewerOverlayController } from "./model-viewer-overlays.js";
import { ensurePpgcRoot } from "../runtime/globals.js";

const eyeShaderMats = [];
const smokeShaderMats = [];
const PPGC = ensurePpgcRoot();


export async function openModelViewerModal({
	title = "Model Viewer",
	glbUrl,
	variant = "base",
}) {
	eyeShaderMats.length = 0;
	smokeShaderMats.length = 0;

	// --- DOM scaffold ---
	const root = createModelViewerRoot({ isSolo: !!window.store?.state?.modelViewerSolo });
	const {
		dropBtns,
		dropPanels,
		canvasWrap,
		statusEl,
		selectEl,
		playToggleBtn,
		poseBtn,
		speedEl,
		gridBtn,
		wireBtn,
		bonesBtn,
		meshListEl,
		meshesToggleAllBtn,
		meshOpacityEl,
		meshOpacityVal,
		matListEl,
		matsToggleAllBtn,
		matOpacityEl,
		matOpacityVal,
		resetBtn,
		autoBtn,
		screenshotBtn,
		recordBtn,
		webmBtn,
	} = getModelViewerElements(root);
	function setActiveDrop(key) {
		dropBtns.forEach((b) => {
			const on = b.dataset.drop === key;
			b.classList.toggle("is-active", on);
			b.setAttribute("aria-selected", on ? "true" : "false");
		});
		dropPanels.forEach((p) => {
			const on = p.dataset.dropPanel === key;
			p.classList.toggle("is-open", on);
		});
	}

	// default open Animation
	setActiveDrop("viewer");

	dropBtns.forEach((b) => {
		b.addEventListener("click", (e) => {
			e.stopPropagation();
			const key = b.dataset.drop;
			const isAlreadyOpen = dropPanels.find(p => p.dataset.dropPanel === key)?.classList.contains("is-open");
			// click active tab toggles closed
			if (isAlreadyOpen && b.classList.contains("is-active")) {
				dropPanels.forEach(p => p.classList.remove("is-open"));
				dropBtns.forEach(btn => { btn.classList.remove("is-active"); btn.setAttribute("aria-selected", "false"); });
				return;
			}
			setActiveDrop(key);
		});
	});

	// --- Three.js setup ---
	const scene = new THREE.Scene();

	// Helpers
	const grid = new THREE.GridHelper(32, 32);
	grid.material.opacity = 0.35;
	grid.material.transparent = true;
	scene.add(grid);

	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
	renderer.debug.checkShaderErrors = true;
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.setClearColor(0x000000, 0); // transparent PNG background
	canvasWrap.appendChild(renderer.domElement);

	const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
	camera.position.set(0, 1.2, 3);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.autoRotate = false;
	controls.autoRotateSpeed = 1.25;

	// Lighting: brighter, viewer-like
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.10; // slightly lower because we're adding more lights

	// Base ambience
	const amb = new THREE.AmbientLight(0xffffff, 0.45);
	scene.add(amb);

	const hemi = new THREE.HemisphereLight(0xffffff, 0x333333, 0.75);
	scene.add(hemi);

	// --- Primary pair (these are the ONLY two that drive the eye shader uniforms) ---
	const key = new THREE.DirectionalLight(0xffffff, 1.9);
	key.position.set(4, 6, 4); // front-right-top
	scene.add(key);

	const fill = new THREE.DirectionalLight(0xffffff, 0.65);
	fill.position.set(-4, 3, 2); // front-left-mid
	scene.add(fill);

	// --- Extra corner lights (kept subtle; bodies benefit, eyes will mostly still match) ---
	const cornerBL = new THREE.DirectionalLight(0xffffff, 0.30);
	cornerBL.position.set(-4, 3, -4); // back-left
	scene.add(cornerBL);

	const cornerBR = new THREE.DirectionalLight(0xffffff, 0.30);
	cornerBR.position.set(4, 3, -4); // back-right
	scene.add(cornerBR);

	// --- Top light (helps with head/upper-body readability) ---
	const top = new THREE.DirectionalLight(0xffffff, 0.65);
	top.position.set(0, 8, 0); // directly above origin
	scene.add(top);

	const loader = new GLTFLoader();

	// Loop padding settings (tweak to taste)
	const MAX_FRAMES = 35;
	const DELAY_SEC = 1;

	let loopRestartTimer = 0;
	let finishedHandler = null;
	let userPaused = false;

	let mixer = null;
	let activeAction = null;
	let model = null;
	const clock = new THREE.Clock();
	let poseMode = false;
	let lastAnimIndex = 0;

	let autoRotate = false;
	let wireframeOn = false;
	let skeletonOn = false;

	const restTransforms = new Map();
	const originalMaterials = new Map(); // mesh.uuid -> material (or array)
	const skelHelpers = []; // list of helpers we add so we can remove them cleanly
	const rigUpdaters = []; // per-frame updaters for rig visualizers

	// --- Recording (WebM) ---
	let mediaRecorder = null;
	let recordChunks = [];
	let lastWebmBlob = null;

	const refs = {
		get model() { return model; },
		set model(v) { model = v; },
		get mixer() { return mixer; },
		set mixer(v) { mixer = v; },
		get activeAction() { return activeAction; },
		set activeAction(v) { activeAction = v; },
		get userPaused() { return userPaused; },
		set userPaused(v) { userPaused = v; },
		get poseMode() { return poseMode; },
		set poseMode(v) { poseMode = v; },
		get loopRestartTimer() { return loopRestartTimer; },
		set loopRestartTimer(v) { loopRestartTimer = v; },
		get finishedHandler() { return finishedHandler; },
		set finishedHandler(v) { finishedHandler = v; },
		rigUpdaters,
		skelHelpers,
		get meshOverlayOpacity() { return meshOverlayOpacity; },
		set meshOverlayOpacity(v) { meshOverlayOpacity = v; },
		get matOverlayOpacity() { return matOverlayOpacity; },
		set matOverlayOpacity(v) { matOverlayOpacity = v; },
		get skeletonOn() { return skeletonOn; },
		set skeletonOn(v) { skeletonOn = v; },
	};

	const meshState = new Map(); // uuid -> boolean
	const matState = new Map();  // material.name -> boolean
	const meshByUuid = new Map();
	const matsByName = new Map(); // name -> Set(material instances)
	const matSaved = new WeakMap(); // material -> original props
	const meshOverlay = new Map(); // uuid -> "#rrggbb" or null
	const matOverlay = new Map(); // material.name -> "#rrggbb" or null

	const OVERLAY_STRENGTH_MAT = 0.65; // 0..1
	const OVERLAY_STRENGTH_MESH = 0.65; // 0..1
	let meshOverlayOpacity = 0.65; // 0..1
	let matOverlayOpacity = 0.65; // 0..1

	const animController = createAnimationController({
		THREE,
		refs,
		restTransforms,
		MAX_FRAMES,
		DELAY_SEC,
		mixerClips: () => mixer?._clips || [],
		selectEl,
		playToggleBtn,
		renderer,
		scene,
		camera,
		controls,
		setPill,
	});

	const overlayController = createViewerOverlayController({
		refs,
		modelRef: () => model,
		scene,
		matsByName,
		matState,
		meshState,
		meshByUuid,
		meshOverlay,
		matOverlay,
		meshListEl,
		matListEl,
		meshesToggleAllBtn,
		matsToggleAllBtn,
		prettyMeshName,
		prettyMatName,
		updateToggleAllButton,
		makeRigVisualizerForSkinnedMesh,
	});

	const {
		captureRestPose,
		restoreRestPose,
		clearLoopPadding,
		stopAllAnimations,
		setAnimByIndex,
		warmUpAnimationFrames,
		hardRestartAnimForRecording,
		isAnimationActivelyPlaying,
		computeRecordingSecondsForCurrentState,
		applyPaddedLoop,
	} = animController;

	const {
		setWireframe,
		rebuildMeshesTabUI,
		setMeshOverlayColor,
		setMaterialOverlayByName,
		setMaterialEnabledByName,
		setMeshEnabled,
		setSkeleton,
		clearSkeletonHelpers,
		ensureBaseColor,
		recomputeMeshTint,
	} = overlayController;

	function setStatus(msg) {
		if (!statusEl) return;
		statusEl.textContent = msg || "";
		statusEl.style.display = msg ? "block" : "none";
	}

	function resize() {
		const w = canvasWrap.clientWidth || 1;
		const h = canvasWrap.clientHeight || 1;

		camera.aspect = w / h;
		camera.updateProjectionMatrix();

		// IMPORTANT: let Three update the canvas style size too
		renderer.setSize(w, h); // <-- remove the ", false"

		// (Optional but helps with some CSS/layout edge cases)
		renderer.domElement.style.width = "100%";
		renderer.domElement.style.height = "100%";
		renderer.domElement.style.display = "block";
	}
	const ro = new ResizeObserver(resize);
	ro.observe(canvasWrap);

	function frameModelToView(root) {
		// Reset wrapper transforms so repeated calls don’t accumulate
		root.position.set(0, 0, 0);
		root.rotation.set(0, 0, 0);
		root.scale.set(1, 1, 1);

		// Compute bounds
		const box = new THREE.Box3().setFromObject(root);
		const center = box.getCenter(new THREE.Vector3());

		// Move so X/Z centered at origin
		root.position.x -= center.x;
		root.position.z -= center.z;

		// Recompute to get accurate bottom
		box.setFromObject(root);

		// Lift model so its bottom touches y=0
		root.position.y -= box.min.y;

		// Recompute final bounds after lifting
		box.setFromObject(root);
		const size2 = box.getSize(new THREE.Vector3());

		const maxDim = Math.max(size2.x, size2.y, size2.z) || 1;

		// Set controls target to mid-upper body (not origin)
		const targetY = size2.y * 0.55;               // look a bit higher (centers model vertically)
		controls.target.set(0, targetY, 0);

		const camX = 0.50;  // right/left (more positive = more rotated to your right) (also zooms out farther to either side)
		const camY = 0.25;  // height (more positive = higher up) (raises camera and points to model)
		const camZ = 1.00;  // forward/back (zoom) (more positive = more zoomed out)

		// Camera: top-left diagonal looking at the target
		const dist = maxDim * 2.3;
		camera.position.set(dist * camX, targetY + maxDim * camY, dist * camZ);
		camera.lookAt(0, targetY, 0);

		// ---- PAN OFFSET (like right-click pan) ----
		const panLR = 0.20; // left/right (more positive = more to the right)
		const panUD = 0.0;   // up/down (more negative = more downward)
		const scroll = 0.25;   // zoom (more negative = more zoomed in)

		// Build camera-relative right/up vectors
		const dir = new THREE.Vector3();
		camera.getWorldDirection(dir);

		const right = new THREE.Vector3().crossVectors(dir, camera.up).normalize();
		const up = new THREE.Vector3().copy(camera.up).normalize();

		// Convert to world-space pan vector
		const pan = new THREE.Vector3()
			.addScaledVector(right, panLR * maxDim)
			.addScaledVector(up, panUD * maxDim);

		// Apply pan by moving BOTH camera and target
		camera.position.add(pan);
		controls.target.add(pan);

		// ---- APPLY SCROLL (ZOOM) ----
		// Move camera closer/farther from the target along the current view ray
		{
			const toCam = new THREE.Vector3().subVectors(camera.position, controls.target);
			const currentDist = toCam.length() || 0.0001;

			// scroll is in "model size" units so it scales nicely per Pokémon
			const desiredDist = currentDist + (scroll * maxDim);

			// clamp using the same min/max you set for OrbitControls
			const clampedDist = THREE.MathUtils.clamp(
				desiredDist,
				maxDim * 0.6,  // should match controls.minDistance below
				maxDim * 8.0   // should match controls.maxDistance below
			);

			toCam.setLength(clampedDist);
			camera.position.copy(controls.target).add(toCam);
		}

		// Clamp controls so you don't start off-screen or zoom through the model
		controls.minDistance = maxDim * 0.6;
		controls.maxDistance = maxDim * 8.0;
		controls.update();

		// Grid stays at floor
		grid.position.set(0, 0, 0);
	}















	function enableControls(enable) {
		selectEl.disabled = !enable;
		playToggleBtn.disabled = !enable;
		speedEl.disabled = !enable;
		if (poseBtn) poseBtn.disabled = !enable;
	}

	function setPill(btn, on) {
		if (!btn) return;
		btn.classList.toggle("is-on", !!on);
		btn.classList.toggle("is-off", !on);
		btn.setAttribute("aria-pressed", on ? "true" : "false");
	}

	function takeViewerScreenshot({ filename = "model.png" } = {}) {
		// Ensure a fresh render so the latest camera position is captured
		renderer.render(scene, camera);

		try {
			const dataUrl = renderer.domElement.toDataURL("image/png");
			downloadDataUrl(dataUrl, filename);
		} catch (err) {
			console.error("Screenshot failed (canvas may be tainted by CORS textures):", err);
			setStatus("Screenshot failed (CORS). See console.");
			setTimeout(() => setStatus(""), 2200);
		}
	}





	function withRecordingQuality(fn) {
		const prevPR = renderer.getPixelRatio();
		// Use devicePixelRatio (clamped) for crisp capture; 2 is usually plenty
		const recPR = Math.min(window.devicePixelRatio || 1, 2);

		renderer.setPixelRatio(recPR);
		// Keep the same canvas/layout size; just re-render at higher internal res
		resize();

		try {
			return fn();
		} finally {
			renderer.setPixelRatio(prevPR);
			resize();
		}
	}







	async function startRecordingWebm({
		fps = 30,
		maxSeconds = 3,
		warmupFrames = 0,
		dropFirstMs = 0,
	} = {}) {
		if (!renderer?.domElement) return;

		if (!window.MediaRecorder || !renderer.domElement.captureStream) {
			setStatus("Recording not supported in this browser.");
			setTimeout(() => setStatus(""), 1800);
			return;
		}

		webmBtn.disabled = true;
		lastWebmBlob = null;

		// Force a fresh render before we begin
		renderer.render(scene, camera);

		recordChunks = [];
		lastWebmBlob = null;

		if (warmupFrames > 0) {
			await warmUpAnimationFrames(warmupFrames);
		}

		let stream;
		withRecordingQuality(() => {
			renderer.render(scene, camera);
			stream = renderer.domElement.captureStream(fps);
		});

		renderer.render(scene, camera);
		await new Promise(requestAnimationFrame);
		renderer.render(scene, camera);

		const mimeType = pickBestWebmMime();
		const rec = new MediaRecorder(
			stream,
			mimeType
				? { mimeType, videoBitsPerSecond: 12_000_000 } // ~12 Mbps
				: { videoBitsPerSecond: 12_000_000 }
		);

		mediaRecorder = rec;

		rec.ondataavailable = (e) => {
			if (e.data && e.data.size > 0) recordChunks.push(e.data);
		};

		rec.onerror = (e) => {
			console.error("MediaRecorder error:", e);
			setStatus("Recording error. See console.");
		};

		rec.onstop = () => {
			try {
				lastWebmBlob = new Blob(recordChunks, { type: rec.mimeType || "video/webm" });

				// Enable buttons instead of auto-download
				webmBtn.disabled = false;
				recordBtn.textContent = "Record";
				setPill(recordBtn, false);

				setStatus("Recorded.");
				setTimeout(() => setStatus(""), 1000);
			} catch (err) {
				console.error(err);
				setStatus("Failed to finalize WebM.");
			} finally {
				mediaRecorder = null;
			}
		};

		rec.start(100); // gather chunks every 100ms
		setStatus(`Recording ${maxSeconds}s…`);

		// UI
		setPill(recordBtn, true);
		recordBtn.textContent = "Stop";
		recordBtn.disabled = false;

		// Auto-stop
		setTimeout(() => {
			if (mediaRecorder && mediaRecorder.state === "recording") stopRecordingWebm();
		}, Math.max(0.25, maxSeconds) * 1000);
	}

	function stopRecordingWebm() {
		if (!mediaRecorder) return;

		try {
			mediaRecorder.stop();
		} catch (e) {
			console.warn("stopRecordingWebm:", e);
		}

		// UI
		setPill(recordBtn, false);
		recordBtn.textContent = "Record";
	}



	// --- Rig visualizer (actual bones + joints) ---











	// Save pristine base color ONCE per material instance


	function _setOpacityLabel(el, pct) {
		if (el) el.textContent = `${pct}%`;
	}

	function _applyOverlayOpacityToAll() {
		// Recompute everything using the new opacities.
		// Use whatever you already have for “recompute all meshes”.
		if (model) {
			model.traverse((o) => {
				if (o?.isMesh) recomputeMeshTint(o); // your existing function
			});
		}
	}

	if (meshOpacityEl) {
		meshOpacityEl.addEventListener("input", () => {
			const pct = Math.max(0, Math.min(100, Number(meshOpacityEl.value) || 0));
			meshOverlayOpacity = pct / 100;
			refs.meshOverlayOpacity = meshOverlayOpacity;
			_setOpacityLabel(meshOpacityVal, pct);
			_applyOverlayOpacityToAll();
		});
	}

	if (matOpacityEl) {
		matOpacityEl.addEventListener("input", () => {
			const pct = Math.max(0, Math.min(100, Number(matOpacityEl.value) || 0));
			matOverlayOpacity = pct / 100;
			refs.matOverlayOpacity = matOverlayOpacity;
			_setOpacityLabel(matOpacityVal, pct);
			_applyOverlayOpacityToAll();
		});
	}

	// Recompute a single material’s displayed color from:
	// base -> materialOverlay(name) -> meshOverlay(uuid)


	// Recompute for an entire mesh


	// IMPORTANT: when we clone materials for a mesh, update matsByName immediately










	// Hook UI
	selectEl.addEventListener("change", () => {
		lastAnimIndex = Number(selectEl.value) || 0;
		if (refs.poseMode) return; // don't start anims while posed
		setAnimByIndex(lastAnimIndex);
	});
	playToggleBtn.addEventListener("click", () => {
		// If Pose is on, Play should: turn Pose off + restart animation (and be "playing")
		if (refs.poseMode) {
			refs.poseMode = false;
			setPill(poseBtn, false);

			// restore model to rest pose first (prevents leftover frozen pose)
			restoreRestPose();

			// restart the currently selected animation
			lastAnimIndex = Number(selectEl.value) || 0;
			setAnimByIndex(lastAnimIndex);

			// keep Play in the "playing" state (button shows Pause)
			playToggleBtn.textContent = "Pause";
			setPill(playToggleBtn, true);
			return;
		}

		if (!refs.activeAction) return;

		// Normal Play/Pause toggle
		refs.userPaused = !refs.userPaused;
		refs.activeAction.paused = refs.userPaused;

		if (refs.userPaused) clearLoopPadding();
		else applyPaddedLoop(refs.activeAction, refs.mixer?._clips?.[Number(selectEl.value)]);

		playToggleBtn.textContent = refs.userPaused ? "Play" : "Pause";
		setPill(playToggleBtn, !refs.userPaused);
	});
	poseBtn?.addEventListener("click", () => {
		if (!model) return;

		refs.poseMode = !refs.poseMode;
		setPill(poseBtn, refs.poseMode);

		if (refs.poseMode) {
			// entering pose mode
			lastAnimIndex = Number(selectEl.value) || 0;

			stopAllAnimations();
			restoreRestPose();
		} else {
			setAnimByIndex(lastAnimIndex);
		}
	});
	speedEl.addEventListener("input", () => {
		if (refs.mixer) refs.mixer.timeScale = Number(speedEl.value);
	});

	gridBtn?.addEventListener("click", () => {
		grid.visible = !grid.visible;
		setPill(gridBtn, grid.visible);
	});
	wireBtn?.addEventListener("click", () => {
		wireframeOn = !wireframeOn;
		setWireframe(wireframeOn);
		setPill(wireBtn, wireframeOn);
	});
	bonesBtn?.addEventListener("click", () => {
		refs.skeletonOn = !refs.skeletonOn;
		setSkeleton(refs.skeletonOn);
		setPill(bonesBtn, refs.skeletonOn);
	});

	root.addEventListener("change", (e) => {
		const el = e.target;
		if (!(el instanceof HTMLInputElement)) return;

		// ✅ Color pickers first (they are NOT checkboxes)
		if (el.type === "color" && el.dataset.kind === "meshcolor" && el.dataset.uuid) {
			setMeshOverlayColor(el.dataset.uuid, el.value);
			return;
		}
		if (el.type === "color" && el.dataset.kind === "matcolor" && el.dataset.name) {
			setMaterialOverlayByName(el.dataset.name, el.value);
			return;
		}

		// Then handle checkboxes
		if (el.type !== "checkbox") return;

		if (el.dataset.kind === "mesh" && el.dataset.uuid) {
			setMeshEnabled(el.dataset.uuid, el.checked);
			rebuildMeshesTabUI();
			return;
		}
		if (el.dataset.kind === "mat" && el.dataset.name) {
			setMaterialEnabledByName(el.dataset.name, el.checked);
			rebuildMeshesTabUI();
			return;
		}
	});

	root.addEventListener("click", (e) => {
		const btn = e.target;
		if (!(btn instanceof HTMLElement)) return;

		if (btn.dataset.act === "meshcolor-reset" && btn.dataset.uuid) {
			meshOverlay.set(btn.dataset.uuid, null);
			setMeshOverlayColor(btn.dataset.uuid, null);
			rebuildMeshesTabUI();
		}

		if (btn.dataset.act === "matcolor-reset" && btn.dataset.name) {
			matOverlay.set(btn.dataset.name, null);
			setMaterialOverlayByName(btn.dataset.name, null);
			rebuildMeshesTabUI();
		}
	});
	meshesToggleAllBtn?.addEventListener("click", () => {
		const anyChecked = Array.from(meshState.values()).some((v) => v !== false);
		const next = !anyChecked; // if any are on -> turn all OFF; else turn all ON

		for (const [uuid] of meshByUuid) setMeshEnabled(uuid, next);
		rebuildMeshesTabUI();
	});

	matsToggleAllBtn?.addEventListener("click", () => {
		const anyChecked = Array.from(matState.values()).some((v) => v !== false);
		const next = !anyChecked;

		for (const k of matsByName.keys()) setMaterialEnabledByName(k, next);
		rebuildMeshesTabUI();
	});

	screenshotBtn?.addEventListener("click", () => {
		// Uses transparent renderer clearColor; grid/wireframe/skeleton toggles affect what is captured.
		takeViewerScreenshot({ filename: `${title.replace(/[^a-z0-9\-_]+/gi, "_") || "model"}_${Date.now()}.png` });
	});
	recordBtn?.addEventListener("click", () => {
		// Toggle record: click once to start, click again to stop early
		if (mediaRecorder && mediaRecorder.state === "recording") {
			stopRecordingWebm();
			return;
		}

		// If actively playing an animation, restart it before recording
		if (isAnimationActivelyPlaying()) {
			hardRestartAnimForRecording();
		}

		const seconds = computeRecordingSecondsForCurrentState();

		startRecordingWebm({
			fps: 60,
			maxSeconds: seconds,
			warmupFrames: isAnimationActivelyPlaying() ? 4 : 0,
		});
	});
	webmBtn?.addEventListener("click", () => {
		if (!lastWebmBlob) return;
		const fname = `${title.replace(/[^a-z0-9\-_]+/gi, "_") || "model"}_${Date.now()}.webm`;
		downloadBlob(lastWebmBlob, fname);
	});

	resetBtn.addEventListener("click", () => {
		if (model) frameModelToView(model);
	});
	autoBtn?.addEventListener("click", () => {
		autoRotate = !autoRotate;
		controls.autoRotate = autoRotate;
		setPill(autoBtn, autoRotate);
	});

	// Animation loop
	let raf = 0;
	function tick() {
		raf = requestAnimationFrame(tick);
		const dt = clock.getDelta();
		if (refs.mixer) refs.mixer.update(dt);
		controls.update();

		// keep rig visualizers aligned to animated bones
		if (refs.skeletonOn && rigUpdaters.length) {
			for (const fn of rigUpdaters) {
				try { fn(); } catch (e) { console.warn("rigUpdater:", e); }
			}
		}

		for (const m of eyeShaderMats) {
			const u = m?.uniforms;
			if (!u) continue;

			if (u.uAmb?.value) {
				u.uAmb.value.copy(amb.color);
				if (u.uAmbIntensity) u.uAmbIntensity.value = amb.intensity;
			}

			if (u.uHemiSky?.value) u.uHemiSky.value.copy(hemi.color);
			if (u.uHemiGround?.value) u.uHemiGround.value.copy(hemi.groundColor);
			if (u.uHemiIntensity) u.uHemiIntensity.value = hemi.intensity;
			if (u.uHemiDir?.value) u.uHemiDir.value.set(0, 1, 0);

			if (u.uDir0Color?.value) u.uDir0Color.value.copy(key.color);
			if (u.uDir0Intensity) u.uDir0Intensity.value = key.intensity;
			if (u.uDir0Dir?.value) u.uDir0Dir.value.copy(key.position).normalize();

			if (u.uDir1Color?.value) u.uDir1Color.value.copy(fill.color);
			if (u.uDir1Intensity) u.uDir1Intensity.value = fill.intensity;
			if (u.uDir1Dir?.value) u.uDir1Dir.value.copy(fill.position).normalize();
		}

		const t = clock.elapsedTime;
		for (const m of smokeShaderMats) m.uniforms.uTime.value = t;

		try {
			renderer.render(scene, camera);
		} catch (e) {
			console.error("RENDER FAIL", e);

			if (model) {
				model.traverse((o) => {
					if (!o?.isMesh) return;
					const mats = Array.isArray(o.material) ? o.material : [o.material];
					for (const m of mats) {
						if (!m) continue;
						console.log("MAT", o.name, m.name, m.type, {
							hasMap: !!m.map,
							hasAlphaMap: !!m.alphaMap,
							transparent: m.transparent,
							alphaTest: m.alphaTest,
						});
					}
				});
			}

			throw e;
		}

		renderer.render(scene, camera);
	}
	tick();

	// Load GLB
	setStatus("Loading model…");
	enableControls(false);

	function isTypingInInput(e) {
		const t = e.target;
		return (
			t instanceof HTMLInputElement ||
			t instanceof HTMLTextAreaElement ||
			t instanceof HTMLSelectElement ||
			t?.isContentEditable
		);
	}

	function onViewerKeydown(e) {
		// Only active when modal is open
		if (!modalEl.classList.contains("open")) return;

		// Don’t hijack typing
		if (isTypingInInput(e)) return;

		// Ignore repeats (holding key)
		if (e.repeat) return;

		switch (e.key.toLowerCase()) {
			case "p": {
				// Screenshot
				e.preventDefault();
				takeViewerScreenshot({
					filename: `${title.replace(/[^a-z0-9\-_]+/gi, "_") || "model"}_${Date.now()}.png`,
				});
				break;
			}

			case "o": {
				// Record toggle
				e.preventDefault();

				// Same logic as clicking the Record button
				if (mediaRecorder && mediaRecorder.state === "recording") {
					stopRecordingWebm();
					return;
				}

				if (isAnimationActivelyPlaying()) {
					hardRestartAnimForRecording();
				}

				const seconds = computeRecordingSecondsForCurrentState();
				startRecordingWebm({
					fps: 60,
					maxSeconds: seconds,
					warmupFrames: isAnimationActivelyPlaying() ? 4 : 0,
				});
				break;
			}
		}
	}

	glbUrl = resolveVariantModelUrl(glbUrl, variant);
	glbUrl = await resolveModelGlbUrl(glbUrl);

	loader.load(glbUrl, async (gltf) => {
		const wrap = new THREE.Group();
		wrap.name = "ModelRoot";
		refs.model = wrap;
		wrap.add(gltf.scene);
		scene.add(wrap);

		const pipeline = await applyModelViewerPipeline({
			scene: gltf.scene,
			renderer,
			glbUrl,
			variant,
			eyeShaderMats,
			lighting: { amb, hemi, key, fill, cornerBL, cornerBR, top },
			setStatus,
		});

		collectSmokeShaderMats(gltf.scene, smokeShaderMats);

		frameModelToView(model);

		// Animations
		const clips = gltf.animations || [];
		refs.mixer = new THREE.AnimationMixer(model);
		refs.mixer._clips = clips;

		selectEl.innerHTML = "";
		const display = buildAnimDisplayNames(clips);

		clips.forEach((clip, idx) => {
			const opt = document.createElement("option");
			opt.value = String(idx);
			opt.textContent = display[idx].label;

			// 👇 Native hover tooltip
			opt.title = display[idx].title;

			selectEl.appendChild(opt);
		});
		if (clips.length) {
			const startIdx = findPreferredAnimIndex(clips, pipeline);
			lastAnimIndex = startIdx;
			setAnimByIndex(startIdx);
		}
		enableControls(clips.length > 0);

		captureRestPose(model);
		setPill(poseBtn, false);
		refs.poseMode = false;

		setWireframe(wireframeOn);
		setSkeleton(refs.skeletonOn);
		grid.visible = true;
		setPill(gridBtn, true);

		rebuildMeshesTabUI();

		controls.autoRotate = autoRotate;

		// Make sure textures show right
		model.traverse((o) => {
			if (!o?.isMesh) return;
			const mats = Array.isArray(o.material) ? o.material : [o.material];
			for (const m of mats) ensureBaseColor(m);
		});
		setStatus("");
	},
		undefined,
		(err) => {
			window.PPGC?.reportMissingAsset?.("models", glbUrl);
			console.warn("[modelViewer] Failed to load model:", glbUrl);
			setStatus(`Failed to load: ${glbUrl}`);
		}
	);

	// --- Mount into your modal system ---
	// Replace this with YOUR modal open call.
	// Example expects you have something like window.openModal({ contentEl, onClose })
	const modalEl = document.getElementById("modelViewerModal");
	const titleEl = document.getElementById("modelViewerTitle");
	const bodyEl = document.getElementById("modelViewerBody");
	const closeBtn = document.getElementById("modelViewerClose");

	if (!modalEl || !bodyEl) {
		console.warn("modelViewerModal missing in index.html");
		setStatus("Missing #modelViewerModal shell.");
		return { cleanup: () => { } };
	}

	if (titleEl) titleEl.textContent = title;

	// Clear previous viewer if any
	bodyEl.innerHTML = "";
	bodyEl.appendChild(root);

	const close = () => {
		modalEl.classList.remove("open");
		modalEl.setAttribute("aria-hidden", "true");
		// tell viewer to cleanup GPU resources
		cleanup();
	};

	// open
	modalEl.classList.add("open");
	modalEl.setAttribute("aria-hidden", "false");

	// wire close once
	if (modalEl.dataset.wired !== "1") {
		modalEl.dataset.wired = "1";

		modalEl.addEventListener("click", (e) => {
			if (e.target === modalEl) close();
		});

		closeBtn?.addEventListener("click", close);
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && modalEl.classList.contains("open")) close();
		});
		document.addEventListener("keydown", onViewerKeydown);

		// --- Solo UI toggle button (hide overlay tabs + help panel) ---
		let soloBtn = document.getElementById("modelViewerSolo");
		if (!soloBtn && closeBtn?.parentElement) {
			soloBtn = document.createElement("button");
			soloBtn.id = "modelViewerSolo";
			soloBtn.className = closeBtn.className || "modal-close";
			soloBtn.type = "button";
			soloBtn.textContent = "Toggle UI";
			soloBtn.style = "color: white; padding: 15px;";

			// Insert right next to the close button
			closeBtn.parentElement.insertBefore(soloBtn, closeBtn);
		}

		soloBtn?.addEventListener("click", () => {
			const currentRoot = document
				.getElementById("modelViewerBody")
				?.querySelector(".ppgc-modelviewer");

			if (!currentRoot) return;

			const isSolo = currentRoot.classList.toggle("is-solo");

			// 🔐 Persist preference
			if (window.store?.state) {
				window.store.state.modelViewerSolo = isSolo;
				window.store.save?.();
			}
		});
	}

	return { cleanup };

	// Cleanup on close (IMPORTANT)
	function cleanup() {
		cancelAnimationFrame(raf);
		ro.disconnect();
		clearLoopPadding();
		controls.dispose();
		renderer.dispose();
		scene.traverse((o) => {
			if (o.isMesh) {
				o.geometry?.dispose?.();
				if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose?.());
				else o.material?.dispose?.();
			}
		});
		for (const h of skelHelpers) {
			if (h && h.__detach) {
				h.bone?.remove?.(h.helper);
			}
		}
		eyeShaderMats.length = 0;
		smokeShaderMats.length = 0;
		document.removeEventListener("keydown", onViewerKeydown);
		root.remove();
	}
}
window.PPGC = window.PPGC || {};
PPGC.openModelViewerModal = openModelViewerModal;

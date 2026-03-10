// src/ui/modals/modelViewerModal.js
// Requires: three (THREE), GLTFLoader, OrbitControls
// You can adapt imports depending on your build setup.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { detectModelPipeline, resolveVariantModelUrl } from "./modelPipelines/registy.js";
import { getEyeParamsForModel } from "./modelPipelines/eyes.js";

import { apply3DSTextureSetToScene } from "./modelPipelines/3dsPipeline.js";
import { applyLGPETextureSetToScene } from "./modelPipelines/lgpePipeline.js";
import { applySwordShieldTextureSetToScene } from "./modelPipelines/swshPipeline.js";
import { applyLegendsArceusTextureSetToScene } from "./modelPipelines/laPipeline.js";
import { applyPokemonTextureSetToScene } from "./modelPipelines/scviPipeline.js";
import { applyLegendsZATextureSetToScene } from "./modelPipelines/lzaPipeline.js";

const eyeShaderMats = [];
const smokeShaderMats = [];

function parseAnimLabel(raw) {
	const r = (raw || "").trim();
	const lower = r.toLowerCase();

	// --- phase suffix detection ---
	let phase = "";
	if (/(^|_)(start|st)(_|$)/i.test(r)) phase = "Start";
	else if (/(^|_)(end|ed)(_|$)/i.test(r)) phase = "End";
	else if (/(^|_)(loop|lp)(_|$)/i.test(r)) phase = "Loop";

	// remove known phase tokens from the base matching
	const baseKey = lower
		.replace(/(^|_)(start|st)(_|$)/g, "_")
		.replace(/(^|_)(end|ed)(_|$)/g, "_")
		.replace(/(^|_)(loop|lp)(_|$)/g, "_")
		.replace(/__+/g, "_");

	// --- base label rules (keep what you already had, but return generic buckets) ---
	let base = "";

	if (/defaultwait/.test(baseKey)) base = "Wait";
	else if (/battlewait/.test(baseKey)) base = "Battle Wait";
	else if (/defaultidle/.test(baseKey)) base = "Idle";
	else if (/battleidle/.test(baseKey)) base = "Battle Idle";
	else if (/turn_r000|turnmove_r000|turnmove01_r000/.test(baseKey)) base = "Turn";
	else if (/turn_l090|turnmove_l090|turnmove01_l090/.test(baseKey)) base = "Turn Left";
	else if (/turn_r090|turnmove_r090|turnmove01_r090/.test(baseKey)) base = "Turn Right";
	else if (/walk/.test(baseKey)) base = "Walk";
	else if (/run/.test(baseKey)) base = "Run";
	else if (/stepin/.test(baseKey)) base = "Step In";
	else if (/stepout/.test(baseKey)) base = "Step Out";
	else if (/jumpup/.test(baseKey)) base = "Jump Up";
	else if (/jumpdown/.test(baseKey)) base = "Jump Down";
	else if (/land/.test(baseKey)) base = "Land";
	else if (/wildbool/.test(baseKey)) base = "Wild Bool";
	else if (/rest/.test(baseKey)) base = "Rest";
	else if (/sleep/.test(baseKey)) base = "Sleep";
	else if (/roar/.test(baseKey)) base = "Roar";
	else if (/appeal/.test(baseKey)) base = "Appeal";
	else if (/refresh/.test(baseKey)) base = "Refresh";
	else if (/search/.test(baseKey)) base = "Search";
	else if (/rangeattack/.test(baseKey)) base = "Ranged Attack";
	else if (/eat/.test(baseKey)) base = "Eat";
	else if (/attack/.test(baseKey)) base = "Attack";
	else if (/charge/.test(baseKey)) base = "Charge";
	else if (/damage/.test(baseKey)) base = "Damage";
	else if (/stun/.test(baseKey)) base = "Stun";
	else if (/down/.test(baseKey)) base = "Downed";
	else if (/glad/.test(baseKey)) base = "Glad";
	else if (/notice/.test(baseKey)) base = "Notice";
	else if (/hate/.test(baseKey)) base = "Hate";
	else if (/ev_once/.test(baseKey)) base = "EV Once";
	else if (/eye/.test(baseKey)) base = "Blink";
	else if (/mouth/.test(baseKey)) base = "Mouth";
	else base = r || "Animation";

	return { base, phase, raw: r };
}

function buildAnimDisplayNames(clips) {
	// First pass: parse
	const parsed = clips.map((c) => ({ clip: c, ...parseAnimLabel(c.name) }));

	// Count how many per base label
	const counts = {};
	for (const p of parsed) counts[p.base] = (counts[p.base] || 0) + 1;

	// Second pass: number duplicates per base
	const seen = {};
	return parsed.map((p) => {
		const needsNumber = (counts[p.base] || 0) > 1;
		const n = (seen[p.base] = (seen[p.base] || 0) + 1);

		const num = needsNumber ? String(n).padStart(2, "0") : "";
		const phase = p.phase ? ` (${p.phase})` : "";

		const label = needsNumber ? `${p.base} ${num}${phase}` : `${p.base}${phase}`;
		return { label, title: p.raw };
	});
}

function findPreferredAnimIndex(clips, pipeline) {
	if (!Array.isArray(clips) || clips.length === 0) return 0;

	const p = String(pipeline || "").toLowerCase();

	// Pipeline-specific "best default" patterns (case-insensitive)
	// 3DS:  pm0002_00|Movement_idle|Animation Base Layer
	// LGPE/SWSH: 0002-00-00-pm0002_00_ba10_waitA01
	// LA/SCVI/LZA: pm0002_00_00_00000_defaultwait01_loop
	const patternsByPipeline = {
		"3ds": [/\bmovement_idle\b/i,],
		"lgpe": [/\bwaita01\b/i,],
		"swsh": [/\bwaita01\b/i,],
		"la": [/\bdefaultwait01_loop\b/i,],
		"scvi": [/\bdefaultwait01_loop\b/i,],
		"lza": [/\bdefaultwait01_loop\b/i,],
	};

	// Fallback patterns (if pipeline is unknown or clip list is odd)
	const fallback = [
		/\bwaita01\b/i,
		/\bmovement_idle\b/i,
		/\bdefaultwait01_loop\b/i,
		/\bdefaultwait\b/i,
		/\bidle\b/i,
		/\bwait\b/i,
	];

	const patterns = patternsByPipeline[p] || fallback;

	// First pass: strict "best match" by pattern order
	for (const re of patterns) {
		const idx = clips.findIndex((c) => re.test(String(c?.name || "")));
		if (idx !== -1) return idx;
	}

	// Second pass: heuristics if nothing matched
	// Prefer anything loop-ish, then anything "idle/wait", else 0.
	let bestIdx = 0;
	let bestScore = -Infinity;

	for (let i = 0; i < clips.length; i++) {
		const name = String(clips[i]?.name || "");
		const low = name.toLowerCase();

		let score = 0;
		if (/(^|[_\-|])defaultwait01_loop([_\-|]|$)/.test(low)) score += 5000;
		if (/(^|[_\-|])movement_idle([_\-|]|$)/.test(low)) score += 4500;
		if (/(^|[_\-|])waita01([_\-|]|$)/.test(low)) score += 4000;

		if (/(^|[_\-|])(loop|lp)([_\-|]|$)/.test(low)) score += 50;
		if (low.includes("idle")) score += 20;
		if (low.includes("wait")) score += 10;

		if (score > bestScore) {
			bestScore = score;
			bestIdx = i;
		}
	}

	return bestIdx;
}

export async function openModelViewerModal({
	title = "Model Viewer",
	glbUrl,
	variant = "base",
}) {
	eyeShaderMats.length = 0;
	smokeShaderMats.length = 0;

	// --- DOM scaffold ---
	const root = document.createElement("div");
	root.className = "ppgc-modelviewer";

	if (window.store?.state?.modelViewerSolo) {
		root.classList.add("is-solo");
	}

	root.innerHTML = `
  <div class="ppgc-modelviewer__body">
    <div class="ppgc-modelviewer__canvaswrap"></div>
    <div class="ppgc-modelviewer__status">Loading…</div>

    <!-- Overlay dropdown UI (does NOT affect layout) -->
<div class="ppgc-modelviewer__overlay" aria-label="Viewer controls">
  <div class="ppgc-modelviewer__dropbar" role="tablist" aria-label="Panels">
    <button class="ppgc-modelviewer__dropbtn is-active" data-drop="viewer" role="tab" aria-selected="true">Viewer</button>
    <button class="ppgc-modelviewer__dropbtn" data-drop="assets" role="tab" aria-selected="false">Assets</button>
    <button class="ppgc-modelviewer__dropbtn" data-drop="anim" role="tab" aria-selected="false">Animation</button>
    <button class="ppgc-modelviewer__dropbtn" data-drop="record" role="tab" aria-selected="false">Record</button>
  </div>

  <div class="ppgc-modelviewer__dropwrap">
    <!-- Viewer dropdown -->
    <div class="ppgc-modelviewer__drop is-open" data-drop-panel="viewer">
      <div class="ppgc-modelviewer__row">
        <button class="ppgc-modelviewer__pill" data-act="reset">Camera Reset</button>
        <button class="ppgc-modelviewer__pill is-off" data-act="autorotate" aria-pressed="false">Auto Rotate</button>
      </div>
      <div class="ppgc-modelviewer__row">
        <button class="ppgc-modelviewer__pill is-off" data-act="wireframe" aria-pressed="false">Wireframe</button>
        <button class="ppgc-modelviewer__pill is-off" data-act="skeleton" aria-pressed="false">Skeleton</button>
        <button class="ppgc-modelviewer__pill is-on" data-act="grid" aria-pressed="true">Grid</button>
      </div>
    </div>

    <!-- Assets dropdown -->
    <div class="ppgc-modelviewer__drop" data-drop-panel="assets">
      <div class="ppgc-modelviewer__meshctl">
        <div class="ppgc-modelviewer__meshcol" data-kind="mesh">
          <div class="ppgc-modelviewer__meshhead">
            <b>Meshes</b>
            <button class="ppgc-modelviewer__pill is-off" data-act="meshes-toggle-all" style="width:auto">All Off</button>
          </div>
          <div class="ppgc-modelviewer__opacityrow">
            <span class="ppgc-modelviewer__opacitylabel">Opacity</span>
            <input class="ppgc-modelviewer__opacityrange" type="range" min="0" max="100" value="65" data-act="mesh-overlay-opacity" />
            <span class="ppgc-modelviewer__opacityval" data-mesh-opacity-val>65%</span>
          </div>
          <div class="ppgc-modelviewer__listbox">
			<div class="ppgc-modelviewer__checklist" data-mesh-list></div>
			</div>
        </div>

        <div class="ppgc-modelviewer__meshcol" data-kind="mat">
          <div class="ppgc-modelviewer__meshhead">
            <b>Materials</b>
            <button class="ppgc-modelviewer__pill is-off" data-act="mats-toggle-all" style="width:auto">All Off</button>
          </div>
          <div class="ppgc-modelviewer__opacityrow">
            <span class="ppgc-modelviewer__opacitylabel">Opacity</span>
            <input class="ppgc-modelviewer__opacityrange" type="range" min="0" max="100" value="65" data-act="mat-overlay-opacity" />
            <span class="ppgc-modelviewer__opacityval" data-mat-opacity-val>65%</span>
          </div>
          <div class="ppgc-modelviewer__listbox">
		<div class="ppgc-modelviewer__checklist" data-mat-list></div>
		</div>
        </div>
      </div>
    </div>

    <!-- Animation dropdown -->
    <div class="ppgc-modelviewer__drop" data-drop-panel="anim">
      <div class="ppgc-modelviewer__row">
        <select class="ppgc-modelviewer__select" disabled></select>
        <button class="ppgc-modelviewer__pill is-play" data-act="playtoggle" disabled style="width:auto">Play</button>
        <button class="ppgc-modelviewer__pill is-off" data-act="pose" disabled style="width:auto">Pose</button>
        <label class="ppgc-modelviewer__speed">
          <span>Speed</span>
          <input
  class="ppgc-modelviewer__range"
  type="range"
  min="0.1"
  max="2.0"
  step="0.1"
  value="1.0"
  data-act="animspeed"
  disabled
/>
        </label>
      </div>
    </div>

    <!-- Record dropdown -->
    <div class="ppgc-modelviewer__drop" data-drop-panel="record">
      <div class="ppgc-modelviewer__row">
        <button class="ppgc-modelviewer__pill" data-act="screenshot">Screenshot</button>
        <button class="ppgc-modelviewer__pill is-off" data-act="record" aria-pressed="false">Record</button>
        <button class="ppgc-modelviewer__pill" data-act="webm" disabled>Export WebM</button>
      </div>
    </div>
  </div>
</div>

    <!-- Help overlay -->
    <div class="ppgc-modelviewer__help" aria-label="Controls help">
      <!-- keep your existing help content -->
      <div class="ppgc-modelviewer__help-title">Controls</div>
      <div class="ppgc-modelviewer__help-row">
					<span class="ppgc-ico ppgc-ico-mouse"></span>
					<span><b>Left</b> drag: Rotate</span>
				</div>
				<div class="ppgc-modelviewer__help-row">
					<span class="ppgc-ico ppgc-ico-mouse"></span>
					<span><b>Right</b> drag: Pan</span>
				</div>
				<div class="ppgc-modelviewer__help-row">
					<span class="ppgc-ico ppgc-ico-wheel"></span>
					<span>Wheel: Zoom</span>
				</div>
				<div class="ppgc-modelviewer__help-row">
					<span class="ppgc-ico ppgc-ico-touch"></span>
					<span>Touch: 1 finger rotate</span>
				</div>
				<div class="ppgc-modelviewer__help-row">
					<span class="ppgc-ico ppgc-ico-touch"></span>
					<span>Touch: 2 fingers pan / pinch zoom</span>
				</div>
				<div class="ppgc-modelviewer__help-row">
					<span class="ppgc-ico ppgc-ico-key"></span>
					<span>Screenshot: Press P</span>
				</div>
				<div class="ppgc-modelviewer__help-row">
					<span class="ppgc-ico ppgc-ico-key"></span>
					<span>Record: Press O</span>
				</div>
    </div>
  </div>
`;
	// --- Overlay dropdowns (Animation/View) ---
	const dropBtns = Array.from(root.querySelectorAll(".ppgc-modelviewer__dropbtn"));
	const dropPanels = Array.from(root.querySelectorAll(".ppgc-modelviewer__drop"));

	const canvasWrap = root.querySelector(".ppgc-modelviewer__canvaswrap");
	const statusEl = root.querySelector(".ppgc-modelviewer__status");

	const selectEl = root.querySelector("select");
	const playToggleBtn = root.querySelector('[data-act="playtoggle"]');
	const poseBtn = root.querySelector('[data-act="pose"]');
	const speedEl = root.querySelector('[data-act="animspeed"]');
	speedEl?.addEventListener("input", () => {
		if (mixer) mixer.timeScale = Number(speedEl.value);
	});

	const gridBtn = root.querySelector('[data-act="grid"]');
	const wireBtn = root.querySelector('[data-act="wireframe"]');
	const bonesBtn = root.querySelector('[data-act="skeleton"]');

	const meshListEl = root.querySelector("[data-mesh-list]");
	const meshesToggleAllBtn = root.querySelector('[data-act="meshes-toggle-all"]');
	const meshOpacityEl = root.querySelector('[data-act="mesh-overlay-opacity"]');
	const meshOpacityVal = root.querySelector('[data-mesh-opacity-val]');

	const matListEl = root.querySelector("[data-mat-list]");
	const matsToggleAllBtn = root.querySelector('[data-act="mats-toggle-all"]');
	const matOpacityEl = root.querySelector('[data-act="mat-overlay-opacity"]');
	const matOpacityVal = root.querySelector('[data-mat-opacity-val]');

	const resetBtn = root.querySelector('[data-act="reset"]');
	const autoBtn = root.querySelector('[data-act="autorotate"]');

	const screenshotBtn = root.querySelector('[data-act="screenshot"]');
	const recordBtn = root.querySelector('[data-act="record"]');
	const webmBtn = root.querySelector('[data-act="webm"]');

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

	function pickBestWebmMime() {
		const candidates = [
			"video/webm;codecs=vp9",
			"video/webm;codecs=vp8",
			"video/webm",
		];

		for (const c of candidates) {
			if (window.MediaRecorder && MediaRecorder.isTypeSupported?.(c)) return c;
		}
		return ""; // let browser decide
	}

	function downloadBlob(blob, filename) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		a.remove();
		setTimeout(() => URL.revokeObjectURL(url), 1500);
	}

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

	function captureRestPose(root) {
		restTransforms.clear();
		root.traverse((o) => {
			restTransforms.set(o.uuid, {
				pos: o.position.clone(),
				quat: o.quaternion.clone(),
				scale: o.scale.clone(),
			});
		});
	}

	function restoreRestPose() {
		if (!model) return;

		model.traverse((o) => {
			const t = restTransforms.get(o.uuid);
			if (!t) return;

			o.position.copy(t.pos);
			o.quaternion.copy(t.quat);
			o.scale.copy(t.scale);

			// For skinned meshes, also snap bones to bind pose
			if (o.isSkinnedMesh && o.skeleton) o.skeleton.pose();
		});

		model.updateMatrixWorld(true);
	}

	function stopAllAnimations() {
		clearLoopPadding();
		userPaused = true;

		if (activeAction) {
			activeAction.stop();
			activeAction = null;
		}

		if (mixer) mixer.stopAllAction();

		// UI reflects "not playing"
		playToggleBtn.textContent = "Play";
		setPill(playToggleBtn, false);
	}

	function clearLoopPadding() {
		if (loopRestartTimer) {
			clearTimeout(loopRestartTimer);
			loopRestartTimer = 0;
		}
		if (mixer && finishedHandler) {
			mixer.removeEventListener("finished", finishedHandler);
			finishedHandler = null;
		}
	}

	function estimateFrameCount(clip) {
		const tracks = clip?.tracks || [];
		const dts = [];

		for (const t of tracks) {
			const times = t?.times;
			if (!times || times.length < 2) continue;

			for (let i = 1; i < times.length; i++) {
				const dt = times[i] - times[i - 1];
				if (dt > 1e-6 && isFinite(dt)) dts.push(dt);
			}
		}

		// If we can't infer any step, treat as "not small"
		if (!dts.length) return Infinity;

		// Median dt
		dts.sort((a, b) => a - b);
		const mid = (dts.length / 2) | 0;
		const medianDt = dts.length % 2 ? dts[mid] : (dts[mid - 1] + dts[mid]) / 2;

		const dur = Math.max(clip?.duration || 0, 0);
		if (dur <= 0 || !isFinite(medianDt) || medianDt <= 0) return Infinity;

		return Math.round(dur / medianDt) + 1;
	}

	function applyPaddedLoop(action, clip) {
		clearLoopPadding();

		const frames = estimateFrameCount(clip);
		const isSmall = frames < MAX_FRAMES;

		// If not small: default behavior = loop forever with no padding
		if (!isSmall) {
			action.clampWhenFinished = false;
			action.setLoop(THREE.LoopRepeat, Infinity);
			return;
		}

		// If small: play once, then restart after a fixed delay
		const padSec = DELAY_SEC;

		action.setLoop(THREE.LoopOnce, 1);
		action.clampWhenFinished = true;

		finishedHandler = (e) => {
			if (!activeAction || e.action !== activeAction) return;
			if (userPaused) return;

			loopRestartTimer = window.setTimeout(() => {
				if (!activeAction) return;
				if (userPaused) return;

				activeAction.paused = false;
				activeAction.reset();
				activeAction.play();
			}, padSec * 1000);
		};

		mixer.addEventListener("finished", finishedHandler);
	}

	function setAnimByIndex(i) {
		clearLoopPadding();
		if (!mixer || !selectEl.options.length) return;

		const idx = Math.max(0, Math.min(i, selectEl.options.length - 1));
		selectEl.value = String(idx);

		const anim = mixer._clips[idx];
		if (!anim) return;

		if (activeAction) activeAction.fadeOut(0.1);

		activeAction = mixer.clipAction(anim);
		activeAction.reset().fadeIn(0.1).play();
		activeAction.paused = false;
		userPaused = false;
		applyPaddedLoop(activeAction, anim);

		playToggleBtn.textContent = "Pause";
		setPill(playToggleBtn, true);
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

	function downloadDataUrl(dataUrl, filename) {
		const a = document.createElement("a");
		a.href = dataUrl;
		a.download = filename || "screenshot.png";
		document.body.appendChild(a);
		a.click();
		a.remove();
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

	function warmUpAnimationFrames(frames = 2) {
		return new Promise((resolve) => {
			let n = 0;
			const step = () => {
				// Advance a tiny amount so mixer applies the "reset" pose cleanly
				const dt = 1 / 60;
				if (mixer) mixer.update(dt);
				controls.update();
				renderer.render(scene, camera);

				n++;
				if (n >= frames) resolve();
				else requestAnimationFrame(step);
			};
			requestAnimationFrame(step);
		});
	}

	function hardRestartAnimForRecording() {
		if (!mixer || !selectEl || poseMode) return false;

		const idx = Number(selectEl.value) || 0;
		const clip = mixer._clips?.[idx];
		if (!clip) return false;

		clearLoopPadding();

		// Kill any blending / previous actions completely
		mixer.stopAllAction();
		activeAction = mixer.clipAction(clip);

		// Start clean at t=0, no fade
		activeAction.enabled = true;
		activeAction.reset();
		activeAction.play();
		activeAction.paused = false;
		userPaused = false;

		// Re-apply your loop padding logic (keeps behavior consistent)
		applyPaddedLoop(activeAction, clip);

		playToggleBtn.textContent = "Pause";
		setPill(playToggleBtn, true);

		return true;
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

	function getSelectedClip() {
		if (!mixer || !mixer._clips || !selectEl) return null;
		const idx = Number(selectEl.value) || 0;
		return mixer._clips[idx] || null;
	}

	function isAnimationActivelyPlaying() {
		// "playing" means: not in Pose and not paused and we have an action
		return !!activeAction && !poseMode && !userPaused && activeAction.paused !== true;
	}

	function computeRecordingSecondsForCurrentState() {
		// If paused or pose, fixed 5s
		if (poseMode || userPaused || !activeAction) return 5;

		const clip = getSelectedClip();
		const dur = Math.max(clip?.duration || 0, 0);

		// If duration unknown/zero, fallback
		if (!dur || !isFinite(dur)) return 5;

		// Record exactly one animation loop (clip duration).
		// (Your padded-loop delay is for replay; we don't include the delay in the capture)
		return Math.min(Math.max(dur, 0.5), 10);
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

	function setWireframe(enabled) {
		wireframeOn = enabled;
		if (!model) return;

		model.traverse((o) => {
			if (!o.isMesh) return;

			const mats = Array.isArray(o.material) ? o.material : [o.material];
			mats.forEach((m) => {
				if (!m) return;
				m.wireframe = enabled;
				m.needsUpdate = true;
			});
		});
	}

	// --- Rig visualizer (actual bones + joints) ---
	function disposeObject3D(obj) {
		if (!obj) return;
		obj.traverse((o) => {
			if (o.isMesh) {
				o.geometry?.dispose?.();
				if (Array.isArray(o.material)) o.material.forEach((m) => m?.dispose?.());
				else o.material?.dispose?.();
			}
		});
	}

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

	function _matKey(m) {
		return (m?.name && String(m.name).trim()) ? String(m.name).trim() : "(unnamed)";
	}

	function setMaterialEnabledByName(name, enabled) {
		matState.set(name, !!enabled);

		const set = matsByName.get(name);
		if (!set) return;

		for (const m of set) {
			if (!m) continue;

			// save originals once
			if (!matSaved.has(m)) {
				matSaved.set(m, {
					transparent: !!m.transparent,
					opacity: (typeof m.opacity === "number") ? m.opacity : 1,
					depthWrite: (typeof m.depthWrite === "boolean") ? m.depthWrite : true,
					visible: (typeof m.visible === "boolean") ? m.visible : true,
				});
			}

			const orig = matSaved.get(m);

			// "off" = invisible without swapping materials
			if (!enabled) {
				if ("visible" in m) m.visible = false;
				m.transparent = true;
				m.opacity = 0.0;
				m.depthWrite = false;
			} else {
				if ("visible" in m) m.visible = orig.visible;
				m.transparent = orig.transparent;
				m.opacity = orig.opacity;
				m.depthWrite = orig.depthWrite;
			}

			m.needsUpdate = true;
		}
	}

	function setMeshEnabled(uuid, enabled) {
		meshState.set(uuid, !!enabled);
		const mesh = meshByUuid.get(uuid);
		if (!mesh) return;

		// mesh visibility is just the mesh toggle (materials can still be disabled independently)
		mesh.visible = !!enabled;
	}

	function rebuildMeshesTabUI() {
		if (!model || !meshListEl || !matListEl) return;

		// collect meshes + materials
		meshByUuid.clear();
		matsByName.clear();

		const meshes = [];
		model.traverse((o) => {
			if (!o?.isMesh) return;
			meshByUuid.set(o.uuid, o);
			meshes.push(o);

			const mats = Array.isArray(o.material) ? o.material : [o.material];
			for (const m of mats) {
				if (!m) continue;
				const k = _matKey(m);
				if (!matsByName.has(k)) matsByName.set(k, new Set());
				matsByName.get(k).add(m);
			}
		});

		// default states (first build only)
		for (const m of meshes) {
			if (!meshState.has(m.uuid)) meshState.set(m.uuid, true);
		}
		for (const k of matsByName.keys()) {
			if (!matState.has(k)) matState.set(k, true);
		}

		// render mesh checkboxes
		meshListEl.innerHTML = "";
		meshes
			.slice()
			.sort((a, b) => (a.name || a.uuid).localeCompare(b.name || b.uuid))
			.forEach((m, idx) => {
				const label = (m.name && m.name.trim())
					? prettyMeshName(m.name.trim())
					: `Mesh ${String(idx + 1).padStart(2, "0")}`;
				const checked = meshState.get(m.uuid) !== false;
				const currentHex = meshOverlay.get(m.uuid) || "";

				const row = document.createElement("label");
				row.className = "ppgc-modelviewer__checkrow";
				row.innerHTML = `
					<input type="checkbox" data-kind="mesh" data-uuid="${m.uuid}" ${checked ? "checked" : ""}/>
					<span>${label}</span>
					<span class="ppgc-modelviewer__miniwrap">
						<input class="ppgc-modelviewer__color" type="color" data-kind="meshcolor" data-uuid="${m.uuid}" value="${currentHex || "#ffffff"}" title="Overlay color"/>
						<button class="ppgc-modelviewer__minireset" type="button" data-act="meshcolor-reset" data-uuid="${m.uuid}">Reset</button>
					</span>
				`;
				meshListEl.appendChild(row);

				// apply state immediately
				m.visible = checked;
			});

		// render material checkboxes
		matListEl.innerHTML = "";
		Array.from(matsByName.keys())
			.sort((a, b) => a.localeCompare(b))
			.forEach((k) => {
				const checked = matState.get(k) !== false;
				const currentHex = matOverlay.get(k) || "";

				const row = document.createElement("label");
				row.className = "ppgc-modelviewer__checkrow";
				row.innerHTML = `
					<input type="checkbox" data-kind="mat" data-name="${k.replace(/"/g, "&quot;")}" ${checked ? "checked" : ""}/>
					<span>${prettyMatName(k)}</span>
					<span class="ppgc-modelviewer__miniwrap">
						<input class="ppgc-modelviewer__color" type="color" data-kind="matcolor" data-name="${k.replace(/"/g, "&quot;")}" value="${currentHex || "#ffffff"}" title="Overlay color"/>
						<button class="ppgc-modelviewer__minireset" type="button" data-act="matcolor-reset" data-name="${k.replace(/"/g, "&quot;")}">Reset</button>
					</span>
				`;
				matListEl.appendChild(row);

				// apply state immediately
				setMaterialEnabledByName(k, checked);
			});

		for (const [uuid, hex] of meshOverlay) {
			if (hex) setMeshOverlayColor(uuid, hex);
		}
		for (const [name, hex] of matOverlay) {
			if (hex) setMaterialOverlayByName(name, hex);
		}

		// update combined toggle buttons
		const anyMeshesChecked = Array.from(meshState.values()).some((v) => v !== false);
		const anyMatsChecked = Array.from(matState.values()).some((v) => v !== false);

		updateToggleAllButton(meshesToggleAllBtn, anyMeshesChecked);
		updateToggleAllButton(matsToggleAllBtn, anyMatsChecked);
	}

	function _titleize(s) {
		return String(s || "")
			.replace(/[_\-]+/g, " ")
			.replace(/\s+/g, " ")
			.trim()
			.replace(/\b\w/g, (c) => c.toUpperCase());
	}

	function prettyMeshName(raw) {
		const r = String(raw || "").trim();
		const low = r.toLowerCase();

		// ..._body_mesh_shape or ..._body_mesh_shape_1
		let m = /_body_mesh_shape(?:_(\d+))?$/.exec(low);
		if (m) {
			const n = m[1] ? (Number(m[1]) + 1) : 1;
			return n === 1 ? "Body" : `Body ${n}`;
		}

		// ..._head_mesh_shape(_#)
		m = /_head_mesh_shape(?:_(\d+))?$/.exec(low);
		if (m) {
			const n = m[1] ? (Number(m[1]) + 1) : 1;
			return n === 1 ? "Head" : `Head ${n}`;
		}

		// ..._eye_mesh_shape(_#)
		m = /_eye_mesh_shape(?:_(\d+))?$/.exec(low);
		if (m) {
			const n = m[1] ? (Number(m[1]) + 1) : 1;
			return n === 1 ? "Eye" : `Eye ${n}`;
		}

		// -----------------------------
		// generic cleanup
		// -----------------------------
		let s = r.replace(/^.*[\/\\]/, ""); // drop any path

		// remove pm####_00_00_ style prefix (pm + digits + _xx_yy_)
		s = s.replace(/^pm\d+[_\-]\d{1,2}[_\-]\d{1,2}[_\-]/i, "");

		// normalize separators to underscores
		s = s.replace(/[\s\-]+/g, "_");

		// capture trailing number (like ..._1 or ..._12)
		let trailingNum = "";
		const t = s.match(/(?:[_\-])(\d+)$/);
		if (t) {
			trailingNum = t[1];
			s = s.replace(/(?:[_\-])\d+$/, "");
		}

		// remove any "mesh" token(s)
		s = s
			.split("_")
			.filter(Boolean)
			.filter(tok => tok.toLowerCase() !== "mesh")
			.join(" ");

		// title-case
		s = _titleize(s);

		// append trailing number (as "Name 1")
		if (trailingNum) s = `${s} ${trailingNum}`;

		return s.trim() || "Mesh";
	}

	function prettyMatName(raw) {
		const k = String(raw || "").trim();
		const low = k.toLowerCase();

		const map = {
			body_a: "Body A",
			body_b: "Body B",
			l_eye: "Left Eye",
			r_eye: "Right Eye",
			eye: "Eye",
		};
		if (map[low]) return map[low];

		// body_c -> Body C, etc.
		let m = /^body_([a-z])$/.exec(low);
		if (m) return `Body ${m[1].toUpperCase()}`;

		return _titleize(k);
	}

	function updateToggleAllButton(btn, anyChecked) {
		if (!btn) return;
		// label shows the NEXT action
		btn.textContent = anyChecked ? "All Off" : "All On";
		btn.classList.toggle("is-off", anyChecked); // red when it will turn everything off
		btn.classList.toggle("is-on", !anyChecked); // green when it will turn everything on
		btn.setAttribute("aria-pressed", anyChecked ? "false" : "true");
	}

	function makeRigVisualizerForSkinnedMesh(skinnedMesh, { glbUrl, jointRadius, boneRadius }) {
		const bones = skinnedMesh?.skeleton?.bones || [];
		if (!bones.length) return null;

		const boneSet = new Set(bones);

		// links: bone -> child bone
		const links = [];
		for (const b of bones) {
			for (const c of (b.children || [])) {
				if (c && boneSet.has(c)) links.push([b, c]);
			}
		}

		const group = new THREE.Group();
		group.name = "RigVisualizer";

		// Shared geometries
		const jointGeo = new THREE.SphereGeometry(jointRadius, 10, 10);
		const boneGeo = new THREE.CylinderGeometry(boneRadius, boneRadius, 1, 8, 1, true); // Y-up

		// Base materials (we'll clone per mesh so each can have its own color)
		const jointBaseMat = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.95,
			depthTest: false,
			depthWrite: false,
		});
		const boneBaseMat = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.75,
			depthTest: false,
			depthWrite: false,
		});

		// Create joint meshes (one per bone)
		const jointMeshes = bones.map(() => {
			const m = jointBaseMat.clone();
			m.color.set(0xffffff);
			const mesh = new THREE.Mesh(jointGeo, m);
			mesh.renderOrder = 999;
			mesh.frustumCulled = false;
			group.add(mesh);
			return mesh;
		});

		// Create bone meshes (one per link)
		const boneMeshes = links.map(() => {
			const m = boneBaseMat.clone();
			m.color.set(0xffffff);
			const mesh = new THREE.Mesh(boneGeo, m);
			mesh.renderOrder = 998;
			mesh.frustumCulled = false;
			group.add(mesh);
			return mesh;
		});

		// --- Gradient seed (reuse iris source you already use for eyes) ---
		const params = getEyeParamsForModel(glbUrl);
		const baseCol = new THREE.Color(params.iris); // 0xRRGGBB
		const centerColor = new THREE.Color(1 - baseCol.r, 1 - baseCol.g, 1 - baseCol.b);

		// dark base -> fade to white, light base -> fade to black
		const baseLum = 0.2126 * baseCol.r + 0.7152 * baseCol.g + 0.0722 * baseCol.b;
		const fadeTarget = (baseLum < 0.5) ? new THREE.Color(1, 1, 1) : new THREE.Color(0, 0, 0);

		// Precompute weighted centroid + center bone (one-time; you said it doesn’t need to “follow”)
		skinnedMesh.updateMatrixWorld(true);

		const pos = new Map();
		for (const b of bones) {
			const v = new THREE.Vector3();
			b.getWorldPosition(v);
			pos.set(b, v);
		}

		let wsum = 0;
		const centroid = new THREE.Vector3();
		for (const b of bones) {
			const childBones = (b.children || []).filter((c) => boneSet.has(c));
			const w = 1 + childBones.length;
			wsum += w;
			centroid.addScaledVector(pos.get(b), w);
		}
		if (wsum > 0) centroid.multiplyScalar(1 / wsum);

		let centerBone = bones[0];
		let best = Infinity;
		for (const b of bones) {
			const d2 = pos.get(b).distanceToSquared(centroid);
			if (d2 < best) { best = d2; centerBone = b; }
		}
		const centerPos = pos.get(centerBone);

		let maxDist = 0;
		for (const b of bones) {
			const d = pos.get(b).distanceTo(centerPos);
			if (d > maxDist) maxDist = d;
		}
		maxDist = Math.max(maxDist, 1e-6);

		const CURVE = 0.35; // lower = stronger near-center change (0.35 - 0.85)
		const MIN_FADE = 0.3; // higher = starts going towards black/white quicker

		// Assign colors ONCE (guaranteed to work because it’s just material.color)
		for (let i = 0; i < bones.length; i++) {
			const d = pos.get(bones[i]).distanceTo(centerPos);
			let t = d / maxDist;
			t = Math.pow(t, CURVE);
			t = MIN_FADE + (1 - MIN_FADE) * t;
			jointMeshes[i].material.color.copy(centerColor).lerp(fadeTarget, t);
		}

		const tmpMid = new THREE.Vector3();
		for (let i = 0; i < links.length; i++) {
			const [p, c] = links[i];
			tmpMid.copy(pos.get(p)).add(pos.get(c)).multiplyScalar(0.5);
			const d = tmpMid.distanceTo(centerPos);
			let t = d / maxDist;
			t = Math.pow(t, CURVE);
			t = MIN_FADE + (1 - MIN_FADE) * t;
			boneMeshes[i].material.color.copy(centerColor).lerp(fadeTarget, t);
		}

		// --- Update positions every frame (colors stay fixed) ---
		const _up = new THREE.Vector3(0, 1, 0);
		const _a = new THREE.Vector3();
		const _b = new THREE.Vector3();
		const _dir = new THREE.Vector3();
		const _mid = new THREE.Vector3();

		const update = () => {
			// joints
			for (let i = 0; i < bones.length; i++) {
				bones[i].getWorldPosition(_a);
				jointMeshes[i].position.copy(_a);
			}

			// bones
			for (let i = 0; i < links.length; i++) {
				const [p, c] = links[i];
				p.getWorldPosition(_a);
				c.getWorldPosition(_b);

				_dir.subVectors(_b, _a);
				const len = _dir.length();

				_mid.addVectors(_a, _b).multiplyScalar(0.5);
				const mesh = boneMeshes[i];
				mesh.position.copy(_mid);

				if (len > 1e-6) {
					_dir.multiplyScalar(1 / len);
					mesh.quaternion.setFromUnitVectors(_up, _dir);
					mesh.scale.set(1, len, 1); // cylinder height = distance
				} else {
					mesh.quaternion.identity();
					mesh.scale.set(1, 1e-6, 1);
				}
			}
		};

		return { group, update };
	}

	function _hexToColor(hex) {
		try { return new THREE.Color(hex); } catch { return null; }
	}

	// Save pristine base color ONCE per material instance
	function _ensureBaseColor(mat) {
		if (!mat) return;
		if (mat.color && !mat.userData.__ppgcBaseColor) {
			mat.userData.__ppgcBaseColor = mat.color.clone();
		}
	}

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
			_setOpacityLabel(meshOpacityVal, pct);
			_applyOverlayOpacityToAll();
		});
	}

	if (matOpacityEl) {
		matOpacityEl.addEventListener("input", () => {
			const pct = Math.max(0, Math.min(100, Number(matOpacityEl.value) || 0));
			matOverlayOpacity = pct / 100;
			_setOpacityLabel(matOpacityVal, pct);
			_applyOverlayOpacityToAll();
		});
	}

	// Recompute a single material’s displayed color from:
	// base -> materialOverlay(name) -> meshOverlay(uuid)
	function recomputeMaterialTintForMeshMaterial(mesh, mat) {
		if (!mesh || !mat) return;

		// ShaderMaterial (eyes): drive uniforms instead of .color
		if (mat.isShaderMaterial && mat.uniforms) {
			const matHex = matOverlay.get(mat.name) || null;
			const meshHex = meshOverlay.get(mesh.uuid) || null;

			// Material overlay
			if (mat.uniforms.uMatOverlayColor && mat.uniforms.uMatOverlayStrength) {
				if (!matHex) {
					mat.uniforms.uMatOverlayStrength.value = 0.0;
				} else {
					const c = _hexToColor(matHex);
					if (c) {
						mat.uniforms.uMatOverlayColor.value.copy(c);
						mat.uniforms.uMatOverlayStrength.value = OVERLAY_STRENGTH_MAT * matOverlayOpacity;
					}
				}
			}

			// Mesh overlay
			if (mat.uniforms.uMeshOverlayColor && mat.uniforms.uMeshOverlayStrength) {
				if (!meshHex) {
					mat.uniforms.uMeshOverlayStrength.value = 0.0;
				} else {
					const c = _hexToColor(meshHex);
					if (c) {
						mat.uniforms.uMeshOverlayColor.value.copy(c);
						mat.uniforms.uMeshOverlayStrength.value = OVERLAY_STRENGTH_MESH * meshOverlayOpacity;
					}
				}
			}

			mat.needsUpdate = true;
			return;
		}

		// Standard materials: tint via .color (map is multiplied by color)
		if (!mat.color) return;

		_ensureBaseColor(mat);
		const base = mat.userData.__ppgcBaseColor || new THREE.Color(1, 1, 1);

		const matHex = matOverlay.get(mat.name) || null;
		const meshHex = meshOverlay.get(mesh.uuid) || null;

		const out = base.clone();

		if (matHex) {
			const c = _hexToColor(matHex);
			if (c) out.lerp(c, OVERLAY_STRENGTH_MAT * matOverlayOpacity);
		}
		if (meshHex) {
			const c = _hexToColor(meshHex);
			if (c) out.lerp(c, OVERLAY_STRENGTH_MESH * meshOverlayOpacity);
		}

		mat.color.copy(out);
		mat.needsUpdate = true;
	}

	// Recompute for an entire mesh
	function recomputeMeshTint(mesh) {
		if (!mesh || !mesh.isMesh) return;
		const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
		for (const m of mats) recomputeMaterialTintForMeshMaterial(mesh, m);
	}

	// IMPORTANT: when we clone materials for a mesh, update matsByName immediately
	function ensureMeshHasUniqueMaterials(mesh) {
		if (!mesh || !mesh.isMesh) return;

		if (mesh.userData.__ppgcUniqueMats) return;
		mesh.userData.__ppgcUniqueMats = true;

		const oldMats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

		const cloned = oldMats.map((m) => {
			if (!m?.clone) return m;
			const c = m.clone();
			// preserve name for grouping
			c.name = m.name;
			// preserve base color properly (clone might copy userData, but be safe)
			if (m.userData?.__ppgcBaseColor && c.color) {
				c.userData.__ppgcBaseColor = m.userData.__ppgcBaseColor.clone();
			}
			return c;
		}).filter(Boolean);

		mesh.material = (cloned.length === 1) ? cloned[0] : cloned;

		// Update matsByName sets so material overlays keep working immediately
		for (const m of oldMats) {
			const k = _matKey(m);
			const set = matsByName.get(k);
			if (set) set.delete(m);
		}
		for (const m of cloned) {
			const k = _matKey(m);
			if (!matsByName.has(k)) matsByName.set(k, new Set());
			matsByName.get(k).add(m);
		}
	}

	function setMeshOverlayColor(uuid, hexOrNull) {
		const mesh = meshByUuid.get(uuid);
		if (!mesh) return;

		meshOverlay.set(uuid, hexOrNull || null);

		// mesh overlay must not bleed across shared materials
		ensureMeshHasUniqueMaterials(mesh);

		// recompute using BOTH overlays (mat + mesh)
		recomputeMeshTint(mesh);
	}

	function setMaterialOverlayByName(name, hexOrNull) {
		matOverlay.set(name, hexOrNull || null);

		// Recompute all meshes/materials that use this material name
		const set = matsByName.get(name);
		if (!set) return;

		for (const mat of set) {
			// We need the owning mesh to apply meshOverlay too, so just recompute whole model meshes
			// (cheap enough; models aren’t huge)
		}

		if (model) {
			model.traverse((o) => { if (o?.isMesh) recomputeMeshTint(o); });
		}
	}

	function clearSkeletonHelpers() {
		// clear any per-frame updaters
		rigUpdaters.length = 0;
		for (const h of skelHelpers) {
			if (!h) continue;

			// helpers we attached to a bone
			if (h.__detach && h.bone && h.helper) {
				h.bone.remove(h.helper);
				continue;
			}

			// our rig groups
			if (h.__rig && h.obj) {
				scene.remove(h.obj);
				disposeObject3D(h.obj);
				continue;
			}

			// helpers added to the scene (SkeletonHelper, etc.)
			scene.remove(h);
		}
		skelHelpers.length = 0;
	}

	function setSkeleton(enabled) {
		skeletonOn = enabled;
		clearSkeletonHelpers();
		if (!enabled || !model) return;

		// Scale bones/joints based on model bounds (so Chikorita doesn't get Gyarados-sized joints)
		const box = new THREE.Box3().setFromObject(model);
		const size = box.getSize(new THREE.Vector3());
		const maxDim = Math.max(size.x, size.y, size.z) || 1;

		// Tune these 3 numbers to taste:
		// - multiplier: overall size
		// - min/max clamps: keep it from getting too tiny or too fat
		const jointRadius = THREE.MathUtils.clamp(maxDim * 0.010, 0.0022, 0.015);
		const boneRadius = THREE.MathUtils.clamp(jointRadius * 0.38, 0.0009, 0.007);

		// Build one rig visualizer per SkinnedMesh we find
		model.traverse((o) => {
			if (!o.isSkinnedMesh) return;

			const rig = makeRigVisualizerForSkinnedMesh(o, { jointRadius, boneRadius });
			if (!rig) return;

			scene.add(rig.group);
			skelHelpers.push({ __rig: true, obj: rig.group });
			rigUpdaters.push(rig.update);
		});
	}

	// Hook UI
	selectEl.addEventListener("change", () => {
		lastAnimIndex = Number(selectEl.value) || 0;
		if (poseMode) return; // don't start anims while posed
		setAnimByIndex(lastAnimIndex);
	});
	playToggleBtn.addEventListener("click", () => {
		// If Pose is on, Play should: turn Pose off + restart animation (and be "playing")
		if (poseMode) {
			poseMode = false;
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

		if (!activeAction) return;

		// Normal Play/Pause toggle
		userPaused = !userPaused;
		activeAction.paused = userPaused;

		if (userPaused) clearLoopPadding();
		else applyPaddedLoop(activeAction, mixer?._clips?.[Number(selectEl.value)]);

		playToggleBtn.textContent = userPaused ? "Play" : "Pause";
		setPill(playToggleBtn, !userPaused);
	});
	poseBtn?.addEventListener("click", () => {
		if (!model) return;

		poseMode = !poseMode;
		setPill(poseBtn, poseMode);

		if (poseMode) {
			// entering pose mode
			lastAnimIndex = Number(selectEl.value) || 0;

			stopAllAnimations();
			restoreRestPose();
		} else {
			setAnimByIndex(lastAnimIndex);
		}
	});
	speedEl.addEventListener("input", () => {
		if (mixer) mixer.timeScale = Number(speedEl.value);
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
		skeletonOn = !skeletonOn;
		setSkeleton(skeletonOn);
		setPill(bonesBtn, skeletonOn);
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
		if (mixer) mixer.update(dt);
		controls.update();

		// keep rig visualizers aligned to animated bones
		if (skeletonOn && rigUpdaters.length) {
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

	async function _urlExists(url) {
		try {
			const res = await fetch(url, { method: "HEAD" });
			return res.ok;
		} catch {
			return false;
		}
	}

	function _ensureTrailingSlash(url) {
		return url.endsWith("/") ? url : (url + "/");
	}

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

	async function resolveModelGlbUrl(inputUrl) {
		// If already a direct .glb/.gltf, keep it
		if (/\.(glb|gltf)$/i.test(inputUrl)) return inputUrl;

		// ✅ No probing: treat input as "path without extension"
		return inputUrl + ".glb";
	}

	glbUrl = resolveVariantModelUrl(glbUrl, variant);
	glbUrl = await resolveModelGlbUrl(glbUrl);

	loader.load(glbUrl, async (gltf) => {
		const wrap = new THREE.Group();
		wrap.name = "ModelRoot";
		model = wrap;
		wrap.add(gltf.scene);
		scene.add(wrap);

		const pipelineRaw = detectModelPipeline(glbUrl);
		const pipeline = String(pipelineRaw || "").toLowerCase();

		try {
			if (pipeline === "3ds") {
				// 3DS assets are not authored for filmic tonemapping
				renderer.toneMapping = THREE.NoToneMapping;
				renderer.toneMappingExposure = 1.0;

				// Don’t use “physically correct” falloff for this look
				renderer.physicallyCorrectLights = false;

				// Flatten lighting
				amb.intensity = 0.85;
				hemi.intensity = 0.55;

				key.intensity = 0.85;
				fill.intensity = 0.35;
				cornerBL.intensity = 0.0;
				cornerBR.intensity = 0.0;
				top.intensity = 0.25;

				await apply3DSTextureSetToScene(gltf.scene, { glbUrl, variant, eyeShaderMats: null });
			} else if (pipeline === "lgpe") {
				await applyLGPETextureSetToScene(gltf.scene, { glbUrl, variant, eyeShaderMats });
			} else if (pipeline === "swsh") {
				await applySwordShieldTextureSetToScene(gltf.scene, { glbUrl, variant, eyeShaderMats });
			} else if (pipeline === "la") {
				await applyLegendsArceusTextureSetToScene(gltf.scene, { glbUrl, variant, eyeShaderMats });
			} else if (pipeline === "scvi") {
				await applyPokemonTextureSetToScene(gltf.scene, { glbUrl, variant, eyeShaderMats });
			} else if (pipeline === "lza") {
				await applyLegendsZATextureSetToScene(gltf.scene, { glbUrl, variant, eyeShaderMats });
			} else {
				console.log("[modelViewer] bypassing custom textures for:", glbUrl);
			}
		} catch (e) {
			console.error("[modelViewer] Pipeline failed:", pipeline, glbUrl, e);
			setStatus(`Pipeline failed (${pipeline}). See console.`);
			// IMPORTANT: don't return; keep the model visible with whatever materials it has
		}

		smokeShaderMats.length = 0;
		gltf.scene.traverse((o) => {
			if (!o?.isMesh) return;
			const mats = Array.isArray(o.material) ? o.material : [o.material];
			for (const m of mats) {
				if (m?.userData?.ppgcSmoke && m.uniforms?.uTime) smokeShaderMats.push(m);
			}
		});

		frameModelToView(model);

		// Animations
		const clips = gltf.animations || [];
		mixer = new THREE.AnimationMixer(model);
		mixer._clips = clips;

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
		poseMode = false;

		setWireframe(wireframeOn);
		setSkeleton(skeletonOn);
		grid.visible = true;
		setPill(gridBtn, true);

		rebuildMeshesTabUI();

		controls.autoRotate = autoRotate;

		// Make sure textures show right
		model.traverse((o) => {
			if (!o?.isMesh) return;
			const mats = Array.isArray(o.material) ? o.material : [o.material];
			for (const m of mats) _ensureBaseColor(m);
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
window.PPGC.openModelViewerModal = openModelViewerModal;
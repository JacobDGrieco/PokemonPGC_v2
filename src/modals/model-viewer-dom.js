export function createModelViewerRoot({ isSolo = false } = {}) {
  const root = document.createElement("div");
  root.className = "ppgc-modelviewer";
  if (isSolo) root.classList.add("is-solo");
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
        <button class="ppgc-modelviewer__pill" data-act="screenshot" style="width:auto">Screenshot</button>
        <button class="ppgc-modelviewer__pill is-off" data-act="record" style="width:auto">Record</button>
        <button class="ppgc-modelviewer__pill" data-act="webm" style="width:auto" disabled>Download WebM</button>
      </div>
      <div class="ppgc-modelviewer__help">Records one clean loop of the selected animation at higher quality.</div>
    </div>
  </div>
</div>
  </div>`;
  return root;
}

export function getModelViewerElements(root) {
  return {
    dropBtns: Array.from(root.querySelectorAll(".ppgc-modelviewer__dropbtn")),
    dropPanels: Array.from(root.querySelectorAll(".ppgc-modelviewer__drop")),
    canvasWrap: root.querySelector(".ppgc-modelviewer__canvaswrap"),
    statusEl: root.querySelector(".ppgc-modelviewer__status"),
    selectEl: root.querySelector("select"),
    playToggleBtn: root.querySelector('[data-act="playtoggle"]'),
    poseBtn: root.querySelector('[data-act="pose"]'),
    speedEl: root.querySelector('[data-act="animspeed"]'),
    gridBtn: root.querySelector('[data-act="grid"]'),
    wireBtn: root.querySelector('[data-act="wireframe"]'),
    bonesBtn: root.querySelector('[data-act="skeleton"]'),
    meshListEl: root.querySelector("[data-mesh-list]"),
    meshesToggleAllBtn: root.querySelector('[data-act="meshes-toggle-all"]'),
    meshOpacityEl: root.querySelector('[data-act="mesh-overlay-opacity"]'),
    meshOpacityVal: root.querySelector('[data-mesh-opacity-val]'),
    matListEl: root.querySelector("[data-mat-list]"),
    matsToggleAllBtn: root.querySelector('[data-act="mats-toggle-all"]'),
    matOpacityEl: root.querySelector('[data-act="mat-overlay-opacity"]'),
    matOpacityVal: root.querySelector('[data-mat-opacity-val]'),
    resetBtn: root.querySelector('[data-act="reset"]'),
    autoBtn: root.querySelector('[data-act="autorotate"]'),
    screenshotBtn: root.querySelector('[data-act="screenshot"]'),
    recordBtn: root.querySelector('[data-act="record"]'),
    webmBtn: root.querySelector('[data-act="webm"]'),
  };
}

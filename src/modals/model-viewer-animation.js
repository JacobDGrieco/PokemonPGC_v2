export function createAnimationController({
  THREE,
  refs,
  restTransforms,
  MAX_FRAMES,
  DELAY_SEC,
  mixerClips,
  selectEl,
  playToggleBtn,
  renderer,
  scene,
  camera,
  controls,
  setPill,
}) {
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
    if (!refs.model) return;

    refs.model.traverse((o) => {
      const t = restTransforms.get(o.uuid);
      if (!t) return;

      o.position.copy(t.pos);
      o.quaternion.copy(t.quat);
      o.scale.copy(t.scale);
      if (o.isSkinnedMesh && o.skeleton) o.skeleton.pose();
    });

    refs.model.updateMatrixWorld(true);
  }

  function clearLoopPadding() {
    if (refs.loopRestartTimer) {
      clearTimeout(refs.loopRestartTimer);
      refs.loopRestartTimer = 0;
    }
    if (refs.mixer && refs.finishedHandler) {
      refs.mixer.removeEventListener("finished", refs.finishedHandler);
      refs.finishedHandler = null;
    }
  }

  function stopAllAnimations() {
    clearLoopPadding();
    refs.userPaused = true;

    if (refs.activeAction) {
      refs.activeAction.stop();
      refs.activeAction = null;
    }

    if (refs.mixer) refs.mixer.stopAllAction();

    playToggleBtn.textContent = "Play";
    setPill(playToggleBtn, false);
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

    if (!dts.length) return Infinity;

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

    if (!isSmall) {
      action.clampWhenFinished = false;
      action.setLoop(THREE.LoopRepeat, Infinity);
      return;
    }

    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;

    refs.finishedHandler = (e) => {
      if (!refs.activeAction || e.action !== refs.activeAction) return;
      if (refs.userPaused) return;

      refs.loopRestartTimer = window.setTimeout(() => {
        if (!refs.activeAction) return;
        if (refs.userPaused) return;

        refs.activeAction.paused = false;
        refs.activeAction.reset();
        refs.activeAction.play();
      }, DELAY_SEC * 1000);
    };

    refs.mixer.addEventListener("finished", refs.finishedHandler);
  }

  function setAnimByIndex(i) {
    clearLoopPadding();
    if (!refs.mixer || !selectEl.options.length) return;

    const idx = Math.max(0, Math.min(i, selectEl.options.length - 1));
    selectEl.value = String(idx);

    const anim = mixerClips()[idx];
    if (!anim) return;

    if (refs.activeAction) refs.activeAction.fadeOut(0.1);

    refs.activeAction = refs.mixer.clipAction(anim);
    refs.activeAction.reset().fadeIn(0.1).play();
    refs.activeAction.paused = false;
    refs.userPaused = false;
    applyPaddedLoop(refs.activeAction, anim);

    playToggleBtn.textContent = "Pause";
    setPill(playToggleBtn, true);
  }

  function warmUpAnimationFrames(frames = 2) {
    return new Promise((resolve) => {
      let n = 0;
      const step = () => {
        const dt = 1 / 60;
        if (refs.mixer) refs.mixer.update(dt);
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
    if (!refs.mixer || !selectEl || refs.poseMode) return false;

    const idx = Number(selectEl.value) || 0;
    const clip = mixerClips()?.[idx];
    if (!clip) return false;

    clearLoopPadding();
    refs.mixer.stopAllAction();
    refs.activeAction = refs.mixer.clipAction(clip);
    refs.activeAction.enabled = true;
    refs.activeAction.reset();
    refs.activeAction.play();
    refs.activeAction.paused = false;
    refs.userPaused = false;
    applyPaddedLoop(refs.activeAction, clip);

    playToggleBtn.textContent = "Pause";
    setPill(playToggleBtn, true);

    return true;
  }

  function getSelectedClip() {
    if (!refs.mixer || !selectEl) return null;
    const idx = Number(selectEl.value) || 0;
    return mixerClips()?.[idx] || null;
  }

  function isAnimationActivelyPlaying() {
    return !!refs.activeAction && !refs.poseMode && !refs.userPaused && refs.activeAction.paused !== true;
  }

  function computeRecordingSecondsForCurrentState() {
    if (refs.poseMode || refs.userPaused || !refs.activeAction) return 5;

    const clip = getSelectedClip();
    const dur = Math.max(clip?.duration || 0, 0);
    if (!dur || !isFinite(dur)) return 5;
    return Math.min(Math.max(dur, 0.5), 10);
  }

  return {
    captureRestPose,
    restoreRestPose,
    clearLoopPadding,
    stopAllAnimations,
    setAnimByIndex,
    warmUpAnimationFrames,
    hardRestartAnimForRecording,
    getSelectedClip,
    isAnimationActivelyPlaying,
    computeRecordingSecondsForCurrentState,
    applyPaddedLoop,
  };
}

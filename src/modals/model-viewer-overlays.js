import * as THREE from "three";

export function createViewerOverlayController({
  refs,
  modelRef,
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
}) {
  const OVERLAY_STRENGTH_MAT = 0.55;
  const OVERLAY_STRENGTH_MESH = 0.35;

  function setWireframe(enabled) {
    if (!refs.model) return;
    refs.model.traverse((o) => {
      if (!o.isMesh) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => { if (m) m.wireframe = enabled; });
    });
  }

  function disposeObject3D(obj) {
    if (!obj) return;
    obj.traverse?.((o) => {
      if (o.geometry) o.geometry.dispose?.();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach((m) => m?.dispose?.());
        else o.material.dispose?.();
      }
    });
  }

  function _matKey(m) {
    return m?.name || "(unnamed material)";
  }

  function setMaterialEnabledByName(name, enabled) {
    matState.set(name, !!enabled);
    const set = matsByName.get(name);
    if (!set) return;
    for (const mat of set) {
      if (mat) mat.visible = enabled;
    }
    if (refs.model) {
      refs.model.traverse((o) => {
        if (!o?.isMesh) return;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        const anyVisible = mats.some((m) => !m || m.visible !== false);
        o.visible = (meshState.get(o.uuid) !== false) && anyVisible;
      });
    }
  }

  function setMeshEnabled(uuid, enabled) {
    meshState.set(uuid, !!enabled);
    const mesh = meshByUuid.get(uuid);
    if (!mesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const anyMatVisible = mats.some((m) => !m || m.visible !== false);
    mesh.visible = !!enabled && anyMatVisible;
  }

  function _hexToColor(hex) {
    try { return new THREE.Color(hex); } catch { return null; }
  }

  function _ensureBaseColor(mat) {
    if (!mat) return;
    if (mat.color && !mat.userData.__ppgcBaseColor) {
      mat.userData.__ppgcBaseColor = mat.color.clone();
    }
  }

  function recomputeMaterialTintForMeshMaterial(mesh, mat) {
    if (!mesh || !mat) return;

    if (mat.isShaderMaterial && mat.uniforms) {
      const matHex = matOverlay.get(mat.name) || null;
      const meshHex = meshOverlay.get(mesh.uuid) || null;

      if (mat.uniforms.uMatOverlayColor && mat.uniforms.uMatOverlayStrength) {
        if (!matHex) {
          mat.uniforms.uMatOverlayStrength.value = 0.0;
        } else {
          const c = _hexToColor(matHex);
          if (c) {
            mat.uniforms.uMatOverlayColor.value.copy(c);
            mat.uniforms.uMatOverlayStrength.value = OVERLAY_STRENGTH_MAT * refs.matOverlayOpacity;
          }
        }
      }

      if (mat.uniforms.uMeshOverlayColor && mat.uniforms.uMeshOverlayStrength) {
        if (!meshHex) {
          mat.uniforms.uMeshOverlayStrength.value = 0.0;
        } else {
          const c = _hexToColor(meshHex);
          if (c) {
            mat.uniforms.uMeshOverlayColor.value.copy(c);
            mat.uniforms.uMeshOverlayStrength.value = OVERLAY_STRENGTH_MESH * refs.meshOverlayOpacity;
          }
        }
      }

      mat.needsUpdate = true;
      return;
    }

    if (!mat.color) return;

    _ensureBaseColor(mat);
    const base = mat.userData.__ppgcBaseColor || new THREE.Color(1, 1, 1);
    const matHex = matOverlay.get(mat.name) || null;
    const meshHex = meshOverlay.get(mesh.uuid) || null;
    const out = base.clone();

    if (matHex) {
      const c = _hexToColor(matHex);
      if (c) out.lerp(c, OVERLAY_STRENGTH_MAT * refs.matOverlayOpacity);
    }
    if (meshHex) {
      const c = _hexToColor(meshHex);
      if (c) out.lerp(c, OVERLAY_STRENGTH_MESH * refs.meshOverlayOpacity);
    }

    mat.color.copy(out);
    mat.needsUpdate = true;
  }

  function recomputeMeshTint(mesh) {
    if (!mesh || !mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) recomputeMaterialTintForMeshMaterial(mesh, m);
  }

  function ensureMeshHasUniqueMaterials(mesh) {
    if (!mesh || !mesh.isMesh) return;
    if (mesh.userData.__ppgcUniqueMats) return;
    mesh.userData.__ppgcUniqueMats = true;

    const oldMats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const cloned = oldMats.map((m) => {
      if (!m?.clone) return m;
      const c = m.clone();
      c.name = m.name;
      if (m.userData?.__ppgcBaseColor && c.color) {
        c.userData.__ppgcBaseColor = m.userData.__ppgcBaseColor.clone();
      }
      return c;
    }).filter(Boolean);

    mesh.material = (cloned.length === 1) ? cloned[0] : cloned;

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
    ensureMeshHasUniqueMaterials(mesh);
    recomputeMeshTint(mesh);
  }

  function setMaterialOverlayByName(name, hexOrNull) {
    matOverlay.set(name, hexOrNull || null);
    if (refs.model) {
      refs.model.traverse((o) => { if (o?.isMesh) recomputeMeshTint(o); });
    }
  }

  function rebuildMeshesTabUI() {
    meshListEl.innerHTML = "";
    Array.from(meshByUuid.values())
      .sort((a, b) => prettyMeshName(a.name).localeCompare(prettyMeshName(b.name)))
      .forEach((m) => {
        const checked = meshState.get(m.uuid) !== false;
        const currentHex = meshOverlay.get(m.uuid) || "";

        const row = document.createElement("label");
        row.className = "ppgc-modelviewer__checkrow";
        row.innerHTML = `
          <input type="checkbox" data-kind="mesh" data-uuid="${m.uuid}" ${checked ? "checked" : ""}/>
          <span>${prettyMeshName(m.name)}</span>
          <span class="ppgc-modelviewer__miniwrap">
            <input class="ppgc-modelviewer__color" type="color" data-kind="meshcolor" data-uuid="${m.uuid}" value="${currentHex || "#ffffff"}" title="Overlay color"/>
            <button class="ppgc-modelviewer__minireset" type="button" data-act="meshcolor-reset" data-uuid="${m.uuid}">Reset</button>
          </span>
        `;
        meshListEl.appendChild(row);
        m.visible = checked;
      });

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
        setMaterialEnabledByName(k, checked);
      });

    for (const [uuid, hex] of meshOverlay) if (hex) setMeshOverlayColor(uuid, hex);
    for (const [name, hex] of matOverlay) if (hex) setMaterialOverlayByName(name, hex);

    const anyMeshesChecked = Array.from(meshState.values()).some((v) => v !== false);
    const anyMatsChecked = Array.from(matState.values()).some((v) => v !== false);
    updateToggleAllButton(meshesToggleAllBtn, anyMeshesChecked);
    updateToggleAllButton(matsToggleAllBtn, anyMatsChecked);
  }

  function clearSkeletonHelpers() {
    refs.rigUpdaters.length = 0;
    for (const h of refs.skelHelpers) {
      if (!h) continue;
      if (h.__detach && h.bone && h.helper) {
        h.bone.remove(h.helper);
        continue;
      }
      if (h.__rig && h.obj) {
        scene.remove(h.obj);
        disposeObject3D(h.obj);
        continue;
      }
      scene.remove(h);
    }
    refs.skelHelpers.length = 0;
  }

  function setSkeleton(enabled) {
    refs.skeletonOn = enabled;
    clearSkeletonHelpers();
    if (!enabled || !refs.model) return;

    const box = new THREE.Box3().setFromObject(refs.model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const jointRadius = THREE.MathUtils.clamp(maxDim * 0.010, 0.0022, 0.015);
    const boneRadius = THREE.MathUtils.clamp(jointRadius * 0.38, 0.0009, 0.007);

    refs.model.traverse((o) => {
      if (!o.isSkinnedMesh) return;
      const rig = makeRigVisualizerForSkinnedMesh(o, { jointRadius, boneRadius });
      if (!rig) return;
      scene.add(rig.group);
      refs.skelHelpers.push({ __rig: true, obj: rig.group });
      refs.rigUpdaters.push(rig.update);
    });
  }

  function ensureBaseColor(mat) {
    _ensureBaseColor(mat);
  }

  return {
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
  };
}

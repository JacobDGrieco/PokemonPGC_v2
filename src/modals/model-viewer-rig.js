import * as THREE from "three";
import { getEyeParamsForModel } from "./modelPipelines/eyes.js";

export function makeRigVisualizerForSkinnedMesh(skinnedMesh, { glbUrl, jointRadius, boneRadius }) {
  const bones = skinnedMesh?.skeleton?.bones || [];
  if (!bones.length) return null;

  const boneSet = new Set(bones);
  const links = [];
  for (const b of bones) {
    for (const c of b.children || []) {
      if (c && boneSet.has(c)) links.push([b, c]);
    }
  }

  const group = new THREE.Group();
  group.name = "RigVisualizer";

  const jointGeo = new THREE.SphereGeometry(jointRadius, 10, 10);
  const boneGeo = new THREE.CylinderGeometry(boneRadius, boneRadius, 1, 8, 1, true);

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

  const jointMeshes = bones.map(() => {
    const m = jointBaseMat.clone();
    m.color.set(0xffffff);
    const mesh = new THREE.Mesh(jointGeo, m);
    mesh.renderOrder = 999;
    mesh.frustumCulled = false;
    group.add(mesh);
    return mesh;
  });

  const boneMeshes = links.map(() => {
    const m = boneBaseMat.clone();
    m.color.set(0xffffff);
    const mesh = new THREE.Mesh(boneGeo, m);
    mesh.renderOrder = 998;
    mesh.frustumCulled = false;
    group.add(mesh);
    return mesh;
  });

  const params = getEyeParamsForModel(glbUrl);
  const baseCol = new THREE.Color(params.iris);
  const centerColor = new THREE.Color(1 - baseCol.r, 1 - baseCol.g, 1 - baseCol.b);
  const baseLum = 0.2126 * baseCol.r + 0.7152 * baseCol.g + 0.0722 * baseCol.b;
  const fadeTarget = baseLum < 0.5 ? new THREE.Color(1, 1, 1) : new THREE.Color(0, 0, 0);

  const pos = new Map();
  const v = new THREE.Vector3();
  bones.forEach((b) => {
    b.getWorldPosition(v);
    pos.set(b, v.clone());
  });

  const centroid = new THREE.Vector3();
  let totalWeight = 0;
  bones.forEach((b) => {
    const childBones = (b.children || []).filter((c) => boneSet.has(c));
    const w = 1 + childBones.length;
    centroid.addScaledVector(pos.get(b), w);
    totalWeight += w;
  });
  if (totalWeight > 0) centroid.multiplyScalar(1 / totalWeight);

  let centerBone = bones[0];
  let bestD2 = Infinity;
  bones.forEach((b) => {
    const d2 = pos.get(b).distanceToSquared(centroid);
    if (d2 < bestD2) {
      bestD2 = d2;
      centerBone = b;
    }
  });

  const centerPos = pos.get(centerBone);
  let maxDist = 0;
  bones.forEach((b) => {
    const d = pos.get(b).distanceTo(centerPos);
    if (d > maxDist) maxDist = d;
  });
  if (maxDist < 1e-6) maxDist = 1;

  const CURVE = 0.35;
  const MIN_FADE = 0.3;

  const tByBone = bones.map((b) => {
    const d = pos.get(b).distanceTo(centerPos);
    const x = Math.min(1, d / maxDist);
    const curved = Math.pow(x, CURVE);
    return MIN_FADE + (1 - MIN_FADE) * curved;
  });

  const tmpMid = new THREE.Vector3();
  const tByLink = links.map(([p, c]) => {
    tmpMid.copy(pos.get(p)).add(pos.get(c)).multiplyScalar(0.5);
    const d = tmpMid.distanceTo(centerPos);
    const x = Math.min(1, d / maxDist);
    const curved = Math.pow(x, CURVE);
    return MIN_FADE + (1 - MIN_FADE) * curved;
  });

  jointMeshes.forEach((mesh, i) => {
    mesh.material.color.copy(centerColor).lerp(fadeTarget, tByBone[i]);
  });
  boneMeshes.forEach((mesh, i) => {
    mesh.material.color.copy(centerColor).lerp(fadeTarget, tByLink[i]);
  });

  const _up = new THREE.Vector3(0, 1, 0);
  const _a = new THREE.Vector3();
  const _b = new THREE.Vector3();
  const _dir = new THREE.Vector3();
  const _mid = new THREE.Vector3();

  const update = () => {
    for (let i = 0; i < bones.length; i++) {
      bones[i].getWorldPosition(_a);
      jointMeshes[i].position.copy(_a);
    }

    for (let i = 0; i < links.length; i++) {
      const [p, c] = links[i];
      p.getWorldPosition(_a);
      c.getWorldPosition(_b);

      _dir.subVectors(_b, _a);
      const len = _dir.length();
      if (len < 1e-6) continue;

      const mesh = boneMeshes[i];
      _mid.copy(_a).add(_b).multiplyScalar(0.5);
      mesh.position.copy(_mid);
      mesh.scale.set(1, len, 1);
      mesh.quaternion.setFromUnitVectors(_up, _dir.normalize());
    }
  };

  update();

  return {
    group,
    update,
    dispose() {
      group.traverse((o) => {
        if (o.isMesh) {
          o.geometry?.dispose?.();
          if (Array.isArray(o.material)) o.material.forEach((m) => m?.dispose?.());
          else o.material?.dispose?.();
        }
      });
    },
  };
}

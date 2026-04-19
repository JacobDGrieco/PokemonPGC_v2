export function titleizeModelViewerLabel(value) {
  return String(value || "")
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function prettyMeshName(raw) {
  const r = String(raw || "").trim();
  const low = r.toLowerCase();

  let m = /_body_mesh_shape(?:_(\d+))?$/.exec(low);
  if (m) {
    const n = m[1] ? Number(m[1]) + 1 : 1;
    return n === 1 ? "Body" : `Body ${n}`;
  }

  m = /_head_mesh_shape(?:_(\d+))?$/.exec(low);
  if (m) {
    const n = m[1] ? Number(m[1]) + 1 : 1;
    return n === 1 ? "Head" : `Head ${n}`;
  }

  m = /_eye_mesh_shape(?:_(\d+))?$/.exec(low);
  if (m) {
    const n = m[1] ? Number(m[1]) + 1 : 1;
    return n === 1 ? "Eye" : `Eye ${n}`;
  }

  let s = r.replace(/^.*[\/\\]/, "");
  s = s.replace(/^pm\d+[_\-]\d{1,2}[_\-]\d{1,2}[_\-]/i, "");
  s = s.replace(/[\s\-]+/g, "_");

  let trailingNum = "";
  const t = s.match(/(?:[_\-])(\d+)$/);
  if (t) {
    trailingNum = t[1];
    s = s.replace(/(?:[_\-])\d+$/, "");
  }

  s = s
    .split("_")
    .filter(Boolean)
    .filter((tok) => tok.toLowerCase() !== "mesh")
    .join(" ");

  s = titleizeModelViewerLabel(s);
  if (trailingNum) s = `${s} ${trailingNum}`;
  return s.trim() || "Mesh";
}

export function prettyMatName(raw) {
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

  const m = /^body_([a-z])$/.exec(low);
  if (m) return `Body ${m[1].toUpperCase()}`;

  return titleizeModelViewerLabel(k);
}

export function updateToggleAllButton(btn, anyChecked) {
  if (!btn) return;
  btn.textContent = anyChecked ? "All Off" : "All On";
  btn.classList.toggle("is-off", anyChecked);
  btn.classList.toggle("is-on", !anyChecked);
  btn.setAttribute("aria-pressed", anyChecked ? "false" : "true");
}

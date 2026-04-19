export function range(start, end, step) {
  if (end == null) {
    end = start;
    start = 1;
  }
  step = step == null ? 1 : step;

  const out = [];
  if (!step) return out;

  if (start <= end && step > 0) {
    for (let v = start; v <= end; v += step) out.push(v);
  } else if (start >= end && step < 0) {
    for (let v = start; v >= end; v += step) out.push(v);
  }
  return out;
}

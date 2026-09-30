import { extent, range } from "d3-array";
import { contours } from "d3-contour";
import { geoIdentity, geoPath } from "d3-geo";

// small seeded PRNG (mulberry32), so each section always gets the same landscape
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// a height field: a handful of gaussian hills and hollows, roughened with smooth value noise
function terrain(nx, ny, seed) {
  const r = rng(seed), big = Math.max(nx, ny), n = 6 + Math.floor(r() * 4), peaks = [];
  for (let k = 0; k < n; k++) peaks.push([r() * nx, r() * ny, (0.07 + r() * 0.2) * big, (r() < 0.22 ? -0.7 : 1) * (0.5 + r())]);
  const g = 9, gw = Math.ceil(nx / g) + 2, lat = new Float32Array(gw * (Math.ceil(ny / g) + 2)).map(() => r());
  const noise = (x, y) => {
    const X = x / g, Y = y / g, xi = Math.floor(X), yi = Math.floor(Y);
    let fx = X - xi, fy = Y - yi;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    const a = lat[yi * gw + xi], b = lat[yi * gw + xi + 1], c = lat[(yi + 1) * gw + xi], d = lat[(yi + 1) * gw + xi + 1];
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
  const v = new Float64Array(nx * ny);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    let s = 0;
    for (const [px, py, sd, h] of peaks) { const dx = i - px, dy = j - py; s += h * Math.exp(-(dx * dx + dy * dy) / (2 * sd * sd)); }
    v[j * nx + i] = s + 0.28 * noise(i, j);
  }
  return v;
}

// contour paths for a w × h box; every fifth line is an index contour, some of which get an elevation label
export function contourMap(w, h, seed, base = 400, cell = 10, levels = 20) {
  const nx = Math.ceil(w / cell) + 1, ny = Math.ceil(h / cell) + 1;
  const v = terrain(nx, ny, seed);
  const [lo, hi] = extent(v), step = (hi - lo) / levels;
  const polys = contours().size([nx, ny]).thresholds(range(1, levels).map((k) => lo + k * step))(v);
  const path = geoPath(geoIdentity().scale(cell));
  const paths = [], labels = [];
  polys.forEach((mp, k) => {
    const d = path(mp);
    if (!d) return;
    const ix = (k + 1) % 5 === 0;
    paths.push({ k, d, ix });
    if (!ix) return;
    const ring = mp.coordinates.reduce((best, poly) => (poly[0].length > best.length ? poly[0] : best), []);
    if (ring.length <= 40) return;
    const [px, py] = ring[Math.floor(ring.length * 0.37)], x = px * cell, y = py * cell;
    // keep labels in the side margins so they never sit behind the copy
    const inMargin = (x > 40 && x < w * 0.09) || (x > w * 0.91 && x < w - 40);
    if (inMargin && y > 90 && y < h - 90) labels.push({ k, x: Math.round(x), y: Math.round(y), text: `${base + (k + 1) * 20} m` });
  });
  return { paths, labels };
}

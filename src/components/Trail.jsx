import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useScrollFrame } from "../hooks/useFrame.js";

// A dashed route down the left margin through every numbered section heading.
// The solid line is how far you've walked; the dot is where you are. Wide screens only.
export default function Trail() {
  const [geo, setGeo] = useState(null);
  const walked = useRef(null);
  const me = useRef(null);
  const stops = useRef([]);
  const track = useRef({ len: 0, samples: [] });

  const measure = useCallback(() => {
    const wrap = document.querySelector(".wrap"), start = document.querySelector(".stats-grid");
    const heads = [...document.querySelectorAll("[data-wp]")];
    if (!wrap || !start || !heads.length) return;
    const left = wrap.getBoundingClientRect().left;
    if (left < 90) { setGeo(null); return; }
    const x = left - 52, sy = scrollY;
    const pts = [[x, start.getBoundingClientRect().top + sy - 30], ...heads.map((h) => {
      const r = h.getBoundingClientRect();
      return [x, r.top + sy + r.height / 2];
    })];
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], dy = by - ay, s = i % 2 ? 1 : -1;
      d += ` C${ax + 34 * s} ${ay + dy * 0.33} ${bx - 34 * s} ${by - dy * 0.33} ${bx} ${by}`;
    }
    setGeo({ d, pts, width: left, height: pts[pts.length - 1][1] + 40 });
  }, []);

  // re-plot whenever the layout can have moved: resize, late images, web fonts, page height changes
  useEffect(() => {
    let t;
    const later = () => { clearTimeout(t); t = setTimeout(measure, 200); };
    measure();
    addEventListener("resize", later);
    addEventListener("load", later);
    document.fonts?.ready.then(later);
    const ro = new ResizeObserver(later);
    ro.observe(document.querySelector("main"));
    return () => { clearTimeout(t); removeEventListener("resize", later); removeEventListener("load", later); ro.disconnect(); };
  }, [measure]);

  const walk = () => {
    const { len, samples } = track.current;
    if (!samples.length || !walked.current) return;
    const target = scrollY + innerHeight * 0.55;
    let lo = 0, hi = samples.length - 1;
    if (target <= samples[0][2]) hi = 0;
    else if (target < samples[hi][2]) {
      while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (samples[mid][2] < target) lo = mid; else hi = mid; }
    }
    const [l, x, y] = samples[hi];
    walked.current.style.strokeDashoffset = len - l;
    me.current.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)})`);
    stops.current.forEach((g, i) => g && g.classList.toggle("hit", geo.pts[i + 1][1] <= y + 1));
  };

  // sample the path once per layout so scrolling only does a binary search
  useLayoutEffect(() => {
    if (!geo) return;
    const p = walked.current, len = p.getTotalLength(), samples = [];
    for (let l = 0; l <= len; l += 6) { const q = p.getPointAtLength(l); samples.push([l, q.x, q.y]); }
    p.style.strokeDasharray = len;
    track.current = { len, samples };
    walk();
  }, [geo]);

  useScrollFrame(walk, !!geo);

  if (!geo) return null;
  return (
    <svg className="trail" width={geo.width} height={geo.height} aria-hidden="true">
      <path className="base" d={geo.d} />
      <path ref={walked} className="walked" d={geo.d} />
      {geo.pts.slice(1).map(([x, y], i) => (
        <g key={i} ref={(g) => { stops.current[i] = g; }} className="wp">
          <circle cx={x} cy={y} r="6" />
          <text x={x - 14} y={y + 4} textAnchor="end">0{i + 1}</text>
        </g>
      ))}
      <g ref={me} className="me"><circle className="ring" r="7" /><circle className="core" r="6" /></g>
    </svg>
  );
}

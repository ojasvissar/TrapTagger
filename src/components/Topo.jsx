import { useEffect, useMemo, useRef, useState } from "react";
import { contourMap } from "../lib/terrain.js";
import { finePointer, reduceMotion } from "../lib/env.js";
import { usePointer, useScrollFrame } from "../hooks/useFrame.js";

// Topographic contours behind a section. They draw themselves in when the section
// arrives, drift slowly, move with scroll, and a second copy lights up around the cursor.
export default function Topo({ seed, base }) {
  const ref = useRef(null);
  const lampRef = useRef(null);
  const [size, setSize] = useState(null);
  const [drawn, setDrawn] = useState(reduceMotion);

  // size to the parent section; only rebuild on real changes, not every pixel
  useEffect(() => {
    const host = ref.current.parentElement;
    let last = null;
    const measure = () => {
      const w = host.offsetWidth, h = host.offsetHeight + 140;
      if (!last || Math.abs(w - last.w) > 40 || Math.abs(h - last.h) > 120) { last = { w, h }; setSize(last); }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  const map = useMemo(() => (size ? contourMap(size.w, size.h, seed, base) : null), [size, seed, base]);

  useEffect(() => {
    if (drawn || !map) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { requestAnimationFrame(() => setDrawn(true)); io.disconnect(); }
    }, { rootMargin: "0px 0px -5% 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [drawn, map]);

  useScrollFrame(() => {
    const el = ref.current, r = el.parentElement.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom < -100 || r.top > vh + 100) return;
    el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - vh / 2) * -0.07).toFixed(1)}px, 0)`;
  }, !reduceMotion);

  usePointer((e) => {
    const lamp = lampRef.current;
    if (!lamp) return;
    const r = lamp.getBoundingClientRect();
    if (e.clientY < r.top - 200 || e.clientY > r.bottom + 200) return;
    lamp.style.setProperty("--mx", `${e.clientX - r.left}px`);
    lamp.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, finePointer);

  const box = size && `0 0 ${size.w} ${size.h}`;
  const lines = map?.paths.map((p) => (
    <path key={p.k} pathLength="1" className={p.ix ? "ix" : undefined} style={{ "--d": p.k }} d={p.d} />
  ));

  return (
    <div ref={ref} className={`topo${drawn ? " in" : ""}`} aria-hidden="true">
      <div className="drift">
        {map && (
          <>
            <svg className="base" viewBox={box} preserveAspectRatio="none">
              {lines}
              {map.labels.map((l) => <text key={l.k} x={l.x} y={l.y} dy="3" textAnchor="middle">{l.text}</text>)}
            </svg>
            {finePointer && <svg ref={lampRef} className="lamp" viewBox={box} preserveAspectRatio="none">{lines}</svg>}
          </>
        )}
      </div>
    </div>
  );
}

// a section with its own contour map behind it
export function Section({ topo, seed, base, className, children, ...rest }) {
  return (
    <section className={className} data-topo={topo} {...rest}>
      <Topo seed={seed} base={base} />
      {children}
    </section>
  );
}

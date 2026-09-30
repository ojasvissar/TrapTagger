import { useEffect, useMemo, useRef } from "react";
import { geoCircle, geoGraticule10, geoInterpolate, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/land-110m.json";
import { useNow } from "../hooks/useFrame.js";
import { reduceMotion } from "../lib/env.js";
import { sunPosition } from "../lib/time.js";

const VANCOUVER = [-123.12, 49.28];
const JOHANNESBURG = [28.05, -26.2];

// everything that never changes is projected once, at module load
const proj = geoNaturalEarth1().fitExtent([[10, 10], [950, 490]], { type: "Sphere" });
const path = geoPath(proj);
const SPHERE = path({ type: "Sphere" });
const GRATICULE = path(geoGraticule10());
const LAND = path(feature(world, world.objects.land));
const route = geoInterpolate(VANCOUVER, JOHANNESBURG);
const ROUTE = path({ type: "LineString", coordinates: Array.from({ length: 51 }, (_, i) => route(i / 50)) });
const PINS = [VANCOUVER, JOHANNESBURG].map((c) => proj(c));
const PLANE = "M0 -7 L2 -2 L8 1 L8 3 L2 1.5 L1.5 6 L3.5 7.5 L3.5 9 L0 8 L-3.5 9 L-3.5 7.5 L-1.5 6 L-2 1.5 L-8 3 L-8 1 L-2 -2 Z";

// a live world map: the night side is where it's dark right now, and a plane flies Vancouver → Johannesburg
export default function WorldMap() {
  const now = useNow(60000);
  const plane = useRef(null);

  const { night, twilight, sun } = useMemo(() => {
    const s = sunPosition(now), anti = [s[0] + 180, -s[1]];
    return {
      night: path(geoCircle().center(anti).radius(90)()),
      twilight: path(geoCircle().center(anti).radius(96)()),
      sun: proj(s),
    };
  }, [now]);

  useEffect(() => {
    if (reduceMotion) return;
    let raf;
    const t0 = performance.now();
    const fly = (t) => {
      const k = ((t - t0) / 9000) % 1, a = proj(route(k)), b = proj(route(Math.min(1, k + 0.01)));
      const angle = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI + 90;
      plane.current.setAttribute("transform", `translate(${a[0].toFixed(1)},${a[1].toFixed(1)}) rotate(${angle.toFixed(1)})`);
      plane.current.style.opacity = k < 0.06 ? k / 0.06 : k > 0.94 ? (1 - k) / 0.06 : 1;
      raf = requestAnimationFrame(fly);
    };
    raf = requestAnimationFrame(fly);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg className="map" viewBox="0 0 960 500" role="img" aria-label="A live world map showing day and night, with Vancouver and Johannesburg marked">
      <path className="sphere" d={SPHERE} />
      <path className="grat" d={GRATICULE} />
      <path className="land" d={LAND} />
      <path className="twilight" d={twilight} />
      <path className="night" d={night} />
      <path className="route" d={ROUTE} />
      {PINS.map(([x, y], i) => (
        <g key={i}><circle className="pulse" cx={x} cy={y} r="7" /><circle className="pin" cx={x} cy={y} r="6.5" /></g>
      ))}
      <circle className="sun" cx={sun[0]} cy={sun[1]} r="9" />
      {!reduceMotion && <path ref={plane} className="plane" d={PLANE} style={{ opacity: 0 }} />}
    </svg>
  );
}

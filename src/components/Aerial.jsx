import { useEffect, useState } from "react";
import Topo from "./Topo.jsx";
import { SplitText } from "./motion.jsx";
import { elephants } from "../content.jsx";
import { useInView } from "../hooks/useInView.js";
import { reduceMotion } from "../lib/env.js";

const pct = (v, of) => `${(v / of) * 100}%`;

// an aerial survey frame: a scan line sweeps across and each elephant is boxed as it passes
export default function Aerial() {
  const [ref, inView] = useInView({ threshold: 0.45 });
  const [found, setFound] = useState(() => new Set());

  useEffect(() => {
    if (!inView) return;
    const timers = elephants
      .map(([x], i) => ({ x, i }))
      .sort((a, b) => a.x - b.x)
      .map(({ x, i }) => setTimeout(() => setFound((f) => new Set(f).add(i)), reduceMotion ? 0 : 200 + (x / 700) * 2400));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <section className="aerial" id="air" aria-labelledby="air-title">
      <div className="aerial-grid">
        <div ref={ref} className={`shot${inView ? " in" : ""}`}>
          <img src="img/aerial-elephants.webp" alt="Elephants seen from a light aircraft over the Okavango Delta" loading="lazy" width="1600" height="1067" />
          <div className="sweep" aria-hidden="true" />
          <div className="hud top" aria-hidden="true"><span className="rec">SURVEY · FRAME 0412</span><span>ALT 150 M</span></div>
          {elephants.map(([x, y, w, h], i) => (
            <i key={i} className={`ebox${found.has(i) ? " on" : ""}`} style={{ left: pct(x, 700), top: pct(y, 466), width: pct(w, 700), height: pct(h, 466) }} />
          ))}
        </div>
        <div className="copy" data-topo="night">
          <Topo seed={41} base={150} />
          <p className="kicker">03 · From the air</p>
          <SplitText id="air-title" text="And SurveyScope, too" />
          <p>WildEye also counts animals from light aircraft with <b>SurveyScope</b> and <b>SkySeeker</b>. I already work with images taken from above: <b>satellite images</b> for crop forecasts, and vegetation maps for vineyards at Vintality.</p>
          <p>I'd be glad to help wherever the aerial side needs it.</p>
          <div className="counter" aria-live="polite"><b key={found.size} className={found.size ? "pop" : undefined}>{found.size}</b>elephants counted</div>
        </div>
      </div>
    </section>
  );
}

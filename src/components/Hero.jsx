import { useEffect, useRef, useState } from "react";
import Topo from "./Topo.jsx";
import Icon from "./Icon.jsx";
import { Magnet, SplitText } from "./motion.jsx";
import { MAILTO, RESUME } from "../content.jsx";
import { interactive, reduceMotion } from "../lib/env.js";
import { useNow } from "../hooks/useFrame.js";
import { JHB, fmt } from "../lib/time.js";

const SPECIES = [["Leopard", 97], ["Cheetah", 2], ["Serval", 1]];

// the date/time stamp burned into the bottom of the camera-trap frame
function TrapStamp() {
  const now = useNow(1000);
  const date = fmt(JHB, { year: "numeric", month: "2-digit", day: "2-digit" }, now).split("/").reverse().join("-");
  const time = fmt(JHB, { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }, now);
  return <div className="hud bot" aria-hidden="true"><span>{date}</span><span>{time} SAST</span></div>;
}

// a camera-trap still that gets "processed": a scan line, then a detection box, then the species guess
function CameraTrap() {
  const [phase, setPhase] = useState(reduceMotion ? 2 : 0);
  const [conf, setConf] = useState(reduceMotion ? 0.97 : 0);
  useEffect(() => {
    if (reduceMotion) return;
    let raf;
    const t1 = setTimeout(() => {
      setPhase(1);
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 900);
        setConf(0.97 * (1 - Math.pow(1 - k, 3)));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, 1800);
    const t2 = setTimeout(() => setPhase(2), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <img src="img/trap-leopard.webp" alt="A camera-trap photo of a leopard walking past at night" width="1336" height="912" fetchPriority="high" />
      <div className="scan" aria-hidden="true" />
      <div className="hud top" aria-hidden="true"><span className="rec">TRAP 01</span><span>IR · FLASH</span></div>
      <div className={`box hero-box${phase >= 1 ? " on" : ""}`} aria-hidden="true">
        <span className="lab">Leopard {conf.toFixed(2)}</span>
      </div>
      <div className={`species${phase >= 2 ? " on" : ""}`} aria-hidden="true">
        <p>Species</p>
        <ul>
          {SPECIES.map(([name, pct]) => (
            <li key={name}><span>{name}</span><span>{pct}%</span><i style={{ "--w": `${pct}%` }} /></li>
          ))}
        </ul>
      </div>
      <TrapStamp />
    </>
  );
}

export default function Hero() {
  const shot = useRef(null);
  const tilt = (e) => {
    const r = shot.current.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    shot.current.style.transform = `rotateY(${(x * 7).toFixed(2)}deg) rotateX(${(-y * 6).toFixed(2)}deg)`;
  };

  return (
    <header className="hero" id="top" data-topo="night"
      onPointerMove={interactive ? tilt : undefined}
      onPointerLeave={interactive ? () => { shot.current.style.transform = ""; } : undefined}>
      <Topo seed={11} base={1200} />
      <div className="wrap hero-grid">
        <div>
          <p className="kicker fade-up" style={{ "--dl": ".1s" }}>For Nicholas · WildEye Conservation</p>
          <SplitText as="h1" text="I'd like to be TrapTagger's" accent="next developer." immediate />
          <p className="intro fade-up" style={{ "--dl": ".7s" }}>
            I'm <b>Ojasv Issar</b>, an AI/ML engineer in Vancouver, Canada. The place where <b>machine learning meets wildlife conservation</b> is exactly where I want to build my career, and TrapTagger sits right there. For over four years I've built image models, cloud pipelines and web apps for real users. This page shows how I match your job ad, in about five minutes.
          </p>
          <div className="ctas fade-up" style={{ "--dl": ".9s" }}>
            <Magnet className="btn btn-leaf" href={MAILTO}><Icon name="mail" size={17} />Email me</Magnet>
            <Magnet className="btn btn-ghost" href={RESUME} target="_blank" rel="noopener"><Icon name="doc" size={17} />Résumé ↗</Magnet>
          </div>
        </div>

        <figure className="trap fade-up" style={{ "--dl": ".3s" }}>
          <div className="shot" ref={shot}><CameraTrap /></div>
          <figcaption><b>What TrapTagger does, 100 million times a year:</b> find the animal, then name the species. (Illustration.)</figcaption>
        </figure>
      </div>
    </header>
  );
}

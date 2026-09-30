import { useRef } from "react";
import { Section } from "./Topo.jsx";
import { SplitText } from "./motion.jsx";
import { skills } from "../content.jsx";
import { useInView } from "../hooks/useInView.js";
import { interactive } from "../lib/env.js";

// a project card: the picture wipes in, and the card tilts toward the cursor
function Card({ s, index }) {
  const [ref, inView] = useInView({ rootMargin: "0px 0px -8% 0px" });
  const card = useRef(null);
  const tilt = (e) => {
    const r = card.current.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    card.current.style.transform = `perspective(1000px) rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg) translateY(-4px)`;
  };
  return (
    <article
      ref={(el) => { ref.current = el; card.current = el; }}
      data-rv=""
      className={`card glass${inView ? " in" : ""}`}
      style={{ transitionDelay: `${(index % 2) * 90}ms` }}
      onPointerMove={interactive ? tilt : undefined}
      onPointerLeave={interactive ? () => { card.current.style.transform = ""; } : undefined}
    >
      <div className="pic"><img src={s.img} alt={s.alt} loading="lazy" width="1440" height="900" /><span>{s.tag}</span></div>
      <div className="txt">
        <h3>{s.title}</h3>
        <p>{s.text}</p>
        <div className="tt"><b>In TrapTagger</b><span>{s.tt}</span></div>
        <a className="more" href={s.link} target="_blank" rel="noopener">{s.linkText}</a>
      </div>
    </article>
  );
}

export default function Skills() {
  return (
    <Section id="skills" className="skills" topo="sand" seed={37} base={880}>
      <div className="wrap">
        <p className="kicker">02 · What I'd bring</p>
        <SplitText text="I've built the same kinds of things TrapTagger runs on" />
        <p className="lede">TrapTagger's code is public, so I read through it. Here are four things it needs, each with a real project where I've done that work.</p>
        <div className="cards">
          {skills.map((s, i) => <Card key={s.title} s={s} index={i} />)}
        </div>
        <p className="src-note">Based on the public <a href="https://github.com/WildEyeConservation/TrapTagger" target="_blank" rel="noopener">TrapTagger repository</a>, which runs on Python, Flask, AWS, MegaDetector and a 55-species classifier.</p>
      </div>
    </Section>
  );
}

import { useRef } from "react";
import { Section } from "./Topo.jsx";
import { Reveal, SplitText } from "./motion.jsx";
import { REPO, contacts, credits, steps } from "../content.jsx";
import { useScrollFrame } from "../hooks/useFrame.js";
import { interactive, reduceMotion } from "../lib/env.js";

const MEDIUM = "https://medium.com/@ojasvissar/ai-in-the-fight-against-climate-change-predicting-environmental-trends-before-its-too-late-0ca6fadce36f";

export function Why() {
  const img = useRef(null);
  const wide = !matchMedia("(max-width: 760px)").matches;
  useScrollFrame(() => {
    const r = img.current.parentElement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
    img.current.style.transform = `translateY(${k * -60 - 40}px)`;
  }, wide && !reduceMotion);

  return (
    <section className="why" id="why">
      <img ref={img} src="img/branch-leopard.webp" alt="A leopard asleep on a branch at dusk" loading="lazy" width="1920" height="1280" />
      <div className="wrap">
        <Reveal className="why-copy">
          <p className="kicker" data-wp="">05 · Why WildEye</p>
          <SplitText text="Machine learning for wildlife is the work I want to do" />
          <p>I've always been drawn to nature. My portfolio is designed as a trail guide, and my favourite projects are about the planet: forecasting global temperatures, predicting harvests from space, and mapping where disaster aid falls short.</p>
          <p>Conservation is where those two interests meet. Camera-trap data is exactly the kind of problem I love: millions of images, lots of them empty, shot at night, with the rare species hardest to spot. Solving that well means rangers and researchers spend their time protecting animals instead of sorting photos.</p>
          <p>TrapTagger does that for free, in more than 32 countries. I can't think of a better place to put my skills to work.</p>
          <a className="blog" href={MEDIUM} target="_blank" rel="noopener">Read my article on AI and climate ↗</a>
        </Reveal>
      </div>
      <span className="credit-tag">Photo: I've Got It On Film!, CC BY 2.0</span>
    </section>
  );
}

export function Plan() {
  return (
    <Section id="plan" topo="sand" seed={67} base={1340}>
      <div className="wrap">
        <p className="kicker" data-wp="">06 · If you hire me</p>
        <SplitText text="My first 90 days" />
        <p className="lede">A simple plan, and yours to change.</p>
        <Reveal className="steps">
          {steps.map((s) => (
            <div className="step glass" key={s.title}>
              <p className="when">{s.when}</p>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

// contact cards glow where the cursor is
function Way({ c }) {
  const glow = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };
  const external = c.href.startsWith("http");
  return (
    <a className={`way${c.main ? " main" : ""}`} href={c.href} onPointerMove={interactive ? glow : undefined}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}>
      <span>{c.label}</span><b>{c.value}</b>
    </a>
  );
}

export function Contact() {
  return (
    <Section id="contact" className="contact" topo="night" seed={79} base={1753}>
      <div className="wrap">
        <p className="kicker" data-wp="">07 · Next step</p>
        <SplitText text="I'd love to talk about TrapTagger." />
        <p className="lede">Either start date, 1 November 2026 or 1 January 2027, works for me. I'm free for a call at whatever time suits Johannesburg.</p>
        <Reveal className="ways">
          {contacts.map((c) => <Way key={c.label} c={c} />)}
        </Reveal>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="row">
          <span>Made for WildEye Conservation by Ojasv Issar · Vancouver, BC · Built with React and Vite, <a href={REPO} target="_blank" rel="noopener">source on GitHub ↗</a></span>
          <a href="#top">Back to top ↑</a>
        </div>
        <p className="credits">
          Photos via Wikimedia Commons:{" "}
          {credits.map((c, i) => (
            <span key={c.what}>{i > 0 && " · "}{c.what} by {c.who} (<a href={c.url} target="_blank" rel="noopener">{c.lic}</a>)</span>
          ))}
          . Resized and compressed. Project figures are my own.
        </p>
      </div>
    </footer>
  );
}

import { useRef, useState } from "react";
import { nav } from "../content.jsx";
import { useScrollFrame } from "../hooks/useFrame.js";

// floating pill nav with a reading-progress bar and a highlight that follows the current section
export default function Nav() {
  const bar = useRef(null);
  const links = useRef([]);
  const [current, setCurrent] = useState(-1);

  useScrollFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.current.style.transform = `scaleX(${max > 0 ? (scrollY / max).toFixed(4) : 0})`;
    let cur = -1;
    nav.forEach((n, i) => {
      const s = document.querySelector(n.href);
      if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = i;
    });
    setCurrent((c) => (c === cur ? c : cur));
  });

  const a = links.current[current];
  const pill = a && a.offsetParent ? { opacity: 1, left: a.offsetLeft, width: a.offsetWidth } : { opacity: 0 };

  return (
    <>
      <div ref={bar} className="progress" aria-hidden="true" />
      <div className="nav">
        <div className="wrap">
          <a className="brand" href="#top"><i aria-hidden="true" />Ojasv Issar × WildEye</a>
          <nav className="links" aria-label="Sections">
            <span className="pill" style={pill} aria-hidden="true" />
            {nav.map((n, i) => (
              <a key={n.href} ref={(el) => { links.current[i] = el; }} href={n.href} className={i === current ? "cur" : undefined}>{n.label}</a>
            ))}
            <a className="go" href="#contact">Contact</a>
          </nav>
        </div>
      </div>
    </>
  );
}

import { useRef, useState } from "react";
import { rail } from "../content.jsx";
import { useScrollFrame } from "../hooks/useFrame.js";

// A small fixed rail on the left edge: one dot per section. The dot for the section you're in
// stretches into a bar, passed sections turn green, and the line fills as you read. Wide screens only.
export default function SectionRail() {
  const [state, setState] = useState({ show: false, active: -1 });
  const list = useRef(null);
  const fill = useRef(null);

  useScrollFrame(() => {
    const line = innerHeight * 0.4;
    const tops = rail.map((r) => document.getElementById(r.id)?.getBoundingClientRect().top ?? Infinity);
    let active = -1;
    tops.forEach((t, i) => { if (t < line) active = i; });
    const show = tops[0] < innerHeight * 0.7;
    setState((s) => (s.show === show && s.active === active ? s : { show, active }));

    // fill the line to the active dot, plus however far we are toward the next section
    const dots = list.current ? [...list.current.querySelectorAll(".dot")] : [];
    if (!dots.length || !fill.current) return;
    const mid = (el) => { const r = el.getBoundingClientRect(); return r.top + r.height / 2; };
    const origin = mid(dots[0]);
    const centre = (i) => mid(dots[i]) - origin;
    let h = 0;
    if (active >= 0) {
      h = centre(active);
      if (active < rail.length - 1) {
        const frac = Math.min(1, Math.max(0, (line - tops[active]) / (tops[active + 1] - tops[active])));
        h += (centre(active + 1) - centre(active)) * frac;
      }
    }
    fill.current.style.height = `${h}px`;
  });

  return (
    <nav className={`rail${state.show ? " show" : ""}`} aria-label="Page sections">
      <span className="rail-track" aria-hidden="true"><i ref={fill} className="rail-fill" /></span>
      <ol ref={list}>
        {rail.map((r, i) => (
          <li key={r.id} className={i === state.active ? "on" : i < state.active ? "done" : undefined}>
            <a href={`#${r.id}`} aria-current={i === state.active ? "true" : undefined}>
              <span className="dot" />
              <span className="lab"><b>0{i + 1}</b>{r.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

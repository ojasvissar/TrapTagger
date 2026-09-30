import { useCallback, useEffect, useState } from "react";
import { Section } from "./Topo.jsx";
import Icon from "./Icon.jsx";
import { Reveal, SplitText } from "./motion.jsx";
import { checklist } from "../content.jsx";
import { useInView } from "../hooks/useInView.js";

// one requirement; its box ticks itself shortly after it scrolls into view
function Item({ item, index, onTick }) {
  const [ref, inView] = useInView({ rootMargin: "0px 0px -15% 0px" });
  const [state, setState] = useState("");
  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => { setState(" ticked"); onTick(index); }, 250 + (index % 2) * 120);
    const t2 = setTimeout(() => setState(" ticked settled"), 700 + (index % 2) * 120);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView, index, onTick]);

  return (
    <div ref={ref} data-rv="" className={`item glass${inView ? " in" : ""}${state}`} style={{ transitionDelay: `${(index % 2) * 90}ms` }}>
      <span className="tick"><Icon name="check" size={22} /></span>
      <div>
        <h3>{item.title}{item.bonus && <span className="bonus">Bonus</span>}</h3>
        <p>{item.text}</p>
      </div>
    </div>
  );
}

export default function Checklist() {
  const [ticked, setTicked] = useState(() => new Set());
  const onTick = useCallback((i) => setTicked((s) => (s.has(i) ? s : new Set(s).add(i))), []);

  return (
    <Section id="fit" topo="paper" seed={23} base={640}>
      <div className="wrap">
        <div className="check-head">
          <div>
            <p className="kicker" data-wp="">01 · The job ad</p>
            <SplitText text="Your list, checked off" />
            <p className="lede">Every requirement from your flyer, with one line on how I meet it.</p>
          </div>
          <Reveal className="tally">
            <div className="tally-bar">{checklist.map((_, i) => <i key={i} className={ticked.has(i) ? "ok" : undefined} />)}</div>
            <p><b>{ticked.size} of {checklist.length}</b> covered</p>
          </Reveal>
        </div>
        <div className="checks">
          {checklist.map((item, i) => <Item key={item.title} item={item} index={i} onTick={onTick} />)}
        </div>
      </div>
    </Section>
  );
}

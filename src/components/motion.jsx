import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/useInView.js";
import { interactive, reduceMotion } from "../lib/env.js";

// fades and lifts its children in when scrolled into view
export function Reveal({ as: Tag = "div", className = "", delay = 0, style, children, ...rest }) {
  const [ref, inView] = useInView({ rootMargin: "0px 0px -8% 0px" });
  return (
    <Tag ref={ref} data-rv="" className={`${className}${inView ? " in" : ""}`} style={{ transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

// a headline whose words rise out of a mask one after another; `accent` is set in <em>
export function SplitText({ as: Tag = "h2", text, accent, immediate = false, ...rest }) {
  const [ref, inView] = useInView();
  const [ready, setReady] = useState(reduceMotion);
  useEffect(() => {
    if (!immediate || ready) return;
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, [immediate, ready]);
  const shown = immediate ? ready : inView;
  let i = 0;
  const words = (s) => s.split(/\s+/).filter(Boolean).map((w) => (
    <span className="w" key={i}><span style={{ "--i": i++ }}>{w}</span></span>
  )).flatMap((el, n, all) => (n < all.length - 1 ? [el, " "] : [el]));
  return (
    <Tag ref={ref} className={`split${shown ? " in" : ""}`} {...rest}>
      {words(text)}
      {accent && <>{" "}<em>{words(accent)}</em></>}
    </Tag>
  );
}

// a link that leans toward the cursor
export function Magnet({ className = "", children, ...rest }) {
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px)`;
  };
  const leave = () => { ref.current.style.transform = ""; };
  return (
    <a ref={ref} className={className} onPointerMove={interactive ? move : undefined} onPointerLeave={interactive ? leave : undefined} {...rest}>
      {children}
    </a>
  );
}

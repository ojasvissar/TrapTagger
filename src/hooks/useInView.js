import { useEffect, useRef, useState } from "react";
import { reduceMotion } from "../lib/env.js";

// true once the element has scrolled into view (and stays true)
export function useInView({ rootMargin = "0px 0px -10% 0px", threshold = 0 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(reduceMotion);
  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin, threshold]);
  return [ref, inView];
}

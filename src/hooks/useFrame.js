import { useEffect, useRef, useState } from "react";

// One shared scroll/resize loop and one pointer listener for the whole page,
// so a dozen parallax layers don't each attach their own handlers.
const frameSubs = new Set();
const pointerSubs = new Set();
let ticking = false;

function frame() {
  ticking = false;
  frameSubs.forEach((fn) => fn());
}
function schedule() {
  if (!ticking) { ticking = true; requestAnimationFrame(frame); }
}
addEventListener("scroll", schedule, { passive: true });
addEventListener("resize", schedule);
addEventListener("pointermove", (e) => pointerSubs.forEach((fn) => fn(e)), { passive: true });

// run fn on every scroll/resize frame; fn always sees the latest props through a ref
export function useScrollFrame(fn, enabled = true) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    if (!enabled) return;
    const run = () => ref.current();
    frameSubs.add(run);
    run();
    return () => frameSubs.delete(run);
  }, [enabled]);
}

export function usePointer(fn, enabled = true) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    if (!enabled) return;
    const run = (e) => ref.current(e);
    pointerSubs.add(run);
    return () => pointerSubs.delete(run);
  }, [enabled]);
}

// the current time, refreshed every `ms`
export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

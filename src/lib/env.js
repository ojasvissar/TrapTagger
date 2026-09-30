// Read once at startup: whether to animate, and whether there's a mouse to play with.
export const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
export const interactive = finePointer && !reduceMotion;

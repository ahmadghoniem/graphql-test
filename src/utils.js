import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
export function useMousemove(ref, callback) {
  const cb = React.useRef();
  React.useEffect(() => {
    cb.current = callback;
  }, [callback]);
  React.useEffect(() => {
    const el = ref.current;
    const onmousemove = (e) => {
      e.preventDefault();
      cb.current(e);
    };
    const onmousedown = (e) => {
      e.preventDefault();
      window.addEventListener("mousemove", onmousemove);
      window.addEventListener("mouseup", onmouseup);
      cb.current(e);
    };
    const onmouseup = (e) => {
      e.preventDefault();
      window.removeEventListener("mousemove", onmousemove);
    };
    el.addEventListener("mousedown", onmousedown);
    return () => {
      el.removeEventListener("mousedown", onmousedown);
      window.removeEventListener("mousemove", onmousemove);
      window.removeEventListener("mouseup", onmouseup);
    };
  }, [ref]);
}
export function useCombinedRefs(...refs) {
  const targetRef = React.useRef();
  React.useEffect(() => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    }
  }, [refs]);
  return targetRef;
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

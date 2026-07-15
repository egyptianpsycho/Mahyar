"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
const globalRef = { lenis: null };
function useLenis() {
  const ref = useRef(null);
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    ref.current = lenis;
    globalRef.lenis = lenis;
    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      globalRef.lenis = null;
      ref.current = null;
    };
  }, []);
  return ref;
}
function getLenis() {
  return globalRef.lenis;
}
export {
  getLenis,
  useLenis
};
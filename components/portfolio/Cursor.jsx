"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
const INTERACTIVE_SELECTOR = "a, button, [role='button'], label, input, textarea, select, [data-cursor='text']";
const TEXT_TAGS = /* @__PURE__ */ new Set([
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "P",
  "SPAN",
  "STRONG",
  "EM",
  "LI",
  "A",
  "BUTTON",
  "LABEL"
]);
function pointHitsText(el, x, y) {
  const range = document.createRange();
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType !== Node.TEXT_NODE) continue;
    const text = (node.nodeValue ?? "").trim();
    if (!text) continue;
    try {
      range.selectNodeContents(node);
      const rects = range.getClientRects();
      for (const r of Array.from(rects)) {
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          range.detach?.();
          return true;
        }
      }
    } catch {
    }
  }
  return false;
}
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const xDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });
    let isText = false;
    const evaluate = (x, y) => {
      const el = document.elementFromPoint(x, y);
      let hit = false;
      if (el) {
        if (el.closest(INTERACTIVE_SELECTOR)) {
          hit = true;
        } else {
          let cur = el;
          while (cur && cur !== document.body) {
            if (TEXT_TAGS.has(cur.tagName)) {
              if (pointHitsText(cur, x, y)) {
                hit = true;
                break;
              }
            }
            cur = cur.parentElement;
          }
        }
      }
      if (hit !== isText) {
        isText = hit;
        ring.classList.toggle("cursor-ring--text", hit);
      }
    };
    const onMove = (e) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
      evaluate(e.clientX, e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    document.documentElement.classList.add("has-custom-cursor");
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);
  return <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>;
}
export {
  Cursor
};
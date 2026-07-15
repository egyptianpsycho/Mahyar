"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
function Marquee({ items, speed = 40, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const track = ref.current.querySelector(".marquee-track");
    if (!track) return;
    const width = track.scrollWidth / 2;
    const tween = gsap.to(track, {
      x: -width,
      duration: width / speed,
      ease: "none",
      repeat: -1
    });
    return () => {
      tween.kill();
    };
  }, [speed]);
  return <div ref={ref} className={`overflow-hidden ${className}`}>
      <div className="marquee-track flex gap-12 whitespace-nowrap will-change-transform">
        {[...items, ...items].map((t, i) => <span key={i} className="font-display text-6xl md:text-8xl uppercase tracking-tighter inline-flex items-center gap-12">
            {t}
            <span className="text-accent">◉</span>
          </span>)}
      </div>
    </div>;
}
export {
  Marquee
};
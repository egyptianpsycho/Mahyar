"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { OptimizedImage } from "./OptimizedImage";

function Hero({ introDone }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current || !introDone) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-wordmark", { yPercent: 125 }, { yPercent: 0, duration: 0.8, ease: "power3.out" });
      gsap.fromTo(".hero-detail", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, delay: 0.2, ease: "power3.out" });
    }, ref);
    return () => ctx.revert();
  }, [introDone]);

  return <section ref={ref} id="top" className="relative h-svh min-h-[38rem] overflow-hidden bg-background">
      <OptimizedImage src="/assets/hero.png" alt="Mahyar portfolio hero" priority sizes="100vw" className="object-cover" />
      <OptimizedImage src="/assets/ovr.webp" alt="Mahyar portfolio hero" priority sizes="100vw" className="object-cover mix-blend-overlay absolute opacity-60" />
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-4 mix-blend-difference md:px-10">
        <h1 className="hero-wordmark relative select-none text-center font-display text-[25vw] uppercase leading-[0.72] tracking-[-0.08em] text-white md:text-[17vw] md:top-30 ">Mousa</h1>
      </div>
      <div className="hero-detail absolute bottom-6 left-6 z-10 font-mono text-[10px] uppercase tracking-[0.28em] text-white mix-blend-difference md:bottom-10 md:left-10">Media Production · Digital Marketing · Graphic Design</div>
      <div className="hero-detail absolute bottom-6 right-6 z-10 font-mono text-[10px] uppercase tracking-[0.28em] text-white mix-blend-difference md:bottom-10 md:right-10">UAE — Worldwide</div>
    </section>;
}

export { Hero };

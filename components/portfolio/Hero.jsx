"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OptimizedImage } from "./OptimizedImage";



// 2. Register ScrollTrigger
gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);

function Hero({ introDone }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current || !introDone) return;

    CustomEase.create("reveal", "0.9, 0, 0.1, 1");

    const ctx = gsap.context(() => {
      // 3. Create the Pin Trigger
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "bottom top", // Keeps it pinned for 100vh
        pin: true,
        pinSpacing: false,  // Lets the next section roll right over it
        invalidateOnRefresh: true,
      });

      // Wordmark slides up from mask
      const wordmarkSplit = SplitText.create(".hero-wordmark", {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });
      gsap.set(wordmarkSplit.lines, { yPercent: 115 });
      
      gsap.to(wordmarkSplit.lines, {
        yPercent: 0,
        duration: 1.2,
        ease: "reveal",
        stagger: 0.02,
      });

      // Eyebrow tag line
      gsap.fromTo(
        ".hero-eyebrow",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.35}
      );

      // Bottom detail lines
      gsap.set(".hero-wordmark,.hero-detail", { opacity: 1 }); 
      const detailSplit = SplitText.create(".hero-detail", {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });
      gsap.set(detailSplit.lines, { yPercent: 115 });
      gsap.to(detailSplit.lines, {
        yPercent: 0,
        duration: 1.0,
        ease: "reveal",
        stagger: 0.06,
        delay: 0.25,
        opacity: 1,
      });

    }, ref);

    return () => ctx.revert();
  }, [introDone]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-svh min-h-[38rem] bg-background hero-pin"
    >
      {/* Background image layer */}
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src="/assets/hero.png"
          alt="Mahyar portfolio hero"
          priority
          sizes="100vw"
          className="object-cover scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
      </div>

      {/* ── TOP ROW ── */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-6 pt-7 md:px-10 md:pt-9">
        <p className="hero-eyebrow font-mono text-[10px] uppercase tracking-[0.3em] opacity-0 text-white/70">
          Creative Studio
        </p>
        <p className="hero-eyebrow font-mono text-[9px] uppercase tracking-[0.3em] text-white/70 opacity-0">
          Est. 2018
        </p>
      </div>

      {/* ── WORDMARK ── */}
      <div className="hero-wordmark-parent absolute inset-x-0 bottom-[18%] z-10 px-6 md:px-10 mix-blend-difference">
        <h1
          className="hero-wordmark w-fit select-none font-display uppercase text-white"
          style={{
            fontSize: "clamp(3.5rem, 15vw, 14rem)",
            lineHeight: 0.88,
            letterSpacing: "-0.05em",
            fontWeight: 500,
            fontVariationSettings: '"wdth" 100, "wght" 300',
            opacity: 0,
          }}
        >
          Mahyar.
        </h1>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-6 pb-7 md:px-10 md:pb-9">
        <h6 className="hero-detail opacity-0 font-mono text-[10px] uppercase tracking-[0.28em] text-white/80">
          Media Production · Digital Marketing · Graphic Design
        </h6>

        <div className="flex flex-col items-end gap-3">
          <h6 className="hero-detail font-mono text-[10px] uppercase tracking-[0.28em] text-white/80 opacity-0">
            United Arab Emirates
          </h6>
        </div>
      </div>
    </section>
  );
}

export { Hero };
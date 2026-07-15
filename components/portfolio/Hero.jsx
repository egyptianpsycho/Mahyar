"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const NAME = "MAHYAR".split("");
function Hero() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-letter", {
        yPercent: 115,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.07,
        delay: 0.2
      });
      gsap.from(".hero-meta", {
        opacity: 0,
        y: 18,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.07,
        delay: 0.6
      });
      gsap.to(".hero-wordmark", {
        scale: 1.18,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5
        }
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return <section
    ref={ref}
    id="top"
    className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
  >
      <div className="hero-meta absolute top-24 left-6 md:left-10 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground max-w-[14rem] leading-relaxed">
        Photographer<br />
        & Videographer<br />
        <span className="text-foreground/40">— Based in Tehran</span>
      </div>

      <div className="hero-meta absolute top-24 right-6 md:right-10 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-right">
        Selected Works<br />
        <span className="text-foreground/40">2019 — 2025</span>
      </div>

      <h1
    className="hero-wordmark font-display leading-[0.85] tracking-[-0.04em] uppercase text-foreground select-none flex justify-center items-center w-full"
    style={{
      fontSize: "clamp(5rem, 22vw, 22rem)",
      willChange: "transform, opacity",
      transform: "translateZ(0)",
      backfaceVisibility: "hidden"
    }}
  >
        <span className="overflow-hidden inline-flex" style={{ paddingBottom: "0.12em" }}>
          {NAME.map((c, i) => <span
    key={i}
    className="hero-letter inline-block"
    style={{ willChange: "transform", transform: "translateZ(0)" }}
  >
              {i === 3 ? <span className="italic font-normal text-accent">{c}</span> : c}
            </span>)}
        </span>
      </h1>

    </section>;
}
export {
  Hero
};
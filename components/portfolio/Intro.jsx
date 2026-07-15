"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Placeholder } from "./Placeholder";
const FRAMES = Array.from({ length: 12 }, (_, i) => i);
const WORDS = ["Digital Marketing", "Photography", "Videography", "Digital Design"];
function Intro({ onDone }) {
  const rootRef = useRef(null);
  const counterRef = useRef(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(".intro-frame", { opacity: 0 });
      gsap.set(".intro-word", { opacity: 0, filter: "blur(16px)", y: 12 });
      gsap.set(".intro-blackscreen", { opacity: 0 });
      const tl = gsap.timeline({
        onComplete: () => {
          setDone(true);
          onDone();
        }
      });
      const frames = gsap.utils.toArray(".intro-frame");
      frames.forEach((f) => {
        gsap.set(f, {
          x: gsap.utils.random(-600, 600),
          y: gsap.utils.random(-400, 400),
          rotate: gsap.utils.random(-25, 25),
          opacity: 0,
          scale: 0.6
        });
      });
      tl.to(frames, {
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "expo.out",
        stagger: { each: 0.05, from: "random" }
      }, 0.1);
      const obj = { v: 0 };
      tl.to(obj, {
        v: 12,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current)
            counterRef.current.textContent = String(Math.floor(obj.v)).padStart(3, "0");
        }
      }, 0.1);
      tl.to({}, { duration: 0.3 });
      tl.to(frames, {
        x: 0,
        y: 0,
        scale: 0.05,
        opacity: 0,
        duration: 0.8,
        ease: "expo.inOut",
        stagger: { each: 0.012, from: "edges" }
      }, ">");
      tl.to(".intro-hud", { opacity: 0, duration: 0.3 }, "<");
      tl.to(".intro-blackscreen", { opacity: 1, duration: 0.3 }, "-=0.2");
      WORDS.forEach((_, i) => {
        const sel = `.intro-word-${i}`;
        const isFirst = i === 0;
        const isLast = i === WORDS.length - 1;
        if (isFirst) {
          tl.to(sel, {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.28,
            ease: "power3.out"
          }, ">");
        } else {
          tl.set(sel, { opacity: 1, filter: "blur(0px)", y: 0 }, ">");
        }
        tl.to({}, { duration: 0.22 });
        if (isLast) {
          tl.to(sel, {
            opacity: 0,
            filter: "blur(16px)",
            y: -12,
            duration: 0.4,
            ease: "power2.in"
          });
        } else {
          tl.set(sel, { opacity: 0, filter: "blur(0px)", y: 0 });
        }
      });
      tl.to(".intro-curtain", {
        yPercent: -100,
        duration: 1,
        ease: "expo.inOut"
      }, "+=0.1");
    }, rootRef);
    return () => ctx.revert();
  }, [onDone]);
  if (done) return null;
  return <div ref={rootRef} className="fixed inset-0 z-[100] pointer-events-none">
      <div className="intro-curtain absolute inset-0 bg-background overflow-hidden">
        {
    /* HUD */
  }
        <div className="intro-hud absolute top-6 left-6 md:top-8 md:left-10 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 z-20">
          <span ref={counterRef}>000</span>
          <span className="text-foreground/30">/</span>
          <span>012</span>
        </div>
        <div className="intro-hud absolute top-6 right-6 md:top-8 md:right-10 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 z-20">
          Contact Sheet · 2025
        </div>
        <div className="intro-hud absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-2xl md:text-3xl tracking-tight text-foreground z-20">
          MAHYAR<span className="text-accent">.</span>
        </div>

        {
    /* Contact sheet grid */
  }
        <div className="absolute inset-0 flex items-center justify-center p-12 md:p-20">
          <div className="grid grid-cols-4 grid-rows-3 gap-3 md:gap-4 w-full h-full max-w-5xl max-h-[70vh]">
            {FRAMES.map((i) => <div
    key={i}
    className="intro-frame relative overflow-hidden border border-accent/40"
    style={{ opacity: 0 }}
  >
                <Placeholder kind="photo" label={`${String(i + 1).padStart(2, "0")}/12`} seed={`intro-${i}`} />
              </div>)}
          </div>
        </div>

        {
    /* Black screen with word sequence */
  }
        <div className="intro-blackscreen absolute inset-0 z-30 bg-background flex items-center justify-center">
          <div className="relative w-full h-32 md:h-40 flex items-center justify-center">
            {WORDS.map((w, i) => <h2
    key={w}
    className={`intro-word intro-word-${i} absolute font-display text-4xl md:text-7xl uppercase tracking-tight text-center px-6 will-change-[filter,opacity,transform]`}
  >
                {w}<span className="text-accent">.</span>
              </h2>)}
          </div>
        </div>
      </div>
    </div>;
}
export {
  Intro
};
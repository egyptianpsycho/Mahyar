"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Marquee } from "./Marquee";
gsap.registerPlugin(ScrollTrigger);
function About() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".about-word", {
        opacity: 0.15,
        duration: 0.8,
        stagger: 0.04,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-copy",
          start: "top 80%",
          end: "bottom 50%",
          scrub: true
        }
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  const text = "I make images that breathe \u2014 stills and motion built on patience, available light, and a love for the quiet middle of a story.";
  return <section ref={ref} className="py-32 md:py-48 border-y border-border">
      <div className="px-6 md:px-10 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-3 md:col-start-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">[ — ] About</p>
        </div>
        <div className="md:col-span-8 about-copy">
          <p className="font-display text-3xl md:text-5xl leading-tight tracking-tight text-balance">
            {text.split(" ").map((w, i) => <span key={i} className="about-word inline-block mr-[0.25em]">{w}</span>)}
          </p>
        </div>
      </div>

      <div className="mt-24">
        <Marquee items={["Photography", "Videography", "Direction", "Color", "Editorial"]} />
      </div>
    </section>;
}
export {
  About
};
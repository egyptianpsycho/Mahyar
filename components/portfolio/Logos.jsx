"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clients } from "@/data/projects";
gsap.registerPlugin(ScrollTrigger);
function Logos() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".logo-cell", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.04,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" }
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return <section ref={ref} id="clients" className="px-6 md:px-10 py-32 border-y border-border">
      <header className="flex justify-between items-end mb-16">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-3">[ 07 ] Trusted by</p>
          <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter">Clients</h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">{clients.length} brands</span>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-5 border-l border-t border-border">
        {clients.map((c) => <div
    key={c}
    className="logo-cell group relative aspect-[5/3] border-r border-b border-border flex items-center justify-center overflow-hidden"
  >
            <span className="font-display text-2xl md:text-3xl tracking-tight text-foreground/40 group-hover:text-accent transition-colors duration-500">
              {c}
            </span>
            <span className="absolute bottom-2 left-2 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/20">
              ◇
            </span>
          </div>)}
      </div>
    </section>;
}
export {
  Logos
};
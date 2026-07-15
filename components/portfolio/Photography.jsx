"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { photoProjects } from "@/data/projects";
import { Placeholder } from "./Placeholder";
gsap.registerPlugin(ScrollTrigger);
function Photography({ onOpen, hideHeader }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".photo-tile").forEach((tile) => {
        gsap.from(tile, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: tile, start: "top 90%" }
        });
        const inner = tile.querySelector(".photo-inner");
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: true }
            }
          );
        }
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return <section ref={ref} id="photography" className={hideHeader ? "px-6 md:px-10 pb-32" : "px-6 md:px-10 py-32"}>
      {!hideHeader && <header className="flex justify-between items-end mb-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-3">[ 04 ] Selected stills</p>
            <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter">Photography</h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">15 projects</span>
        </header>}


      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[18rem] md:auto-rows-[22rem] gap-4">
        {photoProjects.map((p) => <button
    key={p.id}
    data-project-id={p.id}
    onClick={() => onOpen(p)}
    className={`photo-tile group relative overflow-hidden text-left ${p.span ?? ""} ${p.aspect ? "" : ""}`}
  >
            <div className="photo-inner absolute inset-[-8%]">
              <Placeholder kind="photo" label={`Photo ${p.index}`} seed={p.seeds[0]} className="h-full" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/70">
                <span>{p.index}</span>
                <span>{p.year}</span>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-1">{p.category}</p>
                <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight leading-none">{p.title}</h3>
              </div>
            </div>
            <span className="absolute top-4 right-4 size-9 rounded-full border border-foreground/30 flex items-center justify-center font-mono text-xs opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 bg-background/40 backdrop-blur-sm">↗</span>
          </button>)}
      </div>
    </section>;
}
export {
  Photography
};
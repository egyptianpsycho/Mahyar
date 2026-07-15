"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { videoProjects } from "@/data/projects";
import { Placeholder } from "./Placeholder";
gsap.registerPlugin(ScrollTrigger);
const SPANS = [
  "col-span-2 row-span-2 aspect-[4/5]",
  // big portrait
  "col-span-2 row-span-1 aspect-[16/9]",
  // wide landscape
  "col-span-1 row-span-2 aspect-[3/5]",
  // tall narrow
  "col-span-1 row-span-1 aspect-square",
  "col-span-1 row-span-1 aspect-[4/5]",
  "col-span-2 row-span-2 aspect-video",
  // big landscape
  "col-span-1 row-span-1 aspect-square",
  "col-span-2 row-span-1 aspect-[16/9]",
  "col-span-1 row-span-2 aspect-[3/5]",
  "col-span-1 row-span-1 aspect-[4/5]"
];
function Videography({ onOpen, hideHeader }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".video-tile").forEach((tile) => {
        gsap.from(tile, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: tile, start: "top 92%" }
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return <section ref={ref} id="videography" className={hideHeader ? "px-6 md:px-10 pb-32" : "px-6 md:px-10 py-32 border-t border-border"}>
      {!hideHeader && <header className="flex justify-between items-end mb-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-3">[ 05 ] Motion work</p>
            <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter">Videography</h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
            {videoProjects.length} reels
          </span>
        </header>}


      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[minmax(140px,_auto)] gap-3 md:gap-4">
        {videoProjects.map((p, i) => {
    const span = SPANS[i % SPANS.length];
    return <button
      key={p.id}
      onClick={() => onOpen(p)}
      className={`video-tile group text-left relative overflow-hidden border border-border bg-card ${span}`}
    >
              <Placeholder kind="video" label={`Reel ${p.index}`} seed={p.seeds[0]} />
              <div className="absolute inset-0 bg-background/20 group-hover:bg-background/5 transition-colors" />
              <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/80 bg-background/50 backdrop-blur-sm px-2 py-1">
                {p.category}
              </span>
              <div className="absolute bottom-0 inset-x-0 p-3 md:p-4 bg-gradient-to-t from-background/90 via-background/40 to-transparent">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/60 mb-1">
                  {p.index} · {p.year}
                </p>
                <h3 className="font-display text-lg md:text-2xl uppercase tracking-tight leading-none group-hover:text-accent transition-colors">
                  {p.title}
                </h3>
              </div>
            </button>;
  })}
      </div>
    </section>;
}
export {
  Videography
};
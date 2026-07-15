"use client";
import { useRef } from "react";
import gsap from "gsap";
import { designProjects } from "@/data/projects";
const makeSeeds = (id, n) => Array.from({ length: n }, (_, i) => `${id}-${i + 1}`);
const toProject = (d) => ({
  id: d.id,
  index: d.index,
  title: d.title,
  year: d.year,
  category: d.category,
  description: d.description,
  kind: "photo",
  aspect: "aspect-[4/5]",
  gallery: 6,
  seeds: makeSeeds(d.seed, 6)
});
const imgSrc = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/420`;
function Row({ d, onOpen }) {
  const wrapRef = useRef(null);
  const EASE = "power3.inOut";
  const DUR = 0.5;
  const enter = () => {
    if (!wrapRef.current) return;
    gsap.killTweensOf(wrapRef.current);
    gsap.to(wrapRef.current, { width: "10vw", duration: DUR, ease: EASE });
  };
  const leave = () => {
    if (!wrapRef.current) return;
    gsap.killTweensOf(wrapRef.current);
    gsap.to(wrapRef.current, { width: 0, duration: DUR, ease: EASE });
  };
  return <button
    onMouseEnter={enter}
    onMouseLeave={leave}
    onClick={() => onOpen(toProject(d))}
    className="w-full flex items-center justify-center border-t border-border last:border-b py-[0.8vw] cursor-pointer group"
  >
      <p className="font-display uppercase tracking-tighter text-[7vw] md:text-[5vw] leading-none mr-[0.75vw] transition-colors group-hover:text-accent">
        {d.title1}
      </p>
      <div
    ref={wrapRef}
    className="overflow-hidden flex justify-center"
    style={{ width: 0, willChange: "width" }}
  >
        <img
    src={imgSrc(d.seed)}
    alt=""
    className="h-[7vw] md:h-[5vw] w-[10vw] object-cover"
  />
      </div>
      <p className="font-display uppercase tracking-tighter text-[7vw] md:text-[5vw] leading-none ml-[0.75vw] transition-colors group-hover:text-accent">
        {d.title2}
      </p>
    </button>;
}
function DigitalDesign({ onOpen }) {
  return <section id="design" className="px-6 md:px-10 py-32 border-t border-border">
      <header className="flex justify-between items-end mb-16">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-3">
            [ 06 ] Digital design
          </p>
          <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter mb-4">
            Design <span className="italic text-accent">systems</span>.
          </h2>
          <p className="text-foreground/55 max-w-md text-sm leading-relaxed">
            Identity, interface and editorial — crafted to feel inevitable in any medium.
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 hidden md:block">
          {designProjects.length} projects
        </span>
      </header>

      <div className="w-full md:w-[80%] mx-auto">
        {designProjects.map((d) => <Row key={d.id} d={d} onOpen={onOpen} />)}
      </div>
    </section>;
}
export {
  DigitalDesign
};
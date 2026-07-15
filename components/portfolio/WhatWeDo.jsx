"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TiltCard } from "@/components/unlumen-ui/tilt-card";
import { Magnetic } from "@/components/core/magnetic";
gsap.registerPlugin(ScrollTrigger);
const SERVICES = [
  {
    idx: "01",
    title: "Social Media Marketing",
    blurb: "Campaigns, content systems & paid strategy that compound month over month.",
    badge: "Strategy"
  },
  {
    idx: "02",
    title: "Photography",
    blurb: "Editorial, fashion & commercial stills shot on location and in studio.",
    badge: "Editorial"
  },
  {
    idx: "03",
    title: "Videography",
    blurb: "Short films, reels and brand documentaries from concept to color.",
    badge: "Direction"
  },
  {
    idx: "04",
    title: "Digital Design",
    blurb: "Identity systems, websites and motion crafted to feel inevitable.",
    badge: "Identity"
  }
];
const photo = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;
function WhatWeDo() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".service-card").forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          filter: "blur(12px)",
          duration: 1,
          ease: "expo.out",
          delay: i * 0.08,
          scrollTrigger: { trigger: card, start: "top 88%" }
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  const springOptions = { bounce: 0.1 };
  return <section ref={ref} id="services" className="px-6 md:px-10 py-32 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">
            [ 02 ] What we do
          </p>
          <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-[0.9] mb-8">
            Four <span className="italic text-accent">disciplines</span>, one studio.
          </h2>
          <p className="text-foreground/60 leading-relaxed max-w-sm mx-auto mb-10">
            We work across image, motion and strategy — picking the right tools for the
            story, not the other way around.
          </p>

          <Magnetic intensity={0.25} springOptions={springOptions} actionArea="global" range={220}>
            <a
    href="#contact"
    className="inline-flex items-center gap-3 rounded-full bg-accent text-accent-foreground px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] border border-accent hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
  >
              <Magnetic intensity={0.15} springOptions={springOptions} actionArea="global" range={220}>
                <span>Start a project →</span>
              </Magnetic>
            </a>
          </Magnetic>
        </div>

        <div className="flex flex-col gap-6">
          {SERVICES.map((s) => <div key={s.idx} className="service-card">
              <TiltCard
    title={s.title}
    description={s.blurb}
    price={`[ ${s.idx} ]`}
    badgeLabel={s.badge}
    imageSrc={photo(`whatwedo-${s.idx}`)}
    className="bg-card border-border h-56 md:h-64"
  />
            </div>)}
        </div>
      </div>
    </section>;
}
export {
  WhatWeDo
};
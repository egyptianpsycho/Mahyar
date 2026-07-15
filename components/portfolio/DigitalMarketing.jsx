"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { marketingCampaigns } from "@/data/projects";
gsap.registerPlugin(ScrollTrigger);
function ScreenFeed({ c }) {
  return <div className="absolute inset-0 bg-[#0a0a0a] text-white flex flex-col">
      <div className="flex items-center justify-between px-4 pt-8 pb-3">
        <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/60">
          {c.client}
        </span>
        <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#ccff00]">
          Live
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div
    className="absolute inset-0"
    style={{
      background: "radial-gradient(120% 80% at 20% 10%, #ccff00 0%, transparent 55%), radial-gradient(80% 60% at 80% 90%, #1f1f1f 0%, #050505 70%)"
    }}
  />
        <div className="absolute inset-0 flex items-end p-5">
          <h4 className="font-display text-[2.4rem] leading-[0.85] uppercase tracking-tighter">
            {c.title}
          </h4>
        </div>
        <span className="absolute top-4 right-4 font-mono text-[8px] uppercase tracking-[0.3em] text-white/50">
          {c.index}/04
        </span>
      </div>
      <div className="flex items-center gap-4 px-4 py-4 border-t border-white/10">
        <span className="text-base">♡</span>
        <span className="text-base">↗</span>
        <span className="ml-auto font-mono text-[9px] text-white/60">
          {c.kpis[1].value}
        </span>
      </div>
    </div>;
}
function ScreenStats({ c }) {
  return <div className="absolute inset-0 bg-white text-black p-5 pt-9 flex flex-col gap-4">
      <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/50">
        Performance · 30d
      </p>
      <p className="font-display text-[2.8rem] leading-[0.85] uppercase tracking-tighter text-black">
        {c.kpis[0].value}
      </p>
      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/60 -mt-2">
        {c.kpis[0].label}
      </p>
      <div className="flex-1 flex items-end gap-1 pt-4">
        {[24, 38, 30, 52, 44, 70, 60, 88, 74, 96].map((h, i) => <div
    key={i}
    className="flex-1 bg-black"
    style={{ height: `${h}%`, opacity: 0.25 + i / 10 * 0.75 }}
  />)}
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-black/10">
        {c.kpis.slice(1).map((k) => <div key={k.label}>
            <div className="font-display text-xl leading-none">{k.value}</div>
            <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-black/50 mt-1">
              {k.label}
            </div>
          </div>)}
      </div>
    </div>;
}
function ScreenPoster({ c }) {
  return <div className="absolute inset-0 bg-[#ccff00] text-black p-5 pt-9 flex flex-col">
      <span className="font-mono text-[8px] uppercase tracking-[0.35em]">
        {c.tags[0]}
      </span>
      <div className="flex-1 flex items-center">
        <h4 className="font-display text-[3.2rem] leading-[0.82] uppercase tracking-tighter">
          {c.title.split(" ").map((w, i) => <span key={i} className={i % 2 ? "italic font-light" : ""}>
              {w}
              <br />
            </span>)}
        </h4>
      </div>
      <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.3em]">
        <span>{c.client}</span>
        <span>↗ swipe</span>
      </div>
    </div>;
}
function ScreenStory({ c }) {
  return <div className="absolute inset-0 bg-black text-white flex flex-col">
      <div className="flex gap-1 px-3 pt-8">
        {[0, 1, 2, 3].map((i) => <div key={i} className="flex-1 h-[2px] bg-white/20 overflow-hidden">
            <div
    className="h-full bg-white"
    style={{ width: i === 1 ? "60%" : i < 1 ? "100%" : "0%" }}
  />
          </div>)}
      </div>
      <div className="px-4 pt-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#ccff00]" />
        <span className="font-mono text-[9px] tracking-wider">
          {c.client.toLowerCase()}
        </span>
        <span className="ml-auto font-mono text-[8px] text-white/50">2h</span>
      </div>
      <div className="relative flex-1 overflow-hidden mt-3">
        <div
    className="absolute inset-0"
    style={{
      background: "linear-gradient(180deg, #2a2a2a 0%, #050505 100%)"
    }}
  />
        <div className="absolute inset-0 flex items-center justify-center px-5 text-center">
          <span className="font-display text-[2.6rem] leading-[0.85] uppercase tracking-tighter">
            {c.title}
          </span>
        </div>
        <span className="absolute bottom-4 left-4 right-4 font-mono text-[8px] uppercase tracking-[0.3em] text-white/70 text-center">
          Tap to view ↗
        </span>
      </div>
    </div>;
}
const SCREENS = [ScreenFeed, ScreenStats, ScreenPoster, ScreenStory];
function Phone({ c, i }) {
  const Screen = SCREENS[i % SCREENS.length];
  return <div
    className="dm-phone relative shrink-0"
    style={{ width: 260, transform: `rotate(${i % 2 ? -2 : 2}deg)` }}
  >
      <div className="relative rounded-[2.6rem] bg-black p-[6px] shadow-[0_50px_100px_-25px_rgba(0,0,0,0.7)]">
        <div className="relative rounded-[2.2rem] overflow-hidden aspect-[9/19.5] bg-black">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-30" />
          <Screen c={c} />
        </div>
      </div>
    </div>;
}
function DigitalMarketing() {
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const counterRef = useRef(null);
  useEffect(() => {
    if (!wrapRef.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const wrap = wrapRef.current;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current)
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            if (counterRef.current) {
              const idx = Math.min(
                marketingCampaigns.length,
                Math.floor(self.progress * (marketingCampaigns.length + 0.999)) + 1
              );
              counterRef.current.textContent = String(idx).padStart(2, "0");
            }
          }
        }
      });
      gsap.utils.toArray(".dm-panel").forEach((panel) => {
        const reveals = panel.querySelectorAll(".dm-reveal");
        gsap.from(reveals, {
          yPercent: 110,
          ease: "expo.out",
          duration: 1.1,
          stagger: 0.08,
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: "left 85%"
          }
        });
        const fades = panel.querySelectorAll(".dm-fade");
        gsap.from(fades, {
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: "left 75%"
          }
        });
        const phone = panel.querySelector(".dm-phone");
        if (phone) {
          gsap.from(phone, {
            yPercent: 18,
            opacity: 0,
            scale: 0.92,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: "left 95%"
            }
          });
          gsap.to(phone, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true
            }
          });
        }
        const marquee = panel.querySelector(".dm-marquee");
        if (marquee) {
          gsap.to(marquee, {
            xPercent: -50,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true
            }
          });
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  const total = marketingCampaigns.length;
  return <section
    ref={sectionRef}
    id="marketing"
    className="relative border-t border-border bg-background"
  >
      <div ref={wrapRef} className="relative h-screen overflow-hidden">
        {
    /* Sticky header */
  }
        <div className="absolute top-0 inset-x-0 z-30 pointer-events-none px-6 md:px-10 pt-8 md:pt-10 flex items-start justify-between mix-blend-difference text-white">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-70 mb-2">
              [ 03 ] — Digital marketing
            </p>
            <h2 className="font-display text-2xl md:text-4xl uppercase tracking-tighter">
              Campaigns / 2024 — 25
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] opacity-70">
            <span className="w-10 h-px bg-white/60" />
            Drag · Scroll
          </div>
        </div>

        {
    /* Progress + counter */
  }
        <div className="absolute bottom-6 md:bottom-10 inset-x-6 md:inset-x-10 z-30 pointer-events-none mix-blend-difference text-white">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em]">
            <span>
              <span ref={counterRef}>01</span> / {String(total).padStart(2, "0")}
            </span>
            <div className="flex-1 h-px bg-white/30 overflow-hidden">
              <div
    ref={progressRef}
    className="h-full w-full bg-[#ccff00] origin-left"
    style={{ transform: "scaleX(0)" }}
  />
            </div>
            <span className="hidden md:inline">Awwwards · Horizontal</span>
          </div>
        </div>

        {
    /* Horizontal track */
  }
        <div
    ref={trackRef}
    className="absolute top-0 left-0 h-full flex items-stretch will-change-transform"
  >
          {
    /* Intro panel */
  }
          <section
    className="dm-panel shrink-0 h-full relative flex flex-col justify-center px-8 md:px-24"
    style={{ width: "85vw" }}
  >
            <div className="dm-marquee absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap flex pointer-events-none">
              {Array.from({ length: 6 }).map((_, i) => <span
    key={i}
    className="font-display uppercase tracking-tighter leading-none text-[#ccff00]/[0.07] text-[22vw] pr-12 select-none"
  >
                  Marketing —
                </span>)}
            </div>
            <div className="relative max-w-xl">
              <div className="overflow-hidden mb-5">
                <span className="dm-reveal inline-block font-mono text-[10px] uppercase tracking-[0.4em] text-[#ccff00]">
                  ◆ Built for the feed
                </span>
              </div>
              <div className="overflow-hidden mb-2">
                <h3 className="dm-reveal font-display text-6xl md:text-8xl uppercase tracking-tighter leading-[0.85]">
                  Campaigns
                </h3>
              </div>
              <div className="overflow-hidden mb-8">
                <h3 className="dm-reveal font-display italic text-6xl md:text-8xl uppercase tracking-tighter leading-[0.85] text-[#ccff00]">
                  that move.
                </h3>
              </div>
              <p className="dm-fade text-foreground/70 leading-relaxed max-w-md">
                Mobile-first creative engineered for the scroll. Tested hooks,
                editorial art direction, performance you can read at a glance.
              </p>
            </div>
          </section>

          {marketingCampaigns.map((c, i) => <article
    key={c.id}
    className="dm-panel shrink-0 h-full relative flex items-center"
    style={{ width: "100vw" }}
  >
              {
    /* huge index */
  }
              <span
    aria-hidden
    className="absolute -top-6 left-6 md:left-16 font-display text-[28vw] md:text-[22vw] leading-[0.8] uppercase tracking-tighter text-foreground/[0.05] select-none pointer-events-none"
  >
                {c.index}
              </span>

              <div className="relative z-10 w-full px-8 md:px-20 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
                {
    /* Text column */
  }
                <div className="md:col-span-7 max-w-2xl">
                  <div className="overflow-hidden mb-3">
                    <span className="dm-reveal inline-block font-mono text-[10px] uppercase tracking-[0.35em] text-[#ccff00]">
                      {c.client} — {c.tags[0]}
                    </span>
                  </div>
                  <div className="overflow-hidden mb-2">
                    <h3 className="dm-reveal font-display text-5xl md:text-[7rem] uppercase tracking-tighter leading-[0.85]">
                      {c.title.split(" ")[0]}
                    </h3>
                  </div>
                  {c.title.split(" ")[1] && <div className="overflow-hidden mb-8">
                      <h3 className="dm-reveal font-display italic text-5xl md:text-[7rem] uppercase tracking-tighter leading-[0.85] text-foreground/60">
                        {c.title.split(" ").slice(1).join(" ")}
                      </h3>
                    </div>}
                  <p className="dm-fade text-foreground/65 leading-relaxed mb-10 max-w-md">
                    {c.description}
                  </p>
                  <div className="dm-fade grid grid-cols-3 gap-6 max-w-lg border-t border-border pt-6 mb-8">
                    {c.kpis.map((k) => <div key={k.label}>
                        <div className="font-display text-2xl md:text-4xl text-[#ccff00] leading-none">
                          {k.value}
                        </div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/50 mt-2">
                          {k.label}
                        </div>
                      </div>)}
                  </div>
                  <div className="dm-fade flex gap-2 flex-wrap">
                    {c.tags.map((t) => <span
    key={t}
    className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/60 border border-border px-3 py-1"
  >
                        {t}
                      </span>)}
                  </div>
                </div>

                {
    /* Phone column */
  }
                <div className="md:col-span-5 flex justify-center md:justify-end">
                  <Phone c={c} i={i} />
                </div>
              </div>
            </article>)}

          {
    /* End panel */
  }
          <section
    className="dm-panel shrink-0 h-full flex flex-col items-center justify-center text-center px-10"
    style={{ width: "70vw" }}
  >
            <div className="overflow-hidden mb-4">
              <span className="dm-reveal inline-block font-mono text-[10px] uppercase tracking-[0.4em] text-[#ccff00]">
                ◆ End of reel
              </span>
            </div>
            <div className="overflow-hidden">
              <h3 className="dm-reveal font-display text-6xl md:text-9xl uppercase tracking-tighter leading-[0.85]">
                Your turn.
              </h3>
            </div>
            <p className="dm-fade text-foreground/65 mt-6 max-w-sm">
              Got a launch on the calendar? Let's make it the one people screenshot.
            </p>
          </section>
        </div>
      </div>
    </section>;
}
export {
  DigitalMarketing
};
"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { getLenis } from "@/hooks/useLenis";
const ASPECTS = [
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[5/7]"
];
function MediaTile({ item, className }) {
  if (item.type === "video") {
    return <video
      src={item.src}
      poster={item.poster}
      controls
      playsInline
      preload="metadata"
      className={className}
    />;
  }
  return <img
    src={item.src}
    alt={item.alt ?? ""}
    loading="lazy"
    className={className}
  />;
}
function ProjectMediaPortal({ project, onClose }) {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [view, setView] = useState("grid");
  useEffect(() => {
    if (!project || !ref.current) return;
    const lenis = getLenis();
    lenis?.stop();
    const hasVideo = project.media.some((m) => m.type === "video");
    setView(hasVideo ? "stream" : "grid");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { clipPath: "inset(50% 30% 50% 30% round 24px)", opacity: 0.8 },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1, duration: 0.9, ease: "expo.inOut" }
      );
      gsap.from(".mportal-stagger", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.05,
        ease: "expo.out",
        delay: 0.35
      });
    }, ref);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") scrollBySlide(1);
      if (e.key === "ArrowLeft") scrollBySlide(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      ctx.revert();
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [project, onClose]);
  const scrollBySlide = useCallback((dir) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelector("[data-mslide]");
    const w = slide?.offsetWidth ?? track.clientWidth * 0.7;
    const gap = 24;
    track.scrollBy({ left: dir * (w + gap), behavior: "smooth" });
  }, []);
  const onTrackScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || !project) return;
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? track.scrollLeft / max : 0;
    setProgress(p);
    const slides = Array.from(track.querySelectorAll("[data-mslide]"));
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((s, i) => {
      const c = s.offsetLeft + s.offsetWidth / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  }, [project]);
  if (typeof window === "undefined" || !project) return null;
  const media = project.media;
  const hero = media[0];
  return createPortal(
    <div
      ref={ref}
      data-lenis-prevent
      className="fixed inset-0 z-[90] bg-background overflow-y-auto overscroll-contain"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-6 md:px-10 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60">
            <button onClick={onClose} className="hover:text-accent transition-colors">← Back</button>
            <span className="text-foreground/30">|</span>
            <span>{project.index}</span>
            <span>·</span>
            <span>{project.category}</span>
            <span>·</span>
            <span>{project.year}</span>
          </div>
          <button
      onClick={onClose}
      className="group flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em]"
    >
            Close
            <span className="size-9 rounded-full border border-foreground/30 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
              ✕
            </span>
          </button>
        </div>
      </div>

      <div className="px-6 md:px-10 pt-16 md:pt-24 pb-12 max-w-7xl mx-auto">
        <p className="mportal-stagger font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-6">
          [ {project.index} / {project.category} ]
        </p>
        <h2 className="mportal-stagger font-display text-6xl md:text-[9rem] uppercase tracking-tighter leading-[0.85] mb-10">
          {project.title}
        </h2>
        <div className="grid md:grid-cols-12 gap-8 border-t border-border pt-8">
          <p className="mportal-stagger md:col-span-5 text-foreground/70 leading-relaxed text-lg">
            {project.description}
          </p>
          <dl className="mportal-stagger md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-[10px] uppercase tracking-[0.25em]">
            <div>
              <dt className="text-foreground/40 mb-2">Year</dt>
              <dd className="text-foreground">{project.year}</dd>
            </div>
            <div>
              <dt className="text-foreground/40 mb-2">Category</dt>
              <dd className="text-foreground">{project.category}</dd>
            </div>
            <div>
              <dt className="text-foreground/40 mb-2">Format</dt>
              <dd className="text-foreground">
                {media.some((m) => m.type === "video") ? "Mixed media" : "Stills"}
              </dd>
            </div>
            <div>
              <dt className="text-foreground/40 mb-2">Assets</dt>
              <dd className="text-foreground">{media.length}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <div className="mportal-stagger relative w-full aspect-[16/9] mb-16 border border-border overflow-hidden bg-card">
          <MediaTile item={hero} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="pb-16">
        <div className="px-6 md:px-10 flex items-end justify-between mb-6 max-w-7xl mx-auto">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-2">
              [ Gallery ]
            </p>
            <h3 className="font-display text-3xl md:text-5xl uppercase tracking-tighter">
              Selected media
            </h3>
          </div>
          <div className="flex font-mono text-[10px] uppercase tracking-[0.3em] border border-border">
            <button
      onClick={() => setView("grid")}
      className={`px-4 py-2 transition-colors ${view === "grid" ? "bg-accent text-background" : "text-foreground/60 hover:text-foreground"}`}
    >
              Grid
            </button>
            <button
      onClick={() => setView("stream")}
      className={`px-4 py-2 transition-colors ${view === "stream" ? "bg-accent text-background" : "text-foreground/60 hover:text-foreground"}`}
    >
              Stream
            </button>
          </div>
        </div>

        {view === "grid" && <div className="px-6 md:px-10 max-w-7xl mx-auto">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-3 md:gap-4 [column-fill:_balance]">
              {media.map((m, i) => <div
      key={i}
      className={`mb-3 md:mb-4 break-inside-avoid relative ${ASPECTS[i % ASPECTS.length]} overflow-hidden border border-accent/20 hover:border-accent/60 transition-colors bg-card`}
    >
                  <MediaTile item={m} className="absolute inset-0 w-full h-full object-cover" />
                  {m.type === "video" && <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.3em] bg-background/70 backdrop-blur px-2 py-1 pointer-events-none">
                      ▶ Video
                    </span>}
                </div>)}
            </div>
          </div>}

        {view === "stream" && <>
            <div className="px-6 md:px-10 flex items-center justify-end gap-3 mb-4 max-w-7xl mx-auto">
              <button
      onClick={() => scrollBySlide(-1)}
      aria-label="Previous"
      className="size-11 rounded-full border border-foreground/30 flex items-center justify-center hover:bg-accent hover:text-background hover:border-accent transition-colors font-mono"
    >←</button>
              <button
      onClick={() => scrollBySlide(1)}
      aria-label="Next"
      className="size-11 rounded-full border border-foreground/30 flex items-center justify-center hover:bg-accent hover:text-background hover:border-accent transition-colors font-mono"
    >→</button>
            </div>
            <div
      ref={trackRef}
      onScroll={onTrackScroll}
      className="flex gap-6 overflow-x-auto pb-8 px-6 md:px-10 snap-x snap-mandatory scroll-smooth"
      style={{ scrollbarWidth: "none" }}
    >
              <style>{`div::-webkit-scrollbar { display: none; }`}</style>
              {media.map((m, i) => {
      const isActive = i === active;
      return <div
        key={i}
        data-mslide
        className="snap-center shrink-0 relative transition-all duration-500 ease-out"
        style={{
          width: "min(70vw, 720px)",
          transform: isActive ? "scale(1)" : "scale(0.92)",
          opacity: isActive ? 1 : 0.55
        }}
      >
                    <div className="relative aspect-[4/5] border border-accent/30 overflow-hidden bg-card">
                      <MediaTile item={m} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                      <span>{m.type === "video" ? "Video" : "Frame"} {String(i + 1).padStart(2, "0")}</span>
                      <span className="text-accent">{isActive ? "\u25CF live" : "\u25CB"}</span>
                    </div>
                  </div>;
    })}
            </div>

            <div className="px-6 md:px-10 flex items-center gap-6 max-w-7xl mx-auto">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 tabular-nums">
                {String(active + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}
              </span>
              <div className="flex-1 h-px bg-foreground/15 relative overflow-hidden">
                <div
      className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-150"
      style={{ width: `${Math.max(0.05, progress) * 100}%` }}
    />
              </div>
            </div>
          </>}
      </div>

      <div className="px-6 md:px-10 max-w-7xl mx-auto pb-24 pt-10 border-t border-border flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
        <span>End of project {project.index}</span>
        <button onClick={onClose} className="hover:text-accent transition-colors">Back to index ↑</button>
      </div>
    </div>,
    document.body
  );
}
export {
  ProjectMediaPortal
};
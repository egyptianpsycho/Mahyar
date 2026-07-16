"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { recentProjects } from "@/data/projects";
import { recentMediaProjects } from "@/data/mediaProjects";
import { OptimizedImage } from "./OptimizedImage";
gsap.registerPlugin(ScrollTrigger);
const imgSrc = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/700`;
const EASE_OPEN = "expo.out";
const EASE_CLOSE = "expo.in";
function RecentWork({ onOpen, onOpenMedia }) {
  const ref = useRef(null);
  const modalRef = useRef(null);
  const modalInnerRef = useRef(null);
  const sliderRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorInnerRef = useRef(null);
  const labelRef = useRef(null);
  const labelInnerRef = useRef(null);
  const activeRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const moveFns = useRef(null);
  useEffect(() => {
    const modal = modalRef.current;
    const modalInner = modalInnerRef.current;
    const cursor = cursorRef.current;
    const cursorInner = cursorInnerRef.current;
    const label = labelRef.current;
    const labelInner = labelInnerRef.current;
    const section = ref.current;
    if (!modal || !modalInner || !cursor || !cursorInner || !label || !labelInner || !section) return;
    gsap.set([modalInner, cursorInner, labelInner], { scale: 0 });
    moveFns.current = {
      mx: gsap.quickTo(modal, "left", { duration: 0.8, ease: "power3" }),
      my: gsap.quickTo(modal, "top", { duration: 0.8, ease: "power3" }),
      cx: gsap.quickTo(cursor, "left", { duration: 0.5, ease: "power3" }),
      cy: gsap.quickTo(cursor, "top", { duration: 0.5, ease: "power3" }),
      lx: gsap.quickTo(label, "left", { duration: 0.45, ease: "power3" }),
      ly: gsap.quickTo(label, "top", { duration: 0.45, ease: "power3" })
    };
    const onMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      const m = moveFns.current;
      m.mx(e.clientX);
      m.my(e.clientY);
      m.cx(e.clientX);
      m.cy(e.clientY);
      m.lx(e.clientX);
      m.ly(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onLeave: () => close(),
      onLeaveBack: () => close()
    });
    return () => {
      window.removeEventListener("mousemove", onMove);
      st.kill();
    };
  }, []);
  const primePosition = () => {
    const m = moveFns.current;
    if (!m) return;
    const { x, y } = mouseRef.current;
    gsap.set(modalRef.current, { left: x, top: y });
    gsap.set(cursorRef.current, { left: x, top: y });
    gsap.set(labelRef.current, { left: x, top: y });
  };
  const open = (index) => {
    const modalInner = modalInnerRef.current;
    const cursorInner = cursorInnerRef.current;
    const labelInner = labelInnerRef.current;
    const slider = sliderRef.current;
    if (!modalInner || !cursorInner || !labelInner || !slider) return;
    if (!activeRef.current) primePosition();
    activeRef.current = true;
    document.documentElement.classList.add("hide-site-cursor");
    slider.style.top = `${index * -100}%`;
    gsap.killTweensOf([modalInner, cursorInner, labelInner]);
    gsap.to([modalInner, cursorInner, labelInner], {
      scale: 1,
      duration: 0.4,
      ease: EASE_OPEN
    });
  };
  const close = () => {
    if (!activeRef.current) return;
    activeRef.current = false;
    document.documentElement.classList.remove("hide-site-cursor");
    const modalInner = modalInnerRef.current;
    const cursorInner = cursorInnerRef.current;
    const labelInner = labelInnerRef.current;
    if (!modalInner || !cursorInner || !labelInner) return;
    gsap.killTweensOf([modalInner, cursorInner, labelInner]);
    gsap.to([modalInner, cursorInner, labelInner], {
      scale: 0,
      duration: 0.4,
      ease: EASE_CLOSE
    });
  };
  return <section ref={ref} id="recent" className="px-6 md:px-10 py-32 relative">
      <header className="flex justify-between items-end mb-16">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-3">[ 01 ] Recent work</p>
          <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter">
            What we've <span className="italic text-accent">built</span>.
          </h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 hidden md:block">
          {recentProjects.length} projects
        </span>
      </header>

      <ul className="border-t border-border" onMouseLeave={close}>
        {recentProjects.slice(0, 4).map((p, i) => <li key={p.id} className="border-b border-border group">
            <button
    onClick={() => onOpen(p)}
    onMouseEnter={() => open(i)}
    className="w-full grid grid-cols-[3rem_minmax(0,1fr)_auto_auto] md:grid-cols-[5rem_minmax(0,1fr)_auto_auto_3rem] items-center gap-4 md:gap-8 py-6 md:py-8 text-left"
  >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 group-hover:text-accent/70 transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-3xl md:text-6xl uppercase tracking-tighter truncate transition-transform duration-500 ease-out group-hover:translate-x-3">
                {p.title}
              </h3>
              <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                {p.category}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                {p.year}
              </span>
              <span className="hidden md:inline-flex justify-end font-mono text-foreground/40 group-hover:text-accent group-hover:translate-x-1 transition-transform">↗</span>
            </button>
          </li>)}
        {recentMediaProjects.map((p, idx) => {
    const i = 4 + idx;
    return <li key={p.id} className="border-b border-border group">
              <button
      onClick={() => onOpenMedia(p)}
      onMouseEnter={() => open(i)}
      className="w-full grid grid-cols-[3rem_minmax(0,1fr)_auto_auto] md:grid-cols-[5rem_minmax(0,1fr)_auto_auto_3rem] items-center gap-4 md:gap-8 py-6 md:py-8 text-left"
    >
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 group-hover:text-accent/70 transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-3xl md:text-6xl uppercase tracking-tighter truncate transition-transform duration-500 ease-out group-hover:translate-x-3">
                  {p.title}
                  <span className="ml-3 align-middle font-mono text-[10px] tracking-[0.25em] text-accent">●</span>
                </h3>
                <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                  {p.category}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                  {p.year}
                </span>
                <span className="hidden md:inline-flex justify-end font-mono text-foreground/40 group-hover:text-accent group-hover:translate-x-1 transition-transform">↗</span>
              </button>
            </li>;
  })}
      </ul>

      {
    /* === Olivier-style modal + cursor companions === */
  }
      <div
    ref={modalRef}
    aria-hidden
    className="pointer-events-none fixed z-[80] hidden md:block"
    style={{ left: 0, top: 0, width: 0, height: 0, willChange: "left, top" }}
  >
        <div
    ref={modalInnerRef}
    className="absolute bg-white overflow-hidden shadow-2xl"
    style={{
      width: 400,
      height: 350,
      left: "-200px",
      top: "-175px",
      willChange: "transform"
    }}
  >
          <div
    ref={sliderRef}
    className="absolute inset-0 w-full h-full"
    style={{ transition: "top 0.5s cubic-bezier(0.76, 0, 0.24, 1)", top: 0 }}
  >
            {recentProjects.slice(0, 4).map((p) => <div key={p.id} className="relative w-full h-full flex items-center justify-center">
                <OptimizedImage src={imgSrc(p.seeds[0])} alt="" className="object-cover" sizes="400px" />
              </div>)}
            {recentMediaProjects.map((p) => <div key={p.id} className="relative w-full h-full flex items-center justify-center">
                <OptimizedImage
                  src={p.media.find((m) => m.type === "image")?.src ?? p.media[0].poster ?? imgSrc(p.id)}
                  alt=""
                  className="object-cover"
                  sizes="400px"
                />
              </div>)}
          </div>
        </div>
      </div>

      <div
    ref={cursorRef}
    aria-hidden
    className="pointer-events-none fixed z-[81] hidden md:block"
    style={{ left: 0, top: 0, width: 0, height: 0, willChange: "left, top" }}
  >
        <div
    ref={cursorInnerRef}
    className="absolute rounded-full"
    style={{
      width: 80,
      height: 80,
      left: "-40px",
      top: "-40px",
      backgroundColor: "#455CE9",
      willChange: "transform"
    }}
  />
      </div>
      <div
    ref={labelRef}
    aria-hidden
    className="pointer-events-none fixed z-[82] hidden md:block"
    style={{ left: 0, top: 0, width: 0, height: 0, willChange: "left, top" }}
  >
        <div
    ref={labelInnerRef}
    className="absolute flex items-center justify-center rounded-full text-[14px] font-light"
    style={{
      width: 80,
      height: 80,
      left: "-40px",
      top: "-40px",
      color: "#ffffff",
      willChange: "transform"
    }}
  >
          View
        </div>
      </div>
    </section>;
}
export {
  RecentWork
};

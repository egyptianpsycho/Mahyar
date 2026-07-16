"use client";
import { useEffect, useRef, useState } from "react";
const LINKS = [
  { id: "photography", label: "Photography", href: "#photography" },
  { id: "videography", label: "Videography", href: "#videography" },
  { id: "clients", label: "Clients", href: "#clients" },
  { id: "contact", label: "Contact", href: "#contact" }
];
const RING_SIZE = 26;
const RING_STROKE = 1.5;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_C = 2 * Math.PI * RING_R;
function Nav({ introDone = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const listRef = useRef(null);
  const itemRefs = useRef({});
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    opacity: 0
  });
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrolled(y > 40);
      setProgress(Math.min(1, Math.max(0, y / max)));
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  useEffect(() => {
    const ids = LINKS.map((l) => l.id);
    const sections = ids.map((id) => document.getElementById(id)).filter((el) => !!el);
    if (!sections.length) return;
    const visible = /* @__PURE__ */ new Map();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        }
        let bestId = "";
        let bestRatio = 0;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId) setActive(bestId);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const measure = () => {
      const list = listRef.current;
      const el = active ? itemRefs.current[active] : null;
      if (!list || !el) {
        setIndicator((p) => ({ ...p, opacity: 0 }));
        return;
      }
      const lr = list.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      setIndicator({ left: r.left - lr.left, width: r.width, opacity: 1 });
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 60);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [active, scrolled]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const easing = "cubic-bezier(0.22,1,0.36,1)";
  return <>
      <nav
    aria-label="Primary"
    className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-10 md:pt-7 pointer-events-none"
    style={{ opacity: introDone ? 1 : 0, transform: introDone ? "translateY(0)" : "translateY(-16px)", transition: `opacity 500ms ${easing}, transform 700ms ${easing}` }}
  >
        <div
    className={[
      "pointer-events-auto relative mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 border-y border-white/20 py-3 md:gap-5",
      "transition-colors duration-500",
      scrolled ? "bg-background/45 backdrop-blur-xl" : "bg-transparent"
    ].join(" ")}
    style={{ transition: `all 500ms ${easing}` }}
  >
          {
    /* subtle inset highlight */
  }
          {
    /* Logo */
  }
          <a
    href="#top"
    className="relative flex items-center font-display text-xl tracking-tight md:text-2xl"
    aria-label="Mahyar — home"
  >
            <span
    className="overflow-hidden inline-flex items-baseline"
    style={{ transition: `all 500ms ${easing}` }}
  >
              <span className="text-base md:text-lg leading-none">M</span>
              <span
    className="text-base md:text-lg leading-none inline-block overflow-hidden whitespace-nowrap"
    style={{
      maxWidth: scrolled ? 0 : "5rem",
      opacity: scrolled ? 0 : 1,
      transition: `max-width 500ms ${easing}, opacity 300ms ${easing}`
    }}
  >
                ahyar
              </span>
              <span className="text-base md:text-lg leading-none text-accent">.</span>
            </span>
          </a>

          {
    /* Divider */
  }
          {
    /* Links */
  }
          <ul
    ref={listRef}
    className="hidden md:flex relative items-center gap-5"
  >
            {
    /* magic line */
  }
            <span
    aria-hidden
    className="absolute -bottom-3 h-px bg-accent"
    style={{
      left: indicator.left,
      width: indicator.width,
      opacity: indicator.opacity,
      transition: `left 450ms ${easing}, width 450ms ${easing}, opacity 300ms ${easing}`
    }}
  />
            {LINKS.map((l) => {
    const isActive = active === l.id;
    return <li key={l.id} className="relative">
                  <a
      href={l.href}
      aria-current={isActive ? "true" : void 0}
      ref={(el) => {
        itemRefs.current[l.id] = el;
      }}
      className={[
        "group relative block font-mono uppercase",
        scrolled ? "text-[10px] tracking-[0.22em]" : "text-[10.5px] tracking-[0.25em]",
        isActive ? "text-foreground" : "text-foreground/55 hover:text-foreground"
      ].join(" ")}
      style={{ transition: `color 300ms ${easing}, padding 500ms ${easing}, font-size 500ms ${easing}` }}
    >
                    <span className="relative inline-block overflow-hidden align-middle" style={{ height: "1em" }}>
                      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                        {l.label}
                      </span>
                      <span
      aria-hidden
      className="absolute inset-x-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full text-accent"
    >
                        {l.label}
                      </span>
                    </span>
                  </a>
                </li>;
  })}
          </ul>

          {
    /* Divider */
  }
          {
    /* Right — progress ring + status */
  }
          <a
    href="#contact"
    className="relative flex items-center gap-2 pl-1 pr-1 md:pr-2"
    aria-label="Available 2025 — contact"
  >
            <span className="relative inline-flex items-center justify-center" style={{ width: RING_SIZE, height: RING_SIZE }}>
              <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
                <circle
    cx={RING_SIZE / 2}
    cy={RING_SIZE / 2}
    r={RING_R}
    stroke="currentColor"
    strokeWidth={RING_STROKE}
    fill="none"
    className="text-border/60"
  />
                <circle
    cx={RING_SIZE / 2}
    cy={RING_SIZE / 2}
    r={RING_R}
    stroke="currentColor"
    strokeWidth={RING_STROKE}
    fill="none"
    strokeLinecap="round"
    className="text-accent"
    style={{
      strokeDasharray: RING_C,
      strokeDashoffset: RING_C * (1 - progress),
      transition: "stroke-dashoffset 120ms linear"
    }}
  />
              </svg>
              <span className="absolute size-1.5 rounded-full bg-accent animate-pulse" />
            </span>
            <span
    className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.22em] overflow-hidden whitespace-nowrap"
    style={{
      maxWidth: scrolled ? 0 : "9rem",
      opacity: scrolled ? 0 : 1,
      transition: `max-width 500ms ${easing}, opacity 300ms ${easing}`
    }}
  >
              Available 2025
            </span>
          </a>

          {
    /* Mobile menu trigger */
  }
          <button
    type="button"
    onClick={() => setOpen(true)}
    className="md:hidden relative ml-1 size-7 rounded-full border border-border/70 flex flex-col items-center justify-center gap-[3px]"
    aria-label="Open menu"
  >
            <span className="block h-px w-3.5 bg-foreground" />
            <span className="block h-px w-3.5 bg-foreground" />
          </button>
        </div>
      </nav>

      {
    /* Mobile overlay */
  }
      <div
    className={[
      "fixed inset-0 z-[60] md:hidden",
      open ? "pointer-events-auto" : "pointer-events-none"
    ].join(" ")}
    aria-hidden={!open}
  >
        <div
    className="absolute inset-0 bg-background/95 backdrop-blur-xl"
    style={{ opacity: open ? 1 : 0, transition: `opacity 400ms ${easing}` }}
    onClick={() => setOpen(false)}
  />
        <div
    className="relative h-full flex flex-col"
    style={{
      transform: open ? "translateY(0)" : "translateY(-12px)",
      opacity: open ? 1 : 0,
      transition: `opacity 400ms ${easing}, transform 500ms ${easing}`
    }}
  >
          <div className="flex justify-between items-center px-6 py-5">
            <span className="font-display text-lg">
              Mahyar<span className="text-accent">.</span>
            </span>
            <button
    type="button"
    onClick={() => setOpen(false)}
    className="font-mono text-[10px] uppercase tracking-[0.25em] size-9 rounded-full border border-border flex items-center justify-center"
    aria-label="Close menu"
  >
              ✕
            </button>
          </div>
          <ul className="flex-1 flex flex-col justify-center gap-6 px-8">
            {LINKS.map((l, i) => <li key={l.id}>
                <a
    href={l.href}
    onClick={() => setOpen(false)}
    className="block font-display text-5xl uppercase tracking-tighter hover:text-accent transition-colors"
    style={{
      opacity: open ? 1 : 0,
      transform: open ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 500ms ${easing} ${120 + i * 60}ms, transform 500ms ${easing} ${120 + i * 60}ms`
    }}
  >
                  {l.label}
                </a>
              </li>)}
          </ul>
          <div className="px-8 pb-10 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/60 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" /> Available 2025
          </div>
        </div>
      </div>
    </>;
}
export {
  Nav
};

"use client";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "@/hooks/useLenis";
import { Intro } from "./Intro";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { About } from "./About";
import { Media } from "./Media";
import { Logos } from "./Logos";
import { Contact } from "./Contact";
import { ProjectPortal } from "./ProjectPortal";
import { ProjectMediaPortal } from "./ProjectMediaPortal";
import { Cursor } from "./Cursor";
import { RecentWork } from "./RecentWork";
import { WhatWeDo } from "./WhatWeDo";
import { DigitalDesign } from "./DigitalDesign";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/hooks/useLenis";
function Portfolio() {
  const [introDone, setIntroDone] = useState(false); //edited
  const [open, setOpen] = useState(null);
  const [openMedia, setOpenMedia] = useState(null);
  const footerRef = useRef(null);
  const [footerH, setFooterH] = useState(0);
  useLenis();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = getLenis();
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
    }
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 200);
    window.addEventListener("resize", refresh);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", refresh);
    };
  }, [introDone]);
  useEffect(() => {
    if (!footerRef.current) return;
    const el = footerRef.current;
    const update = () => {
      const h = el.offsetHeight;
      setFooterH(h);
      ScrollTrigger.refresh();
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [introDone]);
  return <div className="relative bg-background text-foreground grain">
      {!introDone && <Intro onDone={() => setIntroDone(true)} />} 
      <Cursor />
      {/* Navigation is intentionally disabled while the new intro is being tuned.  */}
      {false && <Nav introDone={introDone} />}
      <div className="relative z-10 bg-background" style={{ marginBottom: footerH }}>
        <main>
          <Hero introDone={introDone} />
          <RecentWork onOpen={setOpen} onOpenMedia={setOpenMedia} />
          <WhatWeDo />
          <About />
          {
    /* <DigitalMarketing /> temporarily disabled */
  }
          <Media onOpen={setOpen} />
          <DigitalDesign onOpen={setOpen} />
          <Logos />
        </main>
      </div>
      {
    /* Pinned footer — sits behind the main content and is revealed on the last scroll */
  }
      <div ref={footerRef} className="fixed inset-x-0 bottom-0 z-0 bg-background">
        <Contact />
      </div>
      <ProjectPortal project={open} onClose={() => setOpen(null)} />
      <ProjectMediaPortal project={openMedia} onClose={() => setOpenMedia(null)} />
    </div>;
}
export {
  Portfolio
};

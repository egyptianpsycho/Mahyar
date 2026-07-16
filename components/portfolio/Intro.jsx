"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { OptimizedImage } from "./OptimizedImage";

gsap.registerPlugin(CustomEase);

const INTRO_IMAGES = ["/assets/3.webp", "/assets/CubeE.webp", "/assets/hero.png", "/assets/Horse2.webp", "/assets/Jumeriah5.jpg"];
const ROTATIONS = [-10, 5, -3, -5, 10];

function Intro({ onDone }) {
  const rootRef = useRef(null);
  const imageRefs = useRef([]);
  const [loadedImages, setLoadedImages] = useState(0);

  useEffect(() => {
    if (!rootRef.current || loadedImages !== INTRO_IMAGES.length) return;

    const hop = CustomEase.create("mahyar-hop", "M0,0 C0,0 0.1,1 1,1");
    const glide = CustomEase.create("mahyar-glide", "M0,0 C0.5,0 0.2,1 1,1");
    const images = imageRefs.current;
    const scaleFactor = window.innerWidth < 768 ? 0.3 : 0.2;
    const gap = window.innerWidth < 768 ? 10 : 20;
    const imageWidth = window.innerWidth * scaleFactor;
    const totalRowWidth = imageWidth * images.length + gap * (images.length - 1);
    const centeredX = (window.innerWidth - totalRowWidth) / 2;
    // A scaled full-screen element keeps space on both sides of its transform origin.
    // Offset that space so the five images form a true centred row on screen.
    const scaleOffset = (window.innerWidth - imageWidth) / 2;
    const offscreenX = -window.innerWidth;

    const ctx = gsap.context(() => {
      images.forEach((image, index) => {
        gsap.set(image, {
          scale: scaleFactor,
          x: offscreenX,
          y: [-28, -10, 0, -10, -28][index],
          rotation: ROTATIONS[index],
          borderRadius: 10,
          transformOrigin: "center center"
        });
      });
      const tl = gsap.timeline({ delay: 0.25, onComplete: onDone });
      tl.to(".intro-preloader", { scaleX: 1, duration: 1, ease: glide })
        .set(".intro-preloader", { transformOrigin: "right" })
        .to(".intro-preloader", { scaleX: 0, duration: 0.7, ease: hop })
        .to(".intro-preloader-overlay", {
          clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
          duration: 0.9,
          ease: hop
        }, "-=0.35");

      images.forEach((image, index) => {
        tl.to(image, {
          x: centeredX + (imageWidth + gap) * index - scaleOffset,
          duration: 1.1,
          ease: glide
        }, "-=0.8");
      });

      tl.addLabel("spread", "-=0.15")
        .to([images[0], images[1]], {
          x: -window.innerWidth,
          duration: 0.85,
          ease: "power3.inOut",
          stagger: 0.015
        }, "spread")
        .to([images[4], images[3]], {
          x: window.innerWidth,
          duration: 0.85,
          ease: "power3.inOut",
          stagger: 0.015
        }, "spread")
        .to(images[2], {
          scale: 1,
          x: 0,
          y: 0,
          rotation: 0,
          borderRadius: 0,
          duration: 1.1,
          ease: "power4.inOut"
        }, "spread")
        .to(rootRef.current, { opacity: 0, duration: 0.16 }, "+=0.1");
    }, rootRef);

    return () => ctx.revert();
  }, [loadedImages, onDone]);

  return <div ref={rootRef} className="fixed inset-0 z-[100] overflow-hidden bg-background">
      <div className="intro-preloader-overlay absolute inset-0 z-30 bg-background" />
      <div className="intro-preloader absolute inset-x-0 top-0 z-40 h-1 origin-left scale-x-0 bg-accent" />
      <div className="absolute inset-0">
        {INTRO_IMAGES.map((src, index) => <div
          key={src}
          ref={(element) => { imageRefs.current[index] = element; }}
          className="intro-image absolute inset-0 overflow-hidden bg-card shadow-2xl"
        >
          <OptimizedImage
            src={src}
            alt={index === 2 ? "Mahyar hero" : ""}
            priority
            sizes="100vw"
            className="object-cover"
            onLoad={() => setLoadedImages((count) => Math.min(INTRO_IMAGES.length, count + 1))}
          />
        </div>)}
      </div>
    </div>;
}

export { Intro };

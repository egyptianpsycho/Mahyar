"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TiltCard } from "@/components/unlumen-ui/tilt-card";
import { Magnetic } from "@/components/core/magnetic";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    idx: "01",
    title: "Branding & Strategy",
    blurb: "Clear positioning and distinctive brand systems built to move your business forward.",
    badge: "Foundation"
  },
  {
    idx: "02",
    title: "Marketing & Content Creation",
    blurb: "Campaigns and content with a point of view, designed to earn attention over time.",
    badge: "Growth"
  },
  {
    idx: "03",
    title: "Media Production",
    blurb: "Photography, film and motion that make the story feel as strong as the idea.",
    badge: "Production"
  },
  {
    idx: "04",
    title: "Graphic Design & Web Development",
    blurb: "Digital experiences and visual tools that bring every part of your brand together.",
    badge: "Digital"
  }
];

const photo = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;

function WhatWeDo() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const panel = ".services-panel";
      const label = ".services-label";
      const cards = gsap.utils.toArray(".service-card");
      const stage = ".services-scroll-wrap";
      const pinHold = { progress: 0 };

      gsap.set(cards, { autoAlpha: 0, filter: "blur(14px)" });
      let cardsVisible = false;
      let lastExpansionProgress = 0;
      const revealCards = () => {
        if (cardsVisible) return;
        cardsVisible = true;
        gsap.to(cards, {
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.42,
          stagger: 0.08,
          ease: "power2.out",
          overwrite: true
        });
      };
      const hideCards = () => {
        if (!cardsVisible) return;
        cardsVisible = false;
        gsap.to(cards, {
          autoAlpha: 0,
          filter: "blur(14px)",
          duration: 0.24,
          stagger: { each: 0.05, from: "end" },
          ease: "power2.in",
          overwrite: true
        });
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top 15%",
          end: "+=115%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      timeline
        .to(panel, {
          top: "50%",
          duration: 0.42,
          ease: "power2.inOut"
        })
        .addLabel("expand")
        .to(label, {
          autoAlpha: 0,
          filter: "blur(14px)",
          duration: 0.28,
          ease: "power1.out"
        }, "expand")
        .to(panel, {
          width: () => ref.current.querySelector(stage).clientWidth,
          height: () => ref.current.querySelector(stage).clientHeight,
          borderRadius: "0.75rem",
          duration: 0.62,
          ease: "power2.inOut",
          onUpdate() {
            const progress = this.progress();
            if (progress < lastExpansionProgress) hideCards();
            else if (progress >= 0.995) revealCards();
            lastExpansionProgress = progress;
          }
        }, "expand")
        .to(pinHold, { progress: 1, duration: 0.75 });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="services" className="border-t border-border px-6 py-32 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
            [ 02 ] What we do
          </p>
          <h2 className="mb-8 font-display text-5xl uppercase leading-[0.9] tracking-tighter md:text-7xl">
            Four <span className="italic text-accent">disciplines</span>, one studio.
          </h2>
          <p className="mx-auto max-w-sm text-foreground/60 leading-relaxed">
            We work across image, motion and strategy — picking the right tools for the story, not the other way around.
          </p>
        </div>

        <div className="services-scroll-wrap relative h-[35rem] pt-8 md:h-[42rem]">
          <div className="relative h-full w-full">
            <div className="services-panel absolute left-1/2 top-8 h-16 w-64 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] bg-[#0F0F0F] will-change-[top,width,height] md:w-72">
              <div className="services-label absolute inset-0 z-10 flex items-center justify-center whitespace-nowrap will-change-[filter,opacity]">
                <Magnetic intensity={0.25} springOptions={{ bounce: 0.1 }} actionArea="global" range={220}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground">
                    Our Services
                  </span>
                </Magnetic>
              </div>

              <div className="grid h-full grid-cols-1 gap-4 p-4 pt-5 md:grid-cols-2 md:gap-6 md:p-6">
                {SERVICES.map((service) => (
                  <div key={service.idx} data-cursor-card className="service-card min-h-0 will-change-[filter,opacity]">
                    <TiltCard
                      title={service.title}
                      description={service.blurb}
                      price={`[ ${service.idx} ]`}
                      badgeLabel={service.badge}
                      imageSrc={photo(`whatwedo-${service.idx}`)}
                      className="h-full min-h-0 bg-card border-border"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { WhatWeDo };

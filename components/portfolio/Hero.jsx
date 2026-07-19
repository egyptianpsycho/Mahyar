"use client";

import { useLayoutEffect, useRef, useEffect } from "react";

import gsap from "gsap";

import { CustomEase } from "gsap/CustomEase";

import { ScrollTrigger } from "gsap/ScrollTrigger";

import * as THREE from "three";

gsap.registerPlugin(CustomEase, ScrollTrigger);

const vertexShader = `

  varying vec2 vUv;

  void main() {

    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  }

`;

const fragmentShader = `

  uniform sampler2D uTexture;

  uniform vec2 uResolution;

  uniform vec2 uTextureSize;

  uniform vec2 uMouse;

  uniform float uParallaxStrength;

  uniform float uDistortionMultiplier;

  uniform float uGlassStrength;

  uniform float uStripesFrequency;

  uniform float uGlassSmoothness;

  uniform float uEdgePadding;

  varying vec2 vUv;



  vec2 getCoverUV(vec2 uv, vec2 textureSize) {

    if (textureSize.x < 1.0 || textureSize.y < 1.0) return uv;

    vec2 s = uResolution / textureSize;

    float scale = max(s.x, s.y);

    vec2 scaledSize = textureSize * scale;

    vec2 offset = (uResolution - scaledSize) * 0.5;

    return (uv * uResolution - offset) / scaledSize;

  }



  float displacement(float x, float num_stripes, float strength) {

    float modulus = 1.0 / num_stripes;

    return mod(x, modulus) * strength;

  }



  float fractalGlass(float x) {

    float d = 0.0;

    for (int i = -5; i <= 5; i++) {

      d += displacement(x + float(i) * uGlassSmoothness, uStripesFrequency, uGlassStrength);

    }

    d = d / 11.0;

    return x + d;

  }



  float smoothEdge(float x, float padding) {

    float edge = padding;

    if (x < edge) return smoothstep(0.0, edge, x);

    else if (x > 1.0 - edge) return smoothstep(1.0, 1.0 - edge, x);

    return 1.0;

  }



  void main() {

    vec2 uv = vUv;

    float originalX = uv.x;

    float edgeFactor = smoothEdge(originalX, uEdgePadding);

    float distortedX = fractalGlass(originalX);

    uv.x = mix(originalX, distortedX, edgeFactor);

    float distortionFactor = uv.x - originalX;

    float parallaxDirection = -sign(0.5 - uMouse.x);

    vec2 parallaxOffset = vec2(

      parallaxDirection * abs(uMouse.x - 0.5) * uParallaxStrength * (1.0 + abs(distortionFactor) * uDistortionMultiplier),

      0.0

    );

    parallaxOffset *= edgeFactor;

    uv += parallaxOffset;

    vec2 coverUV = getCoverUV(uv, uTextureSize);

    coverUV = clamp(coverUV, 0.0, 1.0);

    vec4 color = texture2D(uTexture, coverUV);

    gl_FragColor = color;

  }

`;

const GLASS_CONFIG = {
  lerpFactor: 0.035,

  parallaxStrength: 0.06,

  distortionMultiplier: 4,

  glassStrength: 0.8,

  glassSmoothness: 0.0001,

  stripesFrequency: 20,

  edgePadding: 0.15,
};

const setWillChange = (targets, value) => {
  const els =
    typeof targets === "string" ? document.querySelectorAll(targets) : targets;

  els.forEach?.((el) => {
    el.style.willChange = value;
  });
};

// ── pauseRef: { pause(), resume() } is set on mount so Hero's ScrollTrigger

//    can completely cancel the RAF loop when the pin is done, removing all

//    GPU overhead for the rest of the page scroll. ─────────────────────────

function useGlassShader(containerRef, imageSrc, introDone, pauseRef) {
  const materialRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const rect = container.getBoundingClientRect();

    const w = rect.width || window.innerWidth;

    const h = rect.height || window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(w, h);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.domElement.style.position = "absolute";

    renderer.domElement.style.inset = "0";

    renderer.domElement.style.width = "100%";

    renderer.domElement.style.height = "100%";

    renderer.domElement.style.willChange = "transform";

    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },

        uResolution: { value: new THREE.Vector2(w, h) },

        uTextureSize: { value: new THREE.Vector2(1, 1) },

        uMouse: { value: new THREE.Vector2(0.5, 0.5) },

        uParallaxStrength: { value: 0 },

        uDistortionMultiplier: { value: 0 },

        uGlassStrength: { value: 0 },

        uStripesFrequency: { value: GLASS_CONFIG.stripesFrequency },

        uGlassSmoothness: { value: GLASS_CONFIG.glassSmoothness },

        uEdgePadding: { value: GLASS_CONFIG.edgePadding },
      },

      vertexShader,

      fragmentShader,
    });

    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    const img = new Image();

    img.crossOrigin = "anonymous";

    img.src = imageSrc;

    img.onload = () => {
      const texture = new THREE.Texture(img);

      texture.needsUpdate = true;

      material.uniforms.uTexture.value = texture;

      material.uniforms.uTextureSize.value.set(
        img.naturalWidth,

        img.naturalHeight
      );
    };

    const mouse = { x: 0.5, y: 0.5 };

    const targetMouse = { x: 0.5, y: 0.5 };

    const lerp = (a, b, t) => a + (b - a) * t;

    const onMouseMove = (e) => {
      targetMouse.x = e.clientX / window.innerWidth;

      targetMouse.y = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      const r = container.getBoundingClientRect();

      const nw = r.width || window.innerWidth;

      const nh = r.height || window.innerHeight;

      renderer.setSize(nw, nh);

      material.uniforms.uResolution.value.set(nw, nh);
    };

    window.addEventListener("resize", onResize);

    let isVisible = true;

    const visObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        renderer.domElement.style.willChange = isVisible ? "transform" : "auto";
      },

      { threshold: 0 }
    );

    visObserver.observe(container);

    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      if (!isVisible) return; // skip GPU work when off screen

      mouse.x = lerp(mouse.x, targetMouse.x, GLASS_CONFIG.lerpFactor);

      mouse.y = lerp(mouse.y, targetMouse.y, GLASS_CONFIG.lerpFactor);

      material.uniforms.uMouse.value.set(mouse.x, mouse.y);

      renderer.render(scene, camera);
    };

    // ── Expose pause / resume so ScrollTrigger can kill the loop

    //    the moment the pin ends. Hiding the canvas also evicts it

    //    from the browser compositor, removing any remaining GPU cost. ──────

    if (pauseRef) {
      pauseRef.current = {
        pause: () => {
          if (rafId) {
            cancelAnimationFrame(rafId);

            rafId = 0;
          }

          renderer.domElement.style.willChange = "auto";

          renderer.domElement.style.visibility = "hidden";
        },

        resume: () => {
          if (!rafId) {
            renderer.domElement.style.visibility = "";

            renderer.domElement.style.willChange = "transform";

            animate();
          }
        },

        lowerQuality: () => renderer.setPixelRatio(1),

        restoreQuality: () =>
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)),
      };
    }

    animate();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = 0;

      visObserver.disconnect();

      window.removeEventListener("mousemove", onMouseMove);

      window.removeEventListener("resize", onResize);

      renderer.domElement.style.willChange = "auto";

      renderer.dispose();

      geometry.dispose();

      material.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [containerRef, imageSrc]);

  useEffect(() => {
    if (introDone && materialRef.current) {
      gsap.to(materialRef.current.uniforms.uGlassStrength, {
        value: GLASS_CONFIG.glassStrength,

        duration: 2,

        ease: "power2.inOut",
      });

      gsap.to(materialRef.current.uniforms.uDistortionMultiplier, {
        value: GLASS_CONFIG.distortionMultiplier,

        duration: 2,

        ease: "power2.inOut",
      });

      gsap.to(materialRef.current.uniforms.uParallaxStrength, {
        value: GLASS_CONFIG.parallaxStrength,

        duration: 2,

        ease: "power2.inOut",
      });
    }
  }, [introDone]);
}

function Hero({ introDone }) {
  const wrapperRef = useRef(null);

  const ref = useRef(null);

  const glassContainerRef = useRef(null);

  const text1Ref = useRef(null);

  const text2Ref = useRef(null);

  // Starts with no-op stubs so ScrollTrigger callbacks are always safe to call

  // even if the effect hasn't run yet (it will have, but defensive is fine).

  const glPauseRef = useRef({ pause: () => {}, resume: () => {} });

  useGlassShader(glassContainerRef, "/assets/hero.png", introDone, glPauseRef);

  // ── Morphing text loop ────────────────────────────────────────────────

  useEffect(() => {
    if (!introDone) return;

    const text1 = text1Ref.current;

    const text2 = text2Ref.current;

    if (!text1 || !text2) return;

    const s1 = text1.style;

    const s2 = text2.style;

    const texts = ["Mahyar", "Creative", "Agency"];

    const morphTime = 1.5;

    const invMorph = 1 / morphTime;

    const cooldownTime = 0.7;

    let textIndex = -1;

    let writtenIndex = -2;

    let time = performance.now();

    let morph = 0;

    let cooldown = 0;

    let stopped = false;

    let paused = false;

    let inView = true;

    let cooledStyled = false;

    let lastFraction = -1;

    let rafId = 0;

    const wordAt = (i) => (i < 0 ? "" : texts[i % texts.length]);

    const writeWords = () => {
      if (writtenIndex === textIndex) return;

      text1.textContent = wordAt(textIndex);

      text2.textContent = wordAt(textIndex + 1);

      writtenIndex = textIndex;
    };

    writeWords();

    s1.opacity = "0%";

    s2.opacity = "0%";

    const applyMorphStyles = (fraction) => {
      if (
        Math.abs(fraction - lastFraction) < 0.002 &&
        fraction !== 0 &&
        fraction !== 1
      )
        return;

      lastFraction = fraction;

      const inv = 1 - fraction;

      const op2 =
        fraction === 1 ? 1 : fraction === 0 ? 0 : Math.pow(fraction, 0.4);

      const op1 = inv === 1 ? 1 : inv === 0 ? 0 : Math.pow(inv, 0.4);

      const b2 = fraction === 0 ? 100 : Math.min(8 / fraction - 8, 100);

      const b1 = inv === 0 ? 100 : Math.min(8 / inv - 8, 100);

      s2.filter = "blur(" + b2 + "px)";

      s2.opacity = op2 * 100 + "%";

      s1.filter = "blur(" + b1 + "px)";

      s1.opacity = op1 * 100 + "%";
    };

    const setMorph = (fraction) => {
      writeWords();

      applyMorphStyles(fraction);

      cooledStyled = false;
    };

    const applyCooldownStyles = () => {
      if (cooledStyled) return;

      s2.filter = "";

      s2.opacity = "100%";

      s1.filter = "";

      s1.opacity = "0%";

      lastFraction = -1;

      cooledStyled = true;
    };

    const doMorph = () => {
      morph -= cooldown;

      cooldown = 0;

      let fraction = morph * invMorph;

      if (fraction > 1) {
        cooldown = cooldownTime;

        fraction = 1;
      }

      setMorph(fraction);
    };

    const doCooldown = () => {
      morph = 0;

      applyCooldownStyles();
    };

    const settleOnMahyar = () => {
      text1.textContent = "Mahyar";

      text2.textContent = texts[1];

      s1.filter = "";

      s1.opacity = "100%";

      s2.filter = "";

      s2.opacity = "0%";

      s1.willChange = "auto";

      s2.willChange = "auto";
    };

    const tick = () => {
      if (stopped || paused || !inView) {
        rafId = 0;

        return;
      }

      rafId = requestAnimationFrame(tick);

      const newTime = performance.now();

      const shouldIncrementIndex = cooldown > 0;

      const dt = (newTime - time) / 1000;

      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) textIndex++;

        doMorph();
      } else doCooldown();
    };

    const start = () => {
      if (stopped || paused || !inView || rafId) return;

      s1.willChange = "filter, opacity";

      s2.willChange = "filter, opacity";

      time = performance.now();

      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = 0;
    };

    const onVisibility = () => {
      paused = document.hidden;

      if (paused) stop();
      else start();
    };

    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;

        if (inView) start();
        else {
          stop();

          s1.willChange = "auto";

          s2.willChange = "auto";
        }
      },

      { threshold: 0 }
    );

    if (wrapperRef.current) io.observe(wrapperRef.current);

    const morphToMahyar = () => {
      stopped = true;

      if (rafId) {
        cancelAnimationFrame(rafId);

        rafId = 0;
      }

      // text2 is always the "active" incoming word — use it as the outgoing word

      const visibleWord = text2.textContent || wordAt(0);

      text1.textContent = visibleWord;

      text2.textContent = "Mahyar";

      // Already on Mahyar — just settle cleanly

      if (visibleWord === "Mahyar") {
        settleOnMahyar();

        return;
      }

      s1.willChange = "filter, opacity";

      s2.willChange = "filter, opacity";

      // Reset to clean start (visibleWord fully shown, Mahyar hidden)

      // then animate through the same blur/opacity math the morph loop uses

      applyMorphStyles(0);

      const progress = { t: 0 };

      gsap.to(progress, {
        t: 1,

        duration: 0.6,

        ease: "power2.inOut",

        onUpdate() {
          applyMorphStyles(progress.t);
        },

        onComplete: settleOnMahyar,
      });
    };

    const onScroll = () => {
      if (stopped) return;

      if (window.scrollY > 8) {
        window.removeEventListener("scroll", onScroll);

        morphToMahyar(); // stopped = true is set inside
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    start();

    return () => {
      stopped = true;

      stop();

      s1.willChange = "auto";

      s2.willChange = "auto";

      document.removeEventListener("visibilitychange", onVisibility);

      window.removeEventListener("scroll", onScroll);

      io.disconnect();
    };
  }, [introDone]);

  useLayoutEffect(() => {
    if (!ref.current || !introDone) return;

    CustomEase.create("reveal", "0.9, 0, 0.1, 1");

    const ctx = gsap.context(() => {
      setWillChange(".hero-eyebrow", "filter, opacity, transform");

      gsap.fromTo(
        ".hero-eyebrow",

        { opacity: 0, filter: "blur(8px)", y: 10 },

        {
          opacity: 1,

          filter: "blur(0px)",

          y: 0,

          duration: 0.9,

          ease: "power3.out",

          delay: 0.35,

          onComplete: () => setWillChange(".hero-eyebrow", "auto"),
        }
      );

      setWillChange(".hero-detail", "filter, opacity");

      gsap.fromTo(
        ".hero-detail",

        { opacity: 0, filter: "blur(10px)" },

        {
          opacity: 1,

          filter: "blur(0px)",

          duration: 1.1,

          ease: "power2.out",

          delay: 0.4,

          stagger: 0.1,

          onComplete: () => setWillChange(".hero-detail", "auto"),
        }
      );

      gsap.set(glassContainerRef.current, {
        scale: 1,

        rotateX: 0,

        transformOrigin: "center bottom",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,

          start: "top top",

          end: `+=${window.innerHeight * 1.5}`,

          pin: true,

          pinSpacing: true,

          scrub: 1.2,

          // ── After the pin ends the hero is buried under subsequent sections.

          //    Kill the WebGL RAF and hide the canvas so the GPU is completely

          //    free for the rest of the page. Resume if the user scrolls back. ──

          onEnter: () => {
            glPauseRef.current.lowerQuality();

            if (glassContainerRef.current)
              glassContainerRef.current.style.willChange = "transform";

            setWillChange(".hero-eyebrow", "filter, opacity, transform");
          },

          onLeave: () => {
            glPauseRef.current.pause();

            if (glassContainerRef.current)
              glassContainerRef.current.style.willChange = "auto";

            setWillChange(".hero-eyebrow", "auto");
          },

          onEnterBack: () => {
            glPauseRef.current.resume();

            glPauseRef.current.restoreQuality();

            if (glassContainerRef.current)
              glassContainerRef.current.style.willChange = "transform";

            setWillChange(".hero-eyebrow", "filter, opacity, transform");
          },

          onLeaveBack: () => {
            glPauseRef.current.restoreQuality();

            if (glassContainerRef.current)
              glassContainerRef.current.style.willChange = "auto";

            setWillChange(".hero-eyebrow", "auto");
          },
        },
      });

      tl.fromTo(
        ".hero-eyebrow",

        { opacity: 1, filter: "blur(0px)", y: 0 },

        {
          opacity: 0,

          filter: "blur(10px)",

          y: -10,

          ease: "power2.in",

          duration: 0.3,
        },

        0
      );

      tl.to(
        glassContainerRef.current,

        {
          rotateX: 35,

          rotate: 4,

          scale: 0.82,

          yPercent: 8,

          ease: "none",

          duration: 1,
        },

        0
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [introDone]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ marginBottom: introDone ? "-150vh" : "0px" }}
    >
      <section
        ref={ref}
        id="top"
        className="relative h-svh min-h-[38rem] bg-background hero-pin overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        <div
          ref={glassContainerRef}
          className="absolute inset-0 w-full h-full"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />

        {/* ── TOP ROW ── */}

        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-6 pt-7 md:px-10 md:pt-9 mix-blend-overlay">
          <p className="hero-eyebrow font-mono font-medium text-[10px] uppercase tracking-[0.3em] opacity-0 text-white">
            Creative Studio
          </p>

          <p className="hero-eyebrow  font-mono text-[10px] uppercase tracking-[0.3em] text-white opacity-0">
            Est. 2018
          </p>
        </div>

        {/* ── WORDMARK (morphing) ── */}

        <div className="hero-wordmark-parent absolute inset-x-0 bottom-[18%] z-10 px-6 md:px-10 mix-blend-difference">
          <svg
            aria-hidden="true"
            style={{
              position: "absolute",

              width: 0,

              height: 0,

              pointerEvents: "none",
            }}
          >
            <defs>
              <filter id="threshold">
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
                />
              </filter>
            </defs>
          </svg>

          <div
            className="hero-wordmark relative w-full select-none uppercase text-white"
            style={{
              fontSize: "clamp(3.5rem, 14vw, 12rem)",

              lineHeight: 0.9,

              fontFamily: "Barlow Condensed",

              letterSpacing: "-0.01em",

              fontWeight: 700,

              height: "1em",

              filter: "url(#threshold) blur(0.6px)",

              contain: "paint",

              isolation: "isolate",

              transform: "translateZ(0)",
            }}
          >
            <span
              ref={text1Ref}
              style={{
                position: "absolute",

                inset: 0,

                display: "inline-block",

                width: "100%",

                opacity: 0,
              }}
            >
              Mahyar
            </span>

            <span
              ref={text2Ref}
              style={{
                position: "absolute",

                inset: 0,

                display: "inline-block",

                width: "100%",

                opacity: 0,
              }}
            >
              Creative
            </span>
          </div>
        </div>

        {/* ── BOTTOM ROW ── */}

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-7 md:px-10 md:pb-9">
          <h6 className="hero-detail opacity-0 font-mono text-[12px] uppercase tracking-[0.28em] text-white/100 mix-blend-overlay">
            Media Production · Digital Marketing · Graphic Design
          </h6>

          <div className="flex flex-col items-end gap-3">
            <h6 className="hero-detail font-mono text-[12px] uppercase tracking-[0.28em] text-white/100 opacity-0 mix-blend-soft-light">
              United Arab Emirates
            </h6>
          </div>
        </div>
      </section>
    </div>
  );
}

export { Hero };

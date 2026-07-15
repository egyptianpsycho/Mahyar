"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
function Magnetic({
  children,
  intensity = 0.6,
  range = 100,
  actionArea = "self",
  springOptions
}) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springOptions);
  const springY = useSpring(y, springOptions);
  useEffect(() => {
    const calculate = (e) => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < range) {
        setIsHovered(true);
        x.set(dx * intensity);
        y.set(dy * intensity);
      } else {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }
    };
    const reset = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };
    if (actionArea === "global") {
      document.addEventListener("mousemove", calculate);
      return () => document.removeEventListener("mousemove", calculate);
    }
    const el = actionArea === "parent" ? ref.current?.parentElement : ref.current;
    if (!el) return;
    el.addEventListener("mousemove", calculate);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", calculate);
      el.removeEventListener("mouseleave", reset);
    };
  }, [actionArea, intensity, range, x, y]);
  void isHovered;
  return <motion.div ref={ref} style={{ x: springX, y: springY, display: "inline-block" }}>
      {children}
    </motion.div>;
}
export {
  Magnetic
};

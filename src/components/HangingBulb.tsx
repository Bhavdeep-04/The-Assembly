"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export function HangingBulb() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const [sparksVisible, setSparksVisible] = useState(false);
  const sparkTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Drag logic
  const dragY = useMotionValue(0);
  const springDragY = useSpring(dragY, { stiffness: 400, damping: 25 });
  const bulbY = useTransform(springDragY, [0, 90], [0, 50]);
  const ropeHeight = useTransform(springDragY, [0, 90], [110, 170]);
  const [pullProgress, setPullProgress] = useState(0);
  const dragBrightness = useTransform(springDragY, [40, 90], [0, 1]);

  useEffect(() => {
    const unsub = dragBrightness.on("change", (v) => setPullProgress(v));
    return () => unsub();
  }, [dragBrightness]);

  // Listen to the snap-scroll container, not window
  useEffect(() => {
    const container = document.querySelector("[style*='scroll-snap']") as HTMLElement | null;
    const el = container || window as any;

    const handleScroll = () => {
      const scrollTop = container ? container.scrollTop : window.scrollY;
      const scrollH = container
        ? container.scrollHeight - container.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / (scrollH * 0.45), 1);
      setScrollProgress(progress);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (sparkTimerRef.current) clearTimeout(sparkTimerRef.current);
    };
  }, []);

  // Brightness — gentle, starts very low
  const brightnessRaw = isOn ? 1 : Math.max(scrollProgress * 0.45, pullProgress * 0.65);
  const b = brightnessRaw; // alias

  return (
    <div className="fixed top-0 right-[13%] z-50 hidden lg:flex flex-col items-center pointer-events-none">

      {/* ── ROPE / CORD ── */}
      <motion.div
        className="origin-top"
        style={{
          width: "1px",
          height: ropeHeight,
          background: "linear-gradient(to bottom, #3a2818 0%, #261608 100%)",
        }}
      />

      {/* ── PENDANT ASSEMBLY ── */}
      <motion.div
        className="relative flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing"
        drag="y"
        dragConstraints={{ top: 0, bottom: 90 }}
        dragElastic={0.1}
        style={{ y: bulbY }}
        onDrag={(_, info) => dragY.set(info.offset.y)}
        onDragEnd={(_, info) => {
          if (info.offset.y > 60) {
            setIsOn((v) => !v);
            setSparksVisible(true);
            if (sparkTimerRef.current) clearTimeout(sparkTimerRef.current);
            sparkTimerRef.current = setTimeout(() => setSparksVisible(false), 1400);
          }
          dragY.set(0);
        }}
      >
        {/* Ceiling canopy — tiny disc */}
        <div
          className="w-3 h-1.5 rounded-sm z-10"
          style={{
            background: "linear-gradient(to bottom, #6b5540 0%, #3d2e20 100%)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}
        />

        {/* Shade — clean geometric pendant */}
        <div
          className="relative transition-all duration-700"
          style={{
            width: "52px",
            height: "42px",
            clipPath: "polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)",
            background: b > 0.05
              ? `linear-gradient(160deg,
                  #1a1410 0%,
                  #0f0c09 60%,
                  rgba(180,140,80,${b * 0.07}) 100%)`
              : "linear-gradient(160deg, #1a1410 0%, #0f0c09 100%)",
            borderBottom: `1.5px solid rgba(160,120,70,${0.15 + b * 0.45})`,
            boxShadow: b > 0.05
              ? `inset 0 -12px 18px rgba(255, 215, 140, ${b * 0.18}), 0 2px 12px rgba(0,0,0,0.6)`
              : "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          {/* Warm interior glow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-8 rounded-full transition-opacity duration-700 blur-lg"
            style={{
              background: "rgba(255, 220, 140, 1)",
              opacity: b > 0.05 ? b * 0.55 : 0,
            }}
          />
          {/* Rim catch-light */}
          <div
            className="absolute bottom-0 left-0 w-full h-[1px] transition-opacity duration-500"
            style={{
              background: "linear-gradient(90deg, transparent 5%, rgba(200,160,90,0.8) 50%, transparent 95%)",
              opacity: 0.1 + b * 0.7,
            }}
          />
        </div>

        {/* ── SPARK PARTICLES ── */}
        <AnimatePresence>
          {sparksVisible && (
            <div className="absolute top-[24px] left-1/2 -translate-x-1/2 pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 50,
                    y: 8 + Math.random() * 38,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 0.4 + Math.random() * 0.5, ease: "easeOut" }}
                  className="absolute w-[3px] h-[3px] rounded-full"
                  style={{
                    background: "radial-gradient(circle, #fff5d0 0%, #ffcc66 60%, transparent 100%)",
                    boxShadow: "0 0 4px #ffcc88",
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ════════════════════════════════════════════════════
          AMBIENT LIGHTING — three-layer studio approach:
          1. Tight warm top-light (from shade undersurface)
          2. Wide soft fill bloom (horizontal ellipse)
          3. Very subtle floor gradient scatter
      ════════════════════════════════════════════════════ */}
      {b > 0.02 && (
        <>
          {/* Layer 1 — Tight source: warm pool directly below shade */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "130px",
              left: "50%",
              transform: "translateX(-50%)",
              width: `${120 + b * 160}px`,
              height: `${90 + b * 120}px`,
              borderRadius: "50%",
              background: `radial-gradient(ellipse at 50% 0%,
                rgba(255, 230, 160, ${b * 0.22}) 0%,
                rgba(255, 200, 110, ${b * 0.08}) 40%,
                transparent 75%)`,
              filter: "blur(18px)",
              transition: "opacity 0.8s ease, width 0.8s ease, height 0.8s ease",
            }}
          />

          {/* Layer 2 — Wide diffused fill bloom (the signature studio look) */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "60px",
              left: "50%",
              transform: "translateX(-50%)",
              width: `${340 + b * 280}px`,
              height: `${260 + b * 200}px`,
              borderRadius: "50%",
              background: `radial-gradient(ellipse at 50% 20%,
                rgba(255, 215, 130, ${b * 0.065}) 0%,
                rgba(230, 180, 90,  ${b * 0.028}) 35%,
                rgba(180, 130, 60,  ${b * 0.010}) 60%,
                transparent 80%)`,
              filter: "blur(48px)",
              transition: "opacity 0.9s ease",
            }}
          />

          {/* Layer 3 — Ultra-soft atmospheric scatter on background */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "80px",
              left: "50%",
              transform: "translateX(-55%)",
              width: `${500 + b * 300}px`,
              height: `${380 + b * 180}px`,
              borderRadius: "50%",
              background: `radial-gradient(ellipse at 52% 18%,
                rgba(200, 155, 80, ${b * 0.035}) 0%,
                rgba(160, 110, 50, ${b * 0.012}) 45%,
                transparent 72%)`,
              filter: "blur(72px)",
              transition: "opacity 1s ease",
            }}
          />
        </>
      )}
    </div>
  );
}

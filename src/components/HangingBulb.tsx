"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export function HangingBulb() {
  // ─── Refs (avoid setState for live values) ───────────────────────────────────
  const brightnessRef = useRef(0);
  const shadeRef      = useRef<HTMLDivElement>(null);
  const glow1Ref      = useRef<HTMLDivElement>(null);
  const glow2Ref      = useRef<HTMLDivElement>(null);
  const glow3Ref      = useRef<HTMLDivElement>(null);
  const rimRef        = useRef<HTMLDivElement>(null);

  const isOnRef            = useRef(false);
  const sparksVisible      = useRef(false);
  const sparksContainerRef = useRef<HTMLDivElement>(null);
  const sparkTimerRef      = useRef<NodeJS.Timeout | null>(null);

  // ─── Drag logic ──────────────────────────────────────────────────────────────
  const dragY       = useMotionValue(0);
  const springDragY = useSpring(dragY, { stiffness: 400, damping: 25 });
  const bulbY       = useTransform(springDragY, [0, 90], [0, 50]);
  const ropeHeight  = useTransform(springDragY, [0, 90], [110, 170]);
  const dragBrightness = useTransform(springDragY, [40, 90], [0, 1]);

  // ─── Apply brightness directly to DOM (no setState, no re-render) ────────────
  const applyBrightness = useCallback((b: number) => {
    if (!shadeRef.current) return;

    // Shade background
    shadeRef.current.style.background = b > 0.05
      ? `linear-gradient(160deg, #1a1410 0%, #0f0c09 60%, rgba(180,140,80,${b * 0.07}) 100%)`
      : "linear-gradient(160deg, #1a1410 0%, #0f0c09 100%)";
    shadeRef.current.style.borderBottom = `1.5px solid rgba(160,120,70,${0.15 + b * 0.45})`;
    shadeRef.current.style.boxShadow = b > 0.05
      ? `inset 0 -12px 18px rgba(255, 215, 140, ${b * 0.18}), 0 2px 12px rgba(0,0,0,0.6)`
      : "0 2px 8px rgba(0,0,0,0.5)";

    // Inner glow
    const innerGlow = shadeRef.current.querySelector<HTMLDivElement>(".bulb-inner-glow");
    if (innerGlow) innerGlow.style.opacity = b > 0.05 ? String(b * 0.55) : "0";

    // Rim
    if (rimRef.current) rimRef.current.style.opacity = String(0.1 + b * 0.7);

    // Ambient layers
    const visible = b > 0.02;
    if (glow1Ref.current) {
      glow1Ref.current.style.opacity = visible ? "1" : "0";
      if (visible) {
        const w = 120 + b * 160;
        const h = 90 + b * 120;
        glow1Ref.current.style.width = `${w}px`;
        glow1Ref.current.style.height = `${h}px`;
        glow1Ref.current.style.background = `radial-gradient(ellipse at 50% 0%,
          rgba(255, 230, 160, ${b * 0.22}) 0%,
          rgba(255, 200, 110, ${b * 0.08}) 40%,
          transparent 75%)`;
      }
    }
    if (glow2Ref.current) {
      glow2Ref.current.style.opacity = visible ? "1" : "0";
      if (visible) {
        const w = 340 + b * 280;
        const h = 260 + b * 200;
        glow2Ref.current.style.width = `${w}px`;
        glow2Ref.current.style.height = `${h}px`;
        glow2Ref.current.style.background = `radial-gradient(ellipse at 50% 20%,
          rgba(255, 215, 130, ${b * 0.065}) 0%,
          rgba(230, 180, 90, ${b * 0.028}) 35%,
          rgba(180, 130, 60, ${b * 0.010}) 60%,
          transparent 80%)`;
      }
    }
    if (glow3Ref.current) {
      glow3Ref.current.style.opacity = visible ? "1" : "0";
      if (visible) {
        const w = 500 + b * 300;
        const h = 380 + b * 180;
        glow3Ref.current.style.width = `${w}px`;
        glow3Ref.current.style.height = `${h}px`;
        glow3Ref.current.style.background = `radial-gradient(ellipse at 52% 18%,
          rgba(200, 155, 80, ${b * 0.035}) 0%,
          rgba(160, 110, 50, ${b * 0.012}) 45%,
          transparent 72%)`;
      }
    }
  }, []);

  // ─── Scroll listener — throttled via rAF ─────────────────────────────────────
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const scrollH   = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(scrollTop / (scrollH * 0.45), 1);
        const b = isOnRef.current ? 1 : Math.max(scrollProgress * 0.45, brightnessRef.current);
        brightnessRef.current = b;
        applyBrightness(b);
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (sparkTimerRef.current) clearTimeout(sparkTimerRef.current);
    };
  }, [applyBrightness]);

  // ─── Drag brightness (also direct DOM) ───────────────────────────────────────
  useEffect(() => {
    const unsub = dragBrightness.on("change", (v) => {
      brightnessRef.current = v;
      applyBrightness(v);
    });
    return () => unsub();
  }, [dragBrightness, applyBrightness]);

  const handleDragEnd = useCallback((_: unknown, info: { offset: { y: number } }) => {
    if (info.offset.y > 60) {
      isOnRef.current = !isOnRef.current;
      applyBrightness(isOnRef.current ? 1 : 0);
      // show sparks
      if (sparksContainerRef.current) {
        sparksContainerRef.current.style.display = "block";
      }
      if (sparkTimerRef.current) clearTimeout(sparkTimerRef.current);
      sparkTimerRef.current = setTimeout(() => {
        if (sparksContainerRef.current) {
          sparksContainerRef.current.style.display = "none";
        }
      }, 1400);
    }
    dragY.set(0);
  }, [applyBrightness, dragY]);

  return (
    <div className="fixed top-0 right-[13%] z-50 hidden lg:flex flex-col items-center pointer-events-none">

      {/* ── ROPE / CORD ── */}
      <motion.div
        className="origin-top"
        style={{
          width: "1px",
          height: ropeHeight,
          background: "linear-gradient(to bottom, #3a2818 0%, #261608 100%)",
          willChange: "height",
        }}
      />

      {/* ── PENDANT ASSEMBLY ── */}
      <motion.div
        className="relative flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing"
        drag="y"
        dragConstraints={{ top: 0, bottom: 90 }}
        dragElastic={0.1}
        style={{ y: bulbY, willChange: "transform" }}
        onDrag={(_, info) => dragY.set(info.offset.y)}
        onDragEnd={handleDragEnd}
      >
        {/* Ceiling canopy */}
        <div
          className="w-3 h-1.5 rounded-sm z-10"
          style={{
            background: "linear-gradient(to bottom, #6b5540 0%, #3d2e20 100%)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}
        />

        {/* Shade */}
        <div
          ref={shadeRef}
          className="relative"
          style={{
            width: "52px",
            height: "42px",
            clipPath: "polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)",
            background: "linear-gradient(160deg, #1a1410 0%, #0f0c09 100%)",
            borderBottom: "1.5px solid rgba(160,120,70,0.15)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          {/* Warm interior glow */}
          <div
            className="bulb-inner-glow absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-8 rounded-full blur-lg"
            style={{ background: "rgba(255, 220, 140, 1)", opacity: 0 }}
          />
          {/* Rim catch-light */}
          <div
            ref={rimRef}
            className="absolute bottom-0 left-0 w-full h-[1px]"
            style={{
              background: "linear-gradient(90deg, transparent 5%, rgba(200,160,90,0.8) 50%, transparent 95%)",
              opacity: 0.1,
            }}
          />
        </div>

        {/* ── SPARK PARTICLES ── */}
        <div
          ref={sparksContainerRef}
          className="absolute top-[24px] left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ display: "none" }}
        >
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
      </motion.div>

      {/* ── AMBIENT LIGHTING LAYERS (always in DOM, opacity toggled via ref) ── */}
      <div
        ref={glow1Ref}
        className="absolute pointer-events-none"
        style={{
          top: "130px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "90px",
          borderRadius: "50%",
          filter: "blur(18px)",
          opacity: 0,
          willChange: "opacity, width, height",
        }}
      />
      <div
        ref={glow2Ref}
        className="absolute pointer-events-none"
        style={{
          top: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "340px",
          height: "260px",
          borderRadius: "50%",
          filter: "blur(48px)",
          opacity: 0,
          willChange: "opacity",
        }}
      />
      <div
        ref={glow3Ref}
        className="absolute pointer-events-none"
        style={{
          top: "80px",
          left: "50%",
          transform: "translateX(-55%)",
          width: "500px",
          height: "380px",
          borderRadius: "50%",
          filter: "blur(72px)",
          opacity: 0,
          willChange: "opacity",
        }}
      />
    </div>
  );
}

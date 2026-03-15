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
  
  // Transform drag distance to pull effect
  const bulbY = useTransform(springDragY, [0, 90], [0, 50]);
  const ropeHeight = useTransform(springDragY, [0, 90], [100, 150]);
  
  // Drag progress for interaction feedback
  const [pullProgress, setPullProgress] = useState(0);
  const dragBrightness = useTransform(springDragY, [40, 90], [0, 1]);

  useEffect(() => {
    const unsubscribe = dragBrightness.on("change", (latest) => {
      setPullProgress(latest);
    });
    return () => unsubscribe();
  }, [dragBrightness]);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / (maxScroll * 0.45), 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (sparkTimerRef.current) clearTimeout(sparkTimerRef.current);
    };
  }, []);

  // Brightness logic
  const effectiveBrightness = isOn ? 1 : Math.max(scrollProgress * 0.4, pullProgress * 0.6);
  const glowOpacity = effectiveBrightness * 0.8;
  const haloSize = 80 + effectiveBrightness * 200;
  const warmColor = `rgba(255, 230, 150, ${glowOpacity})`;

  return (
    <div className="fixed top-0 right-[15%] z-50 hidden lg:flex flex-col items-center pointer-events-none">
      {/* ── CORD ── */}
      <motion.div
        className="w-[1.5px] bg-[#2a1a10] origin-top"
        style={{ height: ropeHeight }}
      />

      {/* ── INTERACTIVE BULB ASSEMBLY ── */}
      <motion.div 
        className="relative flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing"
        drag="y"
        dragConstraints={{ top: 0, bottom: 90 }}
        dragElastic={0.1}
        style={{ y: bulbY }}
        onDrag={(e, info) => dragY.set(info.offset.y)}
        onDragEnd={(e, info) => {
          if (info.offset.y > 60) {
            setIsOn(!isOn);
            setSparksVisible(true);
            if (sparkTimerRef.current) clearTimeout(sparkTimerRef.current);
            sparkTimerRef.current = setTimeout(() => setSparksVisible(false), 1500);
          }
          dragY.set(0);
        }}
      >
        {/* Lamp Base / Cap */}
        <div className="w-4 h-2 bg-gradient-to-b from-[#8b7355] to-[#5d4a36] rounded-t-sm z-10" />

        {/* CSS/SVG Lampshade */}
        <div className="relative group">
          {/* Lampshade Shape */}
          <div 
            className="w-16 h-12 bg-[#121212] relative overflow-hidden transition-colors duration-500"
            style={{
              clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
              borderBottom: `2px solid rgba(139, 115, 85, ${0.3 + effectiveBrightness * 0.7})`,
              boxShadow: effectiveBrightness > 0.1 
                ? `inset 0 -10px 20px rgba(255, 220, 150, ${effectiveBrightness * 0.2})` 
                : 'none'
            }}
          >
            {/* Lamp interior glow */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full blur-xl transition-opacity duration-500"
              style={{
                background: 'rgba(255, 230, 180, 0.8)',
                opacity: effectiveBrightness > 0.1 ? 0.6 * effectiveBrightness : 0
              }}
            />
          </div>

          {/* Golden Rim Highlight */}
          <div 
            className="absolute bottom-0 left-0 w-full h-[1px] transition-opacity duration-500"
            style={{
              background: 'linear-gradient(90deg, transparent, #8b7355, transparent)',
              opacity: 0.5 + effectiveBrightness * 0.5
            }}
          />
        </div>

        {/* ── GLOW HALO (Subtle Horizontal Spread) ── */}
        <div
          className="absolute rounded-full pointer-events-none blur-3xl opacity-50"
          style={{
            width: `${haloSize * 1.5}px`,
            height: `${haloSize * 0.8}px`,
            top: `10px`,
            left: "50%",
            transform: "translateX(-50%)",
            background: `radial-gradient(ellipse at center, ${warmColor} 0%, transparent 70%)`,
            transition: "all 0.6s cubic-bezier(0.2, 0, 0, 1)",
          }}
        />

        {/* ── SPARK PARTICLES ── */}
        <AnimatePresence>
          {sparksVisible && (
            <div className="absolute top-[20px] left-1/2 -translate-x-1/2 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 60, 
                    y: 10 + Math.random() * 40, 
                    opacity: 0,
                    scale: 0 
                  }}
                  transition={{ duration: 0.5 + Math.random() * 0.5 }}
                  className="absolute w-0.5 h-0.5 rounded-full bg-[#ffddaa]"
                  style={{ boxShadow: "0 0 5px #ffcc88" }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── WIDE HORIZONTAL LIGHT CONE ── */}
      <div 
        className="absolute pointer-events-none origin-top transition-opacity duration-700"
        style={{
          top: "140px",
          left: "50%",
          transform: `translateX(-50%) translateY(${bulbY.get()}px)`,
          width: `${300 + effectiveBrightness * 500}px`,
          height: `${400 + effectiveBrightness * 200}px`,
          opacity: effectiveBrightness > 0.05 ? 1 : 0
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            background: `conic-gradient(from 150deg at 50% 0%, 
              transparent 0deg, 
              rgba(255, 230, 180, ${effectiveBrightness * 0.06}) 15deg, 
              rgba(255, 230, 180, ${effectiveBrightness * 0.08}) 30deg, 
              rgba(255, 230, 180, ${effectiveBrightness * 0.06}) 45deg, 
              transparent 60deg)`,
            filter: 'blur(40px)',
            transform: 'rotate(150deg)'
          }}
        />
      </div>
    </div>
  );
}

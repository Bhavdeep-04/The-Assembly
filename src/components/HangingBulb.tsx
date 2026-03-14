"use client";

import React, { useEffect, useState, useRef } from "react";

export function HangingBulb() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sparksVisible, setSparksVisible] = useState(false);
  const sparkTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      // Fully bright by mid-page
      const progress = Math.min(window.scrollY / (maxScroll * 0.45), 1);
      setScrollProgress(progress);

      // Trigger sparks on first meaningful scroll
      if (window.scrollY > 60 && lastScroll <= 60) {
        setSparksVisible(true);
        if (sparkTimerRef.current) clearTimeout(sparkTimerRef.current);
        sparkTimerRef.current = setTimeout(() => setSparksVisible(false), 2000);
      }
      lastScroll = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (sparkTimerRef.current) clearTimeout(sparkTimerRef.current);
    };
  }, []);

  const glowOpacity = scrollProgress * 0.6;
  const bulbBrightness = 0.15 + scrollProgress * 0.85;
  const haloSize = 60 + scrollProgress * 140; // 60px → 200px
  const warmColor = `rgba(255,224,160,${glowOpacity})`;

  return (
    <div className="fixed top-0 right-[7%] z-40 pointer-events-none hidden lg:flex flex-col items-center">
      {/* ── ROPE ── */}
      <div
        className="w-[2px] origin-top"
        style={{
          height: "110px",
          background: "linear-gradient(to bottom, #3a2a1a 0%, #5a4530 40%, #3a2a1a 100%)",
          boxShadow: scrollProgress > 0.2
            ? `0 0 ${4 + scrollProgress * 8}px rgba(255,224,160,${scrollProgress * 0.1})`
            : "none",
          animation: "sway 6s ease-in-out infinite",
        }}
      />

      {/* ── BULB HOUSING ── */}
      <div className="relative flex flex-col items-center">
        {/* Socket / cap */}
        <div
          className="w-[14px] h-[10px] rounded-t-sm"
          style={{
            background: "linear-gradient(to bottom, #8a7a60, #6a5a40)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
          }}
        />

        {/* Glass bulb */}
        <div
          className="relative w-[28px] h-[38px] rounded-b-full overflow-visible"
          style={{
            background: `radial-gradient(ellipse at 50% 40%,
              rgba(255,224,160,${0.05 + scrollProgress * 0.35}) 0%,
              rgba(255,200,120,${0.02 + scrollProgress * 0.15}) 50%,
              rgba(40,35,25,${0.4 - scrollProgress * 0.2}) 100%)`,
            border: `1px solid rgba(255,224,160,${0.1 + scrollProgress * 0.15})`,
            boxShadow: scrollProgress > 0.1
              ? `0 0 ${10 + scrollProgress * 30}px rgba(255,224,160,${scrollProgress * 0.3}),
                 inset 0 0 ${8 + scrollProgress * 15}px rgba(255,224,160,${scrollProgress * 0.2})`
              : "none",
            filter: `brightness(${bulbBrightness})`,
            transition: "all 0.3s ease",
          }}
        >
          {/* Filament lines */}
          <div
            className="absolute inset-x-[30%] top-[35%] bottom-[15%] flex justify-between"
            style={{ opacity: 0.3 + scrollProgress * 0.7 }}
          >
            <div className="w-px h-full" style={{ background: `rgba(255,200,100,${0.3 + scrollProgress * 0.7})` }} />
            <div className="w-px h-full" style={{ background: `rgba(255,200,100,${0.2 + scrollProgress * 0.6})` }} />
            <div className="w-px h-full" style={{ background: `rgba(255,200,100,${0.3 + scrollProgress * 0.7})` }} />
          </div>
        </div>

        {/* ── GLOW HALO ── */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${haloSize}px`,
            height: `${haloSize}px`,
            top: `${20 - scrollProgress * 30}px`,
            left: "50%",
            transform: "translateX(-50%)",
            background: `radial-gradient(circle, ${warmColor} 0%, rgba(255,224,160,${glowOpacity * 0.3}) 40%, transparent 70%)`,
            transition: "all 0.4s ease",
          }}
        />

        {/* ── SPARK PARTICLES ── */}
        {sparksVisible && (
          <div className="absolute top-[30px] left-1/2 -translate-x-1/2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  background: i % 3 === 0 ? "#ffcc66" : i % 3 === 1 ? "#ffe8a0" : "#ff9944",
                  boxShadow: `0 0 4px ${i % 2 === 0 ? "#ffcc66" : "#ff9944"}`,
                  animation: `spark-${i % 4} ${0.5 + Math.random() * 1}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.3}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── LIGHT CONE projected downward ── */}
      {scrollProgress > 0.05 && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: "155px",
            left: "50%",
            transform: "translateX(-50%)",
            width: `${40 + scrollProgress * 200}px`,
            height: `${200 + scrollProgress * 600}px`,
            background: `linear-gradient(to bottom,
              rgba(255,224,160,${scrollProgress * 0.06}) 0%,
              rgba(255,224,160,${scrollProgress * 0.02}) 40%,
              transparent 100%)`,
            clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)",
            transition: "all 0.5s ease",
          }}
        />
      )}

      {/* ── INLINE KEYFRAMES ── */}
      <style jsx>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-0.5deg); }
          50% { transform: rotate(0.5deg); }
        }
        @keyframes spark-0 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-20px, 30px) scale(0); opacity: 0; }
        }
        @keyframes spark-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(15px, 40px) scale(0); opacity: 0; }
        }
        @keyframes spark-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-10px, 50px) scale(0); opacity: 0; }
        }
        @keyframes spark-3 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(25px, 25px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

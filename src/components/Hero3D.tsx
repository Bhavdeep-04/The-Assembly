"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax: image drifts up slower than the page scroll
  const y = useTransform(scrollY, [0, 600], [0, -80]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.04]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 right-0 w-full md:w-[52%] lg:w-[48%] h-full pointer-events-none z-10 hidden md:flex items-center justify-end overflow-hidden"
    >
      {/* Atmospheric fade gradient on the left edge so it blends into the dark bg */}
      <div className="absolute inset-y-0 left-0 w-[45%] z-10 bg-gradient-to-r from-background via-background/70 to-transparent pointer-events-none" />

      {/* Subtle top vignette */}
      <div className="absolute top-0 inset-x-0 h-[20%] z-10 bg-gradient-to-b from-background to-transparent pointer-events-none" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-[28%] z-10 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />

      {/* Warm studio light bloom — sits behind the PC image */}
      <motion.div
        className="absolute right-[8%] top-[15%] w-[340px] h-[340px] rounded-full pointer-events-none z-0"
        style={{
          opacity,
          background: "radial-gradient(ellipse at center, rgba(200,160,100,0.10) 0%, rgba(160,120,70,0.06) 40%, transparent 75%)",
          filter: "blur(40px)",
        }}
      />

      {/* The PC image with parallax */}
      <motion.div
        style={{ y, scale }}
        className="relative w-[88%] max-w-[620px] h-auto mr-[2%] mt-[4%] z-[5]"
      >
        <Image
          src="/hero-pc.png"
          alt="Premium ASMBLY workstation with oak wood accents"
          width={1024}
          height={1024}
          priority
          quality={100}
          className="w-full h-auto object-contain select-none"
          style={{
            filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.7)) drop-shadow(0 8px 24px rgba(0,0,0,0.5))",
          }}
        />

        {/* Reflection / floor shadow */}
        <div
          className="absolute bottom-0 left-[10%] right-[10%] h-[60px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, transparent 72%)",
            filter: "blur(18px)",
            transform: "translateY(30%)",
          }}
        />
      </motion.div>
    </div>
  );
}
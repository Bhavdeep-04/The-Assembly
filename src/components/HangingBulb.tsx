"use client";

import React, { useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { LightbulbModel } from "./LightbulbModel";

// Helper component to fix transparency issues in some R3F setups
function SceneCleaner({ brightness }: { brightness: number }) {
  const { scene, gl } = useThree();
  
  useEffect(() => {
    if (scene) scene.background = null;
    if (gl) {
      gl.setClearColor(0x000000, 0);
      gl.setClearAlpha(0);
    }
  }, [scene, gl]);

  return (
    <LightbulbModel 
      position={[0, -0.6, 0]} 
      rotation={[0, Math.PI, 0]}
      scale={1.5}
    />
  );
}

export function HangingBulb() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const [sparksVisible, setSparksVisible] = useState(false);
  const sparkTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Drag logic
  const dragY = useMotionValue(0);
  const springDragY = useSpring(dragY, { stiffness: 300, damping: 30 });
  
  // Transform drag distance to pull effect (up to 80px)
  const bulbY = useTransform(springDragY, [0, 80], [0, 40]);
  const ropeHeight = useTransform(springDragY, [0, 80], [110, 150]);
  
  // Drag progress for interaction feedback
  const [pullProgress, setPullProgress] = useState(0);
  const dragBrightness = useTransform(springDragY, [40, 80], [0, 1]);

  useEffect(() => {
    const unsubscribe = dragBrightness.on("change", (latest) => {
      setPullProgress(latest);
    });
    return () => unsubscribe();
  }, [dragBrightness]);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / (maxScroll * 0.45), 1);
      setScrollProgress(progress);

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

  // Brightness logic: Manual toggle OR Scroll progress
  const effectiveBrightness = isOn ? 1 : Math.max(scrollProgress, pullProgress * 0.5);
  const glowOpacity = effectiveBrightness * 0.7;
  const haloSize = 60 + effectiveBrightness * 160;
  const warmColor = `rgba(255,224,160,${glowOpacity})`;

  return (
    <div className="fixed top-0 right-[200px] z-[100] hidden lg:flex flex-col items-center pointer-events-none">
      {/* ── ROPE ── */}
      <motion.div
        className="w-[1px] origin-top"
        style={{
          height: ropeHeight,
          background: "linear-gradient(to bottom, #3a2a1a 0%, #5a4530 40%, #3a2a1a 100%)",
          boxShadow: effectiveBrightness > 0.2
            ? `0 0 ${4 + effectiveBrightness * 8}px rgba(255,224,160,${effectiveBrightness * 0.1})`
            : "none",
        }}
      />

      {/* ── INTERACTIVE BULB CONTAINER ── */}
      <motion.div 
        className="relative flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing"
        drag="y"
        dragConstraints={{ top: 0, bottom: 90 }}
        dragElastic={0.15}
        style={{ y: bulbY }}
        onDrag={(e, info) => dragY.set(info.offset.y)}
        onDragEnd={(e, info) => {
          // Threshold of 60px to toggle ON/OFF
          if (info.offset.y > 60) {
            setIsOn(!isOn);
            // Trigger sparks when toggled
            setSparksVisible(true);
            if (sparkTimerRef.current) clearTimeout(sparkTimerRef.current);
            sparkTimerRef.current = setTimeout(() => setSparksVisible(false), 1500);
          }
          dragY.set(0);
        }}
      >
        {/* Socket / cap area (bigger hit area) */}
        <div className="absolute top-0 w-full h-full -z-10" />
        
        <div
          className="w-[12px] h-[10px] rounded-t-sm z-10"
          style={{
            background: "linear-gradient(to bottom, #8a7a60, #6a5a40)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
          }}
        />

        {/* 3D Model Canvas */}
        <div 
          className="w-[140px] h-[180px] -mt-1 relative flex items-center justify-center bulb-canvas-wrapper"
          style={{ background: 'transparent' }}
        >
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 32 }}
            gl={{ 
              alpha: true, 
              antialias: true,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl, scene }) => {
              gl.setClearColor(0x000000, 0);
              scene.background = null;
            }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.8 + effectiveBrightness * 1.5} />
            <pointLight 
              position={[0, 0.4, 0.2]} 
              intensity={effectiveBrightness * 35} 
              color="#ffe0a0" 
              distance={8} 
              decay={2}
            />
            <spotLight 
              position={[0, 4, 2]} 
              angle={0.5} 
              penumbra={1} 
              intensity={effectiveBrightness * 15} 
            />
            <SceneCleaner brightness={effectiveBrightness} />
          </Canvas>

          {/* Additional Glass Glow Overlay */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 40%, rgba(255,224,160,${effectiveBrightness * 0.4}) 0%, transparent 75%)`,
              opacity: effectiveBrightness > 0.05 ? 1 : 0
            }}
          />
        </div>

        {/* ── GLOW HALO ── */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${haloSize}px`,
            height: `${haloSize}px`,
            top: `60px`,
            left: "50%",
            transform: "translateX(-50%)",
            background: `radial-gradient(circle, ${warmColor} 0%, rgba(255,224,160,${glowOpacity * 0.3}) 45%, transparent 75%)`,
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* ── SPARK PARTICLES ── */}
        <AnimatePresence>
          {sparksVisible && (
            <div className="absolute top-[70px] left-1/2 -translate-x-1/2 pointer-events-none">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 80, 
                    y: 20 + Math.random() * 60, 
                    opacity: 0,
                    scale: 0 
                  }}
                  transition={{ duration: 0.4 + Math.random() * 0.6, ease: "easeOut" }}
                  className="absolute rounded-full w-[2px] h-[2px]"
                  style={{
                    background: i % 3 === 0 ? "#ffcc66" : i % 3 === 1 ? "#ffe8a0" : "#ff9944",
                    boxShadow: `0 0 6px ${i % 2 === 0 ? "#ffcc66" : "#ff9944"}`,
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── LIGHT CONE projected downward ── */}
      {effectiveBrightness > 0.05 && (
        <motion.div
          className="absolute pointer-events-none origin-top"
          style={{
            top: "175px",
            left: "50%",
            x: "-50%",
            y: bulbY,
            width: `${40 + effectiveBrightness * 260}px`,
            height: `${250 + effectiveBrightness * 750}px`,
            background: `linear-gradient(to bottom,
              rgba(255,224,160,${effectiveBrightness * 0.1}) 0%,
              rgba(255,224,160,${effectiveBrightness * 0.04}) 40%,
              transparent 100%)`,
            clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
            transition: "all 0.5s ease-out"
          }}
        />
      )}
    </div>
  );
}

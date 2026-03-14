"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PresentationControls, Stage } from "@react-three/drei";
import { PcModel } from "./PcModel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pcRef = useRef<any>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !pcRef.current || !isReady) return;

    // Set up GSAP ScrollTrigger for parallax effect
    const ctx = gsap.context(() => {
      // Slight parallax tilt for the 3D model instead of full rotation
      gsap.to(pcRef.current.rotation, {
        y: "+=0.4", // slight twist
        x: "-=0.1", // slight tilt
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Huge background text moving horizontally
      if (textRef.current) {
        gsap.to(textRef.current, {
          x: "-20%", // Move left
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100vh] min-h-[800px] flex items-center overflow-hidden bg-gradient-to-b from-black via-black/90 to-black/80"
    >
      {/* Tailwind Overlay text on the Left */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none w-full md:w-1/2 px-8 lg:px-20 text-left">
        <h2 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_4px_30px_rgba(0,0,0,1)] leading-tight">
          Desert Sand <br /> <span className="text-primary mix-blend-screen">Edition</span>
        </h2>
        <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-light leading-relaxed">
          Interact with the chassis. Drag to rotate or scroll down for a full 360° inspection of the internals.
        </p>
      </div>

      {/* Massive Background Parallax Text */}
      <div className="absolute inset-0 flex items-center z-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div ref={textRef} className="whitespace-nowrap text-[20vw] font-black text-white tracking-tighter">
          DESERT SAND EDITION • THE ASSEMBLY • PREMIUM BUILD • DESERT SAND EDITION
        </div>
      </div>

      {/* 3D Canvas on the Right (or Full on mobile) */}
      <div className="absolute inset-0 md:left-1/3 z-10 flex items-center justify-center">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <React.Suspense fallback={null}>
            <PresentationControls
              global
              snap={false}
              rotation={[0.1, -Math.PI / 4, 0]} /* Angled side-view immediately exposing the glass logic */
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI, Math.PI]}
            >
              <group
                ref={(node) => {
                  pcRef.current = node;
                  if (node && !isReady) setIsReady(true);
                }}
              >
                {/* Stage perfectly measures any messy GLB and normalizes scale/center/shadows/lighting automatically */}
                <Stage environment="studio" intensity={1.5} adjustCamera={1.8}>
                  <PcModel />
                </Stage>
              </group>
            </PresentationControls>
          </React.Suspense>
        </Canvas>
      </div>
    </section>
  );
}

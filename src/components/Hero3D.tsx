"use client";

import React, { useRef, useEffect, useState, forwardRef } from "react";
import { Canvas } from "@react-three/fiber";
import { PresentationControls, Stage } from "@react-three/drei";
import { PcModel } from "./PcModel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Expose a way for the parent page to register scroll animations on the model
export interface Hero3DHandle {
  getModelRef: () => React.MutableRefObject<any>;
}

export const Hero3D = forwardRef<Hero3DHandle, { scrollContainerId: string }>(
  function Hero3D({ scrollContainerId }, _ref) {
    const canvasWrapRef = useRef<HTMLDivElement>(null);
    const pcRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      if (!pcRef.current || !isReady) return;

      const scrollContainer = document.getElementById(scrollContainerId);
      if (!scrollContainer) return;

      const ctx = gsap.context(() => {
        // Scene 1 → 2: rotate model from front-angle to side view
        gsap.timeline({
          scrollTrigger: {
            trigger: "#scene-vision",
            start: "top bottom",
            end: "top top",
            scrub: 1.5,
          },
        }).to(pcRef.current.rotation, { y: Math.PI * 0.6, ease: "none" })
          .to(pcRef.current.position, { x: 2, ease: "none" }, "<");

        // Scene 2 → 3: gentle continued rotation
        gsap.timeline({
          scrollTrigger: {
            trigger: "#scene-signature",
            start: "top bottom",
            end: "top top",
            scrub: 1.5,
          },
        }).to(pcRef.current.rotation, { y: Math.PI * 1.1, ease: "none" })
          .to(pcRef.current.position, { x: -1, ease: "none" }, "<");

      });

      return () => ctx.revert();
    }, [isReady, scrollContainerId]);

    return (
      <div
        ref={canvasWrapRef}
        className="fixed top-0 left-0 w-full h-screen pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <React.Suspense fallback={null}>
            <PresentationControls
              global
              snap={false}
              rotation={[0.05, -Math.PI / 5, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI, Math.PI]}
              domElement={typeof window !== "undefined" ? document.body : undefined}
            >
              <group
                ref={(node) => {
                  pcRef.current = node;
                  if (node && !isReady) setIsReady(true);
                }}
              >
                <Stage environment="studio" intensity={1.6} adjustCamera={1.8}>
                  <PcModel />
                </Stage>
              </group>
            </PresentationControls>
          </React.Suspense>
        </Canvas>
      </div>
    );
  }
);

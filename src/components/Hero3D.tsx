"use client";

import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PresentationControls, Stage } from "@react-three/drei";
import * as THREE from "three";
import { PcModel } from "./PcModel";
import gsap from "gsap";
import { usePageSlideStore, useCurrentSlide, useTargetSlide, useIsTransitioning } from "@/store/usePageSlideStore";
import { SLIDES, TRANSITION_TIMINGS } from "@/utils/slideConfig";

/**
 * Inner component that handles model animation
 */
function AnimatedPcModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const currentSlide = useCurrentSlide();
  const targetSlide = useTargetSlide();
  const isTransitioning = useIsTransitioning();
  
  const animationTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Animate model position/rotation and camera during transition
  useEffect(() => {
    if (!groupRef.current || !isTransitioning) return;

    // Kill any ongoing animation
    if (animationTimelineRef.current) {
      animationTimelineRef.current.kill();
    }

    const currentConfig = SLIDES[currentSlide];
    const nextConfig = SLIDES[targetSlide];

    if (!nextConfig || nextConfig.modelType !== "pc") return;

    // Create animation timeline for the delay phase (0.5s)
    const tl = gsap.timeline();
    
    // Animate model position
    tl.to(
      groupRef.current.position,
      {
        x: nextConfig.model.position[0],
        y: nextConfig.model.position[1],
        z: nextConfig.model.position[2],
        duration: TRANSITION_TIMINGS.delayBeforeDistortion,
        ease: "expo.inOut",
      },
      0
    );

    // Animate model rotation
    tl.to(
      groupRef.current.rotation,
      {
        x: nextConfig.model.rotation[0],
        y: nextConfig.model.rotation[1],
        z: nextConfig.model.rotation[2],
        duration: TRANSITION_TIMINGS.delayBeforeDistortion,
        ease: "expo.inOut",
      },
      0
    );

    // Animate model scale
    tl.to(
      groupRef.current.scale,
      {
        x: nextConfig.model.scale,
        y: nextConfig.model.scale,
        z: nextConfig.model.scale,
        duration: TRANSITION_TIMINGS.delayBeforeDistortion,
        ease: "expo.inOut",
      },
      0
    );

    // Animate camera position
    tl.to(
      camera.position,
      {
        x: nextConfig.camera.position[0],
        y: nextConfig.camera.position[1],
        z: nextConfig.camera.position[2],
        duration: TRANSITION_TIMINGS.delayBeforeDistortion,
        ease: "expo.inOut",
      },
      0
    );

    // Animate camera FOV
    tl.to(
      camera,
      {
        fov: nextConfig.camera.fov,
        duration: TRANSITION_TIMINGS.delayBeforeDistortion,
        ease: "expo.inOut",
        onUpdate: () => {
          camera.updateProjectionMatrix();
        },
      },
      0
    );

    animationTimelineRef.current = tl;

    return () => {
      if (animationTimelineRef.current) {
        animationTimelineRef.current.kill();
      }
    };
  }, [isTransitioning, currentSlide, targetSlide, camera]);

  return (
    <group ref={groupRef}>
      <Stage environment="studio" intensity={2.0} adjustCamera={1.8}>
        <PcModel />
      </Stage>
    </group>
  );
}

export function Hero3D() {
  const currentSlide = useCurrentSlide();
  const isVisible = [0, 2, 6].includes(currentSlide);

  if (!isVisible) {
    return null;
  }

  const currentConfig = SLIDES[currentSlide];

  return (
    <div className="absolute top-0 right-0 w-full md:w-[50%] lg:w-[45%] h-full pointer-events-auto z-10 hidden md:block">
      <Canvas camera={{ 
        position: currentConfig.camera.position, 
        fov: currentConfig.camera.fov 
      }}>
        <React.Suspense fallback={null}>
          <PresentationControls
            snap={false}
            rotation={[0.05, -Math.PI / 5, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI, Math.PI]}
            enabled={false} // Disable user interaction during full page transitions
          >
            <AnimatedPcModel />
          </PresentationControls>
        </React.Suspense>
      </Canvas>
    </div>
  );
}

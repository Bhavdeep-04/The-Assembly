"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import {
  DistortionMaterial,
  useDistortionMaterial,
  getDistortionMaterial,
} from "./DistortionMaterial";

/**
 * Internal component that renders the distortion effect
 */
function DistortionQuad() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { gl, scene, camera, size } = useThree();
  const { setTexture, setIntensity, setTime } = useDistortionMaterial();
  const renderTargetRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const frameCountRef = useRef(0);

  // Initialize render target
  useEffect(() => {
    if (!renderTargetRef.current) {
      renderTargetRef.current = new THREE.WebGLRenderTarget(
        size.width,
        size.height,
        {
          format: THREE.RGBAFormat,
          type: THREE.UnsignedByteType,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          stencilBuffer: false,
          depthBuffer: true,
        }
      );
      setTexture(renderTargetRef.current.texture);
    }

    // Handle resize
    const handleResize = () => {
      renderTargetRef.current?.dispose();
      renderTargetRef.current = new THREE.WebGLRenderTarget(
        size.width,
        size.height,
        {
          format: THREE.RGBAFormat,
          type: THREE.UnsignedByteType,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          stencilBuffer: false,
          depthBuffer: true,
        }
      );
      setTexture(renderTargetRef.current.texture);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      renderTargetRef.current?.dispose();
    };
  }, [size.width, size.height, setTexture]);

  useFrame((state) => {
    // Every other frame, capture the scene to render target
    // (Skip frames to reduce overhead)
    if (frameCountRef.current % 2 === 0 && renderTargetRef.current) {
      gl.setRenderTarget(renderTargetRef.current);
      gl.render(scene, camera);
      gl.setRenderTarget(null);
    }
    frameCountRef.current++;

    // Animate time uniform for shader
    setTime((frameCountRef.current * 0.016) % 10);
  });

  // Create full-screen quad geometry
  useEffect(() => {
    if (!meshRef.current) return;

    const geometry = new THREE.PlaneGeometry(2, 2);
    meshRef.current.geometry = geometry;
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <primitive object={getDistortionMaterial()} attach="material" />
    </mesh>
  );
}

/**
 * Global distortion effect canvas
 * Positioned fixed, full-screen, on top of content
 */
export function DistortionEffectCanvas() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ opacity: 0 }} // Hidden by default; will be animated
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: false,
          alpha: true,
          depth: true,
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <DistortionQuad />
      </Canvas>
    </div>
  );
}

/**
 * Hook to animate the distortion effect
 * Usage: const { animateDistortion } = useDistortion();
 *        animateDistortion(0.6);
 */
let distortionTimelineRef: gsap.core.Timeline | null = null;

export function useDistortion() {
  const { setIntensity } = useDistortionMaterial();

  const animateDistortion = (duration: number = 0.6) => {
    // Kill existing animation
    if (distortionTimelineRef) {
      distortionTimelineRef.kill();
    }

    // Create a mutable object to track intensity
    const animationState = { intensity: 0 };

    // Create new timeline
    distortionTimelineRef = gsap.timeline();

    // Animate intensity from 0 to 1
    distortionTimelineRef.to(
      animationState,
      {
        intensity: 1,
        duration: duration * 0.5,
        ease: "sine.inOut",
        onUpdate: () => {
          setIntensity(animationState.intensity);
        },
      }
    );

    // Animate intensity back down from 1 to 0
    distortionTimelineRef.to(
      animationState,
      {
        intensity: 0,
        duration: duration * 0.5,
        ease: "sine.inOut",
        onUpdate: () => {
          setIntensity(animationState.intensity);
        },
      }
    );

    return distortionTimelineRef;
  };

  return { animateDistortion };
}

/**
 * Hook that always returns the current distortion material
 * for full control over uniforms
 */
export function useDistortionMaterialDirect() {
  return useDistortionMaterial();
}

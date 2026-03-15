"use client";

import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

// Vertex Shader
const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader with distortion effect
const fragmentShader = `
  precision highp float;

  uniform sampler2D uTexture;
  uniform sampler2D uNoise;
  uniform float uTime;
  uniform float uIntensity;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Sample noise texture for organic distortion
    vec3 noise = texture2D(uNoise, vUv + uTime * 0.5).rgb;
    
    // Create distortion offset based on intensity and noise
    vec2 distortion = (noise.rg - 0.5) * uIntensity * 0.15;
    
    // Add sine-based wave distortion for fluidity
    distortion += vec2(
      sin(vUv.y * 8.0 + uTime * 5.0) * uIntensity * 0.08,
      cos(vUv.x * 8.0 + uTime * 5.0) * uIntensity * 0.08
    );
    
    // Apply distortion to UV coordinates
    vec2 distortedUv = uv + distortion;
    
    // Sample the distorted texture
    vec4 color = texture2D(uTexture, distortedUv);
    
    // Optional: Add chromatic aberration for cinematic effect
    float chromaticIntensity = uIntensity * 0.03;
    float r = texture2D(uTexture, distortedUv + vec2(chromaticIntensity, 0.0)).r;
    float b = texture2D(uTexture, distortedUv - vec2(chromaticIntensity, 0.0)).b;
    
    color.r = mix(color.r, r, uIntensity * 0.5);
    color.b = mix(color.b, b, uIntensity * 0.5);
    
    gl_FragColor = color;
  }
`;

export interface DistortionMaterialProps {
  texture?: THREE.Texture | null;
  noiseTexture?: THREE.Texture | null;
  intensity?: number;
  time?: number;
}

/**
 * Creates a perlin noise texture procedurally (lazy initialization)
 */
let cachedNoiseTexture: THREE.CanvasTexture | null = null;

function generateNoiseTexture(): THREE.CanvasTexture {
  if (cachedNoiseTexture) {
    return cachedNoiseTexture;
  }

  // Guard against SSR
  if (typeof document === "undefined") {
    // Return a fallback texture during SSR
    const whiteTexture = new THREE.Texture();
    whiteTexture.wrapS = whiteTexture.wrapT = THREE.RepeatWrapping;
    return whiteTexture as THREE.CanvasTexture;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  // Simple Perlin-like noise using canvas
  const imageData = ctx.createImageData(64, 64);
  const data = imageData.data;

  // Procedural noise generation
  for (let i = 0; i < data.length; i += 4) {
    const rand = Math.random() * 255;
    data[i] = rand;      // R
    data[i + 1] = rand;  // G
    data[i + 2] = rand;  // B
    data[i + 3] = 255;   // A
  }

  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  
  cachedNoiseTexture = texture;
  return texture;
}

// Lazy material instance
let cachedMaterial: THREE.ShaderMaterial | null = null;

export function getDistortionMaterial(): THREE.ShaderMaterial {
  // Guard against SSR
  if (typeof window === "undefined") {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uNoise: { value: null },
        uTime: { value: 0 },
        uIntensity: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
  }

  if (cachedMaterial) {
    return cachedMaterial;
  }

  cachedMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: null },
      uNoise: { value: generateNoiseTexture() },
      uTime: { value: 0 },
      uIntensity: { value: 0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });

  return cachedMaterial;
}

// Export for backward compatibility
export const DistortionMaterial = {
  get current() {
    return getDistortionMaterial();
  },
};

/**
 * Hook to access and animate the distortion material
 */
export function useDistortionMaterial() {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Lazy initialize material on first use
  if (!materialRef.current) {
    materialRef.current = getDistortionMaterial();
  }

  const material = materialRef.current!;

  const updateUniform = (key: string, value: any) => {
    if (material.uniforms[key]) {
      material.uniforms[key].value = value;
    }
  };

  const setTexture = (texture: THREE.Texture | null) => {
    updateUniform("uTexture", texture);
  };

  const setIntensity = (intensity: number) => {
    updateUniform("uIntensity", Math.max(0, Math.min(1, intensity)));
  };

  const setTime = (time: number) => {
    updateUniform("uTime", time);
  };

  return {
    material,
    updateUniform,
    setTexture,
    setIntensity,
    setTime,
  };
}

"use client";

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

export function ProcessorModel(props: any) {
  const group = useRef<Group>(null);
  // Auto-rotate slowly
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.2;
    }
  });

  const { scene } = useGLTF("/amd_ryzen_7_7800x3d.glb");
  return (
    <group ref={group} {...props} dispose={null}>
      {/* Assuming the model is centered but might need scaling depending on unoptimized glb */}
      <primitive object={scene} scale={1.8} />
    </group>
  );
}

useGLTF.preload("/amd_ryzen_7_7800x3d.glb");

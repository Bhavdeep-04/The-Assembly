"use client";

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

export function LightbulbModel(props: any) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF("/edison_light_bulb.glb");

  // Clone the scene so we can safely reuse it
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} scale={3.5} />
    </group>
  );
}

useGLTF.preload("/edison_light_bulb.glb");

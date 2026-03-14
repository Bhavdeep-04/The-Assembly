"use client";

import React, { useRef, useLayoutEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Group } from 'three';

export function PcModel(props: any) {
  // Load the GLTF model
  const { scene } = useGLTF('/PC_model.glb');
  const group = useRef<Group>(null);

  useLayoutEffect(() => {
    if (scene) {
      // Traverse the scene's meshes to override materials
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial;

          if (material) {
            const matName = material.name.toLowerCase();
            
            // Protect wood and glass materials from being overwritten
            const isGlass = material.transparent || matName.includes('glass');
            const isWood = matName.includes('wood');

            // Heuristic to target the main metal casing:
            // if it's explicitly named 'case' or 'metal', OR if it isn't glass/wood and has metallic properties.
            if (!isGlass && !isWood) {
              if (matName.includes('case') || matName.includes('metal') || matName.includes('body') || material.metalness > 0.4 || matName === '' || matName.includes('material')) {
                // Apply Custom Desert Sand matte finish
                material.color = new THREE.Color("#EDC9AF"); // Desert Sand Color
                material.roughness = 0.8;
                material.metalness = 0.2;
                material.needsUpdate = true;
              }
            }
          }
        }
      });
    }
  }, [scene]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/PC_model.glb');

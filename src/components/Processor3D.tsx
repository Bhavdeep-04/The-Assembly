"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";
import { ProcessorModel } from "./ProcessorModel";

export function Processor3D() {
  return (
    <div className="absolute top-[8%] md:top-[12%] right-[4%] w-[40%] md:w-[30%] lg:w-[28%] h-[45%] md:h-[50%] pointer-events-auto z-10 hidden md:block">
      <Canvas camera={{ position: [0, 2, 10], fov: 35 }}>
        <React.Suspense fallback={null}>
          {/* Minimal ambient + single directional = matte, dark look */}
          <ambientLight intensity={0.15} />
          <directionalLight position={[2, 5, 3]} intensity={0.35} color="#c0c0c0" />
          <PresentationControls
            snap={true}
            rotation={[0.6, -Math.PI / 6, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
          >
            <group scale={0.7}>
              <ProcessorModel />
            </group>
          </PresentationControls>
        </React.Suspense>
      </Canvas>
    </div>
  );
}

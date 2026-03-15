"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PresentationControls, Stage } from "@react-three/drei";
import { PcModel } from "./PcModel";

export function Hero3D() {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="absolute top-0 right-0 w-full md:w-[50%] lg:w-[45%] h-full pointer-events-auto z-10 hidden md:block">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <React.Suspense fallback={null}>
          <PresentationControls
            snap={false}
            rotation={[0.05, -Math.PI / 5, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI, Math.PI]}
          >
            <group
              ref={(node) => {
                if (node && !isReady) setIsReady(true);
              }}
            >
              <Stage environment="studio" intensity={2.0} adjustCamera={1.8}>
                <PcModel />
              </Stage>
            </group>
          </PresentationControls>
        </React.Suspense>
      </Canvas>
    </div>
  );
}

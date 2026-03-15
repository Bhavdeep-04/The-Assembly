"use client";

import { DistortionEffectCanvas } from "./DistortionEffectCanvas";
import { Suspense } from "react";

export function DistortionCanvasWrapper() {
  return (
    <Suspense fallback={null}>
      <DistortionEffectCanvas />
    </Suspense>
  );
}

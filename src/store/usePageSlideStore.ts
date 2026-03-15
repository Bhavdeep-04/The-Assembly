"use client";

import { create } from "zustand";
import { TOTAL_SLIDES } from "@/utils/slideConfig";

export interface PageSlideState {
  currentSlide: number;
  targetSlide: number;
  isTransitioning: boolean;
  isMobile: boolean;
}

export interface PageSlideActions {
  setCurrentSlide: (index: number) => void;
  setTargetSlide: (index: number) => void;
  setIsTransitioning: (status: boolean) => void;
  setIsMobile: (status: boolean) => void;
  transitionTo: (targetIndex: number) => void;
  startTransition: (targetIndex: number) => void;
  endTransition: () => void;
  reset: () => void;
}

const initialState: PageSlideState = {
  currentSlide: 0,
  targetSlide: 0,
  isTransitioning: false,
  isMobile: false,
};

export const usePageSlideStore = create<PageSlideState & PageSlideActions>(
  (set, get) => ({
    ...initialState,

    setCurrentSlide: (index: number) =>
      set({ currentSlide: Math.max(0, Math.min(index, TOTAL_SLIDES - 1)) }),

    setTargetSlide: (index: number) =>
      set({ targetSlide: Math.max(0, Math.min(index, TOTAL_SLIDES - 1)) }),

    setIsTransitioning: (status: boolean) =>
      set({ isTransitioning: status }),

    setIsMobile: (status: boolean) =>
      set({ isMobile: status }),

    startTransition: (targetIndex: number) => {
      const clampedTarget = Math.max(0, Math.min(targetIndex, TOTAL_SLIDES - 1));
      set({
        targetSlide: clampedTarget,
        isTransitioning: true,
      });
    },

    endTransition: () => {
      const { targetSlide } = get();
      set({
        currentSlide: targetSlide,
        isTransitioning: false,
      });
    },

    transitionTo: (targetIndex: number) => {
      const clamped = Math.max(0, Math.min(targetIndex, TOTAL_SLIDES - 1));
      const { currentSlide } = get();

      // Don't transition if already at target
      if (clamped === currentSlide) return;

      set({
        targetSlide: clamped,
        isTransitioning: true,
      });
    },

    reset: () => set(initialState),
  })
);

/**
 * Selector hooks for common state queries
 */
export const useCurrentSlide = () =>
  usePageSlideStore((state) => state.currentSlide);

export const useIsTransitioning = () =>
  usePageSlideStore((state) => state.isTransitioning);

export const useTargetSlide = () =>
  usePageSlideStore((state) => state.targetSlide);

export const useIsMobile = () =>
  usePageSlideStore((state) => state.isMobile);

/**
 * Slide Configuration
 * Defines 3D model positions, rotations, and camera settings for each slide
 */

export interface SlideConfig {
  index: number;
  name: string;
  title: string;
  modelType: "pc" | "processor" | "none";
  model: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
  };
  camera: {
    position: [number, number, number];
    fov: number;
  };
}

export const SLIDES: Record<number, SlideConfig> = {
  0: {
    index: 0,
    name: "Hero",
    title: "ASMBLY — Welcome",
    modelType: "pc",
    model: {
      position: [0, 0, 0],
      rotation: [0, 0.3, 0],
      scale: 1,
    },
    camera: {
      position: [0, 0, 8],
      fov: 45,
    },
  },

  1: {
    index: 1,
    name: "Problem",
    title: "The Problem",
    modelType: "processor",
    model: {
      position: [4, -3, -2],
      rotation: [0.2, 0.5, 0],
      scale: 1.2,
    },
    camera: {
      position: [0, 2, 10],
      fov: 35,
    },
  },

  2: {
    index: 2,
    name: "Philosophy",
    title: "Our Philosophy",
    modelType: "pc",
    model: {
      position: [-2, 1, 0],
      rotation: [0, -0.2, 0],
      scale: 0.9,
    },
    camera: {
      position: [-1, 0.5, 7],
      fov: 45,
    },
  },

  3: {
    index: 3,
    name: "Lineup",
    title: "The Lineup",
    modelType: "processor",
    model: {
      position: [0, 4, -3],
      rotation: [-0.3, 0, 0],
      scale: 1.3,
    },
    camera: {
      position: [0, 3, 12],
      fov: 35,
    },
  },

  4: {
    index: 4,
    name: "Engineering",
    title: "Engineering",
    modelType: "processor",
    model: {
      position: [3, -2, 1],
      rotation: [0.1, 0.8, 0],
      scale: 1.1,
    },
    camera: {
      position: [2, 1, 9],
      fov: 40,
    },
  },

  5: {
    index: 5,
    name: "Capabilities",
    title: "Built For",
    modelType: "none",
    model: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: 1,
    },
    camera: {
      position: [0, 0, 8],
      fov: 45,
    },
  },

  6: {
    index: 6,
    name: "CTA",
    title: "Begin Your ASMBLY",
    modelType: "pc",
    model: {
      position: [0, 0, 0],
      rotation: [0, 0.3, 0],
      scale: 1,
    },
    camera: {
      position: [0, 0, 8],
      fov: 45,
    },
  },
};

export const TOTAL_SLIDES = Object.keys(SLIDES).length;

export function getSlideConfig(index: number): SlideConfig | null {
  return SLIDES[index] || null;
}

/**
 * Animation timing configuration
 */
export const TRANSITION_TIMINGS = {
  delayBeforeDistortion: 0.5, // seconds
  distortionDuration: 0.6, // seconds
  modelAnimation: 0.5, // seconds
  totalTransition: 1.1, // seconds (delay + distortion)
} as const;

/**
 * Easing functions for animations
 */
export const EASING = {
  modelPosition: "expo.inOut",
  distortionIntensity: "sine.inOut",
  sectionOpacity: "power2.inOut",
} as const;

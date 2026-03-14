"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "relative inline-flex items-center justify-center whitespace-nowrap font-medium tracking-[0.1em] uppercase text-xs overflow-hidden transition-colors duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30",
          {
            // Ghost platinum — default look
            "border border-silver/30 text-silver/80 hover:text-white hover:border-silver/60 px-8 py-3.5 before:absolute before:inset-0 before:bg-silver/5 before:scale-x-0 before:origin-left hover:before:scale-x-100 before:transition-transform before:duration-500": variant === "primary",
            // Outline — slightly dimmer
            "border border-white/10 text-white/50 hover:text-white hover:border-white/30 px-6 py-3": variant === "outline",
            // Secondary — very quiet
            "text-white/30 hover:text-white/70 px-4 py-2": variant === "secondary",
            // Ghost
            "text-white/40 hover:text-white/80 hover:bg-white/5 px-4 py-2": variant === "ghost",
            // Sizes
            "text-[10px] px-4 py-2": size === "sm",
            "px-8 py-3.5": size === "lg",
          },
          className
        )}
        {...(props as HTMLMotionProps<"button">)}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

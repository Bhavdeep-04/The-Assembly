"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    
    // We omit Framer motion specific props from being passed to the React.forwardRef
    // But we let standard button props pass through, so we cast ...props back to HTMLMotionProps
    
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(0,240,255,0.3)]": variant === "primary",
            "bg-secondary text-white hover:bg-secondary/90 shadow-[0_0_15px_rgba(176,38,255,0.3)]": variant === "secondary",
            "border border-border bg-surface hover:bg-surface-hover text-foreground": variant === "outline",
            "hover:bg-surface-hover text-foreground": variant === "ghost",
            "h-9 px-3": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-11 px-8": size === "lg",
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

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Cpu } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import { Button } from "./ui/Button";

export function Navbar() {
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full border-b border-white/5 glass"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Cpu className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
            The Assembly
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <Link href="/build" className="text-sm font-medium text-muted hover:text-white transition-colors">
            Configurator
          </Link>
          <Link href="/prebuilts" className="text-sm font-medium text-muted hover:text-white transition-colors">
            Pre-Builts
          </Link>
          <Link href="/support" className="text-sm font-medium text-muted hover:text-white transition-colors">
            Support
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/build">
            <Button variant="outline" size="sm" className="relative h-10 w-10 p-0 rounded-full border-white/10">
              <ShoppingCart className="w-5 h-5" />
              {mounted && cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
